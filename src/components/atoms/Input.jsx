import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error = false,
  label = null,
  placeholder = "",
  leftIcon = null,
  rightIcon = null,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 text-sm border rounded-lg transition-colors duration-200 form-focus placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed";
  
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
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={cn(
            baseStyles,
            errorStyles,
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          placeholder={placeholder}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
});

Input.displayName = "Input";

export default Input;