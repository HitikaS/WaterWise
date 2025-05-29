import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Leaf, Droplets, Home, Wrench, Calendar } from "lucide-react";
import type { WaterTip } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const categoryIcons = {
  maintenance: <Wrench className="h-5 w-5" />,
  daily: <Calendar className="h-5 w-5" />,
  conservation: <Droplets className="h-5 w-5" />,
  default: <Home className="h-5 w-5" />
};

const categoryColors = {
  maintenance: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
  daily: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
  conservation: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
};

const getTipBgColor = (category: string) => {
  switch (category) {
    case 'maintenance':
      return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800';
    case 'daily':
      return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800';
    case 'conservation':
      return 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800';
    default:
      return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  }
};

// Mock additional tips
const additionalTips = [
  {
    id: 100,
    title: "Use a Broom Instead of Hose",
    description: "Clean driveways and sidewalks with a broom instead of hosing them down.",
    waterSaving: 25,
    category: "daily",
    isActive: true
  },
  {
    id: 101,
    title: "Install Low-Flow Showerheads",
    description: "Replace old showerheads with water-efficient models that use less water per minute.",
    waterSaving: 60,
    category: "maintenance",
    isActive: true
  },
  {
    id: 102,
    title: "Turn Off Tap While Brushing",
    description: "Don't let the water run while brushing teeth or washing hands.",
    waterSaving: 15,
    category: "daily",
    isActive: true
  },
  {
    id: 103,
    title: "Use Greywater for Plants",
    description: "Reuse water from washing dishes or vegetables to water your garden.",
    waterSaving: 35,
    category: "conservation",
    isActive: true
  }
];

export default function WaterTips() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tips, isLoading } = useQuery<WaterTip[]>({
    queryKey: ['/api/tips']
  });

  const logActionMutation = useMutation({
    mutationFn: async (tipId: number) => {
      // In a real app, this would log the user's action
      return apiRequest("POST", `/api/users/1/water-saved`, {
        waterSaved: 10, // Mock water saved
        actionsCount: 1
      });
    },
    onSuccess: () => {
      toast({
        title: "Action Logged!",
        description: "Great job! Your water-saving action has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
    }
  });

  const allTips = [...(tips || []), ...additionalTips];

  const tipsByCategory = allTips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = [];
    }
    acc[tip.category].push(tip);
    return acc;
  }, {} as Record<string, typeof allTips>);

  const handleLogAction = (tipId: number) => {
    logActionMutation.mutate(tipId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Water Saving Tips" onMenuClick={() => {}} />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <Header title="Water Saving Tips" onMenuClick={() => {}} />
      
      <main className="p-6 space-y-6 pb-20">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-500">{allTips.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Available Tips</p>
                </div>
                <Leaf className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-500">
                    {allTips.reduce((sum, tip) => sum + tip.waterSaving, 0)}L
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Potential Savings/Day</p>
                </div>
                <Droplets className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-500">6</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Actions Completed</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips by Category */}
        {Object.entries(tipsByCategory).map(([category, categoryTips]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              {categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {category} Tips
              </h2>
              <Badge className={categoryColors[category as keyof typeof categoryColors] || categoryColors.default}>
                {categoryTips.length} tips
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categoryTips.map((tip) => (
                <Card key={tip.id} className={getTipBgColor(tip.category)}>
                  <CardHeader>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {tip.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Leaf className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">
                          Save {tip.waterSaving}L/day
                        </span>
                      </div>
                      <Badge className={categoryColors[tip.category as keyof typeof categoryColors] || categoryColors.default}>
                        {tip.category}
                      </Badge>
                    </div>
                    
                    <Button 
                      onClick={() => handleLogAction(tip.id)}
                      disabled={logActionMutation.isPending}
                      className="w-full bg-primary hover:bg-blue-700"
                    >
                      {logActionMutation.isPending ? "Logging..." : "I Did This!"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
