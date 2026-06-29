
import { EggTier } from '../metaStore';

export interface ShopItem {
  id: string;
  category: 'eggs' | 'food' | 'decorations';
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'food';
  image?: string;
  tier?: EggTier;
  unlockLevel?: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Eggs
  {
    id: 'egg-common',
    category: 'eggs',
    name: 'Common Egg',
    description: 'Hatches a common creature (Sprout or Ember)',
    price: 100,
    currency: 'coins',
    tier: 'common',
  },
  {
    id: 'egg-rare',
    category: 'eggs',
    name: 'Rare Egg',
    description: 'Hatches a rare or common creature (Aqua, Volt, Coral Aqua, or Storm Volt)',
    price: 300,
    currency: 'coins',
    tier: 'rare',
  },
  {
    id: 'egg-epic',
    category: 'eggs',
    name: 'Epic Egg',
    description: 'Hatches an epic creature (Crystal Sprout or Shadow Ember)',
    price: 1000,
    currency: 'coins',
    tier: 'epic',
  },
  {
    id: 'egg-legendary',
    category: 'eggs',
    name: 'Legendary Egg',
    description: 'Hatches a legendary creature (World Tree or Phoenix)',
    price: 5000,
    currency: 'coins',
    tier: 'legendary',
  },

  // Food
  {
    id: 'food-small',
    category: 'food',
    name: 'Small Food Pack',
    description: '10 units of food',
    price: 10,
    currency: 'coins',
  },
  {
    id: 'food-medium',
    category: 'food',
    name: 'Medium Food Pack',
    description: '50 units of food',
    price: 40,
    currency: 'coins',
  },
  {
    id: 'food-large',
    category: 'food',
    name: 'Large Food Pack',
    description: '100 units of food',
    price: 70,
    currency: 'coins',
  },

  // Decorations
  {
    id: 'deco-tree',
    category: 'decorations',
    name: 'Oak Tree',
    description: 'A beautiful oak tree for your island',
    price: 200,
    currency: 'coins',
    unlockLevel: 1,
  },
  {
    id: 'deco-flower',
    category: 'decorations',
    name: 'Flower Bed',
    description: 'A colorful flower bed',
    price: 150,
    currency: 'coins',
    unlockLevel: 1,
  },
  {
    id: 'deco-rock',
    category: 'decorations',
    name: 'Decorative Rock',
    description: 'A natural decorative rock',
    price: 100,
    currency: 'coins',
    unlockLevel: 1,
  },
  {
    id: 'deco-fountain',
    category: 'decorations',
    name: 'Fountain',
    description: 'A relaxing water fountain',
    price: 500,
    currency: 'coins',
    unlockLevel: 10,
  },
];

export const MERCHANT_DIALOGUES = {
  welcome: [
    "Welcome to my shop, traveler!",
    "Ah, hello there! What can I get for you today?",
    "Looking for something special, friend?",
  ],
  success: [
    "Great choice! That's one of my favorites!",
    "Excellent! You won't regret it!",
    "A fine purchase, indeed!",
    "Here you go! Enjoy!",
  ],
  failure: [
    "Sorry, you're a bit short on coins, friend.",
    "Not enough currency for that one, I'm afraid.",
    "Come back when you've saved up a bit more!",
  ],
};
