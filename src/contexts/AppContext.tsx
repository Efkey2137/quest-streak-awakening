import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  UserProfile, 
  QuestProgress, 
  StreakConfig, 
  AppSettings, 
  Avatar,
  QuestHistory,
  Quest
} from "@/types";
import { 
  getUserProfile, 
  saveUserProfile, 
  getQuestProgress, 
  saveQuestProgress, 
  getStreakConfig,
  getAppSettings,
  saveAppSettings,
  getAvatars,
  saveAvatars,
  initializeApp,
  hasCompletedSetup,
  initializeTodayQuestProgress,
  getQuestHistory,
  saveStreakConfig // Import saveStreakConfig
} from "@/utils/storage";
import { defaultQuests, getQuestTarget, calculateQuestReward } from "@/data/quests";
import { updateStreak, recordDailyHistory } from "@/utils/streakUtils";

interface AppContextType {
  // User profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // Quests
  quests: Quest[];
  todayProgress: QuestProgress[];
  updateQuestProgress: (questId: string, value: number) => void;
  completeQuest: (questId: string) => void;
  
  // Streak and stats
  streak: StreakConfig;
  updateRequiredQuests: (count: number, cost: number) => boolean; // Updated signature
  
  // Settings
  settings: AppSettings;
  updateDifficulty: (questId: string, difficulty: 'easy' | 'medium' | 'hard') => void;
  
  // Avatars
  avatars: Avatar[];
  unlockAvatar: (avatarId: number) => boolean; // Returns success
  
  // Initial setup
  setupComplete: boolean;
  completeSetup: (nickname: string, avatarId: number) => void;
  
  // History
  history: QuestHistory[];
  
  // Current stats
  todayCompletedQuests: number;
  todayTotalQuests: number;
  
  // Refresh data
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // State for all app data
  const [profile, setProfile] = useState<UserProfile>(getUserProfile);
  const [todayProgress, setTodayProgress] = useState<QuestProgress[]>([]);
  const [streak, setStreak] = useState<StreakConfig>(getStreakConfig);
  const [settings, setSettings] = useState<AppSettings>(getAppSettings);
  const [avatars, setAvatars] = useState<Avatar[]>(getAvatars);
  const [setupComplete, setSetupComplete] = useState<boolean>(hasCompletedSetup());
  const [history, setHistory] = useState<QuestHistory[]>(getQuestHistory);
  
  // Load and initialize data
  useEffect(() => {
    initializeApp();
    const todayQuests = initializeTodayQuestProgress();
    setTodayProgress(todayQuests);
  }, []);
  
  // Refresh all data from storage
  const refreshData = () => {
    setProfile(getUserProfile());
    setTodayProgress(initializeTodayQuestProgress());
    setStreak(getStreakConfig());
    setSettings(getAppSettings());
    setAvatars(getAvatars());
    setSetupComplete(hasCompletedSetup());
    setHistory(getQuestHistory());
  };
  
  // Update user profile
  const updateProfile = (newProfileData: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...newProfileData };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };
  
  // Update quest progress
  const updateQuestProgress = (questId: string, value: number) => {
    const allProgress = getQuestProgress();
    const updatedProgress = allProgress.map(p => {
      if (p.id === questId && p.date === todayProgress[0]?.date) {
        return { ...p, currentValue: value };
      }
      return p;
    });
    
    saveQuestProgress(updatedProgress);
    setTodayProgress(updatedProgress.filter(p => p.date === todayProgress[0]?.date));
  };
  
  // Complete a quest
  const completeQuest = (questId: string) => {
    const quest = defaultQuests.find(q => q.id === questId);
    if (!quest) return;
    
    // Find the quest in today's progress
    const allProgress = getQuestProgress();
    const questProgress = allProgress.find(p => p.id === questId && p.date === todayProgress[0]?.date);
    
    if (!questProgress || questProgress.completed) return;
    
    // Mark as completed and update progress
    const updatedProgress = allProgress.map(p => {
      if (p.id === questId && p.date === todayProgress[0]?.date) {
        return { ...p, completed: true, currentValue: p.targetValue };
      }
      return p;
    });
    
    saveQuestProgress(updatedProgress);
    setTodayProgress(updatedProgress.filter(p => p.date === todayProgress[0]?.date));
    
    // Calculate reward with streak multiplier
    const { streak: currentStreakValue, reward: streakMultiplier } = updateStreak(); // Use streak: currentStreakValue to avoid name clash
    const reward = calculateQuestReward(
      quest, 
      questProgress.difficulty, 
      streakMultiplier
    );
    
    // Update currency
    let currentProfile = getUserProfile(); // Get latest profile before updating
    const updatedProfile = { 
      ...currentProfile, 
      currency: currentProfile.currency + reward 
    };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    
    // Update streak state
    setStreak(getStreakConfig());
    
    // Record in history
    recordDailyHistory(reward); // Pass reward earned from THIS quest
    setHistory(getQuestHistory());
  };
  
  // Update required quests for streak (with currency cost)
  const updateRequiredQuests = (count: number, cost: number): boolean => {
    if (profile.currency < cost) {
      console.error("Not enough currency to change streak requirement.");
      return false; // Indicate failure
    }

    // Deduct currency
    const updatedProfile = {
      ...profile,
      currency: profile.currency - cost
    };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);

    // Update streak config and settings
    const updatedStreak = { ...streak, requiredQuests: count };
    const updatedSettings = { ...settings, streakRequirement: count };
    
    setStreak(updatedStreak);
    setSettings(updatedSettings);
    
    saveStreakConfig(updatedStreak); // Save updated streak config
    saveAppSettings(updatedSettings);
    return true; // Indicate success
  };
  
  // Update difficulty for a quest
  const updateDifficulty = (questId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    const quest = defaultQuests.find(q => q.id === questId);
    if (!quest) return;
    
    // Update settings
    const updatedSettings = { 
      ...settings,
      difficultySettings: {
        ...settings.difficultySettings,
        [questId]: difficulty
      }
    };
    saveAppSettings(updatedSettings);
    setSettings(updatedSettings);
    
    // Update target for today's quest
    const target = getQuestTarget(quest, difficulty);
    
    // Update today's quest progress
    const allProgress = getQuestProgress();
    const updatedProgress = allProgress.map(p => {
      if (p.id === questId && p.date === todayProgress[0]?.date) {
        return { 
          ...p, 
          difficulty,
          targetValue: target,
          // If current value exceeds new target, cap it
          currentValue: Math.min(p.currentValue, target)
        };
      }
      return p;
    });
    
    saveQuestProgress(updatedProgress);
    setTodayProgress(updatedProgress.filter(p => p.date === todayProgress[0]?.date));
  };
  
  // Unlock a new avatar
  const unlockAvatar = (avatarId: number): boolean => {
    const avatar = avatars.find(a => a.id === avatarId);
    if (!avatar || avatar.unlocked || !avatar.price) return false;
    
    // Check if user has enough currency
    if (profile.currency < avatar.price) return false;
    
    // Update avatars
    const updatedAvatars = avatars.map(a => 
      a.id === avatarId ? { ...a, unlocked: true } : a
    );
    saveAvatars(updatedAvatars);
    setAvatars(updatedAvatars);
    
    // Deduct currency
    const updatedProfile = {
      ...profile,
      currency: profile.currency - avatar.price
    };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    
    return true;
  };
  
  // Complete initial setup
  const completeSetup = (nickname: string, avatarId: number) => {
    // Update profile
    const updatedProfile = {
      ...profile,
      nickname,
      avatarId,
    };
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setSetupComplete(true);
  };
  
  // Computed values
  const todayCompletedQuests = todayProgress.filter(q => q.completed).length;
  const todayTotalQuests = todayProgress.length;
  
  const contextValue: AppContextType = {
    profile,
    updateProfile,
    quests: defaultQuests,
    todayProgress,
    updateQuestProgress,
    completeQuest,
    streak,
    updateRequiredQuests,
    settings,
    updateDifficulty,
    avatars,
    unlockAvatar,
    setupComplete,
    completeSetup,
    history,
    todayCompletedQuests,
    todayTotalQuests,
    refreshData,
  };
  
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
