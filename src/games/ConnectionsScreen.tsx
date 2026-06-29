import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Shuffle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';
import { useMetaStore } from '../metaStore';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface Category {
  name: string;
  words: string[];
  difficulty: 'yellow' | 'green' | 'blue' | 'purple';
}

interface Puzzle {
  id: number;
  categories: Category[];
}

const SAMPLE_PUZZLES: Puzzle[] = [
  {
    id: 1,
    categories: [
      { name: 'Types of Shoes', words: ['BOOT', 'LOAFERS', 'SNEAKER', 'SANDAL'], difficulty: 'yellow' },
      { name: 'Things That Spin', words: ['COIN', 'TOP', 'GLOBE', 'RECORD'], difficulty: 'green' },
      { name: 'Palindromes', words: ['KAYAK', 'RACECAR', 'NOON', 'MOM'], difficulty: 'blue' },
      { name: '___ Board', words: ['CHESS', 'DART', 'CUTTING', 'KEY'], difficulty: 'purple' },
    ]
  },
  {
    id: 2,
    categories: [
      { name: 'Kitchen Appliances', words: ['BLENDER', 'TOASTER', 'MIXER', 'KETTLE'], difficulty: 'yellow' },
      { name: 'Things That Are Round', words: ['PIZZA', 'MOON', 'WHEEL', 'ORANGE'], difficulty: 'green' },
      { name: 'Words Before "Face"', words: ['MAKEUP', 'BOOK', 'SPACE', 'CARD'], difficulty: 'blue' },
      { name: 'Types of Coffee', words: ['LATTE', 'MOCHA', 'ESPRESSO', 'AMERICANO'], difficulty: 'purple' },
    ]
  },
  {
    id: 3,
    categories: [
      { name: 'Fruits', words: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE'], difficulty: 'yellow' },
      { name: 'Programming Languages', words: ['PYTHON', 'JAVA', 'RUBY', 'SWIFT'], difficulty: 'green' },
      { name: 'Words with Double Letters', words: ['BALLOON', 'coffee', 'address', 'PEPPER'], difficulty: 'blue' },
      { name: 'Types of Dogs', words: ['BEAGLE', 'PUG', 'BOXER', 'HUSKY'], difficulty: 'purple' },
    ]
  },
  {
    id: 4,
    categories: [
      { name: 'Colors', words: ['RED', 'BLUE', 'GREEN', 'YELLOW'], difficulty: 'yellow' },
      { name: 'Ocean Creatures', words: ['SHARK', 'WHALE', 'OCTOPUS', 'DOLPHIN'], difficulty: 'green' },
      { name: 'Words Ending in -tion', words: ['EDUCATION', 'CELEBRATION', 'IMAGINATION', 'MOTIVATION'], difficulty: 'blue' },
      { name: 'Card Games', words: ['POKER', 'BRIDGE', 'HEARTS', 'SPADES'], difficulty: 'purple' },
    ]
  },
  {
    id: 5,
    categories: [
      { name: 'Weather Phenomena', words: ['TORNADO', 'HURRICANE', 'BLIZZARD', 'TSUNAMI'], difficulty: 'yellow' },
      { name: 'Musical Instruments', words: ['GUITAR', 'PIANO', 'DRUMS', 'VIOLIN'], difficulty: 'green' },
      { name: 'Words with Hidden Animals', words: ['BEAR', 'LION', 'TIGER', 'WOLF'], difficulty: 'blue' },
      { name: 'Planets', words: ['MARS', 'VENUS', 'SATURN', 'JUPITER'], difficulty: 'purple' },
    ]
  }
];

const MAX_MISTAKES = 4;

const DIFFICULTY_COLORS = {
  yellow: {
    bg: 'bg-amber-400',
    text: 'text-amber-900',
    border: 'border-amber-600'
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-900',
    border: 'border-green-700'
  },
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-900',
    border: 'border-blue-700'
  },
  purple: {
    bg: 'bg-purple-600',
    text: 'text-purple-900',
    border: 'border-purple-800'
  }
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function ConnectionsScreen() {
  const theme = useAppStore((state) => state.theme);
  const recordGame = useAppStore((state) => state.recordGame);
  const { addCoins, addFood, updateDailyQuest } = useMetaStore();
  
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(() => 
    SAMPLE_PUZZLES[Math.floor(Math.random() * SAMPLE_PUZZLES.length)]
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [foundCategories, setFoundCategories] = useState<Category[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showOneAway, setShowOneAway] = useState(false);
  const [showMistake, setShowMistake] = useState(false);
  const [words, setWords] = useState<string[]>(() => {
    const allWords = currentPuzzle.categories.flatMap(c => c.words);
    return shuffleArray([...allWords]);
  });

  const startNewGame = useCallback(() => {
    const newPuzzle = SAMPLE_PUZZLES[Math.floor(Math.random() * SAMPLE_PUZZLES.length)];
    setCurrentPuzzle(newPuzzle);
    const allWords = newPuzzle.categories.flatMap(c => c.words);
    setWords(shuffleArray([...allWords]));
    setSelected([]);
    setFoundCategories([]);
    setMistakes(0);
    setGameOver(false);
    setWon(false);
    setShowOneAway(false);
    setShowMistake(false);
  }, []);

  const toggleWord = (word: string) => {
    if (gameOver) return;
    if (foundCategories.some(cat => cat.words.includes(word))) return;

    setSelected(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      } else if (prev.length < 4) {
        return [...prev, word];
      }
      return prev;
    });
  };

  const checkGuess = () => {
    if (selected.length !== 4) return;

    const matchingCategory = currentPuzzle.categories.find(cat => 
      cat.words.every(word => selected.includes(word)) &&
      !foundCategories.some(fc => fc.name === cat.name)
    );

    if (matchingCategory) {
      setFoundCategories(prev => [...prev, matchingCategory]);
      setSelected([]);
      
      const totalFound = foundCategories.length + 1;
      if (totalFound === currentPuzzle.categories.length) {
        setWon(true);
        setGameOver(true);
        recordGame(true, 100 - (mistakes * 15));
        addCoins(40);
        addFood(15);
        updateDailyQuest('playGames', 1);
        updateDailyQuest('earnCoins', 40);
      }
    } else {
      const correctCount = currentPuzzle.categories.reduce((count, cat) => {
        if (foundCategories.some(fc => fc.name === cat.name)) return count;
        const matchCount = selected.filter(w => cat.words.includes(w)).length;
        return Math.max(count, matchCount);
      }, 0);

      if (correctCount === 3) {
        setShowOneAway(true);
        setTimeout(() => setShowOneAway(false), 2000);
      } else {
        setShowMistake(true);
        setTimeout(() => setShowMistake(false), 1000);
      }

      setMistakes(prev => {
        const newMistakes = prev + 1;
        if (newMistakes >= MAX_MISTAKES) {
          setGameOver(true);
          recordGame(false, 10);
          addCoins(20);
          updateDailyQuest('playGames', 1);
          updateDailyQuest('earnCoins', 20);
        }
        return newMistakes;
      });
      setSelected([]);
    }
  };

  const shuffle = () => {
    if (gameOver) return;
    const remainingWords = words.filter(word => 
      !foundCategories.some(cat => cat.words.includes(word))
    );
    const shuffledRemaining = shuffleArray(remainingWords);
    const foundWords = foundCategories.flatMap(c => c.words);
    setWords([...foundWords, ...shuffledRemaining]);
  };

  const deselectAll = () => {
    setSelected([]);
  };

  const getCategoryForWord = (word: string) => 
    currentPuzzle.categories.find(c => c.words.includes(word));

  const getWordBg = (word: string) => {
    const cat = getCategoryForWord(word);
    if (foundCategories.some(c => c.name === cat?.name)) {
      return 'hidden';
    }
    if (selected.includes(word)) {
      return theme === 'light' ? 'bg-gray-300' : 'bg-gray-600';
    }
    return theme === 'light' ? 'bg-white' : 'bg-gray-800';
  };

  const isWordFound = (word: string) => {
    return foundCategories.some(c => c.words.includes(word));
  };

  const remainingWords = words.filter(w => !isWordFound(w));
  const foundWords = foundCategories.flatMap(c => c.words);

  useEffect(() => {
    setWords([...foundWords, ...shuffleArray(remainingWords)]);
  }, [foundCategories.length]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <ArrowLeft className={cn("w-6 h-6", theme === 'light' ? "text-gray-600" : "text-gray-300")} />
        </Link>
        <h1 className={cn("text-xl font-bold", theme === 'light' ? "text-gray-900" : "text-white")}>
          Connections
        </h1>
        <button onClick={startNewGame}>
          <RefreshCw className={cn("w-6 h-6", theme === 'light' ? "text-gray-600" : "text-gray-300")} />
        </button>
      </div>

      <div className="mb-4 text-center">
        <p className={cn("text-sm mb-4", theme === 'light' ? "text-gray-600" : "text-gray-400")}>
          Find groups of 4 items that share a common connection
        </p>
        <div className="flex justify-center gap-3">
          {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
            <motion.div
              key={i}
              initial={showMistake && i === mistakes ? { scale: 1.3, rotate: 10 } : {}}
              animate={showMistake && i === mistakes ? { scale: 1, rotate: 0 } : {}}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg",
                i < mistakes 
                  ? "bg-red-500" 
                  : (theme === 'light' ? "bg-gray-300" : "bg-gray-700")
              )}
            >
              {i < mistakes ? '✕' : '♡'}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showOneAway && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="mb-4 p-4 bg-blue-500 text-white rounded-xl text-center font-bold text-lg shadow-lg"
          >
            One away! One more incorrect guess ends the game.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "mb-6 p-6 rounded-2xl text-center shadow-xl",
              won 
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" 
                : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
            )}
          >
            <h2 className="text-3xl font-bold mb-2">
              {won ? '🎉 Brilliant!' : '😔 Game Over'}
            </h2>
            <p className="mb-4 opacity-90">
              {won 
                ? `You found all connections! Mistakes: ${mistakes}` 
                : 'Here are the connections you missed:'}
            </p>
            
            {!won && (
              <div className="space-y-2 text-left max-w-md mx-auto mb-4">
                {currentPuzzle.categories.map((cat, idx) => {
                  if (foundCategories.some(fc => fc.name === cat.name)) return null;
                  return (
                    <div 
                      key={idx}
                      className={cn("p-3 rounded-lg bg-white/20")}
                    >
                      <div className="font-bold text-sm">{cat.name}</div>
                      <div className="text-xs opacity-80">
                        {cat.words.join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <button
              onClick={startNewGame}
              className={cn(
                "px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-md",
                won ? "bg-white text-green-600 hover:bg-gray-100" : "bg-white text-red-600 hover:bg-gray-100"
              )}
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3 mb-6">
        {foundCategories.map((cat, idx) => {
          const colors = DIFFICULTY_COLORS[cat.difficulty];
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-xl shadow-md",
                colors.bg
              )}
            >
              <div className={cn("font-bold text-lg mb-1", colors.text)}>
                {cat.name}
              </div>
              <div className={cn("text-sm opacity-80", colors.text)}>
                {cat.words.join(', ')}
              </div>
            </motion.div>
          );
        })}

        <div className="grid grid-cols-4 gap-2">
          {words.map((word) => {
            if (isWordFound(word)) {
              return <div key={word} />;
            }
            
            return (
              <motion.button
                key={word}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWord(word)}
                className={cn(
                  "p-3 rounded-lg font-semibold text-sm transition-all min-h-[70px] flex items-center justify-center text-center leading-tight",
                  getWordBg(word),
                  !isWordFound(word) && selected.includes(word) 
                    ? "ring-4 ring-blue-500 shadow-md" 
                    : "hover:shadow-md",
                  theme === 'light' 
                    ? "text-gray-800 hover:bg-gray-100 border-2 border-gray-200" 
                    : "text-gray-200 hover:bg-gray-700 border-2 border-gray-600"
                )}
              >
                {word}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={deselectAll}
          disabled={selected.length === 0}
          className={cn(
            "flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
            selected.length > 0
              ? (theme === 'light' ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-700 text-gray-200 hover:bg-gray-600")
              : (theme === 'light' ? "bg-gray-100 text-gray-400" : "bg-gray-800 text-gray-600")
          )}
        >
          <X className="w-4 h-4" />
          Deselect
        </button>
        
        <button
          onClick={shuffle}
          disabled={gameOver}
          className={cn(
            "flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
            !gameOver
              ? (theme === 'light' ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-700 text-gray-200 hover:bg-gray-600")
              : (theme === 'light' ? "bg-gray-100 text-gray-400" : "bg-gray-800 text-gray-600")
          )}
        >
          <Shuffle className="w-4 h-4" />
          Shuffle
        </button>
        
        <button
          onClick={checkGuess}
          disabled={selected.length !== 4 || gameOver}
          className={cn(
            "flex-1 py-3 rounded-lg font-bold transition-all",
            selected.length === 4 && !gameOver
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:scale-105"
              : (theme === 'light' ? "bg-gray-200 text-gray-400" : "bg-gray-700 text-gray-600")
          )}
        >
          Submit
        </button>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>Difficulty: {foundCategories.length}/{currentPuzzle.categories.length} found</p>
      </div>
    </div>
  );
}
