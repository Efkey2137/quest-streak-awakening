import React from "react";
import { cn } from "@/lib/utils";
import { Landmark, Flame, Trophy, Pencil } from "lucide-react"; // Import Pencil icon
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { getAvatarPlaceholder } from "@/data/avatars";

interface ProfileCardProps {
  onEditProfile?: () => void;
}

export function ProfileCard({ onEditProfile }: ProfileCardProps) {
  const { profile, streak } = useAppContext();
  
  // Add basic check for profile existence
  if (!profile) {
    return <div className="solo-card mb-4 p-4 text-center text-gray-400">Loading profile...</div>;
  }
  
  return (
    <div className="solo-card mb-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700">
          <img 
            src={getAvatarPlaceholder(profile.avatarId)} 
            alt={profile.nickname || `Avatar ${profile.avatarId}`}
            className="w-full h-full object-cover"
            // Add error handling for image loading if needed
            onError={(e) => (e.currentTarget.src = getAvatarPlaceholder(0))} // Fallback to default avatar on error
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between"> {/* Use justify-between */} 
            <h2 className="text-xl font-bold text-gradient truncate">{profile.nickname}</h2>
            {/* Removed isProfilePage condition, show button if onEditProfile exists */}
            {onEditProfile && (
              <Button 
                onClick={onEditProfile} 
                variant="ghost" 
                size="icon" // Make it an icon button
                className="text-gray-400 hover:text-white flex-shrink-0" // Prevent shrinking
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Profile</span> {/* Screen reader text */}
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1 text-sm">
              <Landmark className="h-3 w-3 text-sololevel-purple" />
              <span className="font-medium">{profile.currency ?? 0}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <Flame 
                className={cn(
                  "h-3 w-3",
                  streak?.currentStreak > 0 ? "text-orange-500" : "text-gray-500"
                )} 
              />
              <span className="font-medium">{streak?.currentStreak ?? 0}</span>
            </div>
            
            {streak?.longestStreak > 0 && (
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
