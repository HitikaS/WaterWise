import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Prediction } from "@shared/schema";

export function PredictionChart() {
  const { data: predictions, isLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions']
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>4-Week Water Scarcity Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = predictions?.map(p => ({
    week: `Week ${p.week}`,
    riskLevel: p.riskLevel,
    expectedRainfall: p.expectedRainfall
  })) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>4-Week Water Scarcity Prediction</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="riskLevel" 
                stroke="#0277BD" 
                strokeWidth={2}
                name="Risk Level (%)"
                dot={{ fill: "#0277BD" }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="expectedRainfall" 
                stroke="#00ACC1" 
                strokeWidth={2}
                name="Expected Rainfall (mm)"
                dot={{ fill: "#00ACC1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
