
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AvatarSelector } from "@/components/ui/avatar-selector";
import { useAppContext } from "@/contexts/AppContext";

interface ProfileEditorProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileEditor({ open, onClose }: ProfileEditorProps) {
  const { profile, updateProfile } = useAppContext();
  
  const [nickname, setNickname] = useState(profile.nickname);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarId);
  const [error, setError] = useState("");
  
  const resetForm = () => {
    setNickname(profile.nickname);
    setSelectedAvatar(profile.avatarId);
    setError("");
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSave = () => {
    if (!nickname.trim()) {
      setError("Please enter a nickname");
      return;
    }
    
    updateProfile({
      nickname,
      avatarId: selectedAvatar
    });
    
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-sololevel-dark border-sololevel-purple/30 text-white">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium">
              Nickname
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
            <label className="text-sm font-medium">
              Avatar
            </label>
            <AvatarSelector
              onSelect={setSelectedAvatar}
              selectedId={selectedAvatar}
              showUnlockButton
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose} className="border-gray-700">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-sololevel-purple hover:bg-sololevel-vivid-purple">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
