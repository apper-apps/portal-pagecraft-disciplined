import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const TextArea = forwardRef(({ 
  className, 
  error = false,
  label = null,
  placeholder = "",
  rows = 4,
  resize = true,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 text-sm border rounded-lg transition-colors duration-200 form-focus placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const errorStyles = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-300 focus:border-purple-500 focus:ring-purple-500";

  const resizeStyles = resize ? "resize-y" : "resize-none";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={cn(
          baseStyles,
          errorStyles,
          resizeStyles,
          className
        )}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
    </div>
  );
});

TextArea.displayName = "TextArea";

export default TextArea;