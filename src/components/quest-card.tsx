
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Quest, QuestProgress } from "@/types";
import { Activity, Award, ChevronDown, Dumbbell, Footprints, Move } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateQuestReward } from "@/data/quests";

interface QuestCardProps {
  quest: Quest;
  progress: QuestProgress;
  onComplete: () => void;
  onUpdateProgress: (value: number) => void;
  onChangeDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  streakMultiplier: number;
}

export function QuestCard({
  quest,
  progress,
  onComplete,
  onUpdateProgress,
  onChangeDifficulty,
  streakMultiplier,
}: QuestCardProps) {
  const progressPercentage = Math.min(
    100,
    Math.floor((progress.currentValue / progress.targetValue) * 100)
  );
  
  const isCompleted = progress.completed;
  const canComplete = progress.currentValue >= progress.targetValue && !isCompleted;

  // Function to get icon based on quest.icon string
  const getQuestIcon = () => {
    switch (quest.icon) {
      case "footprints":
        return <Footprints className="w-6 h-6" />;
      case "dumbbell":
        return <Dumbbell className="w-6 h-6" />;
      case "activity":
        return <Activity className="w-6 h-6" />;
      case "move":
        return <Move className="w-6 h-6" />;
      default:
        return <Activity className="w-6 h-6" />;
    }
  };

  const handleProgressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    onUpdateProgress(Math.max(0, Math.min(value, progress.targetValue * 2)));
  };

  const reward = calculateQuestReward(quest, progress.difficulty, streakMultiplier);

  return (
    <div 
      className={cn(
        "solo-card transition-all duration-300",
        isCompleted ? "border-green-500/50" : canComplete ? "border-sololevel-purple/70" : ""
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-full",
            isCompleted ? "bg-green-500/20" : "bg-sololevel-purple/20"
          )}>
            {getQuestIcon()}
          </div>
          <div>
            <h3 className="font-semibold">{quest.name}</h3>
            <p className="text-xs text-gray-400">{quest.description}</p>
          </div>
        </div>
        
        <Badge 
          className={cn(
            "flex items-center gap-1",
            isCompleted ? "bg-green-500/20 text-green-300" : "bg-sololevel-purple/20"
          )}
        >
          <Award className="w-3 h-3" /> 
          {isCompleted ? `+${reward}` : reward}
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress: {progress.currentValue} / {progress.targetValue}</span>
          <span>{progressPercentage}%</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className={cn(
            "h-2",
            isCompleted ? "bg-green-900/30" : "bg-sololevel-dark"
          )}
        />
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            type="number"
            value={progress.currentValue}
            onChange={handleProgressUpdate}
            disabled={isCompleted}
            className="w-full px-3 py-1 bg-sololevel-darker border border-gray-700 rounded text-center"
            min="0"
            max={progress.targetValue * 2}
          />
        </div>
        
        {canComplete ? (
          <Button
            onClick={onComplete}
            className="flex-1 bg-sololevel-purple hover:bg-sololevel-vivid-purple"
          >
            Complete
          </Button>
        ) : (
          <Select
            value={progress.difficulty}
            onValueChange={(value) => onChangeDifficulty(value as 'easy' | 'medium' | 'hard')}
            disabled={isCompleted}
          >
            <SelectTrigger className="flex-1 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      {isCompleted && (
        <div className="mt-3 text-center">
          <span className="text-green-400 text-sm font-medium">Quest Completed!</span>
        </div>
      )}
    </div>
  );
}
