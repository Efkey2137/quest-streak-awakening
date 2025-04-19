import { Quest } from "@/types";

export const defaultQuests: Quest[] = [
  {
    id: "walk",
    name: "Walking",
    description: "Walk 10,000 steps or 10 km",
    category: "Cardio", // Added category
    target: 10000,
    icon: "footprints",
    difficultyMultiplier: {
      easy: 0.5, // 5,000 steps
      medium: 1, // 10,000 steps
      hard: 1.5, // 15,000 steps
    },
    baseReward: 100,
  },
  {
    id: "pushups",
    name: "Push-ups",
    description: "Complete push-ups",
    category: "Strength", // Added category
    target: 100,
    icon: "dumbbell",
    difficultyMultiplier: {
      easy: 0.5, // 50 push-ups
      medium: 1, // 100 push-ups
      hard: 1.5, // 150 push-ups
    },
    baseReward: 150,
  },
  {
    id: "squats",
    name: "Squats",
    description: "Complete squats",
    category: "Strength", // Added category
    target: 100,
    icon: "activity",
    difficultyMultiplier: {
      easy: 0.5, // 50 squats
      medium: 1, // 100 squats 
      hard: 1.5, // 150 squats
    },
    baseReward: 150,
  },
  {
    id: "situps",
    name: "Sit-ups",
    description: "Complete sit-ups",
    category: "Core", // Added category
    target: 100,
    icon: "move",
    difficultyMultiplier: {
      easy: 0.5, // 50 sit-ups
      medium: 1, // 100 sit-ups
      hard: 1.5, // 150 sit-ups
    },
    baseReward: 150,
  },
];

export function getQuestTarget(quest: Quest, difficulty: 'easy' | 'medium' | 'hard'): number {
  return Math.round(quest.target * quest.difficultyMultiplier[difficulty]);
}

export function calculateQuestReward(quest: Quest, difficulty: 'easy' | 'medium' | 'hard', streakMultiplier: number = 1): number {
  const baseReward = quest.baseReward * quest.difficultyMultiplier[difficulty];
  return Math.round(baseReward * streakMultiplier);
}
