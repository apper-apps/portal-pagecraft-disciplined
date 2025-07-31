import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  error = false,
  label = null,
  placeholder = "Select an option",
  options = [],
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 text-sm border rounded-lg transition-colors duration-200 form-focus appearance-none bg-white disabled:opacity-50 disabled:cursor-not-allowed";
  
  const errorStyles = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-300 focus:border-purple-500 focus:ring-purple-500";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            baseStyles,
            errorStyles,
            "pr-10",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
});

Select.displayName = "Select";

export default Select;