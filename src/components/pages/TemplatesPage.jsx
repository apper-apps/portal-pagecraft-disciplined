import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";
import templateService from "@/services/api/templateService";

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    tone: "Professional",
    category: "General",
    structure: "",
    keywords: "",
    description: ""
  });

  const toneOptions = ["Professional", "Casual", "Luxury"];
  const categoryOptions = ["General", "Technology", "Fashion", "Lifestyle", "Luxury"];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setFormData({
      name: "",
      tone: "Professional",
      category: "General",
      structure: "",
      keywords: "",
      description: ""
    });
    setSelectedTemplate(null);
    setIsEditMode(false);
    setIsCreateModalOpen(true);
  };

  const handleEditTemplate = (template) => {
    setFormData({
      name: template.name,
      tone: template.tone,
      category: template.category,
      structure: template.structure,
      keywords: Array.isArray(template.keywords) ? template.keywords.join(", ") : template.keywords,
      description: template.description
    });
    setSelectedTemplate(template);
    setIsEditMode(true);
    setIsCreateModalOpen(true);
  };

  const handleDeleteTemplate = async (template) => {
    if (!window.confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return;
    }

    try {
      await templateService.delete(template.Id);
      setTemplates(prev => prev.filter(t => t.Id !== template.Id));
      toast.success("Template deleted successfully");
    } catch (error) {
      toast.error("Failed to delete template");
      console.error("Delete failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    try {
      const templateData = {
        ...formData,
        keywords: formData.keywords.split(",").map(k => k.trim()).filter(k => k.length > 0)
      };

      if (isEditMode && selectedTemplate) {
        const updated = await templateService.update(selectedTemplate.Id, templateData);
        setTemplates(prev => prev.map(t => t.Id === selectedTemplate.Id ? updated : t));
        toast.success("Template updated successfully");
      } else {
        const created = await templateService.create(templateData);
        setTemplates(prev => [...prev, created]);
        toast.success("Template created successfully");
      }

      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error(isEditMode ? "Failed to update template" : "Failed to create template");
      console.error("Submit failed:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getToneBadgeVariant = (tone) => {
    switch (tone) {
      case "Professional": return "primary";
      case "Casual": return "secondary";
      case "Luxury": return "warning";
      default: return "default";
    }
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadTemplates} 
        type="server"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Description Templates</h2>
          <p className="text-gray-600 mt-1">
            Create and manage reusable templates for AI-generated descriptions
          </p>
        </div>
        <Button
          onClick={handleCreateTemplate}
          variant="primary"
          leftIcon="Plus"
        >
          Create Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold gradient-text">{templates.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Popular Tone</p>
              <p className="text-2xl font-bold text-purple-600">
                {templates.length > 0 
                  ? templates.reduce((acc, curr) => 
                      templates.filter(t => t.tone === curr.tone).length > 
                      templates.filter(t => t.tone === acc.tone).length ? curr : acc
                    ).tone 
                  : "N/A"
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-green-600">
                {new Set(templates.map(t => t.category)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Tag" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Empty
          type="templates"
          action={
            <Button
              variant="primary"
              leftIcon="Plus"
              onClick={handleCreateTemplate}
            >
              Create Your First Template
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.Id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={getToneBadgeVariant(template.tone)} size="sm">
                      {template.tone}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {template.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {template.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Structure:</p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {template.structure}
                </p>
              </div>

              {template.keywords && template.keywords.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(template.keywords) ? template.keywords : [template.keywords])
                      .slice(0, 3)
                      .map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    {template.keywords.length > 3 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                        +{template.keywords.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-400">
                Created {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Template Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsCreateModalOpen(false)} />
            
            <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold gradient-text">
                  {isEditMode ? "Edit Template" : "Create New Template"}
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Template Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter template name"
                    required
                  />
                  
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    options={categoryOptions}
                  />
                </div>

                <Select
                  label="Tone & Style"
                  value={formData.tone}
                  onChange={(e) => handleInputChange("tone", e.target.value)}
                  options={toneOptions}
                />

                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what this template is used for"
                  rows={3}
                />

                <TextArea
                  label="Structure Guidelines"
                  value={formData.structure}
                  onChange={(e) => handleInputChange("structure", e.target.value)}
                  placeholder="Describe the structure and flow of descriptions using this template"
                  rows={4}
                />

                <Input
                  label="Keywords"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange("keywords", e.target.value)}
                  placeholder="Enter keywords separated by commas (e.g., premium, quality, innovative)"
                />

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    leftIcon={isEditMode ? "Save" : "Plus"}
                  >
                    {isEditMode ? "Update Template" : "Create Template"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;