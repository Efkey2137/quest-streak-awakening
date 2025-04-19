
import React from "react";
import { Avatar } from "@/types";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";
import { getAvatarPlaceholder } from "@/data/avatars";
import { LockIcon } from "lucide-react";

interface AvatarSelectorProps {
  onSelect: (avatarId: number) => void;
  selectedId: number;
  showUnlockButton?: boolean;
}

export function AvatarSelector({ onSelect, selectedId, showUnlockButton = false }: AvatarSelectorProps) {
  const { avatars, unlockAvatar, profile } = useAppContext();

  const handleUnlock = (e: React.MouseEvent, avatar: Avatar) => {
    e.stopPropagation();
    if (unlockAvatar(avatar.id)) {
      onSelect(avatar.id);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
          onClick={() => avatar.unlocked && onSelect(avatar.id)}
          className={cn(
            "relative flex flex-col items-center p-2 rounded-lg border-2 transition-all",
            avatar.unlocked
              ? "cursor-pointer hover:scale-105"
              : "cursor-not-allowed opacity-70",
            selectedId === avatar.id
              ? "border-sololevel-purple glow-box"
              : "border-gray-700"
          )}
        >
          <div 
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-2",
              getAvatarPlaceholder(avatar.id)
            )}
          >
            {!avatar.unlocked && <LockIcon className="w-6 h-6 text-gray-400" />}
          </div>
          <span className="text-sm font-medium truncate w-full text-center">
            {avatar.name}
          </span>
          
          {!avatar.unlocked && avatar.price && showUnlockButton && (
            <button
              onClick={(e) => handleUnlock(e, avatar)}
              disabled={profile.currency < (avatar.price || 0)}
              className={cn(
                "mt-2 text-xs px-2 py-1 rounded-md w-full",
                profile.currency >= (avatar.price || 0)
                  ? "bg-sololevel-purple hover:bg-sololevel-vivid-purple"
                  : "bg-gray-700 cursor-not-allowed"
              )}
            >
              Unlock {avatar.price}c
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
