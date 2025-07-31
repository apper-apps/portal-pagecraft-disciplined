import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  categories = [], 
  selectedCategory = "All", 
  onCategoryChange,
  sortBy = "name",
  onSortChange,
  viewMode = "grid",
  onViewModeChange,
  onClearFilters
}) => {
  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "price", label: "Price Low-High" },
    { value: "price-desc", label: "Price High-Low" },
    { value: "updated", label: "Recently Updated" },
    { value: "category", label: "Category" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="min-w-[150px]">
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              options={categories}
            />
          </div>
          
          <div className="min-w-[150px]">
            <Select
              label="Sort by"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              options={sortOptions}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" 
                  ? "bg-white shadow-sm text-purple-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ApperIcon name="Grid3X3" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" 
                  ? "bg-white shadow-sm text-purple-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            leftIcon="X"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;