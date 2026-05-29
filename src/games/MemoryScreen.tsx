import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'menu' | 'playing';

interface Card {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🎨', '🎯', '🎲', '🎭', '🎪', '🎢', '🎡', '🎠', '🏆', '🎖️', '🎗️', '🎙️', '🎚️', '🎛️', '🎜️', '🎝️', '🎞️'];

const DIFFICULTY_CONFIG = {
  easy: { cols: 4, rows: 4, pairs: 8 },
  medium: { cols: 6, rows: 4, pairs: 12 },
  hard: { cols: 6, rows: 6, pairs: 18 },
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function createCards(pairs: number): Card[] {
  const selectedEmojis = shuffleArray(EMOJIS).slice(0, pairs);
  const pairsArray = selectedEmojis.flatMap((_, index) => [
    { id: index * 2, iconIndex: index },
    { id: index * 2 + 1, iconIndex: index },
  ]);
  return shuffleArray(pairsArray).map(c => ({ ...c, isFlipped: false, isMatched: false }));
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function MemoryScreen() {
  const theme = useAppStore((state) => state.theme);
  const recordGame = useAppStore((state) => state.recordGame);
  
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | null>(null);
  const hasRecordedRef = useRef(false);

  const config = DIFFICULTY_CONFIG[difficulty];
  const pairsFound = cards.filter(c => c.isMatched).length / 2;

  const startNewGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const { pairs } = DIFFICULTY_CONFIG[diff];
    setCards(createCards(pairs));
    setFlippedCardIds([]);
    setMoves(0);
    setWon(false);
    setIsLocked(false);
    setTime(0);
    setIsTimerRunning(false);
    hasRecordedRef.current = false;
    setGameState('playing');
  }, []);

  useEffect(() => {
    if (isTimerRunning && !won) {
      timerRef.current = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, won]);

  const handleCardClick = useCallback((id: number) => {
    if (won || isLocked) return;
    
    const card = cards.find(c => c.id === id);
    if (!card) return;
    if (card.isFlipped || card.isMatched) return;
    if (flippedCardIds.includes(id)) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    setCards(prev => prev.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    ));

    const newFlipped = [...flippedCardIds, id];
    setFlippedCardIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);

      const [id1, id2] = newFlipped;
      const card1 = cards.find(c => c.id === id1);
      const card2 = cards.find(c => c.id === id2);

      if (card1 && card2 && card1.iconIndex === card2.iconIndex) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === id1 || c.id === id2) 
              ? { ...c, isMatched: true }
              : c
          ));
          setFlippedCardIds([]);
          setIsLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === id1 || c.id === id2) 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCardIds([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  }, [cards, flippedCardIds, won, isLocked, isTimerRunning]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched) && !hasRecordedRef.current) {
      setWon(true);
      setIsTimerRunning(false);
      hasRecordedRef.current = true;
      const xpReward = Math.max(20, 100 - (moves * 3) - (time * 2));
      recordGame(true, xpReward);
    }
  }, [cards, moves, time, recordGame, difficulty]);

  if (gameState === 'menu') {
    return (
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col items-center justify-center">
        <h1 className={cn("text-4xl font-bold mb-8", theme === 'light' ? "text-gray-900" : "text-white")}>
          Memory
        </h1>
        
        <div className="space-y-3 w-full max-w-xs">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => {
            const { cols, rows, pairs } = DIFFICULTY_CONFIG[diff];
            return (
              <button
                key={diff}
                onClick={() => startNewGame(diff)}
                className={cn(
                  "w-full py-4 px-6 rounded-xl font-bold text-lg capitalize transition-all hover:scale-105",
                  diff === 'easy' 
                    ? (theme === 'light' ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-600 hover:bg-green-700 text-white")
                    : diff === 'medium'
                    ? (theme === 'light' ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-yellow-600 hover:bg-yellow-600 text-white")
                    : (theme === 'light' ? "bg-red-500 hover:bg-red-600 text-white" : "bg-red-600 hover:bg-red-700 text-white")
                )}
              >
                <div>{diff}</div>
                <div className="text-sm opacity-80 font-normal">
                  {cols}×{rows} Grid ({pairs} pairs)
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="mt-8">
          <Link to="/games">
            <button className={cn(
              "px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105",
              theme === 'light' 
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            )}>
              <ArrowLeft className="w-5 h-5" />
              Back to Games
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const colClass = config.cols === 4 ? 'grid-cols-4' : 'grid-cols-6';

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setGameState('menu')}
          className={cn("p-2 rounded-lg", theme === 'light' ? "text-gray-600 hover:bg-gray-200" : "text-gray-300 hover:bg-gray-700")}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <h1 className={cn("text-xl font-bold capitalize", theme === 'light' ? "text-gray-900" : "text-white")}>
            {difficulty}
          </h1>
          <span className={cn("text-sm", theme === 'light' ? "text-gray-600" : "text-gray-400")}>
            {config.cols}×{config.rows} • {config.pairs} pairs
          </span>
        </div>
        
        <button
          onClick={() => startNewGame(difficulty)}
          className={cn("p-2 rounded-lg", theme === 'light' ? "text-gray-600 hover:bg-gray-200" : "text-gray-300 hover:bg-gray-700")}
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      <div className="flex justify-center gap-8 mb-6">
        <div className="text-center">
          <div className={cn("text-2xl font-bold flex items-center gap-2", theme === 'light' ? "text-gray-900" : "text-white")}>
            <Zap className="w-5 h-5" />
            {moves}
          </div>
          <div className={cn("text-xs", theme === 'light' ? "text-gray-500" : "text-gray-400")}>Moves</div>
        </div>
        <div className="text-center">
          <div className={cn("text-2xl font-bold flex items-center gap-2", theme === 'light' ? "text-gray-900" : "text-white")}>
            <Clock className="w-5 h-5" />
            {formatTime(time)}
          </div>
          <div className={cn("text-xs", theme === 'light' ? "text-gray-500" : "text-gray-400")}>Time</div>
        </div>
        <div className="text-center">
          <div className={cn("text-2xl font-bold", theme === 'light' ? "text-gray-900" : "text-white")}>
            {pairsFound} / {config.pairs}
          </div>
          <div className={cn("text-xs", theme === 'light' ? "text-gray-500" : "text-gray-400")}>Pairs Found</div>
        </div>
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mb-6 p-6 rounded-2xl text-center shadow-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white"
        >
          <h2 className="text-3xl font-bold mb-2">🎉 Congratulations!</h2>
          <p className="mb-4 opacity-90">
            You matched all pairs!
          </p>
          
          {/* Rewards */}
          <div className="mb-6 max-w-sm mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
            >
              <Zap className="w-8 h-8 mx-auto mb-1" />
              <div className="text-2xl font-bold">+{Math.max(20, 100 - (moves * 3) - (time * 2))}</div>
              <div className="text-sm opacity-80">XP</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs mx-auto">
            <div className="bg-white/15 rounded-lg p-3">
              <div className="text-2xl font-bold">{formatTime(time)}</div>
              <div className="text-sm opacity-80">Time</div>
            </div>
            <div className="bg-white/15 rounded-lg p-3">
              <div className="text-2xl font-bold">{moves}</div>
              <div className="text-sm opacity-80">Moves</div>
            </div>
          </div>
          <button
            onClick={() => startNewGame(difficulty)}
            className="px-8 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-md"
          >
            Play Again
          </button>
        </motion.div>
      )}

      <div className={cn(
        "grid gap-2 mb-6",
        colClass
      )}>
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative cursor-pointer"
            style={{ minHeight: config.cols === 6 ? '60px' : '80px' }}
          >
            <div
              onClick={() => handleCardClick(card.id)}
              className="relative w-full h-full"
              style={{ perspective: '1000px' }}
            >
              <div
                className={cn(
                  "absolute inset-0 transition-transform duration-500 cursor-pointer",
                  (card.isFlipped || card.isMatched) && "rotate-y-180"
                )}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: (card.isFlipped || card.isMatched) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center rounded-xl shadow-md",
                    theme === 'light' ? "bg-blue-500" : "bg-blue-600"
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-3xl">?</span>
                </div>
                
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center rounded-xl shadow-md",
                    card.isMatched 
                      ? "bg-green-500" 
                      : (theme === 'light' ? "bg-white border-2 border-gray-300" : "bg-gray-800 border-2 border-gray-600")
                  )}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="text-3xl">
                    {EMOJIS[card.iconIndex]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className={cn(
          "text-sm",
          theme === 'light' ? "text-gray-600" : "text-gray-400"
        )}>
          {pairsFound} / {config.pairs} pairs matched
        </p>
        {isLocked && (
          <p className={cn(
            "text-xs mt-2 animate-pulse",
            theme === 'light' ? "text-gray-500" : "text-gray-400"
          )}>
            {cards.filter(c => c.isMatched).length === 2 * config.pairs - 2 ? 'Wait...' : 'Checking...'}
          </p>
        )}
      </div>
    </div>
  );
}
