import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Loading from "@/components/ui/Loading";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import aiService from "@/services/api/aiService";
import productService from "@/services/api/productService";

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
    }
  }, [product, isOpen]);

useEffect(() => {
    if (generatedVersions.length > 0 && generatedVersions[selectedVersion]) {
      analyzeDescription();
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
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <h4 className="font-medium text-gray-900">
                              Analysis - Version {String.fromCharCode(65 + selectedVersion)}
                            </h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{analysis.wordCount}</div>
                                <div className="text-gray-500">Words</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{analysis.readabilityScore}</div>
                                <div className="text-gray-500">Readability</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900">{analysis.seoScore}</div>
                                <div className="text-gray-500">SEO Score</div>
                              </div>
                            </div>
                            
                            {analysis.suggestions && analysis.suggestions.length > 0 && (
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