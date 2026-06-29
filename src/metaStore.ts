// @ts-nocheck
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types ---
export type CreatureType = 'sprout' | 'ember' | 'aqua' | 'volt' | 'crystalSprout' | 'shadowEmber' | 'coralAqua' | 'stormVolt' | 'worldTree' | 'phoenix';
export type CreatureRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type EggTier = 'common' | 'rare' | 'epic' | 'legendary';
export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export interface CreatureStage {
  name: string;
  levelRequired: number;
}

export interface Creature {
  id: string;
  type: CreatureType;
  name: string; // Stage name (e.g., "Sprout")
  nickname: string;
  rarity: CreatureRarity;
  level: number;
  experience: number;
  happiness: number; // 0-100
  hunger: number; // 0-100 (0 = full, 100 = starving)
  affection: number; // 0-100
  favoriteFood: string;
  lastPetTime: number; // Timestamp in ms
  position: { x: number; y: number };
}

export interface Egg {
  id: string;
  tier: EggTier;
  position: { x: number; y: number };
  clicksToHatch: number;
}

export type DecorationType = 'tree' | 'flower' | 'rock' | 'fountain';

export interface Decoration {
  id: string;
  type: DecorationType;
  x: number;
  y: number;
}

export type BuildingType = 'house' | 'garden' | 'hatchery';

export interface Building {
  id: string;
  type: BuildingType;
  level: number;
}

export interface DailyQuest {
  id: string;
  type: 'playGames' | 'earnCoins' | 'feedCreature';
  target: number;
  progress: number;
  reward: { coins?: number; food?: number; egg?: EggTier };
  completed: boolean;
}

export interface DailyReward {
  day: number;
  claimed: boolean;
}

export type EncyclopediaEntry = CreatureType;
export const ALL_CREATURE_TYPES: EncyclopediaEntry[] = [
  'sprout', 'ember', 'aqua', 'volt',
  'crystalSprout', 'shadowEmber', 'coralAqua', 'stormVolt',
  'worldTree', 'phoenix'
];

export interface EncyclopediaReward {
  type: 'coins' | 'food' | 'legendaryEgg';
  amount?: number;
  claimed: boolean;
  threshold: number; // 50, 75, 100
}

// --- Gacha Rules ---
export const GACHA_POOLS: Record<EggTier, { type: CreatureType; rarity: CreatureRarity; weight: number }[]> = {
  common: [
    { type: 'sprout', rarity: 'common', weight: 50 },
    { type: 'ember', rarity: 'common', weight: 50 },
  ],
  rare: [
    { type: 'aqua', rarity: 'common', weight: 35 },
    { type: 'volt', rarity: 'common', weight: 35 },
    { type: 'coralAqua', rarity: 'rare', weight: 15 },
    { type: 'stormVolt', rarity: 'rare', weight: 15 },
  ],
  epic: [
    { type: 'crystalSprout', rarity: 'epic', weight: 50 },
    { type: 'shadowEmber', rarity: 'epic', weight: 50 },
  ],
  legendary: [
    { type: 'worldTree', rarity: 'legendary', weight: 50 },
    { type: 'phoenix', rarity: 'legendary', weight: 50 },
  ],
};

export const EGG_CLICKS_TO_HATCH: Record<EggTier, number> = {
  common: 3,
  rare: 4,
  epic: 5,
  legendary: 7,
};

// --- Helper Functions ---
function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

export const getCreatureStage = (type: CreatureType, level: number): CreatureStage => {
  const stages: Record<CreatureType, CreatureStage[]> = {
    sprout: [
      { name: 'Sprout', levelRequired: 1 },
      { name: 'Bloomling', levelRequired: 10 },
      { name: 'Forest Guardian', levelRequired: 25 },
    ],
    ember: [
      { name: 'Ember', levelRequired: 1 },
      { name: 'Flamefox', levelRequired: 10 },
      { name: 'Phoenix Cub', levelRequired: 25 },
    ],
    aqua: [
      { name: 'Aqua', levelRequired: 1 },
      { name: 'Wavefin', levelRequired: 10 },
      { name: 'Ocean Spirit', levelRequired: 25 },
    ],
    volt: [
      { name: 'Volt', levelRequired: 1 },
      { name: 'Sparkcat', levelRequired: 10 },
      { name: 'Storm Dragon', levelRequired: 25 },
    ],
    crystalSprout: [
      { name: 'Crystal Sprout', levelRequired: 1 },
      { name: 'Crystal Bloomling', levelRequired: 10 },
      { name: 'Crystal Guardian', levelRequired: 25 },
    ],
    shadowEmber: [
      { name: 'Shadow Ember', levelRequired: 1 },
      { name: 'Shadow Flamefox', levelRequired: 10 },
      { name: 'Shadow Phoenix', levelRequired: 25 },
    ],
    coralAqua: [
      { name: 'Coral Aqua', levelRequired: 1 },
      { name: 'Coral Wavefin', levelRequired: 10 },
      { name: 'Coral Spirit', levelRequired: 25 },
    ],
    stormVolt: [
      { name: 'Storm Volt', levelRequired: 1 },
      { name: 'Storm Sparkcat', levelRequired: 10 },
      { name: 'Storm Dragon', levelRequired: 25 },
    ],
    worldTree: [
      { name: 'World Tree Sapling', levelRequired: 1 },
      { name: 'World Tree Sprout', levelRequired: 10 },
      { name: 'World Tree Spirit', levelRequired: 25 },
    ],
    phoenix: [
      { name: 'Phoenix Chick', levelRequired: 1 },
      { name: 'Phoenix Fledgling', levelRequired: 10 },
      { name: 'Eternal Phoenix', levelRequired: 25 },
    ],
  };
  const creatureStages = stages[type];
  for (let i = creatureStages.length - 1; i >= 0; i--) {
    if (level >= creatureStages[i].levelRequired) {
      return creatureStages[i];
    }
  }
  return creatureStages[0];
};

export const CREATURE_NICKNAMES: Record<CreatureType, string[]> = {
  sprout: ['Leafy', 'Buddy', 'Sproutie', 'Fern', 'Willow', 'Clover', 'Moss', 'Ivy', 'Acorn', 'Sapling'],
  ember: ['Ash', 'Sparky', 'Blaze', 'Ember', 'Flicker', 'Cinder', 'Phoenix', 'Flame', 'Inferno', 'Spark'],
  aqua: ['Bubbles', 'Splash', 'Wave', 'Dew', 'Rain', 'Coral', 'Tide', 'Ocean', 'Pearl', 'Nemo'],
  volt: ['Zap', 'Spark', 'Bolt', 'Thunder', 'Storm', 'Watt', 'Volt', 'Lightning', 'Current', 'Surge'],
  crystalSprout: ['Crystal', 'Gem', 'Jewel', 'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Opal', 'Topaz'],
  shadowEmber: ['Shadow', 'Shade', 'Umbra', 'Nocturne', 'Eclipse', 'Midnight', 'Darkness', 'Night', 'Gloom', 'Dusk'],
  coralAqua: ['Coral', 'Reef', 'Tide', 'Ocean', 'Pearl', 'Nemo', 'Shell', 'Starfish', 'Jellyfish', 'Octopus'],
  stormVolt: ['Storm', 'Tempest', 'Thunder', 'Lightning', 'Bolt', 'Cyclone', 'Hurricane', 'Typhoon', 'Gust', 'Wind'],
  worldTree: ['Yggdrasil', 'Sylvia', 'Oak', 'Ash', 'Birch', 'Maple', 'Pine', 'Cedar', 'Redwood', 'Sequoia'],
  phoenix: ['Phoenix', 'Firebird', 'Sunny', 'Sol', 'Aurora', 'Flame', 'Solaris', 'Luna', 'Stella', 'Nova'],
};

export const FAVORITE_FOODS = ['Apple', 'Berry', 'Carrot', 'Mushroom', 'Honey', 'Fish', 'Meat', 'Bread', 'Cheese', 'Cake'];

function getRandomNickname(type: CreatureType): string {
  const options = CREATURE_NICKNAMES[type];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomFavoriteFood(): string {
  return FAVORITE_FOODS[Math.floor(Math.random() * FAVORITE_FOODS.length)];
}

interface Position {
  x: number;
  y: number;
}

function getRandomPosition(existingPositions: Position[] = []): Position {
  const MIN_DISTANCE = 10; // Minimum 10% distance between creatures
  const BOUNDS = {
    minX: 15,
    maxX: 85,
    minY: 50,
    maxY: 78
  };

  const calculateDistance = (pos1: Position, pos2: Position): number => {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
  };

  const isValidPosition = (pos: Position): boolean => {
    return existingPositions.every(
      existing => calculateDistance(pos, existing) >= MIN_DISTANCE
    );
  };

  // Try to find a non-clustered position (max 10 attempts)
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate: Position = {
      x: BOUNDS.minX + Math.random() * (BOUNDS.maxX - BOUNDS.minX),
      y: BOUNDS.minY + Math.random() * (BOUNDS.maxY - BOUNDS.minY)
    };

    if (isValidPosition(candidate)) {
      return candidate;
    }
  }

  // If all attempts fail (very crowded), return a spiraled position
  const baseX = BOUNDS.minX + Math.random() * (BOUNDS.maxX - BOUNDS.minX);
  const baseY = BOUNDS.minY + Math.random() * (BOUNDS.maxY - BOUNDS.minY);
  const offset = (existingPositions.length % 5) * 5;
  
  return {
    x: Math.min(BOUNDS.maxX, Math.max(BOUNDS.minX, baseX + offset)),
    y: Math.min(BOUNDS.maxY, Math.max(BOUNDS.minY, baseY + offset))
  };
}

function rollGacha(tier: EggTier): { type: CreatureType; rarity: CreatureRarity } {
  const pool = GACHA_POOLS[tier];
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of pool) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }
  return pool[0]; // Fallback
}

// --- Store ---
const META_STORAGE_VERSION = 2;

interface MetaState {
  // Currencies
  coins: number;
  food: number;

  // Creatures
  creatures: Creature[];
  activeCreatureId: string | null;

  // Eggs
  eggs: Egg[];

  // Island
  islandLevel: number;
  weather: Weather;
  decorations: Decoration[];
  buildings: Building[];

  // Daily System
  lastLoginDate: string | null;
  dailyRewards: DailyReward[];
  dailyQuests: DailyQuest[];

  // Encyclopedia
  discoveredCreatures: Record<CreatureType, boolean>;
  encyclopediaRewards: EncyclopediaReward[];

  // Actions
  addCoins: (amount: number) => void;
  addFood: (amount: number) => void;
  buyEgg: (tier: EggTier) => boolean;
  interactWithEgg: (eggId: string) => boolean; // returns true if hatched
  hatchEgg: (eggId: string) => void; // legacy, kept for compatibility
  feedCreature: (creatureId: string, amount: number) => { isFavorite: boolean; bonusApplied: boolean };
  petCreature: (creatureId: string) => boolean;
  evolveCreature: (creatureId: string) => void;
  addCreatureXp: (creatureId: string, xp: number) => void;
  addCreatureXpToAll: (xp: number) => void;
  updateDailyQuest: (type: DailyQuest['type'], amount: number) => void;
  claimDailyReward: (day: number) => void;
  claimQuestReward: (questId: string) => void;
  checkDailyLogin: () => void;
  discoverCreature: (type: CreatureType) => void;
  claimEncyclopediaReward: (threshold: number) => void;

  // Dev Debug Actions (only available in dev mode)
  devAddCoins: (amount: number) => void;
  devAddFood: (amount: number) => void;
  devSpawnEgg: (tier: EggTier) => void;
  devSpawnCreature: (type: CreatureType, rarity: CreatureRarity) => void;
  devIncreaseIslandLevel: () => void;
}

const initialBuildings: Building[] = [
  { id: 'house-1', type: 'house', level: 1 },
  { id: 'garden-1', type: 'garden', level: 1 },
  { id: 'hatchery-1', type: 'hatchery', level: 1 },
];

const initialEncyclopedia: Record<CreatureType, boolean> = {
  sprout: false,
  ember: false,
  aqua: false,
  volt: false,
  crystalSprout: false,
  shadowEmber: false,
  coralAqua: false,
  stormVolt: false,
  worldTree: false,
  phoenix: false,
};

const initialEncyclopediaRewards: EncyclopediaReward[] = [
  { type: 'coins', amount: 500, claimed: false, threshold: 50 },
  { type: 'food', amount: 200, claimed: false, threshold: 75 },
  { type: 'legendaryEgg', claimed: false, threshold: 100 },
];

export const useMetaStore = create<MetaState>()(
  persist(
    (set, get) => ({
      coins: 0,
      food: 0,
      creatures: [],
      activeCreatureId: null,
      eggs: [],
      islandLevel: 1,
      weather: 'sunny',
      decorations: [],
      buildings: initialBuildings,
      lastLoginDate: null,
      dailyRewards: [],
      dailyQuests: [],
      discoveredCreatures: initialEncyclopedia,
      encyclopediaRewards: initialEncyclopediaRewards,

      addCoins: (amount: number) => set((state) => ({ coins: Math.max(0, state.coins + amount) })),
      addFood: (amount: number) => set((state) => ({ food: Math.max(0, state.food + amount) })),

      buyEgg: (tier: EggTier): boolean => {
        const prices: Record<EggTier, number> = { common: 100, rare: 300, epic: 1000, legendary: 5000 };
        const price = prices[tier];
        if (get().coins >= price) {
          const state = get();
          const allPositions: Position[] = [
            ...state.creatures.map(c => c.position),
            ...state.eggs.map(e => e.position)
          ];
          const newEgg: Egg = {
            id: generateId(),
            tier,
            position: getRandomPosition(allPositions),
            clicksToHatch: EGG_CLICKS_TO_HATCH[tier],
          };
          set((state) => ({
            coins: state.coins - price,
            eggs: [...state.eggs, newEgg],
          }));
          return true;
        }
        return false;
      },

      discoverCreature: (type: CreatureType) => {
        set((state) => ({
          discoveredCreatures: {
            ...state.discoveredCreatures,
            [type]: true,
          },
        }));
      },

      claimEncyclopediaReward: (threshold: number) => {
        const state = get();
        const reward = state.encyclopediaRewards.find(r => r.threshold === threshold && !r.claimed);
        if (!reward) return;

        const allPositions: Position[] = [
          ...state.creatures.map(c => c.position),
          ...state.eggs.map(e => e.position)
        ];

        set((s) => {
          const newState: Partial<MetaState> = {
            encyclopediaRewards: s.encyclopediaRewards.map(r =>
              r.threshold === threshold ? { ...r, claimed: true } : r
            ),
          };
          if (reward.type === 'coins' && reward.amount) {
            newState.coins = s.coins + reward.amount;
          } else if (reward.type === 'food' && reward.amount) {
            newState.food = s.food + reward.amount;
          } else if (reward.type === 'legendaryEgg') {
            newState.eggs = [
              ...s.eggs,
              {
                id: generateId(),
                tier: 'legendary',
                position: getRandomPosition(allPositions),
                clicksToHatch: EGG_CLICKS_TO_HATCH.legendary,
              },
            ];
          }
          return newState as MetaState;
        });
      },

      interactWithEgg: (eggId: string): boolean => {
        const egg = get().eggs.find(e => e.id === eggId);
        if (!egg) return false;

        const newClicksToHatch = egg.clicksToHatch - 1;
        if (newClicksToHatch <= 0) {
          // Hatch the egg
          const gachaResult = rollGacha(egg.tier);
          const stage = getCreatureStage(gachaResult.type, 1);
          const newCreature: Creature = {
            id: generateId(),
            type: gachaResult.type,
            name: stage.name,
            nickname: getRandomNickname(gachaResult.type),
            rarity: gachaResult.rarity,
            level: 1,
            experience: 0,
            happiness: 100,
            hunger: 0,
            affection: 50,
            favoriteFood: getRandomFavoriteFood(),
            lastPetTime: 0,
            position: egg.position, // Spawn at egg's position
          };

          // Discover the creature
          get().discoverCreature(gachaResult.type);

          set((state) => ({
            eggs: state.eggs.filter(e => e.id !== eggId),
            creatures: [...state.creatures, newCreature],
            activeCreatureId: state.activeCreatureId || newCreature.id,
          }));
          return true;
        }

        set((state) => ({
          eggs: state.eggs.map(e =>
            e.id === eggId ? { ...e, clicksToHatch: newClicksToHatch } : e
          ),
        }));
        return false;
      },

      hatchEgg: (eggId: string) => {
        // Legacy function for compatibility
        const egg = get().eggs.find(e => e.id === eggId);
        if (!egg) return;
        
        const gachaResult = rollGacha(egg.tier);
        const stage = getCreatureStage(gachaResult.type, 1);
        
        const state = get();
        const creaturePositions: Position[] = state.creatures.map(c => c.position);
        const newCreature: Creature = {
          id: generateId(),
          type: gachaResult.type,
          name: stage.name,
          nickname: getRandomNickname(gachaResult.type),
          rarity: gachaResult.rarity,
          level: 1,
          experience: 0,
          happiness: 100,
          hunger: 0,
          affection: 50,
          favoriteFood: getRandomFavoriteFood(),
          lastPetTime: 0,
          position: getRandomPosition(creaturePositions),
        };

        // Discover the creature
        get().discoverCreature(gachaResult.type);

        set((state) => ({
          eggs: state.eggs.filter(e => e.id !== eggId),
          creatures: [...state.creatures, newCreature],
          activeCreatureId: state.activeCreatureId || newCreature.id,
        }));
      },

      feedCreature: (creatureId: string, amount: number) => {
        const state = get();
        if (state.food < amount) return { isFavorite: false, bonusApplied: false };
        const creature = state.creatures.find((c) => c.id === creatureId);
        if (!creature) return { isFavorite: false, bonusApplied: false };
        
        const isFavorite = Math.random() < 0.3; // 30% chance it's favorite food
        const affectionGain = isFavorite ? 2 : 1;

        set((state) => ({
          food: state.food - amount,
          creatures: state.creatures.map((c) => {
            if (c.id !== creatureId) return c;
            return {
              ...c,
              hunger: Math.max(0, c.hunger - amount * 10),
              happiness: Math.min(100, c.happiness + amount * 5),
              affection: Math.min(100, c.affection + affectionGain),
            };
          }),
        }));
        return { isFavorite, bonusApplied: isFavorite };
      },

      petCreature: (creatureId: string) => {
        const now = Date.now();
        const creature = get().creatures.find((c) => c.id === creatureId);
        if (!creature) return false;
        const oneHour = 60 * 60 * 1000;
        if (now - creature.lastPetTime < oneHour) return false;
        set((state) => ({
          creatures: state.creatures.map((c) => {
            if (c.id !== creatureId) return c;
            return {
              ...c,
              affection: Math.min(100, c.affection + 1),
              lastPetTime: now,
            };
          }),
        }));
        return true;
      },

      evolveCreature: (creatureId: string) => {
        set((state) => ({
          creatures: state.creatures.map((c) => {
            if (c.id !== creatureId) return c;
            // Just trigger stage recalculation on next render by updating name
            const newStage = getCreatureStage(c.type, c.level);
            return { ...c, name: newStage.name };
          }),
        }));
      },

      addCreatureXp: (creatureId: string, xp: number) => {
        set((state) => ({
          creatures: state.creatures.map((c) => {
            if (c.id !== creatureId) return c;
            let newLevel = c.level;
            let newXp = c.experience + xp;
            const xpNeeded = newLevel * 50;
            while (newXp >= xpNeeded) {
              newXp -= xpNeeded;
              newLevel++;
            }
            const newStage = getCreatureStage(c.type, newLevel);
            return { ...c, level: newLevel, experience: newXp, name: newStage.name };
          }),
        }));
      },

      addCreatureXpToAll: (xp: number) => {
        const { creatures } = get();
        creatures.forEach((c) => get().addCreatureXp(c.id, xp));
      },

      checkDailyLogin: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastLoginDate } = get();

        if (lastLoginDate !== today) {
          let currentDay = 1;
          if (lastLoginDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastLoginDate === yesterday.toISOString().split('T')[0]) {
              const lastClaimedDay = get().dailyRewards.filter((r) => r.claimed).length;
              currentDay = (lastClaimedDay % 7) + 1;
            }
          }

          const newQuests: DailyQuest[] = [
            {
              id: generateId(),
              type: 'playGames',
              target: 3,
              progress: 0,
              reward: { coins: 50 },
              completed: false,
            },
            {
              id: generateId(),
              type: 'earnCoins',
              target: 200,
              progress: 0,
              reward: { food: 20 },
              completed: false,
            },
            {
              id: generateId(),
              type: 'feedCreature',
              target: 1,
              progress: 0,
              reward: { egg: 'common' },
              completed: false,
            },
          ];

          set((state) => ({
            lastLoginDate: today,
            dailyQuests: newQuests,
            dailyRewards: state.dailyRewards.some((r) => r.day === currentDay && !r.claimed)
              ? state.dailyRewards
              : [...state.dailyRewards.filter((r) => r.day !== currentDay), { day: currentDay, claimed: false }],
          }));
        }
      },

      updateDailyQuest: (type: DailyQuest['type'], amount: number) => {
        set((state) => ({
          dailyQuests: state.dailyQuests.map((q) => {
            if (q.type !== type || q.completed) return q;
            const newProgress = Math.min(q.target, q.progress + amount);
            return { ...q, progress: newProgress };
          }),
        }));
      },

      claimDailyReward: (day: number) => {
        const rewards = [
          { coins: 50 },
          { coins: 100 },
          { egg: 'common' },
          { food: 30 },
          { coins: 150 },
          { food: 50 },
          { egg: 'rare' },
        ];
        const reward = rewards[(day - 1) % 7];

        const state = get();
        const allPositions: Position[] = [
          ...state.creatures.map(c => c.position),
          ...state.eggs.map(e => e.position)
        ];

        set((state) => {
          const newState: Partial<MetaState> = {
            dailyRewards: state.dailyRewards.map((r) =>
              r.day === day ? { ...r, claimed: true } : r
            ),
          };
          if (reward.coins) newState.coins = state.coins + reward.coins;
          if (reward.food) newState.food = state.food + reward.food;
          if (reward.egg) {
            newState.eggs = [
              ...state.eggs,
              {
                id: generateId(),
                tier: reward.egg,
                position: getRandomPosition(allPositions),
                clicksToHatch: EGG_CLICKS_TO_HATCH[reward.egg],
              }
            ];
          }
          return newState as MetaState;
        });
      },

      claimQuestReward: (questId: string) => {
        const quest = get().dailyQuests.find((q) => q.id === questId);
        if (!quest || quest.completed || quest.progress < quest.target) return;

        const state = get();
        const allPositions: Position[] = [
          ...state.creatures.map(c => c.position),
          ...state.eggs.map(e => e.position)
        ];

        set((state) => {
          const newState: Partial<MetaState> = {
            dailyQuests: state.dailyQuests.map((q) =>
              q.id === questId ? { ...q, completed: true } : q
            ),
          };
          if (quest.reward.coins) newState.coins = state.coins + quest.reward.coins;
          if (quest.reward.food) newState.food = state.food + quest.reward.food;
          if (quest.reward.egg) {
            newState.eggs = [
              ...state.eggs,
              {
                id: generateId(),
                tier: quest.reward.egg,
                position: getRandomPosition(allPositions),
                clicksToHatch: EGG_CLICKS_TO_HATCH[quest.reward.egg],
              }
            ];
          }
          return newState as MetaState;
        });
      },

      // Dev Debug Actions
      devAddCoins: (amount: number) => {
        if (import.meta.env.DEV) {
          set((state) => ({ coins: state.coins + amount }));
        }
      },
      devAddFood: (amount: number) => {
        if (import.meta.env.DEV) {
          set((state) => ({ food: state.food + amount }));
        }
      },
      devSpawnEgg: (tier: EggTier) => {
        if (import.meta.env.DEV) {
          const state = get();
          const allPositions: Position[] = [
            ...state.creatures.map(c => c.position),
            ...state.eggs.map(e => e.position)
          ];
          set((state) => ({
            eggs: [
              ...state.eggs,
              {
                id: generateId(),
                tier,
                position: getRandomPosition(allPositions),
                clicksToHatch: EGG_CLICKS_TO_HATCH[tier],
              }
            ]
          }));
        }
      },
      devSpawnCreature: (type: CreatureType, rarity: CreatureRarity) => {
        if (import.meta.env.DEV) {
          const stage = getCreatureStage(type, 1);
          const state = get();
          const creaturePositions: Position[] = state.creatures.map(c => c.position);
          const newCreature: Creature = {
            id: generateId(),
            type,
            name: stage.name,
            nickname: getRandomNickname(type),
            rarity,
            level: 1,
            experience: 0,
            happiness: 100,
            hunger: 0,
            affection: 50,
            favoriteFood: getRandomFavoriteFood(),
            lastPetTime: 0,
            position: getRandomPosition(creaturePositions),
          };
          set((state) => ({ creatures: [...state.creatures, newCreature] }));
        }
      },
      devIncreaseIslandLevel: () => {
        if (import.meta.env.DEV) {
          set((state) => ({ islandLevel: state.islandLevel + 1 }));
        }
      },
    }),
    {
      name: 'mindplay-meta-storage',
      version: META_STORAGE_VERSION,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState) return persistedState;

        let state = { ...persistedState };

        // Initialize encyclopedia
        if (!state.discoveredCreatures) {
          state.discoveredCreatures = { ...initialEncyclopedia };
        }
        if (!state.encyclopediaRewards) {
          state.encyclopediaRewards = [...initialEncyclopediaRewards];
        }

        // Discover existing creatures
        if (state.creatures && Array.isArray(state.creatures)) {
          const existingCreatures = state.creatures as Creature[];
          existingCreatures.forEach((c: any) => {
            if (c.type) {
              state.discoveredCreatures[c.type] = true;
            }
          });
        }

        if (version < 2) {
          // Migrate v1 to v2
          // Add islandLevel, weather
          state.islandLevel = state.islandLevel || 1;
          state.weather = state.weather || 'sunny';
          // Update creatures
          state.creatures = (state.creatures || []).map((c: any) => {
            let rarity: CreatureRarity = 'common';
            if (c.type === 'aqua' || c.type === 'volt') rarity = 'rare';
            return {
              ...c,
              rarity,
              nickname: getRandomNickname(c.type as CreatureType),
              affection: 50,
              favoriteFood: getRandomFavoriteFood(),
              lastPetTime: 0,
              position: getRandomPosition(),
            };
          });
          // Convert old egg format if needed
          if (Array.isArray(state.eggs)) {
            state.eggs = state.eggs.map((e: any) => ({
              ...e,
              id: e.id || generateId(),
              tier: e.type || 'common',
              position: getRandomPosition(),
              clicksToHatch: EGG_CLICKS_TO_HATCH[e.type || 'common'],
            }));
          }
        }
        return state;
      },
    }
  )
);
