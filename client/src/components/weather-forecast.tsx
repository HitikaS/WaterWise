import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Sun, Cloud, CloudRain, Snowflake } from "lucide-react";
import type { WeatherData } from "@shared/schema";
import { getWeatherIcon } from "@/lib/utils";

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'sun':
      return <Sun className="text-yellow-500 text-lg" />;
    case 'cloud':
      return <Cloud className="text-gray-500 text-lg" />;
    case 'cloud-rain':
      return <CloudRain className="text-blue-500 text-lg" />;
    case 'snow':
      return <Snowflake className="text-blue-300 text-lg" />;
    default:
      return <Sun className="text-yellow-500 text-lg" />;
  }
};

const getDayLabel = (date: string, index: number) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
};

export function WeatherForecast() {
  const { data: weatherData, isLoading } = useQuery<WeatherData[]>({
    queryKey: ['/api/weather']
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
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
        <div className="flex items-center justify-between">
          <CardTitle>Weather Forecast</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            7-Day View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weatherData?.slice(0, 3).map((day, index) => (
            <div key={day.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                {getIconComponent(day.icon)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getDayLabel(day.date, index)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {day.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {Math.round(day.temperature)}°C
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {day.rainfall}mm
                </p>
              </div>
            </div>
          )) || (
            <div className="text-center py-4 text-gray-500">
              No weather data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
