import React, { useState } from "react";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { SetupForm } from "@/components/setup-form";
import { ProfileCard } from "@/components/profile-card";
import { ProfileStats } from "@/components/profile-stats";
import { StreakBanner } from "@/components/streak-banner";
import { QuestCard } from "@/components/quest-card";
import { HistoryView } from "@/components/history-view";
import { ProfileEditor } from "@/components/profile-editor";
import { BottomNav } from "@/components/bottom-nav";
import { getStreakMultiplier } from "@/utils/streakUtils";
import { Button } from "@/components/ui/button";
import { Landmark, Minus, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

function AppContent() {
  const { 
    setupComplete, 
    profile,
    quests, 
    todayProgress, 
    streak,
    updateQuestProgress,
    completeQuest,
    updateDifficulty,
    updateRequiredQuests,
    todayTotalQuests
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState("home");
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [targetRequiredQuests, setTargetRequiredQuests] = useState(streak.requiredQuests);

  // Update target when actual requirement changes
  React.useEffect(() => {
      setTargetRequiredQuests(streak.requiredQuests);
  }, [streak.requiredQuests]);
  
  if (!setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SetupForm />
      </div>
    );
  }
  
  const streakMultiplier = getStreakMultiplier(streak.currentStreak);

  const calculateChangeCost = (currentReq: number, newReq: number): number => {
    // Example cost: 50 currency per quest difference (absolute)
    return Math.abs(newReq - currentReq) * 50;
  };

  const handleChangeRequiredQuests = () => {
    const cost = calculateChangeCost(streak.requiredQuests, targetRequiredQuests);
    if (profile.currency < cost) {
      toast({ 
        title: "Insufficient Funds", 
        description: `You need ${cost} currency, but only have ${profile.currency}.`, 
        variant: "destructive" 
      });
      setTargetRequiredQuests(streak.requiredQuests); // Reset target
      return;
    }

    const success = updateRequiredQuests(targetRequiredQuests, cost);
    if (success) {
      toast({ title: "Streak Requirement Updated", description: `Cost: ${cost} currency.` });
    } else {
      toast({ title: "Update Failed", description: "Could not update streak requirement.", variant: "destructive" });
      setTargetRequiredQuests(streak.requiredQuests); // Reset target on failure
    }
  };
  
  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Main Profile Card - always visible, handles editing */}
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
                    showDifficultySelect={false} // Difficulty select hidden on home
                  />
                );
              })}
            </div>
          </>
        )}
        
        {activeTab === "quests" && (
          <div className="space-y-4 mb-4">
            {/* Streak Requirement Change Section */}
            <div className="solo-card">
              <h3 className="text-lg font-semibold mb-3">Streak Settings</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Required Quests/Day:</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setTargetRequiredQuests(Math.max(1, targetRequiredQuests - 1))}
                    disabled={targetRequiredQuests <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-bold text-lg w-6 text-center">{targetRequiredQuests}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setTargetRequiredQuests(Math.min(todayTotalQuests, targetRequiredQuests + 1))}
                    disabled={targetRequiredQuests >= todayTotalQuests}
                   >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {targetRequiredQuests !== streak.requiredQuests && (
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    Cost: 
                    <Landmark className="h-3 w-3 text-sololevel-purple" />
                    {calculateChangeCost(streak.requiredQuests, targetRequiredQuests)}
                  </span>
                  <Button size="sm" onClick={handleChangeRequiredQuests}>Confirm Change</Button>
                </div>
              )}
            </div>
            
            {/* Quest List */}
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
                  showDifficultySelect={true} // Difficulty select shown on quests tab
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
            {/* Profile Stats are displayed here */}
            <ProfileStats /> 
          </div>
        )}
      </div>
      
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      
      {/* Profile Editor Modal - controlled by state */}
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
