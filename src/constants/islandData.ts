import { Weather } from '../metaStore';

export interface IslandLandmark {
  id: string;
  type: 'house' | 'tree' | 'pond' | 'garden' | 'windmill' | 'floatingIsland';
  unlockLevel: number;
  x: number; // Percentage of island width
  y: number; // Percentage of island height
  emoji: string;
}

export const ISLAND_LANDMARKS: IslandLandmark[] = [
  { id: 'house-1', type: 'house', unlockLevel: 1, x: 20, y: 30, emoji: '🏠' },
  { id: 'tree-1', type: 'tree', unlockLevel: 5, x: 70, y: 25, emoji: '🌳' },
  { id: 'pond-1', type: 'pond', unlockLevel: 10, x: 50, y: 70, emoji: '💧' },
  { id: 'garden-1', type: 'garden', unlockLevel: 15, x: 35, y: 60, emoji: '🌻' },
  { id: 'windmill-1', type: 'windmill', unlockLevel: 20, x: 80, y: 40, emoji: '🌀' },
  { id: 'floatingIsland-1', type: 'floatingIsland', unlockLevel: 30, x: 50, y: 10, emoji: '🏝️' },
];

export interface IslandLevelData {
  level: number;
  backgroundPath: string;
  maxCreatures: number;
}

export const getIslandLevelData = (level: number): IslandLevelData => {
  return {
    level,
    backgroundPath: '', // Using inline gradient instead for reliability
    maxCreatures: Math.min(3 + Math.floor(level / 5), 20),
  };
};

export const getWeatherIcon = (weather: Weather): string => {
  switch (weather) {
    case 'sunny':
      return '☀️';
    case 'cloudy':
      return '☁️';
    case 'rainy':
      return '🌧️';
    case 'snowy':
      return '❄️';
    default:
      return '☀️';
  }
};

export const getWeatherOverlayClass = (weather: Weather): string => {
  switch (weather) {
    case 'sunny':
      return 'bg-gradient-to-t from-yellow-100/20 to-transparent';
    case 'cloudy':
      return 'bg-gradient-to-t from-gray-200/30 to-transparent';
    case 'rainy':
      return 'bg-gradient-to-t from-blue-200/40 to-transparent';
    case 'snowy':
      return 'bg-gradient-to-t from-white/40 to-transparent';
    default:
      return '';
  }
};
