
// Types for SoloMate App

export interface UserProfile {
  nickname: string;
  avatarId: number;
  currency: number;
  createdAt: string;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  category: string; // Added category
  target: number;
  icon: string;
  difficultyMultiplier: {
    easy: number;
    medium: number;
    hard: number;
  };
  baseReward: number;
}

export interface QuestProgress {
  id: string;
  completed: boolean;
  currentValue: number;
  targetValue: number;
  difficulty: 'easy' | 'medium' | 'hard';
  date: string;
}

export interface StreakConfig {
  requiredQuests: number; // How many quests needed to maintain streak
  currentStreak: number;
  lastCompletedDate: string | null;
  longestStreak: number;
}

export interface QuestHistory {
  date: string;
  completedQuests: number;
  totalQuests: number;
  earnedCurrency: number;
  maintainedStreak: boolean;
  dailyProgress: QuestProgress[]; // Added detailed daily progress
}

export interface AppSettings {
  difficultySettings: {
    [questId: string]: 'easy' | 'medium' | 'hard';
  };
  streakRequirement: number; // Number of quests required to maintain streak
}

export interface Avatar {
  id: number;
  imageUrl: string;
  name: string;
  unlocked: boolean;
  price?: number;
}
