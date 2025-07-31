import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ProgressBar = ({ current = 0, total = 100, message = "Loading..." }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <ApperIcon className="w-16 h-16 text-primary-600 animate-pulse-subtle" />
      
      <div className="w-full max-w-md space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{message}</span>
          <span className="text-primary-600 font-medium">{percentage}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          {current} of {total} completed
        </div>
      </div>
    </div>
  );
};

const Loading = ({ type = "default", message = "Loading...", current, total }) => {
  if (type === "skeleton") {
    return (
      <div className="space-y-6 p-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg shimmer"></div>
          <div className="h-10 w-32 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg shimmer"></div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="h-48 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg shimmer mb-4"></div>
              <div className="h-6 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded shimmer mb-2"></div>
              <div className="h-4 w-2/3 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded shimmer mb-4"></div>
              <div className="h-10 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "spinner") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ApperIcon name="Sparkles" className="w-4 h-4 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "generation") {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gradient-to-r from-purple-200 to-pink-200 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 border-r-pink-600 rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ApperIcon name="Brain" className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold gradient-text mb-2">AI is crafting your description</h3>
          <p className="text-gray-600">{message}</p>
          <div className="flex items-center justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "progress") {
    return (
      <div className="p-6">
        <ProgressBar current={current || 0} total={total || 100} message={message} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <ApperIcon className="w-12 h-12 text-primary-600 animate-spin" />
      <p className="text-gray-600 text-sm animate-pulse">{message}</p>
    </div>
  );
};

export { ProgressBar };
export default Loading;