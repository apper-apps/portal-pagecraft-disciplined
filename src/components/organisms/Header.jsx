import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, subtitle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Zap" className="w-4 h-4 text-purple-600" />
            <span>AI Powered</span>
          </div>
          
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;