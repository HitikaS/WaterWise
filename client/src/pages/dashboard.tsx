import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CloudRain, Users, Thermometer, Plus } from "lucide-react";
import { Header } from "@/components/header";
import { MetricCard } from "@/components/metric-card";
import { PredictionChart } from "@/components/prediction-chart";
import { WeatherForecast } from "@/components/weather-forecast";
import { WaterTipsCard } from "@/components/water-tips-card";
import { LeaderboardCard } from "@/components/leaderboard-card";
import { RecentReports } from "@/components/recent-reports";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaterReportSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface DashboardMetrics {
  currentRisk: number;
  expectedRainfall: number;
  reportsToday: number;
  temperature: number;
}

const reportFormSchema = insertWaterReportSchema.extend({
  userName: z.string().optional()
});

export default function Dashboard() {
  const [showQuickReport, setShowQuickReport] = useState(false);
  const [location, setLocation] = useState("London");
  const [isInitializing, setIsInitializing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard/metrics']
  });

  const { data: predictions, refetch: refetchPredictions } = useQuery({
    queryKey: ['/api/predictions']
  });

  const { data: weatherData, refetch: refetchWeather } = useQuery({
    queryKey: ['/api/weather']
  });

  const initializeWeatherData = async (city: string = location) => {
    setIsInitializing(true);
    try {
      const response = await fetch('/api/init-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city })
      });
      
      if (response.ok) {
        await refetchWeather();
        await refetchPredictions();
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/metrics'] });
        toast({
          title: "Weather data updated",
          description: `Loaded current data for ${city}`
        });
      }
    } catch (error) {
      console.error('Failed to initialize weather data:', error);
      toast({
        title: "Error",
        description: "Failed to load weather data",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Initialize weather data on component mount if no data exists
  useEffect(() => {
    if (weatherData && Array.isArray(weatherData) && weatherData.length === 0) {
      initializeWeatherData();
    }
  }, [weatherData]);

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      issueType: "",
      severity: "",
      location: "",
      description: "",
      userName: "John Doe"
    }
  });

  const reportMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reportFormSchema>) => {
      return apiRequest("POST", "/api/reports", data);
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Water issue report submitted successfully! Thank you for helping improve water management in your area."
      });
      form.reset();
      setShowQuickReport(false);
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: z.infer<typeof reportFormSchema>) => {
    reportMutation.mutate(data);
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 80) return "High";
    if (risk >= 60) return "Moderate";
    return "Low";
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "border-red-500 bg-red-50 dark:bg-red-900/20";
    if (risk >= 60) return "border-orange-500 bg-orange-50 dark:bg-orange-900/20";
    return "border-green-500 bg-green-50 dark:bg-green-900/20";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Water Scarcity Dashboard" onMenuClick={() => {}} />
      
      <main className="p-6 space-y-6">
        {/* Alert Banner */}
        {metrics && metrics.currentRisk >= 60 && (
          <Alert className={`border-l-4 ${getRiskColor(metrics.currentRisk)}`}>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription>
              <span className="font-medium">Water Scarcity Alert:</span> {getRiskLevel(metrics.currentRisk)} water stress predicted for next week. Consider water conservation measures.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <MetricCard
                value={`${metrics?.currentRisk || 0}%`}
                label="Water Risk Level"
                icon={AlertTriangle}
                trend={{
                  value: "+12% from last week",
                  isPositive: false
                }}
                iconBgColor="bg-orange-100 dark:bg-orange-900/20"
                iconColor="text-orange-500"
              />
              <MetricCard
                value={`${metrics?.expectedRainfall || 0}mm`}
                label="Expected Rainfall"
                icon={CloudRain}
                trend={{
                  value: "-45% below average",
                  isPositive: false
                }}
                iconBgColor="bg-blue-100 dark:bg-blue-900/20"
                iconColor="text-primary"
              />
              <MetricCard
                value={metrics?.reportsToday || 0}
                label="User Reports Today"
                icon={Users}
                trend={{
                  value: "+23% from yesterday",
                  isPositive: true
                }}
                iconBgColor="bg-purple-100 dark:bg-purple-900/20"
                iconColor="text-purple-600"
              />
              <MetricCard
                value={`${metrics?.temperature || 0}°C`}
                label="Current Temperature"
                icon={Thermometer}
                trend={{
                  value: "+3°C above normal",
                  isPositive: false
                }}
                iconBgColor="bg-red-100 dark:bg-red-900/20"
                iconColor="text-red-500"
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PredictionChart />
          <WeatherForecast />
        </div>

        {/* Report Issue & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Water Issue Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Water Issue</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="issueType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issue Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select issue type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Low Water Pressure">Low Water Pressure</SelectItem>
                                <SelectItem value="No Water Supply">No Water Supply</SelectItem>
                                <SelectItem value="Water Quality Issues">Water Quality Issues</SelectItem>
                                <SelectItem value="Pipe Leakage">Pipe Leakage</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="severity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Severity</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your address or area" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the water issue in detail..."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={reportMutation.isPending}
                    >
                      {reportMutation.isPending ? "Submitting..." : "Submit Report"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Water Saving Tips */}
          <WaterTipsCard />
        </div>

        {/* Leaderboard & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaderboardCard />
          <RecentReports />
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setShowQuickReport(!showQuickReport)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 text-white z-30"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
