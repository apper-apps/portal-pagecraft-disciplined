import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const SettingsPage = () => {
const [settings, setSettings] = useState({
    shopifyStore: "",
    apiKey: "",
    aiModel: "gpt-4",
    defaultTone: "Professional",
    maxWords: 150,
    includeKeywords: true,
    autoSave: false,
    notifications: true,
    brandVoiceStrength: 70,
    sampleContent: "",
    brandGuidelines: "",
    uploadedFiles: []
  });

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [saving, setSaving] = useState(false);

  const aiModelOptions = [
    { value: "gpt-4", label: "GPT-4 (Recommended)" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "claude-2", label: "Claude 2" }
  ];

  const toneOptions = ["Professional", "Casual", "Luxury"];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Simulate loading settings from localStorage or API
const savedSettings = localStorage.getItem("pagecraft-settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({
        ...settings,
        ...parsed,
        uploadedFiles: parsed.uploadedFiles || []
      });
      setIsConnected(parsed.shopifyStore && parsed.apiKey);
      setConnectionStatus(parsed.shopifyStore && parsed.apiKey ? "connected" : "disconnected");
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const textFiles = files.filter(file => 
      file.type === 'text/plain' || 
      file.type === 'text/csv' || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.csv')
    );

    if (textFiles.length === 0) {
      toast.error("Please upload text files (.txt, .csv) only");
      return;
    }

    try {
      const fileContents = await Promise.all(
        textFiles.map(async (file) => {
          const content = await file.text();
          return {
            name: file.name,
            size: file.size,
            content: content.substring(0, 5000), // Limit content length
            uploadDate: new Date().toISOString()
          };
        })
      );

      setSettings(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, ...fileContents]
      }));

      toast.success(`${textFiles.length} file(s) uploaded successfully for brand voice training`);
    } catch (error) {
      toast.error("Failed to upload files. Please try again.");
    }
  };

  const handleClearTrainingData = () => {
    setSettings(prev => ({
      ...prev,
      sampleContent: "",
      brandGuidelines: "",
      uploadedFiles: []
    }));
    toast.success("All brand voice training data cleared");
  };
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem("pagecraft-settings", JSON.stringify(settings));
      
      if (settings.shopifyStore && settings.apiKey) {
        setIsConnected(true);
        setConnectionStatus("connected");
      } else {
        setIsConnected(false);
        setConnectionStatus("disconnected");
      }
      
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!settings.shopifyStore || !settings.apiKey) {
      toast.error("Please enter your Shopify store URL and API key");
      return;
    }

    setConnectionStatus("testing");
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectionStatus("connected");
      setIsConnected(true);
      toast.success("Connection successful!");
    } catch (error) {
      setConnectionStatus("error");
      setIsConnected(false);
      toast.error("Connection failed. Please check your credentials.");
    }
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return <Badge variant="success">Connected</Badge>;
      case "testing":
        return <Badge variant="info">Testing...</Badge>;
      case "error":
        return <Badge variant="danger">Error</Badge>;
      default:
        return <Badge variant="default">Disconnected</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">
          Configure your AI preferences and Shopify integration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shopify Integration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="ShoppingBag" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Shopify Integration</h3>
                  <p className="text-sm text-gray-600">Connect your Shopify store</p>
                </div>
              </div>
              {getConnectionStatusBadge()}
            </div>

            <div className="space-y-4">
              <Input
                label="Shopify Store URL"
                value={settings.shopifyStore}
                onChange={(e) => handleInputChange("shopifyStore", e.target.value)}
                placeholder="your-store.myshopify.com"
                leftIcon={<ApperIcon name="Globe" className="w-4 h-4 text-gray-400" />}
              />
              
              <Input
                label="Private App API Key"
                type="password"
                value={settings.apiKey}
                onChange={(e) => handleInputChange("apiKey", e.target.value)}
                placeholder="Enter your private app API key"
                leftIcon={<ApperIcon name="Key" className="w-4 h-4 text-gray-400" />}
              />

              <Button
                onClick={handleTestConnection}
                variant="outline"
                loading={connectionStatus === "testing"}
                leftIcon="Zap"
                disabled={!settings.shopifyStore || !settings.apiKey}
              >
                Test Connection
              </Button>
            </div>
          </div>

{/* AI Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Brain" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Configuration</h3>
                <p className="text-sm text-gray-600">Customize AI behavior and preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <Select
                label="AI Model"
                value={settings.aiModel}
                onChange={(e) => handleInputChange("aiModel", e.target.value)}
                options={aiModelOptions}
              />

              <Select
                label="Default Tone"
                value={settings.defaultTone}
                onChange={(e) => handleInputChange("defaultTone", e.target.value)}
                options={toneOptions}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Word Count: {settings.maxWords}
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={settings.maxWords}
                  onChange={(e) => handleInputChange("maxWords", parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50 words</span>
                  <span>300 words</span>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Voice */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="MessageSquare" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Brand Voice</h3>
                <p className="text-sm text-gray-600">Train AI to match your brand's unique style and tone</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Sample Content
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-400 transition-colors">
                  <div className="text-center">
                    <ApperIcon name="Upload" className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-sm text-gray-600 mb-2">
                      Upload existing product descriptions or marketing content
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".txt,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="brand-voice-upload"
                    />
                    <label htmlFor="brand-voice-upload">
                      <Button variant="outline" size="sm" as="span" leftIcon="Upload">
                        Choose Files
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports .txt and .csv files up to 5MB each
                    </p>
                  </div>
                </div>

                {/* Uploaded Files */}
                {settings.uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Uploaded Files ({settings.uploadedFiles.length})
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {settings.uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="File" className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{file.name}</span>
                            <span className="text-gray-500">({Math.round(file.size / 1024)}KB)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Guidelines */}
              <div>
                <TextArea
                  label="Brand Guidelines (Optional)"
                  value={settings.brandGuidelines}
                  onChange={(e) => handleInputChange("brandGuidelines", e.target.value)}
                  placeholder="Describe your brand voice, tone, key phrases, writing style, or specific requirements. For example: 'Use casual, friendly language. Avoid technical jargon. Include sustainability messaging. Use emojis sparingly.'"
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide specific instructions to help AI understand your brand's personality and communication style
                </p>
              </div>

              {/* Brand Voice Strength */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Voice Strength: {settings.brandVoiceStrength}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.brandVoiceStrength}
                  onChange={(e) => handleInputChange("brandVoiceStrength", parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Generic (0%)</span>
                  <span>Balanced (50%)</span>
                  <span>Strong Brand Match (100%)</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Higher values make AI follow your brand voice more closely. Lower values allow for more creative variation.
                </p>
              </div>

              {/* Clear Training Data */}
              {(settings.uploadedFiles.length > 0 || settings.brandGuidelines) && (
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleClearTrainingData}
                    variant="ghost"
                    size="sm"
                    leftIcon="Trash2"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear All Training Data
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Settings" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
                <p className="text-sm text-gray-600">Application behavior settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Include SEO Keywords</h4>
                  <p className="text-sm text-gray-600">Automatically include relevant keywords in descriptions</p>
                </div>
                <button
                  onClick={() => handleToggle("includeKeywords")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    settings.includeKeywords ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.includeKeywords ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Auto-save Descriptions</h4>
                  <p className="text-sm text-gray-600">Automatically save generated descriptions to drafts</p>
                </div>
                <button
                  onClick={() => handleToggle("autoSave")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    settings.autoSave ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoSave ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications about generation status</p>
                </div>
                <button
                  onClick={() => handleToggle("notifications")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    settings.notifications ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Crown" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pro Plan</h3>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Generations Used</span>
                <span className="font-medium">247 / ∞</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Templates</span>
                <span className="font-medium">12 / ∞</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">API Calls</span>
                <span className="font-medium">1,429 / ∞</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="ghost" size="sm" className="w-full justify-start" leftIcon="Download">
                Export Settings
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" leftIcon="Upload">
                Import Settings
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" leftIcon="RotateCcw">
                Reset to Defaults
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" leftIcon="HelpCircle">
                Get Help
              </Button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ApperIcon name="Headphones" className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Need Help?</h3>
            </div>
            <p className="text-sm text-purple-700 mb-4">
              Get assistance with setup, integration, or troubleshooting.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button
          onClick={handleSaveSettings}
          variant="primary"
          loading={saving}
          leftIcon="Save"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;