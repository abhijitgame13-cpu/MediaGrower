import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

const pageNames = {
  "/": "Dashboard",
  "/content-upload": "Content Upload",
  "/ai-processing": "AI Processing", 
  "/schedule": "Schedule",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

const pageDescriptions = {
  "/": "AI-powered social media automation in action",
  "/content-upload": "Upload and organize your content for AI processing",
  "/ai-processing": "Monitor AI enhancement and processing workflows",
  "/schedule": "Manage automated posting schedules across platforms",
  "/analytics": "Track growth metrics and performance insights",
  "/settings": "Configure your account and platform connections",
};

export default function Header() {
  const [location] = useLocation();
  const pageName = pageNames[location as keyof typeof pageNames] || "Page";
  const pageDescription = pageDescriptions[location as keyof typeof pageDescriptions] || "";

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 p-4" data-testid="header">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800" data-testid="text-page-title">
            {pageName}
          </h2>
          <p className="text-slate-600" data-testid="text-page-description">
            {pageDescription}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input 
              type="search" 
              placeholder="Search content..." 
              className="pl-10 pr-4 py-2 w-64"
              data-testid="input-search"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>
          
          <Button variant="ghost" size="sm" className="relative" data-testid="button-notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" data-testid="text-notification-count">
              3
            </span>
          </Button>
          
          <Button 
            className="btn-viralo-primary"
            data-testid="button-upload-content"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Content
          </Button>
        </div>
      </div>
    </header>
  );
}
