import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null, 
  type = "default" 
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "notFound":
        return "Search";
      case "server":
        return "Server";
      default:
        return "AlertTriangle";
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case "network":
        return "Connection Error";
      case "notFound":
        return "Not Found";
      case "server":
        return "Server Error";
      default:
        return "Oops! Something went wrong";
    }
  };

  const getErrorDescription = () => {
    switch (type) {
      case "network":
        return "Please check your internet connection and try again.";
      case "notFound":
        return "The item you're looking for couldn't be found.";
      case "server":
        return "Our servers are experiencing issues. Please try again later.";
      default:
        return "We encountered an unexpected error. Please try again.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon 
          name={getErrorIcon()} 
          className="w-8 h-8 text-red-500"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message || getErrorDescription()}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="primary"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};

export default Error;