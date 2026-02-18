export enum PetStage {
  EGG = 'Egg',
  BABY = 'Baby',
  CHILD = 'Child',
  TEEN = 'Teen',
  ADULT = 'Adult',
  MYTHIC = 'Mythic'
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: 'hat' | 'background' | 'toy' | 'skin' | 'accessory';
  emoji: string; // Fallback or UI icon
  image?: string; // URL for 3D asset
  data?: string; // The actual value applied (filter string for skins, image URL for accessories)
  purchased: boolean;
}

export interface PetState {
  name: string;
  xp: number;
  level: number;
  stage: PetStage;
  hunger: number; // 0-100
  happiness: number; // 0-100
  equippedHat: string | null;
  equippedBackground: string | null;
  equippedSkin: string | null; // CSS filter string
  equippedAccessory: string | null;
}

export interface UserState {
  coins: number;
  gems: number;
  dayStreak: number;
  lastLoginDate: string; // YYYY-MM-DD
  inventory: string[]; // IDs of purchased items
}

export interface GameState {
  pet: PetState;
  user: UserState;
  habits: Habit[];
  shopItems: ShopItem[];
}