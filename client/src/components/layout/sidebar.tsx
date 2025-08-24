import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Upload, 
  Brain, 
  Calendar, 
  BarChart3, 
  Settings,
  Rocket,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Content Upload", href: "/content-upload", icon: Upload },
  { name: "AI Processing", href: "/ai-processing", icon: Brain },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
};

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: connections = [] } = useQuery({
    queryKey: ["/api/social-connections"],
    enabled: !!user,
  });

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col" data-testid="sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 viralo-gradient rounded-lg flex items-center justify-center">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800" data-testid="text-brand">Viralo</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                    data-testid={`link-${item.name.toLowerCase().replace(" ", "-")}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Connected Platforms */}
      <div className="p-4 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3" data-testid="text-connected-platforms">
          Connected Platforms
        </h3>
        <div className="space-y-2">
          {['instagram', 'facebook', 'twitter', 'linkedin'].map((platform) => {
            const Icon = platformIcons[platform as keyof typeof platformIcons];
            const connection = connections.find((c: any) => c.platform === platform);
            const isConnected = connection?.isConnected || false;
            
            return (
              <div
                key={platform}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg",
                  isConnected ? "bg-green-50" : "bg-red-50"
                )}
                data-testid={`platform-${platform}`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={cn("h-4 w-4", `platform-icon ${platform}`)} />
                  <span className="text-sm capitalize">{platform}</span>
                </div>
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-secondary" : "bg-red-500"
                  )}
                  data-testid={`status-${platform}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3">
          <img 
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover"
            data-testid="img-avatar"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800" data-testid="text-username">
              {user?.firstName || user?.email || "User"}
            </p>
            <p className="text-xs text-slate-500" data-testid="text-plan">Pro Plan</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="button-logout"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
