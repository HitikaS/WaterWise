import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { WaterReport } from "@shared/schema";
import { getSeverityColor, getTimeAgo } from "@/lib/utils";

export function RecentReports() {
  const { data: reports, isLoading } = useQuery<WaterReport[]>({
    queryKey: ['/api/reports']
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentReports = reports?.slice(0, 3) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Reports</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReports.length > 0 ? recentReports.map((report) => (
            <div key={report.id} className="flex items-start space-x-3 p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {report.issueType} - {report.location}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Reported by: {report.userName || "Anonymous"} • {getTimeAgo(new Date(report.createdAt!))}
                </p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getSeverityColor(report.severity)}`}>
                  {report.severity} Severity
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-4 text-gray-500">
              No recent reports
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
