import ApperIcon from "@/components/ApperIcon";

const Loading = ({ type = "default", message = "Loading..." }) => {
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

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600 font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Loading;