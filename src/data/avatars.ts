
import { Avatar } from "@/types";

export const avatars: Avatar[] = [
  {
    id: 1,
    imageUrl: "/avatars/default-1.png",
    name: "Hunter",
    unlocked: true,
  },
  {
    id: 2,
    imageUrl: "/avatars/default-2.png",
    name: "Shadow",
    unlocked: true,
  },
  {
    id: 3,
    imageUrl: "/avatars/default-3.png",
    name: "Monarch",
    unlocked: true,
  },
  {
    id: 4,
    imageUrl: "/avatars/premium-1.png",
    name: "Dragon Knight",
    unlocked: false,
    price: 500,
  },
  {
    id: 5,
    imageUrl: "/avatars/premium-2.png",
    name: "Ice Queen",
    unlocked: false,
    price: 750,
  },
  {
    id: 6,
    imageUrl: "/avatars/premium-3.png",
    name: "Phoenix",
    unlocked: false,
    price: 1000,
  },
];

export function getAvatar(id: number): Avatar {
  return avatars.find(avatar => avatar.id === id) || avatars[0];
}

export function getAvatarPlaceholder(id: number): string {
  // Generate a placeholder based on the avatar ID
  // This will be used until we have actual avatar images
  const colors = [
    "bg-sololevel-purple", 
    "bg-sololevel-purple-dark", 
    "bg-sololevel-purple-light", 
    "bg-sololevel-vivid-purple",
    "bg-sololevel-dark",
    "bg-black"
  ];
  
  const index = (id - 1) % colors.length;
  return colors[index];
}
