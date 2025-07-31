import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import TextArea from '@/components/atoms/TextArea';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import { marketingService } from '@/services/api/marketingService';

const MarketingPagesPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'Sale',
    discountPercentage: '',
    targetAudience: '',
    description: ''
  });

  // Generated content state
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await marketingService.getAll();
      setCampaigns(data);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.targetAudience.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setGenerating(true);
      
      // Generate content first
      const content = await marketingService.generateContent(formData);
      setGeneratedContent(content);

      // Save campaign
      const campaignData = {
        ...formData,
        generatedContent: content,
        status: 'Draft'
      };

      if (editingCampaign) {
        await marketingService.update(editingCampaign.Id, campaignData);
        toast.success('Campaign updated successfully');
      } else {
        await marketingService.create(campaignData);
        toast.success('Campaign created successfully');
      }

      await loadCampaigns();
      resetForm();
    } catch (error) {
      toast.error('Failed to generate campaign');
    } finally {
      setGenerating(false);
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      type: campaign.type,
      discountPercentage: campaign.discountPercentage,
      targetAudience: campaign.targetAudience,
      description: campaign.description
    });
    setGeneratedContent(campaign.generatedContent);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await marketingService.delete(id);
      toast.success('Campaign deleted successfully');
      await loadCampaigns();
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Sale',
      discountPercentage: '',
      targetAudience: '',
      description: ''
    });
    setGeneratedContent(null);
    setShowForm(false);
    setEditingCampaign(null);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || campaign.type === selectedType;
    return matchesSearch && matchesType;
  });

  const campaignTypes = [
    { value: 'Sale', label: 'Sale Campaign', icon: 'Tag' },
    { value: 'New Collection', label: 'New Collection', icon: 'Sparkles' },
    { value: 'Seasonal', label: 'Seasonal Campaign', icon: 'Calendar' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Loader2" className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading campaigns...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Pages</h1>
          <p className="text-gray-600">Create compelling landing pages for your marketing campaigns</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 btn-gradient text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={18} />
          <span>New Campaign</span>
        </Button>
      </div>

      {/* Campaign Generator Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </h2>
              <Button
                onClick={resetForm}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter campaign title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Type *
                  </label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {campaignTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <Input
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="e.g., Young professionals, Fashion enthusiasts"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Any specific requirements or context for the campaign"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={generating}
                  className="w-full btn-gradient text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  {generating ? (
                    <>
                      <ApperIcon name="Loader2" className="animate-spin" size={18} />
                      <span>Generating Content...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Sparkles" size={18} />
                      <span>{editingCampaign ? 'Update Campaign' : 'Generate Landing Page'}</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Right Column - Generated Content */}
              <div className="space-y-6">
                {generatedContent ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Content</h3>
                    
                    {/* Headlines */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">Headlines</h4>
                        <Button
                          onClick={() => copyToClipboard(generatedContent.headlines.join('\n'))}
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ApperIcon name="Copy" size={16} />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {generatedContent.headlines.map((headline, index) => (
                          <div key={index} className="bg-white p-3 rounded border text-gray-700">
                            {headline}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Body Text */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">Body Text</h4>
                        <Button
                          onClick={() => copyToClipboard(generatedContent.bodyText)}
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ApperIcon name="Copy" size={16} />
                        </Button>
                      </div>
                      <div className="bg-white p-3 rounded border text-gray-700">
                        {generatedContent.bodyText}
                      </div>
                    </div>

                    {/* Call-to-Action Buttons */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">Call-to-Action Buttons</h4>
                        <Button
                          onClick={() => copyToClipboard(generatedContent.ctaButtons.join('\n'))}
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ApperIcon name="Copy" size={16} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.ctaButtons.map((cta, index) => (
                          <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                            {cta}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-12 text-center">
                    <ApperIcon name="FileText" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Generated content will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search campaigns..."
            />
          </div>
          <div className="sm:w-48">
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {campaignTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.Id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary">{campaign.type}</Badge>
                    <Badge variant={campaign.status === 'Published' ? 'success' : 'default'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
                  <p className="text-gray-600 text-sm">{campaign.targetAudience}</p>
                </div>
                <div className="flex items-center space-x-1 ml-4">
                  <Button
                    onClick={() => handleEdit(campaign)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-primary-600"
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(campaign.Id)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              {campaign.discountPercentage && (
                <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  {campaign.discountPercentage}% OFF
                </div>
              )}

              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <strong>Created:</strong> {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
                
                {campaign.generatedContent && (
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Generated Content</span>
                      <ApperIcon name="Eye" className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {campaign.generatedContent.headlines.length} headlines, {campaign.generatedContent.ctaButtons.length} CTAs
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && !loading && (
        <div className="text-center py-12">
          <ApperIcon name="FileText" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedType ? 'Try adjusting your filters' : 'Create your first marketing campaign to get started'}
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="btn-gradient text-white px-6 py-2 rounded-lg font-medium"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Create Campaign
          </Button>
        </div>
      )}
    </div>
  );
};

export default MarketingPagesPage;