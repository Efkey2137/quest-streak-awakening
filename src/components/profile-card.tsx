
import React from "react";
import { cn } from "@/lib/utils";
import { Pencil, Landmark, Flame, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { getAvatarPlaceholder } from "@/data/avatars";

interface ProfileCardProps {
  onEditProfile: () => void;
}

export function ProfileCard({ onEditProfile }: ProfileCardProps) {
  const { profile, streak } = useAppContext();
  
  return (
    <div className="solo-card mb-4">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-md",
          getAvatarPlaceholder(profile.avatarId)
        )}>
          {profile.nickname.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gradient">{profile.nickname}</h2>
            <Button 
              onClick={onEditProfile} 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1 text-sm">
              <Landmark className="h-3 w-3 text-sololevel-purple" />
              <span className="font-medium">{profile.currency}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <Flame 
                className={cn(
                  "h-3 w-3",
                  streak.currentStreak > 0 ? "text-orange-500" : "text-gray-500"
                )} 
              />
              <span className="font-medium">{streak.currentStreak}</span>
            </div>
            
            {streak.longestStreak > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span className="font-medium">{streak.longestStreak}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
