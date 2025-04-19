import React, { useState } from "react";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { SetupForm } from "@/components/setup-form";
import { ProfileCard } from "@/components/profile-card";
import { StreakBanner } from "@/components/streak-banner";
import { QuestCard } from "@/components/quest-card";
import { HistoryView } from "@/components/history-view";
import { ProfileEditor } from "@/components/profile-editor";
import { BottomNav } from "@/components/bottom-nav";
import { getStreakMultiplier } from "@/utils/streakUtils";

function AppContent() {
  const { 
    setupComplete, 
    quests, 
    todayProgress, 
    streak,
    updateQuestProgress,
    completeQuest,
    updateDifficulty
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState("home");
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  
  if (!setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SetupForm />
      </div>
    );
  }
  
  const streakMultiplier = getStreakMultiplier(streak.currentStreak);
  
  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-md mx-auto px-4 py-6">
        <ProfileCard onEditProfile={() => setShowProfileEditor(true)} />
        
        {activeTab === "home" && (
          <>
            <StreakBanner />
            <div className="grid grid-cols-1 gap-4 mb-4">
              {todayProgress.map((progress) => {
                const quest = quests.find(q => q.id === progress.id);
                if (!quest) return null;
                
                return (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    progress={progress}
                    onComplete={() => completeQuest(quest.id)}
                    onUpdateProgress={(value) => updateQuestProgress(quest.id, value)}
                    onChangeDifficulty={(difficulty) => updateDifficulty(quest.id, difficulty)}
                    streakMultiplier={streakMultiplier}
                    showDifficultySelect={false}
                  />
                );
              })}
            </div>
          </>
        )}
        
        {activeTab === "quests" && (
          <div className="grid grid-cols-1 gap-4 mb-4">
            {todayProgress.map((progress) => {
              const quest = quests.find(q => q.id === progress.id);
              if (!quest) return null;
              
              return (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  progress={progress}
                  onComplete={() => completeQuest(quest.id)}
                  onUpdateProgress={(value) => updateQuestProgress(quest.id, value)}
                  onChangeDifficulty={(difficulty) => updateDifficulty(quest.id, difficulty)}
                  streakMultiplier={streakMultiplier}
                  showDifficultySelect={true}
                />
              );
            })}
          </div>
        )}
        
        {activeTab === "stats" && (
          <HistoryView />
        )}
        
        {activeTab === "profile" && (
          <div className="space-y-4">
            <ProfileCard onEditProfile={() => setShowProfileEditor(true)} />
            <ProfileStats />
          </div>
        )}
      </div>
      
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      
      <ProfileEditor 
        open={showProfileEditor} 
        onClose={() => setShowProfileEditor(false)} 
      />
    </div>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
