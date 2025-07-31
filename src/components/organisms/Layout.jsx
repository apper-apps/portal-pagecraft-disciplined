import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

const getPageInfo = () => {
    switch (location.pathname) {
      case "/":
      case "/products":
        return {
          title: "Products",
          subtitle: "Manage your store products and generate AI descriptions"
        };
      case "/templates":
        return {
          title: "Templates",
          subtitle: "Create and manage description templates"
        };
      case "/marketing":
        return {
          title: "Marketing Pages",
          subtitle: "Generate compelling landing pages for your campaigns"
        };
      case "/settings":
        return {
          title: "Settings",
          subtitle: "Configure AI preferences and integrations"
        };
      default:
        return {
          title: "PageCraft AI",
          subtitle: "Shopify Description Generator"
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile header with menu button */}
        <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
            >
              <ApperIcon name="Menu" className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-md flex items-center justify-center mr-2">
                <ApperIcon name="Sparkles" className="w-3 h-3 text-white" />
              </div>
              <h1 className="text-lg font-bold gradient-text">
                PageCraft AI
              </h1>
            </div>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block">
          <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />
        </div>
        
        {/* Main content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;