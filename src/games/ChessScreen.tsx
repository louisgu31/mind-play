import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, RefreshCw, Trophy, Users, Bot, Crown, Star, Lock, ChevronRight, Sparkles, Swords, Shield, Award, Zap, Target, ShieldCheck, Eye, Sparkle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';
import { useMetaStore } from '../metaStore';
import {
  createInitialState,
  getLegalMoves,
  applyMove,
  isInCheck,
  getGameStatus,
  getAIMove,
} from './chessEngine';
import type { Move, GameState, AIDifficulty, PieceType } from './chessEngine';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type GameMode = 'menu' | 'journeyMap' | 'pvp' | 'pvc';

type AIPersonality = 
  | 'trainer'      // Makes mistakes, teaches
  | 'aggressive'   // Attacks early, sacrifices
  | 'defender'     // Very solid, hard to break
  | 'tactical'     // Forks, pins, tactics
  | 'positional'   // Controls center, improves pieces
  | 'endgame'      // Excellent endings
  | 'balanced';   // Overall balanced play

interface LevelConfig {
  level: number;
  name: string;
  elo: number;
  difficulty: AIDifficulty;
  depth: number;
  randomness: number;
  blunderRate: number;
  description: string;
  personality: AIPersonality;
  personalityDescription: string;
  tier: 'beginner' | 'intermediate' | 'advanced' | 'elite' | 'boss';
}

const JOURNEY_LEVELS: LevelConfig[] = [
  { level: 1, name: 'Training Bot', elo: 100, difficulty: 'easy', depth: 0, randomness: 0.9, blunderRate: 0.35, description: 'Your first opponent', personality: 'trainer', personalityDescription: 'Makes random mistakes to help you learn', tier: 'beginner' },
  { level: 2, name: 'Curious Player', elo: 180, difficulty: 'easy', depth: 0, randomness: 0.85, blunderRate: 0.3, description: 'Exploring moves', personality: 'trainer', personalityDescription: 'Tries different things, learns from mistakes', tier: 'beginner' },
  { level: 3, name: 'Eager Student', elo: 260, difficulty: 'easy', depth: 0, randomness: 0.8, blunderRate: 0.25, description: 'Basic tactics', personality: 'aggressive', personalityDescription: 'Likes to attack, sometimes overextending', tier: 'beginner' },
  { level: 4, name: 'Methodical Mind', elo: 380, difficulty: 'medium', depth: 1, randomness: 0.6, blunderRate: 0.2, description: 'Learning discipline', personality: 'positional', personalityDescription: 'Focuses on piece placement and center control', tier: 'beginner' },
  { level: 5, name: 'Rising Player', elo: 500, difficulty: 'medium', depth: 1, randomness: 0.5, blunderRate: 0.15, description: 'First milestone!', personality: 'balanced', personalityDescription: 'Developing a balanced playing style', tier: 'beginner' },
  { level: 6, name: 'Sharp Shooter', elo: 650, difficulty: 'medium', depth: 1, randomness: 0.4, blunderRate: 0.12, description: 'Spotting tactics', personality: 'tactical', personalityDescription: 'Looks for forks, pins, and discovered attacks', tier: 'intermediate' },
  { level: 7, name: 'Steady Defender', elo: 750, difficulty: 'medium', depth: 2, randomness: 0.35, blunderRate: 0.1, description: 'Solid as a rock', personality: 'defender', personalityDescription: 'Hard to break, excellent at holding positions', tier: 'intermediate' },
  { level: 8, name: 'Club Starter', elo: 850, difficulty: 'hard', depth: 2, randomness: 0.3, blunderRate: 0.08, description: 'Solid fundamentals', personality: 'positional', personalityDescription: 'Good opening knowledge, solid development', tier: 'intermediate' },
  { level: 9, name: 'Attack Dog', elo: 950, difficulty: 'hard', depth: 2, randomness: 0.25, blunderRate: 0.06, description: 'Aggressive style', personality: 'aggressive', personalityDescription: 'Launches attacks, sacrifices for initiative', tier: 'intermediate' },
  { level: 10, name: 'Tactician', elo: 1100, difficulty: 'hard', depth: 3, randomness: 0.2, blunderRate: 0.04, description: 'Tactical awareness', personality: 'tactical', personalityDescription: 'Sharp calculations, dangerous tactics', tier: 'intermediate' },
  { level: 11, name: 'Position Master', elo: 1200, difficulty: 'hard', depth: 3, randomness: 0.15, blunderRate: 0.03, description: 'Positional play', personality: 'positional', personalityDescription: 'Excellent piece coordination and space', tier: 'advanced' },
  { level: 12, name: 'Fortress Builder', elo: 1300, difficulty: 'ultimate', depth: 3, randomness: 0.12, blunderRate: 0.02, description: 'Impenetrable defense', personality: 'defender', personalityDescription: 'Creates fortress-like positions, patient', tier: 'advanced' },
  { level: 13, name: 'Combiner', elo: 1400, difficulty: 'ultimate', depth: 3, randomness: 0.1, blunderRate: 0.015, description: 'Tactical + positional', personality: 'balanced', personalityDescription: 'Blends tactics with positional play', tier: 'advanced' },
  { level: 14, name: 'Endgame Wizard', elo: 1500, difficulty: 'ultimate', depth: 4, randomness: 0.08, blunderRate: 0.01, description: 'Endgame specialist', personality: 'endgame', personalityDescription: 'Exceptional technique in endings', tier: 'advanced' },
  { level: 15, name: 'Mastermind', elo: 1600, difficulty: 'ultimate', depth: 4, randomness: 0.06, blunderRate: 0.008, description: 'Brilliant strategist', personality: 'tactical', personalityDescription: 'Deep calculation, complex plans', tier: 'advanced' },
  { level: 16, name: 'Grandmaster', elo: 1700, difficulty: 'impossible', depth: 4, randomness: 0.04, blunderRate: 0.004, description: 'Elite level', personality: 'balanced', personalityDescription: 'World-class understanding of the game', tier: 'elite' },
  { level: 17, name: 'Super GM', elo: 1800, difficulty: 'impossible', depth: 4, randomness: 0.03, blunderRate: 0.002, description: 'World class', personality: 'positional', personalityDescription: 'Supreme positional understanding', tier: 'elite' },
  { level: 18, name: 'Champion', elo: 1900, difficulty: 'impossible', depth: 5, randomness: 0.02, blunderRate: 0.001, description: 'Championship level', personality: 'tactical', personalityDescription: 'Brilliant tactician, sharp as a razor', tier: 'elite' },
  { level: 19, name: 'Legend', elo: 1950, difficulty: 'impossible', depth: 5, randomness: 0.01, blunderRate: 0.0005, description: 'Near-perfect play', personality: 'endgame', personalityDescription: 'Perfect endgame technique', tier: 'elite' },
  { level: 20, name: 'The Impossible King', elo: 2000, difficulty: 'impossible', depth: 6, randomness: 0, blunderRate: 0, description: 'The final challenge', personality: 'balanced', personalityDescription: 'The ultimate chess master', tier: 'boss' },
];

const MILESTONES: { level: number; title: string; description: string; icon: any; color: string }[] = [
  { level: 5, title: 'Rising Player', description: 'Completed beginner levels', icon: Sparkles, color: 'from-green-400 to-emerald-600' },
  { level: 10, title: 'Tactician', description: 'Mastered intermediate levels', icon: Swords, color: 'from-blue-400 to-cyan-600' },
  { level: 15, title: 'Mastermind', description: 'Conquered advanced levels', icon: Shield, color: 'from-purple-400 to-pink-600' },
  { level: 20, title: 'Chess Conqueror', description: 'Defeated the final boss!', icon: Crown, color: 'from-yellow-400 to-orange-600' },
];

const TIER_COLORS: Record<string, { bg: string; border: string; text: string; glow: string; ring: string }> = {
  beginner: { bg: 'from-green-400 to-emerald-500', border: 'border-green-500', text: 'text-green-400', glow: 'shadow-green-500/30', ring: 'ring-green-400' },
  intermediate: { bg: 'from-blue-400 to-cyan-500', border: 'border-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/30', ring: 'ring-blue-400' },
  advanced: { bg: 'from-purple-400 to-pink-500', border: 'border-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/30', ring: 'ring-purple-400' },
  elite: { bg: 'from-orange-400 to-red-500', border: 'border-orange-500', text: 'text-orange-400', glow: 'shadow-orange-500/30', ring: 'ring-orange-400' },
  boss: { bg: 'from-yellow-400 via-red-500 to-purple-500', border: 'border-yellow-400', text: 'text-yellow-400', glow: 'shadow-yellow-500/40', ring: 'ring-yellow-400' },
};

const PERSONALITY_ICONS: Record<AIPersonality, any> = {
  trainer: Target,
  aggressive: Zap,
  defender: ShieldCheck,
  tactical: Eye,
  positional: Target,
  endgame: Sparkle,
  balanced: Sparkles,
};

interface LevelProgress {
  completed: boolean;
  stars: number;
  bestResult?: 'win' | 'draw' | 'loss';
  moveCount?: number;
}

interface JourneyProgress {
  levels: Record<number, LevelProgress>;
  currentLevel: number;
  totalStars: number;
  unlockedMilestones: number[];
  playerTitle?: string;
}

const STORAGE_KEY = 'chess_journey_progress';

function loadJourneyProgress(): JourneyProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load journey progress:', e);
  }
  return {
    levels: {},
    currentLevel: 1,
    totalStars: 0,
    unlockedMilestones: [],
  };
}

function saveJourneyProgress(progress: JourneyProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save journey progress:', e);
  }
}

function calculateStars(level: LevelConfig, winner: 'white' | 'black' | null, moveCount: number, playerBlunders: number): number {
  if (winner !== 'white') return 0;

  let stars = 1;

  const maxMoves = level.tier === 'beginner' ? 35 : level.tier === 'intermediate' ? 45 : level.tier === 'advanced' ? 55 : level.tier === 'elite' ? 65 : 80;
  const maxBlunders = level.tier === 'beginner' ? 4 : level.tier === 'intermediate' ? 3 : level.tier === 'advanced' ? 2 : level.tier === 'elite' ? 1 : 0;

  const isQuickWin = moveCount <= maxMoves;
  const fewBlunders = playerBlunders <= maxBlunders;

  if (isQuickWin || fewBlunders) {
    stars = 2;
  }

  if (isQuickWin && fewBlunders) {
    stars = 3;
  }

  return stars;
}

const PIECE_SVGS: Record<PieceType, { white: JSX.Element; black: JSX.Element }> = {
  king: {
    white: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter"/>
          <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" strokeLinecap="butt" strokeLinejoin="miter"/>
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/>
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/>
        </g>
      </svg>
    ),
    black: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="#000" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6" strokeLinejoin="miter"/>
          <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#000" strokeLinecap="butt" strokeLinejoin="miter"/>
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#000"/>
          <path d="M20 8h5" strokeLinejoin="miter"/>
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#fff"/>
        </g>
      </svg>
    ),
  },
  queen: {
    white: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="#fff" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/>
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" strokeLinecap="butt"/>
          <path d="M9 26c0 2 1.5 2 2.5 4 1 1 3 3.5 3 3.5 1.5 1.5 2 2.5 5.5 2.5 3.5 0 2.5-1 5.5-1 3 0 2.5 1 5.5 1 3.5 0 4-1 5.5-2.5 0 0 2-2.5 3-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt"/>
          <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/>
        </g>
      </svg>
    ),
    black: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="#000" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <g fill="#000" strokeLinecap="butt">
            <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/>
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z"/>
            <path d="M9 26c0 2 1.5 2 2.5 4 1 1 3 3.5 3 3.5 1.5 1.5 2 2.5 5.5 2.5 3.5 0 2.5-1 5.5-1 3 0 2.5 1 5.5 1 3.5 0 4-1 5.5-2.5 0 0 2-2.5 3-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/>
          </g>
          <path d="M11.5 30c3.5-1 18.5-1 22 0m-21 3.5c6-1 15-1 21 0" stroke="#fff"/>
          <path d="M11 38.5a35 35 1 0 0 23 0" fill="none" stroke-linecap="butt"/>
          <path d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0" fill="none" stroke="#fff"/>
        </g>
      </svg>
    ),
  },
  rook: {
    white: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="#fff" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z" strokeLinecap="butt"/>
          <path d="M14 29.5v-13h17v13H14z" strokeLinecap="butt" strokeLinejoin="miter"/>
          <path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" strokeLinecap="butt"/>
          <path d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23" fill="none" stroke="#fff" strokeWidth="1" strokeLinejoin="miter"/>
        </g>
      </svg>
    ),
    black: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="#000" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z" strokeLinecap="butt"/>
          <path d="M14 29.5v-13h17v13H14z" strokeLinecap="butt" strokeLinejoin="miter"/>
          <path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" strokeLinecap="butt"/>
          <path d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23" fill="none" stroke="#fff" strokeWidth="1" strokeLinejoin="miter"/>
        </g>
      </svg>
    ),
  },
  bishop: {
    white: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <g fill="#fff" strokeLinecap="butt">
            <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
            <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
          </g>
          <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" strokeLinejoin="miter"/>
        </g>
      </svg>
    ),
    black: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <g fill="#000" strokeLinecap="butt">
            <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/>
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
            <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
          </g>
          <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#fff" strokeLinejoin="miter"/>
        </g>
      </svg>
    ),
  },
  knight: {
    white: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/>
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/>
          <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#000"/>
        </g>
      </svg>
    ),
    black: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#000"/>
          <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#000"/>
          <path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#fff" stroke="#fff"/>
        </g>
      </svg>
    ),
  },
  pawn: {
    white: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    black: (
      <svg viewBox="0 0 45 45" className="w-10 h-10">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#000" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

export default function ChessScreen() {
  const theme = useAppStore((state) => state.theme);
  const recordGame = useAppStore((state) => state.recordGame);
  const { addCoins, addCreatureXpToAll, updateDailyQuest } = useMetaStore();

  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [promotionMove, setPromotionMove] = useState<Move | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState<{ status: 'checkmate' | 'stalemate', winner?: 'white' | 'black' } | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [journeyProgress, setJourneyProgress] = useState<JourneyProgress>(loadJourneyProgress());
  const [moveCount, setMoveCount] = useState(0);
  const [playerBlunders, setPlayerBlunders] = useState(0);
  const [showMilestone, setShowMilestone] = useState<typeof MILESTONES[0] | null>(null);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const levelConfig = currentLevel ? JOURNEY_LEVELS.find(l => l.level === currentLevel) : null;

  const isLevelUnlocked = useCallback((level: number): boolean => {
    if (level === 1) return true;
    return !!journeyProgress.levels[level - 1]?.completed;
  }, [journeyProgress.levels]);

  const getLevelProgress = useCallback((level: number): LevelProgress => {
    return journeyProgress.levels[level] || { completed: false, stars: 0 };
  }, [journeyProgress.levels]);

  const startNewGame = useCallback((mode: GameMode, level?: number) => {
    const initial = createInitialState();
    if (level) {
      const lvl = JOURNEY_LEVELS.find(l => l.level === level);
      if (lvl) {
        initial.aiDifficulty = lvl.difficulty;
      }
    }
    setGameState(initial);
    setSelected(null);
    setLegalMoves([]);
    setPromotionMove(null);
    setGameEnded(false);
    setGameResult(null);
    setAiThinking(false);
    setMoveCount(0);
    setPlayerBlunders(0);
    setGameMode(mode);
    if (level !== undefined) {
      setCurrentLevel(level);
    }
  }, []);

  const checkGameEnd = useCallback((state: GameState) => {
    const status = getGameStatus(state);
    if (status.status !== 'playing') {
      setGameEnded(true);
      if (status.status === 'checkmate') {
        setGameResult({ status: status.status, winner: status.winner });
        recordGame(true, 100);
        addCoins(60);
        addCreatureXpToAll(15);
        updateDailyQuest('playGames', 1);
        updateDailyQuest('earnCoins', 60);

        if (gameMode === 'pvc' && currentLevel && levelConfig && status.winner === 'white') {
          const stars = calculateStars(levelConfig, status.winner, moveCount, playerBlunders);
          const newProgress = { ...journeyProgress };
          const existingProgress = newProgress.levels[currentLevel] || { completed: false, stars: 0 };
          const newStars = Math.max(existingProgress.stars, stars);
          const starDiff = newStars - existingProgress.stars;

          newProgress.levels[currentLevel] = {
            completed: true,
            stars: newStars,
            bestResult: 'win',
            moveCount,
          };

          if (starDiff > 0) {
            newProgress.totalStars += starDiff;
          }

          const nextLevel = currentLevel + 1;
          if (nextLevel <= 20 && nextLevel > newProgress.currentLevel) {
            newProgress.currentLevel = nextLevel;
          }

          for (const milestone of MILESTONES) {
            if (currentLevel >= milestone.level && !newProgress.unlockedMilestones.includes(milestone.level)) {
              newProgress.unlockedMilestones.push(milestone.level);
              newProgress.playerTitle = milestone.title;
              setTimeout(() => setShowMilestone(milestone), 1500);
            }
          }

          setJourneyProgress(newProgress);
          saveJourneyProgress(newProgress);
        }
      } else {
        setGameResult({ status: status.status });
        addCoins(30);
        updateDailyQuest('playGames', 1);
        updateDailyQuest('earnCoins', 30);
      }
    }
  }, [recordGame, addCoins, addCreatureXpToAll, updateDailyQuest, gameMode, currentLevel, levelConfig, moveCount, playerBlunders, journeyProgress]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (gameEnded || aiThinking) return;
    if (gameMode === 'pvc' && gameState.currentPlayer === 'black') return;

    if (selected) {
      const move = legalMoves.find(m => m.to[0] === row && m.to[1] === col);
      if (move) {
        const piece = move.piece;
        const isPawnPromotion = piece.type === 'pawn' && (row === 0 || row === 7);

        if (isPawnPromotion) {
          setPromotionMove(move);
        } else {
          const newState = applyMove(gameState, move);
          setGameState(newState);
          setSelected(null);
          setLegalMoves([]);
          if (gameState.currentPlayer === 'white') {
            setMoveCount(m => m + 1);
          }
          checkGameEnd(newState);
        }
      } else {
        const piece = gameState.board[row][col];
        if (piece && piece.color === gameState.currentPlayer) {
          setSelected([row, col]);
          setLegalMoves(getLegalMoves(gameState, row, col));
        } else {
          setSelected(null);
          setLegalMoves([]);
        }
      }
    } else {
      const piece = gameState.board[row][col];
      if (piece && piece.color === gameState.currentPlayer) {
        setSelected([row, col]);
        setLegalMoves(getLegalMoves(gameState, row, col));
      }
    }
  }, [gameEnded, aiThinking, gameMode, gameState, selected, legalMoves, checkGameEnd]);

  const handlePromotion = useCallback((pieceType: PieceType) => {
    if (!promotionMove) return;
    const newState = applyMove(gameState, { ...promotionMove, promotion: pieceType });
    setGameState(newState);
    setPromotionMove(null);
    if (gameState.currentPlayer === 'white') {
      setMoveCount(m => m + 1);
    }
    checkGameEnd(newState);
  }, [promotionMove, gameState, checkGameEnd]);

  useEffect(() => {
    if (gameMode === 'pvc' && gameState.currentPlayer === 'black' && !gameEnded && !aiThinking) {
      setAiThinking(true);
      
      // Use requestIdleCallback or setTimeout to not block UI
      const computeAI = () => {
        try {
          const difficulty = gameState.aiDifficulty || 'easy';
          console.log('AI computing move with difficulty:', difficulty);
          
          const aiMove = getAIMove(gameState, difficulty);
          console.log('AI move found:', aiMove);
          
          const newState = applyMove(gameState, aiMove);
          setGameState(newState);
          setAiThinking(false);
          checkGameEnd(newState);
        } catch (error) {
          console.error('AI move error:', error);
          setAiThinking(false);
          
          // Fallback: try to get any legal move
          try {
            const moves = getLegalMoves(gameState, 0, 0);
            if (moves.length > 0) {
              const randomMove = moves[Math.floor(Math.random() * moves.length)];
              const newState = applyMove(gameState, randomMove);
              setGameState(newState);
              checkGameEnd(newState);
            }
          } catch (e) {
            console.error('Fallback also failed:', e);
          }
        }
      };
      
      // Schedule AI computation with delay to not block UI
      aiTimeoutRef.current = setTimeout(computeAI, 500);
    }
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, [gameMode, gameState, gameEnded, aiThinking, checkGameEnd]);

  const inCheck = gameState && isInCheck(gameState, gameState.currentPlayer);

  // Menu Screen
  if (gameMode === 'menu') {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={cn("text-3xl font-bold mb-2", theme === 'light' ? "text-gray-900" : "text-white")}>
            Chess
          </h1>
          <p className={cn("text-sm", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
            Play against AI or a friend
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => startNewGame('pvp')}
              className={cn(
                "w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105",
                theme === 'light'
                  ? "bg-white shadow-md hover:shadow-lg text-gray-900"
                  : "bg-gray-800 shadow-lg hover:shadow-xl text-white"
              )}
            >
              <Users className="w-6 h-6" />
              Player vs Player
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setGameMode('journeyMap')}
              className={cn(
                "w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl",
              )}
            >
              <Trophy className="w-6 h-6" />
              Chess Journey
            </button>
          </motion.div>

          {journeyProgress.playerTitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "mt-6 px-6 py-4 rounded-2xl border-2 border-yellow-500/50",
                theme === 'light'
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50"
                  : "bg-gradient-to-r from-yellow-900/20 to-orange-900/20"
              )}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <p className={cn("font-bold", theme === 'light' ? "text-yellow-800" : "text-yellow-400")}>
                  {journeyProgress.playerTitle}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <p className={cn("text-sm", theme === 'light' ? "text-yellow-700" : "text-yellow-500")}>
                  {journeyProgress.totalStars} / 60 stars earned
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Link to="/games">
              <button className={cn(
                "w-full px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105",
                theme === 'light'
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              )}>
                <ArrowLeft className="w-5 h-5" />
                Back to Games
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Journey Map Screen
  if (gameMode === 'journeyMap') {
    const completedLevels = Object.values(journeyProgress.levels).filter(l => l.completed).length;
    const completedPercentage = Math.round((completedLevels / 20) * 100);

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <button
            onClick={() => setGameMode('menu')}
            className={cn(
              "p-2 rounded-xl transition-all hover:scale-105",
              theme === 'light'
                ? "text-gray-600 hover:bg-gray-100"
                : "text-gray-300 hover:bg-gray-700"
            )}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="text-center flex-1">
            <h1 className={cn("text-2xl font-bold flex items-center gap-2 justify-center", theme === 'light' ? "text-gray-900" : "text-white")}>
              <Trophy className="w-6 h-6 text-yellow-500" />
              Chess Journey
            </h1>
            <p className={cn("text-sm mt-1", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
              {completedLevels} of 20 levels completed ({completedPercentage}%)
            </p>
          </div>

          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full",
            theme === 'light'
              ? "bg-yellow-50 border-2 border-yellow-200"
              : "bg-yellow-900/30 border-2 border-yellow-700"
          )}>
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className={cn("text-sm font-bold", theme === 'light' ? "text-yellow-700" : "text-yellow-400")}>
              {journeyProgress.totalStars}
            </span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "mb-8 p-4 rounded-2xl",
            theme === 'light' ? "bg-white shadow-md" : "bg-gray-800 shadow-lg"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={cn("text-sm font-semibold", theme === 'light' ? "text-gray-700" : "text-gray-300")}>
              Overall Progress
            </span>
            <span className={cn("text-sm font-bold", theme === 'light' ? "text-gray-900" : "text-white")}>
              {completedPercentage}%
            </span>
          </div>
          <div className={cn("w-full h-3 rounded-full overflow-hidden", theme === 'light' ? "bg-gray-200" : "bg-gray-700")}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completedPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />
          </div>
          {journeyProgress.playerTitle && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <p className={cn("text-sm font-bold text-yellow-600 dark:text-yellow-400")}>
                {journeyProgress.playerTitle}
              </p>
            </div>
          )}
        </motion.div>

        {/* Level Grid */}
        <div className="space-y-3">
          {JOURNEY_LEVELS.map((level, index) => {
            const unlocked = isLevelUnlocked(level.level);
            const progress = getLevelProgress(level.level);
            const colors = TIER_COLORS[level.tier];
            const isCurrent = level.level === journeyProgress.currentLevel && !progress.completed;
            const PersonalityIcon = PERSONALITY_ICONS[level.personality];

            return (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <button
                  onClick={() => unlocked && startNewGame('pvc', level.level)}
                  disabled={!unlocked}
                  className={cn(
                    "w-full p-4 rounded-2xl transition-all relative overflow-hidden group",
                    unlocked
                      ? theme === 'light'
                        ? "bg-white shadow-md hover:shadow-xl cursor-pointer"
                        : "bg-gray-800 shadow-lg hover:shadow-xl cursor-pointer"
                      : theme === 'light'
                        ? "bg-gray-100 cursor-not-allowed opacity-60"
                        : "bg-gray-700/50 cursor-not-allowed opacity-60",
                    isCurrent && `ring-4 ring-yellow-400 ring-offset-2 ${theme === 'light' ? 'ring-offset-white' : 'ring-offset-gray-900'}`,
                    progress.completed && `border-2 ${colors.border}`
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Level Number / Icon */}
                    <div className={cn(
                      "w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl relative flex-shrink-0",
                      unlocked ? `bg-gradient-to-br ${colors.bg} text-white shadow-lg ${colors.glow}` : "bg-gray-300 text-gray-500",
                      level.tier === 'boss' && unlocked && "animate-pulse"
                    )}>
                      {unlocked ? (
                        level.tier === 'boss' ? (
                          <Crown className="w-8 h-8" />
                        ) : (
                          <span>{level.level}</span>
                        )
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                      {progress.completed && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Level Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          "font-bold text-lg",
                          unlocked
                            ? theme === 'light' ? "text-gray-900" : "text-white"
                            : theme === 'light' ? "text-gray-500" : "text-gray-400"
                        )}>
                          {level.name}
                        </h3>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-semibold",
                          unlocked ? `bg-gradient-to-r ${colors.bg} text-white` : "bg-gray-300 text-gray-600"
                        )}>
                          {level.elo} ELO
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <PersonalityIcon className={cn("w-4 h-4", colors.text)} />
                        <p className={cn(
                          unlocked
                            ? theme === 'light' ? "text-gray-600" : "text-gray-400"
                            : theme === 'light' ? "text-gray-400" : "text-gray-500"
                        )}>
                          {level.personalityDescription}
                        </p>
                      </div>

                      <p className={cn(
                        "text-xs",
                        unlocked
                          ? theme === 'light' ? "text-gray-500" : "text-gray-400"
                          : theme === 'light' ? "text-gray-400" : "text-gray-500"
                      )}>
                        {level.description}
                      </p>
                    </div>

                    {/* Stars */}
                    {progress.completed && (
                      <div className="flex gap-1 flex-shrink-0">
                        {[1, 2, 3].map(s => (
                          <Star
                            key={s}
                            className={cn(
                              "w-5 h-5 transition-all",
                              s <= progress.stars
                                ? "text-yellow-500 fill-yellow-500"
                                : theme === 'light' ? "text-gray-300" : "text-gray-600"
                            )}
                          />
                        ))}
                      </div>
                    )}

                    {/* Arrow for unlocked levels */}
                    {unlocked && !progress.completed && (
                      <ChevronRight className={cn(
                        "w-6 h-6 flex-shrink-0 transition-transform group-hover:translate-x-1",
                        theme === 'light' ? "text-gray-400" : "text-gray-500"
                      )} />
                    )}
                  </div>

                  {/* Tier indicator line */}
                  {unlocked && (
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b",
                      colors.bg
                    )} />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h2 className={cn(
            "text-lg font-bold mb-4 flex items-center gap-2",
            theme === 'light' ? "text-gray-900" : "text-white"
          )}>
            <Award className="w-5 h-5 text-yellow-500" />
            Milestones
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {MILESTONES.map(milestone => {
              const unlocked = journeyProgress.unlockedMilestones.includes(milestone.level);
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.level}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + milestone.level * 0.05 }}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all",
                    unlocked
                      ? `bg-gradient-to-br ${milestone.color} border-yellow-400 shadow-lg`
                      : theme === 'light'
                        ? "bg-gray-100 border-gray-200 opacity-50"
                        : "bg-gray-800 border-gray-700 opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      unlocked ? "bg-white/20" : "bg-gray-400"
                    )}>
                      <Icon className={cn("w-6 h-6", unlocked ? "text-white" : "text-gray-600")} />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-bold text-sm",
                        unlocked ? "text-white" : theme === 'light' ? "text-gray-500" : "text-gray-400"
                      )}>
                        {milestone.title}
                      </h3>
                      <p className={cn(
                        "text-xs",
                        unlocked ? "text-white/80" : theme === 'light' ? "text-gray-400" : "text-gray-500"
                      )}>
                        Level {milestone.level}
                      </p>
                    </div>
                    {unlocked && (
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  const inJourney = gameMode === 'pvc' && currentLevel !== null;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => inJourney ? setGameMode('journeyMap') : setGameMode('menu')}
          className={cn(
            "p-2 rounded-xl transition-all hover:scale-105",
            theme === 'light'
              ? "text-gray-600 hover:bg-gray-100"
              : "text-gray-300 hover:bg-gray-700"
          )}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className={cn("text-xl font-bold flex items-center gap-2", theme === 'light' ? "text-gray-900" : "text-white")}>
          {gameMode === 'pvp' ? (
            <>
              <Users className="w-5 h-5" />
              Player vs Player
            </>
          ) : inJourney && levelConfig ? (
            <>
              <span className={cn(
                "text-xs px-2 py-1 rounded-lg font-bold bg-gradient-to-r",
                TIER_COLORS[levelConfig.tier].bg,
                "text-white"
              )}>
                Lv.{levelConfig.level}
              </span>
              <Bot className="w-5 h-5" />
              {levelConfig.name}
            </>
          ) : (
            <>
              <Bot className="w-5 h-5" />
              vs AI
            </>
          )}
        </h1>

        <button
          onClick={() => inJourney ? startNewGame('pvc', currentLevel!) : startNewGame(gameMode)}
          className={cn(
            "p-2 rounded-xl transition-all hover:scale-105",
            theme === 'light'
              ? "text-gray-600 hover:bg-gray-100"
              : "text-gray-300 hover:bg-gray-700"
          )}
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      {inJourney && levelConfig && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mb-4 p-3 rounded-xl text-center",
            theme === 'light' ? "bg-gray-50" : "bg-gray-800"
          )}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Bot className={cn("w-4 h-4", TIER_COLORS[levelConfig.tier].text)} />
            <p className={cn("text-sm font-semibold", theme === 'light' ? "text-gray-700" : "text-gray-300")}>
              {levelConfig.personalityDescription}
            </p>
          </div>
          <p className={cn("text-xs", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
            {levelConfig.elo} ELO • {levelConfig.description}
          </p>
        </motion.div>
      )}

      <div className={cn(
        "mb-4 p-4 rounded-xl text-center transition-all",
        inCheck
          ? theme === 'light'
            ? "bg-red-50 border-2 border-red-200"
            : "bg-red-900/20 border-2 border-red-800"
          : theme === 'light'
            ? "bg-gray-50"
            : "bg-gray-800"
      )}>
        <p className={cn(
          "font-bold text-lg",
          inCheck
            ? "text-red-600 dark:text-red-400"
            : theme === 'light' ? "text-gray-900" : "text-white"
        )}>
          {gameEnded
            ? (gameResult?.status === 'checkmate'
                ? (gameResult.winner === 'white' ? 'White Wins!' : 'Black Wins!')
                : 'Stalemate!')
            : aiThinking
              ? 'AI is thinking...'
              : inCheck
                ? `${gameState.currentPlayer === 'white' ? 'White' : 'Black'} is in Check!`
                : `${gameState.currentPlayer === 'white' ? 'White' : 'Black'}'s Turn`
          }
        </p>
        {aiThinking && (
          <div className="flex justify-center gap-1 mt-2">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 rounded-full bg-gray-400"
            />
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 rounded-full bg-gray-400"
            />
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 rounded-full bg-gray-400"
            />
          </div>
        )}
      </div>

      {gameEnded && inJourney && levelConfig && gameResult?.winner === 'white' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-6 rounded-2xl text-center bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Trophy className="w-16 h-16 mx-auto mb-3" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Victory!</h2>
          <p className="text-sm opacity-90 mb-4">You defeated {levelConfig.name}!</p>
          
          <div className="flex justify-center gap-3 mb-4">
            {[1, 2, 3].map(s => {
              const stars = calculateStars(levelConfig, gameResult.winner!, moveCount, playerBlunders);
              return (
                <motion.div
                  key={s}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.4 + s * 0.1 }}
                >
                  <Star
                    className={cn(
                      "w-10 h-10 transition-all",
                      s <= stars
                        ? "text-yellow-300 fill-yellow-300"
                        : "text-white/30"
                    )}
                  />
                </motion.div>
              );
            })}
          </div>

          {currentLevel! < 20 && (
            <p className="text-sm opacity-90 mb-4">
              Next level unlocked!
            </p>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setGameMode('journeyMap')}
              className="px-5 py-2 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Map
            </button>
            {currentLevel! < 20 && (
              <button
                onClick={() => startNewGame('pvc', currentLevel! + 1)}
                className="px-5 py-2 bg-white text-orange-600 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {gameEnded && !inJourney && (
        <div className="mb-4 p-6 rounded-2xl text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            {gameResult?.status === 'checkmate' ? 'Checkmate!' : 'Stalemate!'}
          </h2>
          <p className="mb-4 opacity-90">
            {gameResult?.status === 'checkmate'
              ? `${gameResult.winner === 'white' ? 'White' : 'Black'} wins!`
              : 'Game is a draw!'}
          </p>
          <button
            onClick={() => startNewGame(gameMode)}
            className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            Play Again
          </button>
        </div>
      )}

      {gameEnded && inJourney && gameResult?.winner === 'black' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-6 rounded-2xl text-center bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg"
        >
          <h2 className="text-xl font-bold mb-2">Defeat</h2>
          <p className="text-sm opacity-90 mb-4">Don't give up! Try again!</p>
          <button
            onClick={() => startNewGame('pvc', currentLevel!)}
            className="px-5 py-2 bg-white text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            Try Again
          </button>
        </motion.div>
      )}

      <div className="mb-6">
        <div className="grid grid-cols-8 gap-1">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isSelected = selected && selected[0] === rowIndex && selected[1] === colIndex;
              const isLegalMoveSquare = legalMoves.some(m => m.to[0] === rowIndex && m.to[1] === colIndex);
              // isLastMove: boolean = false; // Unused but kept for future implementation
              const isCheck = inCheck && cell && cell.type === 'king' && cell.color === gameState.currentPlayer;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  className={cn(
                    "aspect-square flex items-center justify-center cursor-pointer transition-all relative",
                    isLight ? "bg-orange-200 dark:bg-orange-300" : "bg-orange-800 dark:bg-orange-900",
                    isSelected && "ring-4 ring-yellow-400 ring-inset",
                    isCheck && "bg-red-500 animate-pulse",
                    !cell && isLegalMoveSquare && "after:absolute after:w-3 after:h-3 after:rounded-full after:bg-green-500/50",
                    cell && isLegalMoveSquare && "after:absolute after:w-5 after:h-5 after:rounded-full after:bg-green-500/50 after:border-2 after:border-white"
                  )}
                >
                  {cell && (
                    <div className="w-full h-full flex items-center justify-center">
                      {PIECE_SVGS[cell.type][cell.color]}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {promotionMove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "p-6 rounded-2xl",
              theme === 'light' ? "bg-white" : "bg-gray-800"
            )}
          >
            <h3 className={cn("text-lg font-bold mb-4 text-center", theme === 'light' ? "text-gray-900" : "text-white")}>
              Promote to:
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {(['queen', 'rook', 'bishop', 'knight'] as PieceType[]).map(type => (
                <button
                  key={type}
                  onClick={() => handlePromotion(type)}
                  className={cn(
                    "p-3 rounded-xl transition-all hover:scale-110",
                    theme === 'light'
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                >
                  <div className="w-12 h-12">
                    {PIECE_SVGS[type].white}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={() => setShowMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
              className={cn(
                "p-8 rounded-3xl text-center max-w-sm w-full",
                theme === 'light' ? "bg-white" : "bg-gray-800"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn(
                "w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br flex items-center justify-center",
                showMilestone.color
              )}>
                <showMilestone.icon className="w-10 h-10 text-white" />
              </div>
              <h2 className={cn(
                "text-2xl font-bold mb-2",
                theme === 'light' ? "text-gray-900" : "text-white"
              )}>
                Milestone Unlocked!
              </h2>
              <h3 className={cn(
                "text-xl font-bold mb-3",
                theme === 'light' ? "text-yellow-600" : "text-yellow-400"
              )}>
                {showMilestone.title}
              </h3>
              <p className={cn(
                "text-sm mb-6",
                theme === 'light' ? "text-gray-600" : "text-gray-400"
              )}>
                {showMilestone.description}
              </p>
              <button
                onClick={() => setShowMilestone(null)}
                className={cn(
                  "px-6 py-3 rounded-xl font-bold transition-all",
                  `bg-gradient-to-r ${showMilestone.color} text-white`
                )}
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
