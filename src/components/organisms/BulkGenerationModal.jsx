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

const BulkGenerationModal = ({ 
  products, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [currentStep, setCurrentStep] = useState('setup'); // setup, generating, review
  const [formData, setFormData] = useState({
    tone: "Professional",
    features: ""
  });
  const [generationProgress, setGenerationProgress] = useState({
    current: 0,
    total: 0,
    currentProduct: ""
  });
  const [generatedResults, setGeneratedResults] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const toneOptions = [
    { value: "Professional", label: "Professional - Technical and feature-focused" },
    { value: "Casual", label: "Casual - Friendly and conversational" },
    { value: "Luxury", label: "Luxury - Sophisticated and premium" }
  ];

  useEffect(() => {
    if (products && isOpen) {
      setCurrentStep('setup');
      setFormData({
        tone: "Professional",
        features: ""
      });
      setGeneratedResults([]);
      setSelectedTab(0);
      setGenerationProgress({ current: 0, total: products.length, currentProduct: "" });
    }
  }, [products, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartGeneration = async () => {
    if (!formData.features.trim()) {
      toast.error("Please enter key features for the products");
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');
    setGenerationProgress({ current: 0, total: products.length, currentProduct: "" });
    
    const results = [];
    
    try {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        setGenerationProgress({
          current: i,
          total: products.length,
          currentProduct: product.name
        });

        try {
          const result = await aiService.generateDescription({
            productName: product.name,
            features: formData.features,
            tone: formData.tone,
            variations: 3
          });

          results.push({
            productId: product.Id,
            product: product,
            descriptions: result.variations || [result],
            selectedIndex: 0,
            status: 'success'
          });
        } catch (error) {
          console.error(`Failed to generate for ${product.name}:`, error);
          results.push({
            productId: product.Id,
            product: product,
            descriptions: [],
            selectedIndex: 0,
            status: 'error',
            error: error.message
          });
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setGenerationProgress({
        current: products.length,
        total: products.length,
        currentProduct: "Complete!"
      });

      setGeneratedResults(results);
      setCurrentStep('review');
      toast.success(`Generated descriptions for ${results.filter(r => r.status === 'success').length} products!`);
    } catch (error) {
      toast.error("Bulk generation failed. Please try again.");
      console.error("Bulk generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDescriptionChange = (resultIndex, value) => {
    setGeneratedResults(prev => prev.map((result, index) => 
      index === resultIndex 
        ? {
            ...result,
            descriptions: result.descriptions.map((desc, descIndex) => 
              descIndex === result.selectedIndex 
                ? { ...desc, content: value }
                : desc
            )
          }
        : result
    ));
  };

  const handleVersionSelect = (resultIndex, versionIndex) => {
    setGeneratedResults(prev => prev.map((result, index) => 
      index === resultIndex 
        ? { ...result, selectedIndex: versionIndex }
        : result
    ));
  };

  const handleRegenerateProduct = async (resultIndex) => {
    const result = generatedResults[resultIndex];
    
    try {
      const newResult = await aiService.generateDescription({
        productName: result.product.name,
        features: formData.features,
        tone: formData.tone,
        variations: 3
      });

      setGeneratedResults(prev => prev.map((r, index) => 
        index === resultIndex 
          ? {
              ...r,
              descriptions: newResult.variations || [newResult],
              selectedIndex: 0,
              status: 'success'
            }
          : r
      ));

      toast.success(`Regenerated descriptions for ${result.product.name}`);
    } catch (error) {
      toast.error(`Failed to regenerate for ${result.product.name}`);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    
    try {
      const updates = generatedResults
        .filter(result => result.status === 'success' && result.descriptions[result.selectedIndex]?.content)
        .map(result => ({
          productId: result.productId,
          description: result.descriptions[result.selectedIndex].content
        }));

      await productService.bulkUpdateDescriptions(updates);
      onSave(updates);
      onClose();
    } catch (error) {
      toast.error("Failed to save descriptions. Please try again.");
      console.error("Bulk save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold gradient-text">
                  Bulk Description Generator
                </h3>
                <p className="text-sm text-gray-600">
                  Generate descriptions for {products.length} selected products
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
            {/* Setup Step */}
            {currentStep === 'setup' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Configure Bulk Generation
                  </h4>
                  <p className="text-gray-600">
                    Set the parameters that will be used for all {products.length} products
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <TextArea
                      label="Key Features (applies to all products)"
                      value={formData.features}
                      onChange={(e) => handleInputChange("features", e.target.value)}
                      placeholder="Enter common features that apply to most products (e.g., high quality, durable, modern design)"
                      rows={4}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      These features will be combined with each product's specific details
                    </p>
                  </div>

                  <div>
                    <Select
                      label="Tone & Style"
                      value={formData.tone}
                      onChange={(e) => handleInputChange("tone", e.target.value)}
                      options={toneOptions}
                    />
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">Products to Process:</h5>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {products.map(product => (
                        <div key={product.Id} className="text-sm text-blue-700 flex items-center">
                          <ApperIcon name="Package" className="w-3 h-3 mr-2" />
                          {product.name} - {product.category}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleStartGeneration}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    leftIcon="Sparkles"
                    disabled={!formData.features.trim()}
                  >
                    Start Bulk Generation
                  </Button>
                </div>
              </div>
            )}

            {/* Generation Step */}
            {currentStep === 'generating' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Generating Descriptions
                  </h4>
                  <p className="text-gray-600">
                    Please wait while we create descriptions for your products...
                  </p>
                </div>

                <Loading 
                  type="progress" 
                  current={generationProgress.current}
                  total={generationProgress.total}
                  message={generationProgress.currentProduct ? 
                    `Processing: ${generationProgress.currentProduct}` : 
                    "Preparing generation..."
                  }
                />

                <div className="mt-6 text-center text-sm text-gray-500">
                  This process may take a few minutes. Please don't close this window.
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      Review Generated Descriptions
                    </h4>
                    <p className="text-gray-600">
                      Review and edit descriptions before saving to Shopify
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setCurrentStep('setup')}
                      variant="outline"
                      size="md"
                      leftIcon="ArrowLeft"
                    >
                      Back to Setup
                    </Button>
                    <Button
                      onClick={handleSaveAll}
                      variant="success"
                      size="md"
                      loading={isSaving}
                      leftIcon="Save"
                    >
                      Save All to Shopify
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {generatedResults.map((result, index) => (
                    <div key={result.productId} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">{result.product.name}</h5>
                          <p className="text-sm text-gray-500">{result.product.category} • SKU: {result.product.sku}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {result.status === 'success' ? (
                            <div className="flex items-center text-green-600">
                              <ApperIcon name="CheckCircle2" className="w-4 h-4 mr-1" />
                              <span className="text-sm">Generated</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                              <span className="text-sm">Failed</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {result.status === 'success' && result.descriptions.length > 0 ? (
                        <div className="space-y-4">
                          {/* Version Tabs */}
                          <div className="flex border-b border-gray-200">
                            {result.descriptions.map((_, versionIndex) => (
                              <button
                                key={versionIndex}
                                onClick={() => handleVersionSelect(index, versionIndex)}
                                className={cn(
                                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                                  result.selectedIndex === versionIndex
                                    ? "border-purple-600 text-purple-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                )}
                              >
                                Version {String.fromCharCode(65 + versionIndex)}
                              </button>
                            ))}
                          </div>

                          <TextArea
                            value={result.descriptions[result.selectedIndex]?.content || ""}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                            rows={6}
                            className="font-mono text-sm"
                          />

                          <div className="flex justify-end">
                            <Button
                              onClick={() => handleRegenerateProduct(index)}
                              variant="outline"
                              size="sm"
                              leftIcon="RefreshCw"
                            >
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <ApperIcon name="AlertTriangle" className="w-8 h-8 mx-auto mb-2" />
                          <p>Failed to generate description</p>
                          <p className="text-sm">{result.error}</p>
                          <Button
                            onClick={() => handleRegenerateProduct(index)}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            leftIcon="RefreshCw"
                          >
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkGenerationModal;