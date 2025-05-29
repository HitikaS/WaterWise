import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  value: string | number;
  label: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export function MetricCard({ 
  value, 
  label, 
  icon: Icon, 
  trend, 
  iconBgColor = "bg-blue-100",
  iconColor = "text-primary"
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {label}
            </p>
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgColor)}>
            <Icon className={cn("text-xl", iconColor)} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
              {trend.value}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
