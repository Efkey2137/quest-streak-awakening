import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Trophy, Activity, Check, Landmark, BarChart3, Dumbbell, Move, Footprints } from "lucide-react";
import { Quest } from "@/types";

// Helper function to get icon for a specific quest or category
const getIcon = (id: string) => {
  switch (id) {
    case 'walk': return <Footprints className="w-4 h-4 text-blue-400" />;
    case 'pushups': return <Dumbbell className="w-4 h-4 text-red-400" />;
    case 'squats': return <Activity className="w-4 h-4 text-green-400" />;
    case 'situps': return <Move className="w-4 h-4 text-purple-400" />;
    case 'Cardio': return <Footprints className="w-4 h-4 text-blue-400" />;
    case 'Strength': return <Dumbbell className="w-4 h-4 text-red-400" />;
    case 'Core': return <Move className="w-4 h-4 text-purple-400" />;
    default: return <Activity className="w-4 h-4 text-gray-400" />;
  }
};

export function ProfileStats() {
  const { history, streak, quests, profile } = useAppContext();

  // Calculate totals from history
  const totalStats = history.reduce((acc, day) => {
    acc.completedQuests += day.completedQuests;
    acc.earnedCurrency += day.earnedCurrency;

    day.dailyProgress.forEach(progress => {
      if (progress.completed) {
        const quest = quests.find(q => q.id === progress.id);
        if (quest) {
          // Aggregate by quest ID
          acc.questTotals[quest.id] = (acc.questTotals[quest.id] || 0) + progress.targetValue;
          // Aggregate by category
          acc.categoryTotals[quest.category] = (acc.categoryTotals[quest.category] || 0) + 1;
        }
      }
    });

    return acc;
  }, { 
    completedQuests: 0, 
    earnedCurrency: 0, 
    questTotals: {} as Record<string, number>, 
    categoryTotals: {} as Record<string, number> 
  });

  const questCategories = [...new Set(quests.map(q => q.category))];

  return (
    <div className="solo-card space-y-6">
      {/* General Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Overall Stats
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Total Quests Completed</span>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="font-medium">{totalStats.completedQuests}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Total Currency Earned</span>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-sololevel-purple" />
              <span className="font-medium text-sololevel-purple">{totalStats.earnedCurrency}</span>
            </div>
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

      {/* Quest Specific Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Quest Performance
        </h2>
        <div className="space-y-3">
          {quests.map(quest => (
            <div key={quest.id} className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2">
                {getIcon(quest.id)}
                Total {quest.name}
              </span>
              <span className="font-medium">{totalStats.questTotals[quest.id] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Check className="w-5 h-5" />
          Completed by Category
        </h2>
        <div className="space-y-3">
          {questCategories.map(category => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-2">
                 {getIcon(category)}
                {category} Quests
              </span>
              <span className="font-medium">{totalStats.categoryTotals[category] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
