import ProductCard from "@/components/molecules/ProductCard";
import React from "react";
import ApperIcon from "@/components/atoms/ApperIcon";
import Button from "@/components/atoms/Button";
const ProductGrid = ({ products, onGenerateDescription, viewMode = "grid" }) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.Id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="w-full h-full flex items-center justify-center" style={{ display: "none" }}>
                  <ApperIcon name="Package" className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span>SKU: {product.sku}</span>
                      <span>{product.category}</span>
                      <span className="font-medium text-purple-600">
                        ${product.price?.toFixed(2)}
                      </span>
                    </div>
                    {product.currentDescription && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.currentDescription}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 ml-6">
                    <Button
                      onClick={() => onGenerateDescription(product)}
                      variant="primary"
                      size="sm"
                      leftIcon="Sparkles"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.Id}
          product={product}
          onGenerateDescription={onGenerateDescription}
        />
      ))}
    </div>
  );
};

export default ProductGrid;