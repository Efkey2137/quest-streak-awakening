import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Trophy, Activity, Check, Landmark, BarChart3, Dumbbell, Move, Footprints } from "lucide-react";
import { Quest } from "@/types";

// Helper function to get icon for a specific quest ID or category name
const getIcon = (idOrCategory: string) => {
  switch (idOrCategory) {
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

  // Ensure quests is an array before proceeding
  if (!Array.isArray(quests)) {
    console.error("Quests data is not available or not an array.");
    return <div>Error loading quest data.</div>; // Or some placeholder/error UI
  }

  // Create a map for quick quest lookup
  const questMap = new Map<string, Quest>(quests.map(q => [q.id, q]));

  // Calculate totals from history
  const totalStats = history.reduce((acc, day) => {
    // Ensure day.dailyProgress is an array
    if (!Array.isArray(day.dailyProgress)) {
        return acc; // Skip this day if progress data is missing/invalid
    }

    acc.completedQuests += day.completedQuests;
    acc.earnedCurrency += day.earnedCurrency;

    day.dailyProgress.forEach(progress => {
      // Ensure progress object is valid
      if (!progress || typeof progress !== 'object') return;
      
      if (progress.completed && progress.id) {
        const quest = questMap.get(progress.id);
        if (quest) {
          // Aggregate by quest ID (using target value from progress)
          acc.questTotals[quest.id] = (acc.questTotals[quest.id] || 0) + (progress.targetValue || 0);
          
          // Aggregate by category (check if category exists)
          if (quest.category) {
              acc.categoryTotals[quest.category] = (acc.categoryTotals[quest.category] || 0) + 1;
          }
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

  // Get unique categories from the available quests list
  const questCategories = [...new Set(quests.map(q => q.category).filter(Boolean))]; // Filter out undefined/null categories

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
              <span className="font-medium">{streak?.longestStreak ?? 0} days</span> {/* Add null check for streak */}
            </div>
          </div>
        </div>
      </div>

      {/* Quest Specific Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Quest Performance (Total Value)
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
          Completed Quests by Category
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
