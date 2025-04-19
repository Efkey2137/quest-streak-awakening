import { UserProfile, QuestProgress, StreakConfig, QuestHistory, AppSettings, Avatar } from "@/types";
import { defaultQuests } from "@/data/quests";
import { avatars } from "@/data/avatars";

// Storage keys
const KEYS = {
  USER_PROFILE: "solomate_user_profile",
  QUEST_PROGRESS: "solomate_quest_progress",
  STREAK_CONFIG: "solomate_streak_config",
  QUEST_HISTORY: "solomate_quest_history",
  APP_SETTINGS: "solomate_app_settings",
  AVATARS: "solomate_avatars"
};

// Default values
const DEFAULT_USER_PROFILE: UserProfile = {
  nickname: "",
  avatarId: 1,
  currency: 0,
  createdAt: new Date().toISOString(),
};

const DEFAULT_STREAK_CONFIG: StreakConfig = {
  requiredQuests: 3, // Default: 3 out of 4 quests needed to maintain streak
  currentStreak: 0,
  lastCompletedDate: null,
  longestStreak: 0,
};

const DEFAULT_APP_SETTINGS: AppSettings = {
  difficultySettings: {
    walk: "medium",
    pushups: "medium",
    squats: "medium",
    situps: "medium",
  },
  streakRequirement: 3,
};

// Helper function to get today's date as a string (YYYY-MM-DD)
export function getTodayString(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Initialize local storage with default quests for today if not exists
export function initializeTodayQuestProgress(): QuestProgress[] {
  const today = getTodayString();
  const currentProgress = getQuestProgress();
  
  // If we already have progress for today, return it
  if (currentProgress.some(p => p.date === today)) {
    return currentProgress.filter(p => p.date === today);
  }
  
  // Otherwise, create new progress entries for today
  const settings = getAppSettings();
  const todayQuests = defaultQuests.map(quest => ({
    id: quest.id,
    completed: false,
    currentValue: 0,
    targetValue: quest.target * quest.difficultyMultiplier[settings.difficultySettings[quest.id] || "medium"],
    difficulty: settings.difficultySettings[quest.id] || "medium" as 'easy' | 'medium' | 'hard',
    date: today,
  }));
  
  // Save the new quests and return them
  saveQuestProgress([...currentProgress, ...todayQuests]);
  return todayQuests;
}

// User Profile
export function getUserProfile(): UserProfile {
  try {
    const profile = localStorage.getItem(KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : DEFAULT_USER_PROFILE;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
}

// Quest Progress
export function getQuestProgress(): QuestProgress[] {
  try {
    const progress = localStorage.getItem(KEYS.QUEST_PROGRESS);
    return progress ? JSON.parse(progress) : [];
  } catch (error) {
    console.error("Error getting quest progress:", error);
    return [];
  }
}

export function saveQuestProgress(progress: QuestProgress[]): void {
  try {
    localStorage.setItem(KEYS.QUEST_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving quest progress:", error);
  }
}

// Streak Config
export function getStreakConfig(): StreakConfig {
  try {
    const config = localStorage.getItem(KEYS.STREAK_CONFIG);
    return config ? JSON.parse(config) : DEFAULT_STREAK_CONFIG;
  } catch (error) {
    console.error("Error getting streak config:", error);
    return DEFAULT_STREAK_CONFIG;
  }
}

export function saveStreakConfig(config: StreakConfig): void {
  try {
    localStorage.setItem(KEYS.STREAK_CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error("Error saving streak config:", error);
  }
}

// Quest History
export function getQuestHistory(): QuestHistory[] {
  try {
    const history = localStorage.getItem(KEYS.QUEST_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting quest history:", error);
    return [];
  }
}

export function saveQuestHistory(history: QuestHistory[]): void {
  try {
    localStorage.setItem(KEYS.QUEST_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving quest history:", error);
  }
}

// App Settings
export function getAppSettings(): AppSettings {
  try {
    const settings = localStorage.getItem(KEYS.APP_SETTINGS);
    return settings ? JSON.parse(settings) : DEFAULT_APP_SETTINGS;
  } catch (error) {
    console.error("Error getting app settings:", error);
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving app settings:", error);
  }
}

// Avatars
export function getAvatars(): Avatar[] {
  try {
    const storedAvatars = localStorage.getItem(KEYS.AVATARS);
    if (storedAvatars) {
      return JSON.parse(storedAvatars);
    }
    // If not found, initialize with default avatars
    saveAvatars(avatars);
    return avatars;
  } catch (error) {
    console.error("Error getting avatars:", error);
    return avatars;
  }
}

export function saveAvatars(avatarsData: Avatar[]): void {
  try {
    localStorage.setItem(KEYS.AVATARS, JSON.stringify(avatarsData));
  } catch (error) {
    console.error("Error saving avatars:", error);
  }
}

// Check if user has completed the initial profile setup
export function hasCompletedSetup(): boolean {
  const profile = getUserProfile();
  return !!profile.nickname;
}

// Initialize the app with default data if needed
export function initializeApp(): void {
  if (!localStorage.getItem(KEYS.APP_SETTINGS)) {
    saveAppSettings(DEFAULT_APP_SETTINGS);
  }
  
  if (!localStorage.getItem(KEYS.STREAK_CONFIG)) {
    saveStreakConfig(DEFAULT_STREAK_CONFIG);
  }
  
  if (!localStorage.getItem(KEYS.AVATARS)) {
    saveAvatars(avatars);
  }
}
