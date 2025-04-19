
import React from "react";
import { cn } from "@/lib/utils";
import { Home, User, BarChart, Dumbbell } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "quests", label: "Quests", icon: Dumbbell },
    { id: "stats", label: "Stats", icon: BarChart },
    { id: "profile", label: "Profile", icon: User },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-sololevel-darker py-2 px-4">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 py-1 transition-colors",
                isActive 
                  ? "text-sololevel-purple" 
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1",
                isActive && "glow-purple"
              )} />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
