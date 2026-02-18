import { ShopItem, PetStage } from './types';

const ASSET_BASE = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis";

export const PET_ASSETS: Record<PetStage, string> = {
  [PetStage.EGG]: `${ASSET_BASE}/Food/Egg.png`,
  [PetStage.BABY]: `${ASSET_BASE}/Smilies/Alien%20Monster.png`,
  [PetStage.CHILD]: `${ASSET_BASE}/Smilies/Goblin.png`,
  [PetStage.TEEN]: `${ASSET_BASE}/Smilies/Ogre.png`,
  [PetStage.ADULT]: `${ASSET_BASE}/Animals/Dragon.png`,
  [PetStage.MYTHIC]: `${ASSET_BASE}/Animals/T-Rex.png`,
};

export const INITIAL_HABITS = [
  { id: '1', name: 'Drink Water', completed: false, streak: 0 },
  { id: '2', name: 'Read 10 mins', completed: false, streak: 0 },
  { id: '3', name: 'Exercise', completed: false, streak: 0 },
];

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  // Hats
  { 
    id: 'hat_cap', 
    name: 'Blue Cap', 
    price: 50, 
    type: 'hat', 
    emoji: '🧢', 
    image: `${ASSET_BASE}/Objects/Billed%20Cap.png`,
    data: `${ASSET_BASE}/Objects/Billed%20Cap.png`,
    purchased: false 
  },
  { 
    id: 'hat_crown', 
    name: 'Gold Crown', 
    price: 500, 
    type: 'hat', 
    emoji: '👑', 
    image: `${ASSET_BASE}/Objects/Crown.png`,
    data: `${ASSET_BASE}/Objects/Crown.png`,
    purchased: false 
  },
  { 
    id: 'hat_glasses', 
    name: 'Cool Shades', 
    price: 150, 
    type: 'hat', 
    emoji: '🕶️', 
    image: `${ASSET_BASE}/Objects/Sunglasses.png`,
    data: `${ASSET_BASE}/Objects/Sunglasses.png`,
    purchased: false 
  },
  { 
    id: 'hat_top', 
    name: 'Top Hat', 
    price: 200, 
    type: 'hat', 
    emoji: '🎩', 
    image: `${ASSET_BASE}/Objects/Top%20Hat.png`,
    data: `${ASSET_BASE}/Objects/Top%20Hat.png`,
    purchased: false 
  },
  
  // Accessories
  { 
    id: 'acc_bow', 
    name: 'Pink Bow', 
    price: 60, 
    type: 'accessory', 
    emoji: '🎀', 
    image: `${ASSET_BASE}/Objects/Ribbon.png`,
    data: `${ASSET_BASE}/Objects/Ribbon.png`,
    purchased: false 
  },
  { 
    id: 'acc_medal', 
    name: 'Gold Medal', 
    price: 100, 
    type: 'accessory', 
    emoji: '🥇', 
    image: `${ASSET_BASE}/Activities/Military%20Medal.png`,
    data: `${ASSET_BASE}/Activities/Military%20Medal.png`,
    purchased: false 
  },
  
  // Skins (Applied as CSS Filters to the 3D Image)
  { id: 'skin_ghost', name: 'Ghostly', price: 250, type: 'skin', emoji: '👻', data: 'grayscale(100%) opacity(0.7)', purchased: false },
  { id: 'skin_hulk', name: 'Radioactive', price: 150, type: 'skin', emoji: '🧪', data: 'hue-rotate(90deg) saturate(200%)', purchased: false },
  { id: 'skin_ocean', name: 'Deep Blue', price: 150, type: 'skin', emoji: '🌊', data: 'hue-rotate(180deg) brightness(1.1)', purchased: false },
  { id: 'skin_gold', name: 'Midas Touch', price: 1000, type: 'skin', emoji: '✨', data: 'sepia(100%) saturate(300%) hue-rotate(320deg)', purchased: false },

  // Backgrounds
  { id: 'bg_forest', name: 'Forest', price: 100, type: 'background', emoji: '🌲', purchased: false },
  { id: 'bg_city', name: 'City', price: 150, type: 'background', emoji: '🏙️', purchased: false },
  { id: 'bg_space', name: 'Space', price: 1000, type: 'background', emoji: '🌌', purchased: false },
  
  // Toys
  { id: 'toy_ball', name: 'Soccer Ball', price: 75, type: 'toy', emoji: '⚽', image: `${ASSET_BASE}/Activities/Soccer%20Ball.png`, purchased: false },
];

export const LEVEL_THRESHOLDS: Record<PetStage, number> = {
  [PetStage.EGG]: 0,
  [PetStage.BABY]: 100,
  [PetStage.CHILD]: 300,
  [PetStage.TEEN]: 600,
  [PetStage.ADULT]: 1000,
  [PetStage.MYTHIC]: 5000,
};

export const XP_PER_HABIT = 15;
export const COINS_PER_HABIT = 10;
export const GEMS_PER_STREAK_DAY = 5;