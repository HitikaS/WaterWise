import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Clock, Bell } from "lucide-react";
import { getTimeAgo } from "@/lib/utils";

interface AlertItem {
  id: number;
  type: "scarcity" | "weather" | "maintenance" | "quality";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  location?: string;
  timestamp: Date;
  isRead: boolean;
  isActive: boolean;
}

// Mock alerts data - in a real app this would come from the API
const mockAlerts: AlertItem[] = [
  {
    id: 1,
    type: "scarcity",
    severity: "high",
    title: "Water Scarcity Alert",
    description: "High water stress predicted for next week. Implement immediate conservation measures.",
    location: "Downtown Area",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    isActive: true
  },
  {
    id: 2,
    type: "weather",
    severity: "medium",
    title: "Low Rainfall Warning",
    description: "Below average rainfall expected for the next 10 days. Monitor water usage closely.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: false,
    isActive: true
  },
  {
    id: 3,
    type: "maintenance",
    severity: "medium",
    title: "Scheduled Maintenance",
    description: "Water supply interruption scheduled for tomorrow 2:00 AM - 6:00 AM in Sector B.",
    location: "Sector B",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isRead: true,
    isActive: true
  },
  {
    id: 4,
    type: "quality",
    severity: "low",
    title: "Water Quality Advisory",
    description: "Minor chlorine levels detected. Water is safe to drink but may have slight taste.",
    location: "Park Avenue",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    isActive: false
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'scarcity':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'weather':
      return <Bell className="h-5 w-5 text-blue-500" />;
    case 'maintenance':
      return <Clock className="h-5 w-5 text-purple-500" />;
    case 'quality':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

export default function Alerts() {
  const { data: metrics } = useQuery({
    queryKey: ['/api/dashboard/metrics']
  });

  const activeAlerts = mockAlerts.filter(alert => alert.isActive);
  const unreadCount = activeAlerts.filter(alert => !alert.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <Header title="Alerts & Notifications" onMenuClick={() => {}} />
      
      <main className="p-6 space-y-6 pb-20">
        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-500">{unreadCount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unread Alerts</p>
                </div>
                <Bell className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-500">{activeAlerts.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-500">{metrics?.currentRisk || 0}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Risk Level</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Alert key={alert.id} className={`${!alert.isRead ? 'ring-2 ring-blue-200' : ''}`}>
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {alert.title}
                          </h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {!alert.isRead && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <AlertDescription className="text-gray-600 dark:text-gray-400">
                          {alert.description}
                        </AlertDescription>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{getTimeAgo(alert.timestamp)}</span>
                          {alert.location && <span>📍 {alert.location}</span>}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </Alert>
              ))}
              
              {activeAlerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No active alerts</p>
                  <p className="text-sm">You're all caught up!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
