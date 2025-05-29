import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Leaf } from "lucide-react";
import type { WaterTip } from "@shared/schema";

const getTipBgColor = (category: string) => {
  switch (category) {
    case 'maintenance':
      return 'bg-blue-50 dark:bg-blue-900/20';
    case 'daily':
      return 'bg-green-50 dark:bg-green-900/20';
    case 'conservation':
      return 'bg-purple-50 dark:bg-purple-900/20';
    default:
      return 'bg-gray-50 dark:bg-gray-800';
  }
};

const getTipTextColor = (category: string) => {
  switch (category) {
    case 'maintenance':
      return 'text-blue-900 dark:text-blue-100';
    case 'daily':
      return 'text-green-900 dark:text-green-100';
    case 'conservation':
      return 'text-purple-900 dark:text-purple-100';
    default:
      return 'text-gray-900 dark:text-gray-100';
  }
};

const getTipDescColor = (category: string) => {
  switch (category) {
    case 'maintenance':
      return 'text-blue-700 dark:text-blue-300';
    case 'daily':
      return 'text-green-700 dark:text-green-300';
    case 'conservation':
      return 'text-purple-700 dark:text-purple-300';
    default:
      return 'text-gray-700 dark:text-gray-300';
  }
};

const getTipSavingColor = (category: string) => {
  switch (category) {
    case 'maintenance':
      return 'text-blue-600 dark:text-blue-400';
    case 'daily':
      return 'text-green-600 dark:text-green-400';
    case 'conservation':
      return 'text-purple-600 dark:text-purple-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export function WaterTipsCard() {
  const { data: tips, isLoading } = useQuery<WaterTip[]>({
    queryKey: ['/api/tips']
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>💡 Water Saving Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>💡 Water Saving Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips?.map((tip) => (
            <div key={tip.id} className={`p-4 rounded-lg ${getTipBgColor(tip.category)}`}>
              <h4 className={`font-medium mb-2 ${getTipTextColor(tip.category)}`}>
                {tip.title}
              </h4>
              <p className={`text-sm mb-2 ${getTipDescColor(tip.category)}`}>
                {tip.description}
              </p>
              <div className={`flex items-center text-xs ${getTipSavingColor(tip.category)}`}>
                <Leaf className="w-3 h-3 mr-1" />
                <span>Save up to {tip.waterSaving}L/day</span>
              </div>
            </div>
          )) || (
            <div className="text-center py-4 text-gray-500">
              No tips available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
