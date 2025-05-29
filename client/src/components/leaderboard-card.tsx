import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Crown, Medal, Award } from "lucide-react";
import type { User } from "@shared/schema";
import { formatWaterSaved, cn } from "@/lib/utils";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 text-orange-400" />;
    default:
      return <div className="w-5 h-5" />;
  }
};

const getRankBg = (rank: number, isCurrentUser: boolean) => {
  if (isCurrentUser) {
    return "bg-blue-50 dark:bg-blue-900/20 border-2 border-primary";
  }
  
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700";
    case 2:
      return "bg-gray-50 dark:bg-gray-800";
    case 3:
      return "bg-orange-50 dark:bg-orange-900/20";
    default:
      return "bg-gray-50 dark:bg-gray-800";
  }
};

const getRankColor = (rank: number, isCurrentUser: boolean) => {
  if (isCurrentUser) {
    return "bg-primary text-white";
  }
  
  switch (rank) {
    case 1:
      return "bg-yellow-500 text-white";
    case 2:
      return "bg-gray-400 text-white";
    case 3:
      return "bg-orange-400 text-white";
    default:
      return "bg-gray-300 text-gray-700";
  }
};

const getWaterSavedColor = (rank: number, isCurrentUser: boolean) => {
  if (isCurrentUser) {
    return "text-primary";
  }
  
  switch (rank) {
    case 1:
      return "text-yellow-600 dark:text-yellow-400";
    case 2:
      return "text-gray-600 dark:text-gray-400";
    case 3:
      return "text-orange-600 dark:text-orange-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

export function LeaderboardCard() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/leaderboard']
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Water Savers Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentUser = users?.find(user => user.username === "John Doe");
  const currentUserRank = users?.findIndex(user => user.username === "John Doe") + 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Water Savers Leaderboard
          </CardTitle>
          <span className="text-sm text-gray-500">This Month</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.slice(0, 4).map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.username === "John Doe";
            
            return (
              <div 
                key={user.id} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  getRankBg(rank, isCurrentUser)
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                    getRankColor(rank, isCurrentUser)
                  )}>
                    {rank}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {isCurrentUser ? `${user.username} (You)` : user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.actionsCount} water-saving actions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-bold",
                    getWaterSavedColor(rank, isCurrentUser)
                  )}>
                    {formatWaterSaved(user.waterSaved || 0)}L
                  </p>
                  <p className="text-xs text-gray-500">saved</p>
                </div>
              </div>
            );
          }) || (
            <div className="text-center py-4 text-gray-500">
              No leaderboard data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
