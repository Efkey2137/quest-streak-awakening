
import React from "react";
import { cn } from "@/lib/utils";
import { Flame, Trophy } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { getStreakMultiplier } from "@/utils/streakUtils";

export function StreakBanner() {
  const { streak, todayCompletedQuests, todayTotalQuests } = useAppContext();

  const streakMultiplier = getStreakMultiplier(streak.currentStreak);
  const streakBonus = streakMultiplier > 1 
    ? `+${Math.round((streakMultiplier - 1) * 100)}%` 
    : "No bonus";

  return (
    <div className="solo-card mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-full bg-gradient-to-br",
            streak.currentStreak > 0 
              ? "from-orange-500 to-red-600" 
              : "from-gray-700 to-gray-800"
          )}>
            <Flame className={cn(
              "w-5 h-5",
              streak.currentStreak > 0 ? "text-white" : "text-gray-400"
            )} />
          </div>
          
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg">
                {streak.currentStreak}
              </span>
              <span className="text-sm text-gray-400">day streak</span>
              
              {streak.currentStreak > 0 && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded ml-2">
                  {streakBonus}
                </span>
              )}
            </div>
            
            <div className="text-xs text-gray-400">
              {streak.longestStreak > 0 && (
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Best: {streak.longestStreak} days
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm">
            <span className="text-gray-400">Today: </span>
            <span className={cn(
              "font-medium",
              todayCompletedQuests >= streak.requiredQuests 
                ? "text-green-400" 
                : "text-gray-300"
            )}>
              {todayCompletedQuests}/{todayTotalQuests}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">Required:</span>
             <span className="text-xs font-medium text-gray-300 pl-1">{streak.requiredQuests}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
