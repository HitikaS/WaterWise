import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import ReportIssue from "@/pages/report-issue";
import Alerts from "@/pages/alerts";
import WaterTips from "@/pages/water-tips";
import Leaderboard from "@/pages/leaderboard";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/report" component={ReportIssue} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/tips" component={WaterTips} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
            onToggle={toggleSidebar}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
            <Router />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
