
import { Avatar } from "@/types";

export const avatars: Avatar[] = [
  {
    id: 1,
    imageUrl: "/avatars/1.png",
    name: "E-Rank Hunter",
    unlocked: true,
  },
  {
    id: 2,
    imageUrl: "/avatars/2.png",
    name: "System Watcher",
    unlocked: true,
  },
  {
    id: 3,
    imageUrl: "/avatars/3.png",
    name: "Shadow Guard",
    unlocked: true,
  },
  {
    id: 4,
    imageUrl: "/avatars/p1.png",
    name: "Dark Heir",
    unlocked: false,
    price: 1000,
  },
  {
    id: 5,
    imageUrl: "/avatars/p2.png",
    name: "Shadow Knight",
    unlocked: false,
    price: 2000,
  },
  {
    id: 6,
    imageUrl: "/avatars/p3.png",
    name: " Awakened One",
    unlocked: false,
    price: 3000,
  },
  {
    id: 7,
    imageUrl: "/avatars/p4.png",
    name: "Trainee",
    unlocked: false,
    price: 4000,
  },
  {
    id: 8,
    imageUrl: "/avatars/p5.png",
    name: "Soulbound",
    unlocked: false,
    price: 5000,
  }
];

export function getAvatar(id: number): Avatar {
  return avatars.find(avatar => avatar.id === id) || avatars[0];
}

export function getAvatarPlaceholder(id: number): string {
  const avatar = getAvatar(id);
  return avatar.imageUrl;
}
