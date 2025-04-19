
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarSelector } from "@/components/ui/avatar-selector";
import { useAppContext } from "@/contexts/AppContext";

export function SetupForm() {
  const { completeSetup } = useAppContext();
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
        <p className="text-gray-300">
          Set up your profile to begin your journey
        </p>
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
