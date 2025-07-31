import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import productService from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import FilterBar from "@/components/molecules/FilterBar";
import SearchBar from "@/components/molecules/SearchBar";
import ProductGrid from "@/components/organisms/ProductGrid";
import DescriptionGeneratorModal from "@/components/organisms/DescriptionGeneratorModal";
import BulkGenerationModal from "@/components/organisms/BulkGenerationModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";

const ProductsPage = () => {
const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [categories, setCategories] = useState([]);
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Bulk selection state
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
      setCategories(productService.getCategories());
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "category":
          return a.category.localeCompare(b.category);
        case "updated":
          return new Date(b.lastGenerated || 0) - new Date(a.lastGenerated || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("name");
  };

  const handleGenerateDescription = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

const handleDescriptionSave = (description) => {
    // Update the product in the local state
    setProducts(prev => prev.map(product => 
      product.Id === selectedProduct.Id 
        ? { ...product, currentDescription: description, lastGenerated: new Date().toISOString() }
        : product
    ));
    toast.success("Description saved successfully!");
  };

  // Bulk selection handlers
  const handleProductSelect = (productId, isSelected) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.Id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedProducts(new Set());
  };

  const handleBulkGenerate = () => {
    if (selectedProducts.size === 0) {
      toast.error("Please select products to generate descriptions for");
      return;
    }
    setIsBulkModalOpen(true);
  };

  const handleBulkModalClose = () => {
    setIsBulkModalOpen(false);
  };

  const handleBulkSave = (results) => {
    // Update products with bulk generated descriptions
    setProducts(prev => prev.map(product => {
      const result = results.find(r => r.productId === product.Id);
      if (result && result.description) {
        return {
          ...product,
          currentDescription: result.description,
          lastGenerated: new Date().toISOString()
        };
      }
      return product;
    }));
    
    setSelectedProducts(new Set());
    toast.success(`Bulk descriptions saved for ${results.filter(r => r.description).length} products!`);
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadProducts} 
        type="server"
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold gradient-text">{products.length}</p>
            </div>
<div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With Descriptions</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.currentDescription).length}
              </p>
            </div>
<div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-blue-600">{categories.length - 1}</p>
            </div>
<div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Tag" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Filtered Results</p>
              <p className="text-2xl font-bold text-purple-600">{filteredProducts.length}</p>
            </div>
<div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Filter" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
{/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search products by name, category, or SKU..."
          className="max-w-md"
        />
        
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onClearFilters={handleClearFilters}
        />

        {/* Bulk Actions Bar */}
        {selectedProducts.size > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={handleClearSelection}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear selection
                </button>
              </div>
              <Button
                onClick={handleBulkGenerate}
                variant="primary"
                size="sm"
                leftIcon="Sparkles"
              >
                Bulk Generate
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <Empty
          type="products"
          action={
            <Button
              variant="primary"
              leftIcon="Plus"
              onClick={() => toast.info("Connect to Shopify to sync products")}
            >
              Sync Products
            </Button>
          }
        />
      ) : (
<ProductGrid
          products={filteredProducts}
          onGenerateDescription={handleGenerateDescription}
          viewMode={viewMode}
          selectedProducts={selectedProducts}
          onProductSelect={handleProductSelect}
          onSelectAll={handleSelectAll}
          showCheckboxes={true}
        />
      )}

      {/* Description Generator Modal */}
      <DescriptionGeneratorModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleDescriptionSave}
      />
{/* Bulk Generation Modal */}
      {isBulkModalOpen && (
        <BulkGenerationModal
          products={filteredProducts.filter(p => selectedProducts.has(p.Id))}
          isOpen={isBulkModalOpen}
          onClose={handleBulkModalClose}
          onSave={handleBulkSave}
        />
      )}
    </div>
  );
};

export default ProductsPage;