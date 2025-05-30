import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Trophy, Medal, Star } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  waterSaved: number;
  actionsCount: number;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
  if (rank === 3) return <Star className="h-6 w-6 text-amber-600" />;
  return <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">{rank}</span>;
}

function getRankBg(rank: number, isCurrentUser: boolean) {
  if (isCurrentUser) return "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800";
  if (rank === 1) return "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800";
  if (rank === 2) return "bg-gray-50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700";
  if (rank === 3) return "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800";
  return "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700";
}

export default function Leaderboard() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/leaderboard']
  });
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Water Savers Leaderboard" onMenuClick={() => {}} />
        <main className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const currentUser = user ? users?.find(u => u.id === user.id) : undefined;
  const currentUserRank = user ? (users?.findIndex(u => u.id === user.id) ?? -1) + 1 : 0;
  const topUsers = users?.slice(0, 10) || [];

  const totalWaterSaved = users?.reduce((sum, user) => sum + (user.waterSaved || 0), 0) || 0;
  const totalActions = users?.reduce((sum, user) => sum + (user.actionsCount || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Water Savers Leaderboard" onMenuClick={() => {}} />
      
      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalWaterSaved.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Water Saved (Liters)
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalActions.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Actions Taken
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {users?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Contributors
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current User Stats */}
        {currentUser && (
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getRankIcon(currentUserRank)}
                  </div>
                  <Avatar>
                    <AvatarFallback>
                      {currentUser.username.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-blue-600 dark:text-blue-400">
                      {currentUser.username}
                      <span className="text-sm text-blue-500 dark:text-blue-300 ml-1">(You)</span>
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{currentUser.actionsCount} actions</span>
                      <span>{currentUser.waterSaved}L saved</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Rank #{currentUserRank}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUsers.map((user, index) => {
                const rank = index + 1;
                const isCurrentUser = user.id === currentUser?.id;
                
                return (
                  <div 
                    key={user.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                      getRankBg(rank, isCurrentUser)
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10">
                        {getRankIcon(rank)}
                      </div>
                      <Avatar>
                        <AvatarFallback>
                          {user.username.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={cn(
                          "font-medium",
                          isCurrentUser ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
                        )}>
                          {user.username}
                          {isCurrentUser && <span className="text-sm text-blue-500 dark:text-blue-300 ml-1">(You)</span>}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{user.actionsCount} actions</span>
                          <span>{user.waterSaved}L saved</span>
                          {rank <= 3 && (
                            <Badge variant="secondary" className="text-xs">
                              Top {rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
