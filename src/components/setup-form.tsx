
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarSelector } from "@/components/ui/avatar-selector";
import { useAppContext } from "@/contexts/AppContext";
import { defaultQuests } from "@/data/quests";

export function SetupForm() {
  const { completeSetup, settings, updateDifficulty, updateRequiredQuests } = useAppContext();
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }
    
    completeSetup(nickname, selectedAvatar);
  };

  return (
    <div className="solo-card max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gradient mb-2">Welcome, Hunter</h1>
        <p className="text-gray-300">Set up your profile to begin your journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="nickname" className="block text-sm font-medium">
            Your Nickname
          </label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="bg-gray-800 border-gray-700"
            maxLength={20}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium mb-2">
            Choose Your Avatar
          </label>
          <AvatarSelector
            onSelect={setSelectedAvatar}
            selectedId={selectedAvatar}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Quest Difficulty</h3>
          {defaultQuests.map(quest => (
            <div key={quest.id} className="flex items-center justify-between">
              <span className="text-sm">{quest.name}</span>
              <Select
                value={settings.difficultySettings[quest.id]}
                onValueChange={(value: 'easy' | 'medium' | 'hard') => updateDifficulty(quest.id, value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Streak Settings</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Required Daily Quests</span>
            <Select
              value={settings.streakRequirement.toString()}
              onValueChange={(value) => updateRequiredQuests(parseInt(value, 10))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-sololevel-purple hover:bg-sololevel-vivid-purple"
        >
          Begin Your Quest
        </Button>
      </form>
    </div>
  );
}
