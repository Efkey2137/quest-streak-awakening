
import { Avatar } from "@/types";

export const avatars: Avatar[] = [
  {
    id: 1,
    imageUrl: "/lovable-uploads/f466c6cf-ea4d-495a-933b-37e02446390f.png",
    name: "Hunter",
    unlocked: true,
  },
  {
    id: 2,
    imageUrl: "/lovable-uploads/20bd5e15-eca4-4d11-9b4c-a0537dead5d6.png",
    name: "Shadow",
    unlocked: true,
  },
  {
    id: 3,
    imageUrl: "/lovable-uploads/0272143f-6dcb-45ce-b2c4-437a52cfa930.png",
    name: "Monarch",
    unlocked: true,
  },
  {
    id: 4,
    imageUrl: "/lovable-uploads/847bec26-6993-4d92-90f7-62e151e4c3be.png",
    name: "Dragon Knight",
    unlocked: false,
    price: 1000,
  }
];

export function getAvatar(id: number): Avatar {
  return avatars.find(avatar => avatar.id === id) || avatars[0];
}

export function getAvatarPlaceholder(id: number): string {
  const avatar = getAvatar(id);
  return avatar.imageUrl;
}
