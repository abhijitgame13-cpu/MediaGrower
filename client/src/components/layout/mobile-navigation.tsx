import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Upload, 
  Brain, 
  BarChart3, 
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, label: "Home" },
  { name: "Upload", href: "/content-upload", icon: Upload, label: "Upload" },
  { name: "AI Processing", href: "/ai-processing", icon: Brain, label: "AI" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, label: "Analytics" },
  { name: "Settings", href: "/settings", icon: Settings, label: "Settings" },
];

export default function MobileNavigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white border-t border-slate-200 px-4 py-2" data-testid="mobile-navigation">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors min-w-0",
                  isActive
                    ? "text-primary"
                    : "text-slate-500 hover:text-slate-700"
                )}
                data-testid={`mobile-nav-${item.name.toLowerCase().replace(" ", "-")}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}