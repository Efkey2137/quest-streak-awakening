
import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Trophy, Activity, Check } from "lucide-react";

export function ProfileStats() {
  const { history, streak } = useAppContext();
  
  // Calculate total completed quests
  const totalCompletedQuests = history.reduce((sum, day) => sum + day.completedQuests, 0);
  
  // Calculate total currency earned
  const totalCurrencyEarned = history.reduce((sum, day) => sum + day.earnedCurrency, 0);
  
  return (
    <div className="solo-card">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Statistics
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Completed Quests</span>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="font-medium">{totalCompletedQuests}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Total Currency Earned</span>
          <span className="font-medium text-sololevel-purple">{totalCurrencyEarned}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Longest Streak</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{streak.longestStreak} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
