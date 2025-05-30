import { useState } from "react";
import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/sidebar";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ReportIssue from "@/pages/report-issue";
import Alerts from "@/pages/alerts";
import WaterTips from "@/pages/water-tips";
import Leaderboard from "@/pages/leaderboard";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Profile from "@/pages/profile";
import { ReactNode } from "react";

function ProtectedRoute({ component: Component, ...props }: { component: React.ComponentType<any>; [key: string]: any }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Redirect to="/" />;
  return <Component {...props} />;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
      <Route path="/profile" component={(props) => <ProtectedRoute component={Profile} {...props} />} />
      <Route path="/report" component={(props) => <ProtectedRoute component={ReportIssue} {...props} />} />
      <Route path="/alerts" component={(props) => <ProtectedRoute component={Alerts} {...props} />} />
      <Route path="/tips" component={(props) => <ProtectedRoute component={WaterTips} {...props} />} />
      <Route path="/leaderboard" component={(props) => <ProtectedRoute component={Leaderboard} {...props} />} />
      <Route path="/settings" component={(props) => <ProtectedRoute component={Settings} {...props} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto lg:pl-64">
        <AppRoutes />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter>
            <AuthenticatedApp />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
