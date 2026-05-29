import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  xp: number;
  lastPlayedDate: string | null;
  dailyStreak: number;
}

interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'zh';
  sound: boolean;
  stats: GameStats;
  
  // Progression System
  level: number;
  totalXp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'zh') => void;
  toggleSound: () => void;
  recordGame: (won: boolean, xpGained: number) => void;
  addXp: (amount: number) => void;
  resetProgress: () => void;
}

const initialStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  xp: 0,
  lastPlayedDate: null,
  dailyStreak: 0,
};

// Define base XP thresholds
const BASE_XP_PER_LEVEL = 100;

function calculateXpForLevel(level: number): number {
  return Math.floor(BASE_XP_PER_LEVEL * Math.pow(1.5, level - 1));
}

function calculateLevelFromXp(xp: number): { level: number; xpForCurrent: number; xpForNext: number } {
  let level = 1;
  let xpForCurrent = 0;
  let xpForNext = calculateXpForLevel(1);
  
  while (xp >= xpForNext) {
    xpForCurrent = xpForNext;
    level++;
    xpForNext += calculateXpForLevel(level);
  }
  
  return { level, xpForCurrent, xpForNext };
}

// Storage version for migration
const STORAGE_VERSION = 1;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      return {
        theme: 'light',
        language: 'en',
        sound: true,
        stats: initialStats,
        
        level: 1,
        totalXp: 0,
        xpForCurrentLevel: 0,
        xpForNextLevel: calculateXpForLevel(1),
        
        toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        setLanguage: (lang) => set({ language: lang }),
        toggleSound: () => set((state) => ({ sound: !state.sound })),
        
        recordGame: (won: boolean, xpGained: number) => {
          const today = new Date().toISOString().split('T')[0];
          const { stats } = get();
          
          let newStreak = stats.dailyStreak;
          let newLastPlayed = today;
          
          if (stats.lastPlayedDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (stats.lastPlayedDate === today) {
              // Already played today
            } else if (stats.lastPlayedDate === yesterday.toISOString().split('T')[0]) {
              newStreak = stats.dailyStreak + 1;
            } else {
              newStreak = 1;
            }
          } else {
            newStreak = 1;
          }
          
          set((state) => {
            // Recalculate level with new XP
            const newTotalXp = state.totalXp + xpGained;
            const { level: newLevel, xpForCurrent, xpForNext } = calculateLevelFromXp(newTotalXp);
            
            return {
              stats: {
                ...state.stats,
                gamesPlayed: state.stats.gamesPlayed + 1,
                gamesWon: state.stats.gamesWon + (won ? 1 : 0),
                xp: newTotalXp,
                lastPlayedDate: newLastPlayed,
                dailyStreak: newStreak,
              },
              totalXp: newTotalXp,
              level: newLevel,
              xpForCurrentLevel: xpForCurrent,
              xpForNextLevel: xpForNext,
            };
          });
        },
        
        addXp: (amount: number) => {
          set((state) => {
            const newTotalXp = state.totalXp + amount;
            const { level: newLevel, xpForCurrent, xpForNext } = calculateLevelFromXp(newTotalXp);
            
            return {
              totalXp: newTotalXp,
              stats: { ...state.stats, xp: newTotalXp },
              level: newLevel,
              xpForCurrentLevel: xpForCurrent,
              xpForNextLevel: xpForNext,
            };
          });
        },

        resetProgress: () => {
          const { level, xpForCurrent, xpForNext } = calculateLevelFromXp(0);
          set({
            totalXp: 0,
            level,
            xpForCurrentLevel: xpForCurrent,
            xpForNextLevel: xpForNext,
            stats: initialStats,
          });
        },
      };
    },
    {
      name: 'mindplay-storage',
      version: STORAGE_VERSION,
      migrate: (persistedState: any, _version: number) => {
        // Clean up deprecated house-related keys if they exist
        if (persistedState && typeof persistedState === 'object') {
          const keysToRemove = ['house', 'houseStats', 'houseProgress', 'houseData'];
          keysToRemove.forEach(key => {
            if (key in persistedState) {
              delete persistedState[key];
            }
          });
        }
        return persistedState as any;
      },
      // Ensure state is properly rehydrated with calculated values
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recalculate level from saved XP to ensure consistency
          const { level, xpForCurrent, xpForNext } = calculateLevelFromXp(state.totalXp);
          state.level = level;
          state.xpForCurrentLevel = xpForCurrent;
          state.xpForNextLevel = xpForNext;
        }
      },
    }
  )
);
