import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found", 
  description = "There are no items to display at the moment.",
  action = null,
  icon = "Package",
  type = "default" 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "products":
        return {
          icon: "Package",
          title: "No products found",
          description: "Start by adding products to your store or adjust your search criteria."
        };
      case "templates":
        return {
          icon: "FileText",
          title: "No templates available",
          description: "Create your first template to get started with AI-powered descriptions."
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          description: "Try adjusting your search terms or filters to find what you're looking for."
        };
      case "descriptions":
        return {
          icon: "PenTool",
          title: "No descriptions generated",
          description: "Generate your first AI-powered product description to get started."
        };
      default:
        return { icon, title, description };
    }
  };

  const content = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon 
          name={content.icon} 
          className="w-10 h-10 text-purple-500"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {content.description}
      </p>
      
      {action && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action}
        </div>
      )}
    </div>
  );
};

export default Empty;