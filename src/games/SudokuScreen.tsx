import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Pencil, Eraser, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface Puzzle {
  board: number[][];
  solution: number[][];
}

const generateSolvedBoard = (): number[][] => {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  
  const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  };

  const solve = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          for (const num of nums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  solve(board);
  return board;
};

const removeNumbers = (board: number[][], clues: number): number[][] => {
  const puzzle = board.map(row => [...row]);
  let removed = 0;
  const totalToRemove = 81 - clues;
  
  while (removed < totalToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  
  return puzzle;
};

const generatePuzzle = (difficulty: Difficulty): Puzzle => {
  const solution = generateSolvedBoard();
  const clues = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 32 : 26;
  const board = removeNumbers(solution, clues);
  return { board, solution };
};

const SAMPLE_PUZZLES: Puzzle[] = [
  {
    board: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ]
  }
];

type GameState = 'menu' | 'playing';

export default function SudokuScreen() {
  const theme = useAppStore((state) => state.theme);
  const recordGame = useAppStore((state) => state.recordGame);
  
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(SAMPLE_PUZZLES[0]);
  const [board, setBoard] = useState<number[][]>([]);
  const [notes, setNotes] = useState<number[][][]>(() => 
    Array(9).fill(null).map(() => Array(9).fill(null).map(() => []))
  );
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState<{ board: number[][]; notes: number[][][] }[]>([]);
  const [conflicts, setConflicts] = useState<Set<string>>(new Set());

  const startNewGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const puzzle = generatePuzzle(diff);
    setCurrentPuzzle(puzzle);
    setBoard(puzzle.board.map(row => [...row]));
    setInitialBoard(puzzle.board.map(row => [...row]));
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setSelected(null);
    setNotesMode(false);
    setMistakes(0);
    setWon(false);
    setHistory([]);
    setConflicts(new Set());
    setGameState('playing');
  }, []);

  const saveToHistory = useCallback(() => {
    setHistory(prev => [...prev, { 
      board: board.map(row => [...row]), 
      notes: notes.map(r => r.map(c => [...c])) 
    }]);
    if (history.length > 50) {
      setHistory(prev => prev.slice(-50));
    }
  }, [board, notes, history.length]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setBoard(lastState.board);
    setNotes(lastState.notes);
    setHistory(prev => prev.slice(0, -1));
    checkConflicts(lastState.board);
  }, [history]);

  const checkConflicts = useCallback((currentBoard: number[][]) => {
    const newConflicts = new Set<string>();
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const num = currentBoard[i][j];
        if (num === 0) continue;
        
        for (let k = 0; k < 9; k++) {
          if (k !== j && currentBoard[i][k] === num) {
            newConflicts.add(`${i}-${j}`);
          }
          if (k !== i && currentBoard[k][j] === num) {
            newConflicts.add(`${i}-${j}`);
          }
        }
        
        const boxRow = Math.floor(i / 3) * 3;
        const boxCol = Math.floor(j / 3) * 3;
        for (let bi = 0; bi < 3; bi++) {
          for (let bj = 0; bj < 3; bj++) {
            const ni = boxRow + bi;
            const nj = boxCol + bj;
            if (ni !== i || nj !== j) {
              if (currentBoard[ni][nj] === num) {
                newConflicts.add(`${i}-${j}`);
                newConflicts.add(`${ni}-${nj}`);
              }
            }
          }
        }
      }
    }
    
    setConflicts(newConflicts);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (won) return;
    if (initialBoard[row][col] !== 0) return;
    setSelected([row, col]);
  };

  const handleNumberClick = (num: number) => {
    if (!selected || won) return;
    const [row, col] = selected;
    if (initialBoard[row][col] !== 0) return;

    saveToHistory();

    if (notesMode) {
      const newNotes = notes.map(r => r.map(c => [...c]));
      const cellNotes = newNotes[row][col];
      const noteIndex = cellNotes.indexOf(num);
      if (noteIndex > -1) {
        newNotes[row][col] = cellNotes.filter(n => n !== num);
      } else {
        newNotes[row][col] = [...cellNotes, num].sort((a, b) => a - b);
      }
      setNotes(newNotes);
    } else {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = num;
      setBoard(newBoard);
      
      if (num !== 0 && num !== currentPuzzle.solution[row][col]) {
        setMistakes(prev => {
          const newMistakes = prev + 1;
          if (newMistakes >= 3) {
            setWon(true);
            recordGame(false, 10);
          }
          return newMistakes;
        });
      }
      
      checkConflicts(newBoard);
      
      const isComplete = newBoard.every((r, ri) => 
        r.every((cell, ci) => cell === currentPuzzle.solution[ri][ci])
      );
      if (isComplete) {
        setWon(true);
        recordGame(true, 100 - (mistakes * 20));
      }
    }
  };

  const handleErase = () => {
    if (!selected || won) return;
    const [row, col] = selected;
    if (initialBoard[row][col] !== 0) return;

    saveToHistory();
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = 0;
    setBoard(newBoard);
    
    const newNotes = notes.map(r => r.map(c => [...c]));
    newNotes[row][col] = [];
    setNotes(newNotes);
    
    checkConflicts(newBoard);
  };

  useEffect(() => {
    if (board.length > 0) {
      checkConflicts(board);
    }
  }, [board, checkConflicts]);

  if (gameState === 'menu') {
    return (
      <div className="max-w-md mx-auto px-4 py-6 min-h-screen flex flex-col items-center justify-center">
        <h1 className={cn("text-4xl font-bold mb-8", theme === 'light' ? "text-gray-900" : "text-white")}>
          Sudoku
        </h1>
        
        <div className="space-y-3 w-full max-w-xs">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
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
              {diff}
            </button>
          ))}
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

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
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
        </div>
        
        <button
          onClick={() => startNewGame(difficulty)}
          className={cn("p-2 rounded-lg", theme === 'light' ? "text-gray-600 hover:bg-gray-200" : "text-gray-300 hover:bg-gray-700")}
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-4 text-center">
        <div className="flex justify-center gap-2 mb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                i < (3 - mistakes) ? "bg-red-500" : "bg-gray-300"
              )}
            >
              {i < (3 - mistakes) ? '♡' : '✕'}
            </div>
          ))}
        </div>
        <span className={cn("text-sm", theme === 'light' ? "text-gray-600" : "text-gray-400")}>
          {3 - mistakes} lives remaining
        </span>
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "mb-6 p-6 rounded-2xl text-center shadow-xl",
              mistakes < 3
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
            )}
          >
            <h2 className="text-3xl font-bold mb-2">
              {mistakes < 3 ? '🎉 Congratulations!' : '😔 Game Over'}
            </h2>
            <p className="mb-4 opacity-90">
              {mistakes < 3 
                ? `You solved it with ${mistakes} mistake${mistakes !== 1 ? 's' : ''}!` 
                : 'You ran out of lives!'}
            </p>
            <button
              onClick={() => startNewGame(difficulty)}
              className="px-8 py-3 bg-white text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-all"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <div className={cn(
          "grid grid-cols-9 gap-0 border-2 rounded-lg overflow-hidden shadow-2xl",
          theme === 'light' ? "border-gray-800" : "border-white"
        )}>
          {board.map((row, ri) =>
            row.map((cell, ci) => {
              const isSelected = selected?.[0] === ri && selected?.[1] === ci;
              const isInitial = initialBoard[ri][ci] !== 0;
              const hasConflict = conflicts.has(`${ri}-${ci}`);
              const isRelated = selected && (
                selected[0] === ri ||
                selected[1] === ci ||
                (Math.floor(selected[0] / 3) === Math.floor(ri / 3) && Math.floor(selected[1] / 3) === Math.floor(ci / 3))
              );
              const isSameNumber = selected && board[ri][ci] !== 0 && board[ri][ci] === board[selected[0]][selected[1]];
              const isRightBorder = (ci + 1) % 3 === 0 && ci < 8;
              const isBottomBorder = (ri + 1) % 3 === 0 && ri < 8;

              return (
                <button
                  key={`${ri}-${ci}`}
                  onClick={() => handleCellClick(ri, ci)}
                  className={cn(
                    "aspect-square flex items-center justify-center text-lg font-semibold transition-all relative",
                    hasConflict && "bg-red-200 dark:bg-red-900",
                    !hasConflict && isSelected && "bg-blue-200 dark:bg-blue-800",
                    !hasConflict && !isSelected && isRelated && (theme === 'light' ? "bg-blue-50" : "bg-blue-900/30"),
                    !hasConflict && !isSelected && !isRelated && (theme === 'light' ? "bg-white" : "bg-gray-900"),
                    isSameNumber && !isSelected && "bg-blue-100 dark:bg-blue-900",
                    isInitial ? (theme === 'light' ? "text-gray-900 font-bold" : "text-white font-bold") : (theme === 'light' ? "text-blue-600" : "text-blue-400"),
                    "border-t border-l",
                    theme === 'light' ? "border-gray-300" : "border-gray-700",
                    isRightBorder && (theme === 'light' ? "border-r-2 border-r-gray-800" : "border-r-2 border-r-white"),
                    isBottomBorder && (theme === 'light' ? "border-b-2 border-b-gray-800" : "border-b-2 border-b-white")
                  )}
                >
                  {cell !== 0 ? (
                    <span className="relative z-10">{cell}</span>
                  ) : notes[ri][ci].length > 0 ? (
                    <div className="grid grid-cols-3 gap-0.5 text-xs p-0.5">
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <span key={n} className={cn(
                          "w-3 h-3 flex items-center justify-center",
                          notes[ri][ci].includes(n) ? (theme === 'light' ? "text-gray-600" : "text-gray-400") : "text-transparent"
                        )}>
                          {n}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setNotesMode(!notesMode)}
          className={cn(
            "flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
            notesMode
              ? (theme === 'light' ? "bg-blue-500 text-white" : "bg-blue-600 text-white")
              : (theme === 'light' ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-700 text-gray-200 hover:bg-gray-600")
          )}
        >
          <Pencil className="w-5 h-5" />
          Notes
        </button>
        
        <button
          onClick={handleErase}
          disabled={!selected}
          className={cn(
            "flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
            selected
              ? (theme === 'light' ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-700 text-gray-200 hover:bg-gray-600")
              : (theme === 'light' ? "bg-gray-100 text-gray-400" : "bg-gray-800 text-gray-600")
          )}
        >
          <Eraser className="w-5 h-5" />
          Erase
        </button>
        
        <button
          onClick={undo}
          disabled={history.length === 0}
          className={cn(
            "flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all",
            history.length > 0
              ? (theme === 'light' ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-700 text-gray-200 hover:bg-gray-600")
              : (theme === 'light' ? "bg-gray-100 text-gray-400" : "bg-gray-800 text-gray-600")
          )}
        >
          <RotateCcw className="w-5 h-5" />
          Undo
        </button>
      </div>

      <div className="grid grid-cols-9 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className={cn(
              "py-3 rounded-lg font-bold text-lg transition-all hover:scale-105",
              notesMode
                ? (theme === 'light' ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-700 text-gray-200 hover:bg-gray-600")
                : (theme === 'light' ? "bg-white text-gray-900 hover:bg-gray-100 border border-gray-300" : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600")
            )}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
