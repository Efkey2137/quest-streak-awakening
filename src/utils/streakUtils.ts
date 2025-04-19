
import { StreakConfig, QuestProgress, QuestHistory } from "@/types";
import { getStreakConfig, saveStreakConfig, getTodayString, getQuestProgress, getQuestHistory, saveQuestHistory } from "./storage";

// Calculate streak multiplier based on current streak
export function getStreakMultiplier(streak: number): number {
  // No streak bonus for the first 2 days
  if (streak <= 2) return 1;
  
  // Bonus increases with streak length
  if (streak <= 6) return 1.2; // 3-6 days: 20% bonus
  if (streak <= 13) return 1.5; // 7-13 days: 50% bonus
  if (streak <= 29) return 1.8; // 14-29 days: 80% bonus
  return 2.0; // 30+ days: 100% bonus
}

// Check if a date is yesterday relative to another date
function isYesterday(dateToCheck: string, relativeTo: string): boolean {
  const checkDate = new Date(dateToCheck);
  const relativeDate = new Date(relativeTo);
  
  const yesterday = new Date(relativeDate);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return checkDate.getFullYear() === yesterday.getFullYear() &&
         checkDate.getMonth() === yesterday.getMonth() &&
         checkDate.getDate() === yesterday.getDate();
}

// Update streak based on today's completed quests
export function updateStreak(): { streak: number, maintained: boolean, reward: number } {
  const today = getTodayString();
  const streakConfig = getStreakConfig();
  const todayProgress = getQuestProgress().filter(q => q.date === today);
  
  // Count completed quests
  const completedQuests = todayProgress.filter(q => q.completed).length;
  const totalQuests = todayProgress.length;
  
  // Check if enough quests were completed
  const sufficientCompletion = completedQuests >= streakConfig.requiredQuests;
  let maintained = false;
  let newStreak = 0;
  
  if (sufficientCompletion) {
    if (streakConfig.lastCompletedDate === null) {
      // First time completing quests
      newStreak = 1;
      maintained = true;
    } else if (today === streakConfig.lastCompletedDate) {
      // Already updated streak today
      newStreak = streakConfig.currentStreak;
      maintained = true;
    } else if (isYesterday(streakConfig.lastCompletedDate, today)) {
      // Continued streak
      newStreak = streakConfig.currentStreak + 1;
      maintained = true;
    } else {
      // Streak broken but starting a new one
      newStreak = 1;
      maintained = false;
    }
  } else {
    // Didn't complete enough quests
    newStreak = 0;
    maintained = false;
  }
  
  // Update longest streak if needed
  const longestStreak = Math.max(streakConfig.longestStreak, newStreak);
  
  // Calculate streak reward multiplier
  const rewardMultiplier = getStreakMultiplier(newStreak);
  
  // Save updated streak config
  const updatedConfig: StreakConfig = {
    ...streakConfig,
    currentStreak: newStreak,
    lastCompletedDate: sufficientCompletion ? today : streakConfig.lastCompletedDate,
    longestStreak,
  };
  saveStreakConfig(updatedConfig);
  
  // Return the new streak and whether it was maintained
  return { 
    streak: newStreak, 
    maintained, 
    reward: rewardMultiplier
  };
}

// Add today's progress to history
export function recordDailyHistory(currencyEarned: number): void {
  const today = getTodayString();
  const todayProgress = getQuestProgress().filter(q => q.date === today);
  const completedQuests = todayProgress.filter(q => q.completed).length;
  const totalQuests = todayProgress.length;
  const streak = getStreakConfig();
  
  const historyEntry: QuestHistory = {
    date: today,
    completedQuests,
    totalQuests,
    earnedCurrency: currencyEarned,
    maintainedStreak: completedQuests >= streak.requiredQuests,
  };
  
  const history = getQuestHistory();
  // Don't add duplicate entries for the same day
  const updatedHistory = history.filter(h => h.date !== today);
  saveQuestHistory([...updatedHistory, historyEntry]);
}
