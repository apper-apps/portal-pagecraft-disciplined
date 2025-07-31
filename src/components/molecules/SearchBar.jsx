import { useState } from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className = "",
  debounceMs = 300 
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleSearch = (value) => {
    setSearchValue(value);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
    
    setDebounceTimer(timer);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearch("");
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        leftIcon={<ApperIcon name="Search" className="w-4 h-4 text-gray-400" />}
        rightIcon={
          searchValue && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </button>
          )
        }
        className="pr-10"
      />
    </div>
  );
};

export default SearchBar;