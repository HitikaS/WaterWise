import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  AlertTriangle, 
  Bell, 
  Lightbulb, 
  Trophy, 
  Settings,
  Droplets,
  X,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const navigationItems = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/report", label: "Report Issue", icon: AlertTriangle },
  { path: "/alerts", label: "Alerts", icon: Bell },
  { path: "/tips", label: "Water Tips", icon: Lightbulb },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Droplets className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">AQUAID</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors",
                  isActive && "text-primary bg-blue-50 dark:bg-blue-900/20 border-r-3 border-primary"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className={cn("font-medium", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
