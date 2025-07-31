import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ProductCard = ({ product, onGenerateDescription }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatLastGenerated = (dateString) => {
    if (!dateString) return "Never";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ApperIcon name="Package" className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Badge variant="primary" size="sm">
            {product.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>SKU: {product.sku}</span>
            <span className="font-medium text-purple-600">
              ${product.price?.toFixed(2)}
            </span>
          </div>
        </div>

        {product.currentDescription && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.currentDescription}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {formatLastGenerated(product.lastGenerated)}
            </p>
          </div>
        )}

        <Button
          onClick={() => onGenerateDescription(product)}
          variant="primary"
          size="md"
          className="w-full"
          leftIcon="Sparkles"
        >
          Generate Description
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;