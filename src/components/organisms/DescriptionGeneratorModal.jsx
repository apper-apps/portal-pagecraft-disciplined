import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import aiService from "@/services/api/aiService";
import productService from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const DescriptionGeneratorModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onSave 
}) => {
const [formData, setFormData] = useState({
    productName: "",
    features: "",
    tone: "Professional"
  });
const [generatedVersions, setGeneratedVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
const [analysis, setAnalysis] = useState(null);
  const [qualityScore, setQualityScore] = useState(null);
  const [seoData, setSeoData] = useState({
    metaTitle: "",
    metaDescription: "",
    suggestedKeywords: ""
  });
  const toneOptions = [
    { value: "Professional", label: "Professional - Technical and feature-focused" },
    { value: "Casual", label: "Casual - Friendly and conversational" },
    { value: "Luxury", label: "Luxury - Sophisticated and premium" }
  ];

useEffect(() => {
    if (product && isOpen) {
      setFormData({
        productName: product.name || "",
        features: "",
        tone: "Professional"
      });
setGeneratedVersions([]);
      setSelectedVersion(0);
setAnalysis(null);
      setQualityScore(null);
      setSeoData({
        metaTitle: "",
        metaDescription: "",
        suggestedKeywords: ""
      });
    }
  }, [product, isOpen]);

useEffect(() => {
    if (generatedVersions.length > 0 && generatedVersions[selectedVersion]) {
      analyzeDescription();
      // Update SEO data when version changes
      const currentVersion = generatedVersions[selectedVersion];
      if (currentVersion.seo) {
        setSeoData(currentVersion.seo);
      }
    }
  }, [generatedVersions, selectedVersion]);

const analyzeDescription = async () => {
    try {
      const currentDescription = generatedVersions[selectedVersion]?.content || "";
      const result = await aiService.analyzeDescription(currentDescription);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const handleGenerate = async () => {
    if (!formData.productName.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    if (!formData.features.trim()) {
      toast.error("Please enter key features");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiService.generateDescription({
        productName: formData.productName,
        features: formData.features,
        tone: formData.tone,
        variations: 3
      });
      
setGeneratedVersions(result.variations || [result]);
      setSelectedVersion(0);
      // Set initial SEO data from first version
      if (result.variations && result.variations[0]?.seo) {
        setSeoData(result.variations[0].seo);
      } else if (result.seo) {
        setSeoData(result.seo);
      }
      toast.success("3 description versions generated successfully!");
    } catch (error) {
      toast.error("Failed to generate descriptions. Please try again.");
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

const handleRegenerateVersion = async () => {
    if (generatedVersions.length === 0) return;
    
    setIsGenerating(true);
    try {
      const result = await aiService.generateDescription({
        productName: formData.productName,
        features: formData.features,
        tone: formData.tone,
        variations: 3
      });
      
setGeneratedVersions(result.variations || [result]);
      setSelectedVersion(0);
      // Update SEO data with new first version
      if (result.variations && result.variations[0]?.seo) {
        setSeoData(result.variations[0].seo);
      } else if (result.seo) {
        setSeoData(result.seo);
      }
      toast.success("New versions generated!");
    } catch (error) {
      toast.error("Failed to generate new versions. Please try again.");
      console.error("Regeneration failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

const handleSaveToShopify = async () => {
    if (generatedVersions.length === 0 || !generatedVersions[selectedVersion]?.content.trim()) {
      toast.error("No description to save");
      return;
    }

    const selectedDescription = generatedVersions[selectedVersion].content;
    setIsSaving(true);
    try {
      await productService.updateDescription(product.Id, selectedDescription);
      toast.success(`Version ${String.fromCharCode(65 + selectedVersion)} saved to Shopify successfully!`);
      onSave && onSave(selectedDescription);
      onClose();
    } catch (error) {
      toast.error("Failed to save to Shopify. Please try again.");
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

const handleDescriptionChange = (value) => {
    if (generatedVersions[selectedVersion]) {
      const updatedVersions = [...generatedVersions];
      updatedVersions[selectedVersion] = {
        ...updatedVersions[selectedVersion],
        content: value
      };
      setGeneratedVersions(updatedVersions);
    }
};

  const handleSEOChange = (field, value) => {
    setSeoData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update the current version's SEO data
    if (generatedVersions[selectedVersion]) {
      const updatedVersions = [...generatedVersions];
      updatedVersions[selectedVersion] = {
        ...updatedVersions[selectedVersion],
        seo: {
          ...updatedVersions[selectedVersion].seo,
          [field]: value
        }
      };
      setGeneratedVersions(updatedVersions);
    }
  };

const getCharacterCountColor = (current, optimal) => {
    const percentage = current / optimal;
    if (percentage >= 0.8 && percentage <= 1.2) return "text-green-600";
    if (percentage >= 0.6 && percentage <= 1.4) return "text-yellow-600";
    return "text-red-600";
  };

  const getQualityColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getQualityBadgeColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold gradient-text">
                  AI Description Generator
                </h3>
                <p className="text-sm text-gray-600">
                  Generate compelling descriptions for {product?.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div className="space-y-6">
                <div>
                  <Input
                    label="Product Name"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <TextArea
                    label="Key Features"
                    value={formData.features}
                    onChange={(e) => handleInputChange("features", e.target.value)}
                    placeholder="List key features separated by commas (e.g., wireless, noise cancelling, 30-hour battery)"
                    rows={4}
                  />
                </div>

                <div>
                  <Select
                    label="Tone & Style"
                    value={formData.tone}
                    onChange={(e) => handleInputChange("tone", e.target.value)}
                    options={toneOptions}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isGenerating}
                  leftIcon="Sparkles"
                  disabled={!formData.productName.trim() || !formData.features.trim()}
                >
                  {isGenerating ? "Generating..." : "Generate Description"}
                </Button>
              </div>

{/* Right Column - Preview */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generated Descriptions - A/B Testing
                  </label>
                  
                  {isGenerating ? (
                    <div className="border border-gray-300 rounded-lg p-6">
                      <Loading type="generation" message="Crafting 3 perfect description variations..." />
                    </div>
                  ) : generatedVersions.length > 0 ? (
                    <div className="space-y-4">
                      {/* Tab Navigation */}
                      <div className="flex border-b border-gray-200">
                        {generatedVersions.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedVersion(index)}
                            className={cn(
                              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                              selectedVersion === index
                                ? "border-purple-600 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                          >
                            Version {String.fromCharCode(65 + index)}
                          </button>
                        ))}
                      </div>

                      {/* Selected Version Content */}
                      <div className="space-y-4">
                        <TextArea
                          value={generatedVersions[selectedVersion]?.content || ""}
                          onChange={(e) => handleDescriptionChange(e.target.value)}
                          placeholder="Generated description will appear here..."
                          rows={8}
                          className="font-mono text-sm"
                        />
{analysis && (
                          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">
                                Quality Analysis - Version {String.fromCharCode(65 + selectedVersion)}
                              </h4>
                              {analysis.qualityScores && (
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityBadgeColor(analysis.qualityScores.overall)}`}>
                                  Overall: {analysis.qualityScores.overall}/100
                                </div>
                              )}
                            </div>
                            
                            {/* Content Metrics */}
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{analysis.wordCount}</div>
                                <div className="text-gray-500">Words</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{analysis.sentenceCount}</div>
                                <div className="text-gray-500">Sentences</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{analysis.avgWordsPerSentence}</div>
                                <div className="text-gray-500">Avg/Sentence</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{analysis.characterCount}</div>
                                <div className="text-gray-500">Characters</div>
                              </div>
                            </div>

                            {/* Quality Scores */}
                            {analysis.qualityScores && (
                              <div className="border-t border-gray-200 pt-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Quality Indicators</h5>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <ApperIcon name="BookOpen" className="w-4 h-4 mr-1 text-gray-400" />
                                      <span className={`font-semibold ${getQualityColor(analysis.qualityScores.readability)}`}>
                                        {analysis.qualityScores.readability}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500">Readability</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <ApperIcon name="Search" className="w-4 h-4 mr-1 text-gray-400" />
                                      <span className={`font-semibold ${getQualityColor(analysis.qualityScores.seo)}`}>
                                        {analysis.qualityScores.seo}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500">SEO Score</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center mb-1">
                                      <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1 text-gray-400" />
                                      <span className={`font-semibold ${getQualityColor(analysis.qualityScores.conversion)}`}>
                                        {analysis.qualityScores.conversion}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500">Conversion</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {analysis && analysis.suggestions && analysis.suggestions.length > 0 && (
                              <div className="border-t border-gray-200 pt-3">
                                <div className="text-xs font-medium text-gray-700 mb-1">Suggestions:</div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {analysis.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start">
                                      <ApperIcon name="ArrowRight" className="w-3 h-3 mt-0.5 mr-1 text-gray-400" />
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        {/* SEO Section */}
                        {generatedVersions.length > 0 && (
                          <div className="border-t border-gray-200 pt-6 mt-6">
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                              <ApperIcon name="Search" className="w-4 h-4 mr-2" />
                              SEO Optimization
                            </h4>
                            
                            <div className="space-y-4">
                              {/* Meta Title */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Meta Title
                                  <span className={`ml-2 text-xs ${getCharacterCountColor(seoData.metaTitle.length, 55)}`}>
                                    {seoData.metaTitle.length}/60 characters (optimal: 50-60)
                                  </span>
                                </label>
                                <Input
                                  value={seoData.metaTitle}
                                  onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
                                  placeholder="Enter meta title for search engines..."
                                  className="text-sm"
                                  maxLength={60}
                                />
                              </div>
                              
                              {/* Meta Description */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Meta Description
                                  <span className={`ml-2 text-xs ${getCharacterCountColor(seoData.metaDescription.length, 155)}`}>
                                    {seoData.metaDescription.length}/160 characters (optimal: 150-160)
                                  </span>
                                </label>
                                <TextArea
                                  value={seoData.metaDescription}
                                  onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
                                  placeholder="Enter meta description for search engine results..."
                                  rows={3}
                                  className="text-sm resize-none"
                                  maxLength={160}
                                />
                              </div>
                              
                              {/* Suggested Keywords */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Suggested Keywords
                                  <span className="ml-2 text-xs text-gray-500">
                                    Comma-separated list
                                  </span>
                                </label>
                                <Input
                                  value={seoData.suggestedKeywords}
                                  onChange={(e) => handleSEOChange('suggestedKeywords', e.target.value)}
                                  placeholder="keyword1, keyword2, keyword3..."
                                  className="text-sm"
                                />
                              </div>
                              
                              {/* SEO Tips */}
                              <div className="bg-blue-50 rounded-lg p-3">
                                <div className="flex items-start">
                                  <ApperIcon name="Info" className="w-4 h-4 text-blue-500 mt-0.5 mr-2" />
                                  <div className="text-xs text-blue-700">
                                    <div className="font-medium mb-1">SEO Tips:</div>
                                    <ul className="space-y-1">
                                      <li>• Meta titles should be unique and descriptive</li>
                                      <li>• Meta descriptions should entice clicks from search results</li>
                                      <li>• Use relevant keywords naturally in both title and description</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-6 text-center text-gray-500">
                      Generated descriptions will appear here...
                    </div>
                  )}
                </div>

                {generatedVersions.length > 0 && !isGenerating && (
<div className="flex space-x-3">
                    <Button
                      onClick={handleRegenerateVersion}
                      variant="outline"
                      size="md"
                      className="flex-1"
                      leftIcon="RefreshCw"
                      title="Generate new versions with quality feedback incorporated"
                    >
                      Generate New Versions
                    </Button>
                    <Button
                      onClick={handleSaveToShopify}
                      variant="success"
                      size="md"
                      className="flex-1"
                      loading={isSaving}
                      leftIcon="Save"
                    >
                      Save Version {String.fromCharCode(65 + selectedVersion)}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionGeneratorModal;