import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';
import { TARGET_WORDS, VALID_WORDS } from './wordle-words';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export default function WordleScreen() {
  const theme = useAppStore((state) => state.theme);
  const recordGame = useAppStore((state) => state.recordGame);
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [invalidWord, setInvalidWord] = useState(false);

  const startNewGame = useCallback(() => {
    const newWord = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
    setTargetWord(newWord);
    setCurrentGuess('');
    setGuesses([]);
    setGameOver(false);
    setWon(false);
    setShowPlayAgain(false);
    setInvalidWord(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const getLetterState = (letter: string, position: number, guessIndex: number): LetterState => {
    if (guessIndex >= guesses.length) return 'empty';
    const guess = guesses[guessIndex];
    if (!guess[position]) return 'empty';

    if (letter === targetWord[position]) return 'correct';
    if (targetWord.includes(letter)) return 'present';
    return 'absent';
  };

  const handleKeyPress = (key: string) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length === WORD_LENGTH) {
        if (!VALID_WORDS.has(currentGuess)) {
          setInvalidWord(true);
          setTimeout(() => setInvalidWord(false), 1000);
          return;
        }

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        
        if (currentGuess === targetWord) {
          setWon(true);
          setGameOver(true);
          setShowPlayAgain(true);
          recordGame(true, 100 - (newGuesses.length * 10));
        } else if (newGuesses.length === MAX_ATTEMPTS) {
          setGameOver(true);
          setShowPlayAgain(true);
          recordGame(false, 10);
        }
        
        setCurrentGuess('');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE');
      } else if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, gameOver, targetWord]);

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ];

  const getKeyState = (key: string): LetterState => {
    let state: LetterState = 'empty';
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === key) {
          const letterState = getLetterState(key, i, guesses.indexOf(guess));
          if (letterState === 'correct') return 'correct';
          if (letterState === 'present') state = 'present';
          else if (state === 'empty') state = 'absent';
        }
      }
    }
    return state;
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
          <ArrowLeft className={cn("w-6 h-6", theme === 'light' ? "text-gray-600" : "text-gray-300")} />
        </Link>
        <h1 className={cn("text-xl font-bold", theme === 'light' ? "text-gray-900" : "text-white")}>
          Wordle
        </h1>
        <button onClick={startNewGame}>
          <RefreshCw className={cn("w-6 h-6", theme === 'light' ? "text-gray-600" : "text-gray-300")} />
        </button>
      </div>

      <div className="mb-8">
        <div className="grid grid-rows-6 gap-2">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, attemptIndex) => (
            <div key={attemptIndex} className="grid grid-cols-5 gap-2">
              {Array.from({ length: WORD_LENGTH }).map((_, letterIndex) => {
                const guess = guesses[attemptIndex];
                const letter = guess ? guess[letterIndex] : (attemptIndex === guesses.length ? currentGuess[letterIndex] : '');
                const state = guess ? getLetterState(letter, letterIndex, attemptIndex) : 'empty';
                const isFilled = !!letter;

                return (
                  <motion.div
                    key={letterIndex}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: letterIndex * 0.05 }}
                    className={cn(
                      "w-full aspect-square rounded-lg flex items-center justify-center text-2xl font-bold transition-colors",
                      state === 'correct' ? "bg-green-700 text-white" :
                      state === 'present' ? "bg-yellow-600 text-black" :
                      state === 'absent' ? (theme === 'light' ? "bg-gray-800 text-white" : "bg-gray-900 text-white") :
                      isFilled ? (theme === 'light' ? "bg-white border-2 border-gray-300 text-gray-900" : "bg-gray-800 border-2 border-gray-600 text-white") :
                      (theme === 'light' ? "bg-white border-2 border-gray-200" : "bg-gray-800 border-2 border-gray-700")
                    )}
                  >
                    {letter}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {invalidWord && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-center"
        >
          Not in word list!
        </motion.div>
      )}

      {showPlayAgain && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "mb-6 p-6 rounded-2xl text-center",
            won ? (theme === 'light' ? "bg-green-100" : "bg-green-900/30") : (theme === 'light' ? "bg-red-100" : "bg-red-900/30")
          )}
        >
          <h2 className={cn("text-2xl font-bold mb-2", won ? "text-green-700" : "text-red-700")}>
            {won ? "Congratulations! You Won!" : "Game Over"}
          </h2>
          <p className={cn("text-lg mb-4", theme === 'light' ? "text-gray-700" : "text-gray-300")}>
            The word was: <span className="font-bold">{targetWord}</span>
          </p>
          <button
            onClick={startNewGame}
            className={cn(
              "px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105",
              theme === 'light' ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            )}
          >
            Play Again
          </button>
        </motion.div>
      )}

      <div className="space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const state = getKeyState(key);
              const isSpecial = key === 'ENTER' || key === 'BACKSPACE';

              return (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleKeyPress(key)}
                  className={cn(
                    "py-3 rounded-lg font-semibold transition-colors",
                    isSpecial ? "px-3 text-xs" : "w-8 text-sm",
                    state === 'correct' ? "bg-green-700 text-white" :
                    state === 'present' ? "bg-yellow-600 text-black" :
                    state === 'absent' ? (theme === 'light' ? "bg-gray-800 text-white" : "bg-gray-900 text-white") :
                    (theme === 'light' ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-700 text-gray-200 hover:bg-gray-600")
                  )}
                >
                  {key === 'BACKSPACE' ? '←' : key}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
