import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, Award, Crown, Droplets, Target, TrendingUp } from "lucide-react";
import type { User } from "@shared/schema";
import { formatWaterSaved, cn } from "@/lib/utils";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-orange-400" />;
    default:
      return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</div>;
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
      return "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600";
    case 3:
      return "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700";
    default:
      return "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700";
  }
};

export default function Leaderboard() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/leaderboard']
  });

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

  const currentUser = users?.find(user => user.username === "John Doe");
  const currentUserRank = users?.findIndex(user => user.username === "John Doe") + 1;
  const topUsers = users?.slice(0, 10) || [];

  const totalWaterSaved = users?.reduce((sum, user) => sum + (user.waterSaved || 0), 0) || 0;
  const totalActions = users?.reduce((sum, user) => sum + (user.actionsCount || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Water Savers Leaderboard" onMenuClick={() => {}} />
      
      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-500">{users?.length || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-500">{formatWaterSaved(totalWaterSaved)}L</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Water Saved</p>
                </div>
                <Droplets className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-500">{totalActions}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Actions</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-500">#{currentUserRank || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your Rank</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Podium */}
        {topUsers.length >= 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🏆 Top Water Savers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-center space-x-8">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="w-20 h-16 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-end justify-center mb-2">
                    <span className="text-2xl pb-2">🥈</span>
                  </div>
                  <Avatar className="mx-auto mb-2">
                    <AvatarFallback>{topUsers[1]?.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm">{topUsers[1]?.username}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{formatWaterSaved(topUsers[1]?.waterSaved || 0)}L</p>
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-yellow-200 dark:bg-yellow-800 rounded-t-lg flex items-end justify-center mb-2">
                    <span className="text-3xl pb-2">🥇</span>
                  </div>
                  <Avatar className="mx-auto mb-2 ring-2 ring-yellow-400">
                    <AvatarFallback>{topUsers[0]?.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-sm">{topUsers[0]?.username}</p>
                  <p className="text-yellow-600 dark:text-yellow-400 text-xs font-bold">{formatWaterSaved(topUsers[0]?.waterSaved || 0)}L</p>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="w-20 h-12 bg-orange-200 dark:bg-orange-800 rounded-t-lg flex items-end justify-center mb-2">
                    <span className="text-xl pb-2">🥉</span>
                  </div>
                  <Avatar className="mx-auto mb-2">
                    <AvatarFallback>{topUsers[2]?.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-sm">{topUsers[2]?.username}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{formatWaterSaved(topUsers[2]?.waterSaved || 0)}L</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Full Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUsers.map((user, index) => {
                const rank = index + 1;
                const isCurrentUser = user.username === "John Doe";
                
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
                          isCurrentUser ? "text-primary" : "text-gray-900 dark:text-white"
                        )}>
                          {user.username}
                          {isCurrentUser && <span className="text-sm text-blue-600 dark:text-blue-400 ml-1">(You)</span>}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{user.actionsCount} actions</span>
                          {rank <= 3 && (
                            <Badge variant="secondary" className="text-xs">
                              Top {rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-bold text-lg",
                        isCurrentUser ? "text-primary" : "text-gray-900 dark:text-white"
                      )}>
                        {formatWaterSaved(user.waterSaved || 0)}L
                      </p>
                      <p className="text-xs text-gray-500">saved</p>
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
