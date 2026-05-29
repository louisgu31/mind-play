import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';
import { getRandomPuzzle, GRID_SIZE, CrosswordPuzzle } from './crossword-puzzles-full';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface Cell {
  letter: string;
  isBlock: boolean;
  number: number | null;
  acrossClue: number | null;
  downClue: number | null;
}

export default function CrosswordScreen() {
  const theme = useAppStore((state) => state.theme);
  const recordGame = useAppStore((state) => state.recordGame);
  const [currentPuzzle, setCurrentPuzzle] = useState<CrosswordPuzzle>(() => getRandomPuzzle());
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [showClues, setShowClues] = useState(true);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    const puzzle = currentPuzzle;

    for (let r = 0; r < GRID_SIZE; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const char = puzzle.grid[r]?.[c] || ' ';
        const isBlock = char === '#';
        row.push({
          letter: '',
          isBlock,
          number: null,
          acrossClue: null,
          downClue: null
        });
      }
      newGrid.push(row);
    }

    let clueNumber = 1;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newGrid[r][c].isBlock) {
          const acrossStart = (c === 0 || newGrid[r][c - 1].isBlock) && 
                             c < GRID_SIZE - 1 && !newGrid[r][c + 1].isBlock;
          const downStart = (r === 0 || newGrid[r - 1][c].isBlock) && 
                           r < GRID_SIZE - 1 && !newGrid[r + 1][c].isBlock;
          
          if (acrossStart || downStart) {
            newGrid[r][c].number = clueNumber;
            
            if (acrossStart) {
              const clue = puzzle.clues.find(cl => 
                cl.direction === 'across' && cl.row === r && cl.col === c
              );
              if (clue) {
                newGrid[r][c].acrossClue = puzzle.clues.indexOf(clue) + 1;
              }
            }
            
            if (downStart) {
              const clue = puzzle.clues.find(cl => 
                cl.direction === 'down' && cl.row === r && cl.col === c
              );
              if (clue) {
                newGrid[r][c].downClue = puzzle.clues.indexOf(clue) + 1;
              }
            }
            
            clueNumber++;
          }
        }
      }
    }

    setGrid(newGrid);
  }, [currentPuzzle]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const startNewGame = useCallback(() => {
    const newPuzzle = getRandomPuzzle();
    setCurrentPuzzle(newPuzzle);
    setSelected(null);
    setShowClues(true);
    setShowPlayAgain(false);
    setGameWon(false);
  }, []);

  const checkWin = (currentGrid: Cell[][]) => {
    let allCorrect = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!currentGrid[r][c].isBlock) {
          const puzzleLetter = currentPuzzle.grid[r]?.[c] || ' ';
          if (puzzleLetter === '#') continue;
          if (currentGrid[r][c].letter.toUpperCase() !== puzzleLetter.toUpperCase()) {
            allCorrect = false;
            break;
          }
        }
      }
      if (!allCorrect) break;
    }
    
    if (allCorrect) {
      setGameWon(true);
      setShowPlayAgain(true);
      recordGame(true, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selected || gameWon) return;
    const [row, col] = selected;

    if (/^[A-Za-z]$/.test(e.key)) {
      const newGrid = grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].letter = e.key.toUpperCase();
      setGrid(newGrid);
      checkWin(newGrid);

      if (direction === 'across' && col < GRID_SIZE - 1 && !newGrid[row][col + 1].isBlock) {
        setSelected([row, col + 1]);
      } else if (direction === 'down' && row < GRID_SIZE - 1 && !newGrid[row + 1][col].isBlock) {
        setSelected([row + 1, col]);
      }
    } else if (e.key === 'Backspace') {
      const newGrid = grid.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].letter = '';
      setGrid(newGrid);
      if (direction === 'across' && col > 0 && !newGrid[row][col - 1].isBlock) {
        setSelected([row, col - 1]);
      } else if (direction === 'down' && row > 0 && !newGrid[row - 1][col].isBlock) {
        setSelected([row - 1, col]);
      }
    } else if (e.key === ' ') {
      setDirection(direction === 'across' ? 'down' : 'across');
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlock) return;
    
    if (selected && selected[0] === row && selected[1] === col) {
      setDirection(direction === 'across' ? 'down' : 'across');
    } else {
      setSelected([row, col]);
    }
  };

  const getCurrentClue = () => {
    if (!selected) return null;
    const [row, col] = selected;
    const cell = grid[row][col];
    const clueNumber = direction === 'across' ? cell.acrossClue : cell.downClue;
    if (!clueNumber) return null;
    return currentPuzzle.clues[clueNumber - 1];
  };

  const getFilledCount = () => {
    let count = 0;
    let total = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!grid[r][c].isBlock) {
          total++;
          if (grid[r][c].letter) count++;
        }
      }
    }
    return { count, total };
  };

  const { count, total } = getFilledCount();
  const currentClue = getCurrentClue();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <Link to="/">
          <ArrowLeft className={cn("w-6 h-6", theme === 'light' ? "text-gray-600" : "text-gray-300")} />
        </Link>
        <h1 className={cn("text-xl font-bold", theme === 'light' ? "text-gray-900" : "text-white")}>
          {currentPuzzle.theme}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowClues(!showClues)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              theme === 'light' ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-700 hover:bg-gray-600"
            )}
          >
            {showClues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
          <button
            onClick={startNewGame}
            className={cn(
              "p-2 rounded-lg transition-colors",
              theme === 'light' ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-4 text-center">
        <p className={cn("text-sm", theme === 'light' ? "text-gray-600" : "text-gray-300")}>
          {count}/{total} letters filled • {direction === 'across' ? 'Across' : 'Down'}
        </p>
        {currentClue && (
          <motion.div
            key={currentClue.clue}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-2 p-3 rounded-lg text-sm",
              theme === 'light' ? "bg-blue-50 text-blue-900" : "bg-blue-900/30 text-blue-200"
            )}
          >
            <span className="font-bold">{currentClue.answer.length} letters:</span> {currentClue.clue}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showPlayAgain && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-6 rounded-2xl text-center bg-green-100 dark:bg-green-900/30"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-2">Congratulations! 🎉</h2>
            <p className={cn("mb-4", theme === 'light' ? "text-gray-700" : "text-gray-300")}>
              You completed the {currentPuzzle.theme} crossword!
            </p>
            <button
              onClick={startNewGame}
              className={cn(
                "px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105",
                theme === 'light' ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              New Puzzle
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <div 
          className={cn(
            "grid gap-1 mx-auto max-w-md",
            theme === 'light' ? "bg-gray-900" : "bg-gray-100"
          )}
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={cn(
                  "aspect-square flex items-center justify-center text-lg font-bold cursor-pointer relative transition-all",
                  cell.isBlock 
                    ? (theme === 'light' ? "bg-gray-900" : "bg-gray-900") 
                    : (theme === 'light' ? "bg-white" : "bg-gray-100"),
                  selected && selected[0] === rowIndex && selected[1] === colIndex
                    ? "ring-2 ring-blue-500 ring-inset"
                    : "",
                  !cell.isBlock && theme === 'light' ? "border border-gray-300" : "",
                  !cell.isBlock && theme === 'dark' ? "border border-gray-700" : ""
                )}
              >
                {!cell.isBlock && cell.number && (
                  <span className={cn(
                    "absolute top-0.5 left-0.5 text-xs",
                    theme === 'light' ? "text-gray-600" : "text-gray-800"
                  )}>
                    {cell.number}
                  </span>
                )}
                <span className={cn(
                  cell.letter 
                    ? "opacity-100" 
                    : "opacity-0"
                )}>
                  {cell.letter}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {showClues && (
        <div className={cn(
          "rounded-lg p-4",
          theme === 'light' ? "bg-gray-100" : "bg-gray-800"
        )}>
          <h3 className={cn("font-bold mb-3", theme === 'light' ? "text-gray-900" : "text-white")}>
            Clues
          </h3>
          <div className="space-y-2">
            {currentPuzzle.clues.map((clue, idx) => (
              <div 
                key={idx}
                className={cn(
                  "p-2 rounded cursor-pointer transition-colors",
                  currentClueIndex === idx
                    ? (theme === 'light' ? "bg-blue-100" : "bg-blue-900/30")
                    : (theme === 'light' ? "hover:bg-gray-200" : "hover:bg-gray-700")
                )}
                onClick={() => {
                  setCurrentClueIndex(idx);
                  const cell = grid[clue.row]?.[clue.col];
                  if (cell && !cell.isBlock) {
                    setSelected([clue.row, clue.col]);
                    setDirection(clue.direction);
                  }
                }}
              >
                <span className={cn("font-semibold", theme === 'light' ? "text-gray-900" : "text-white")}>
                  {clue.number}{clue.direction === 'down' ? '↓' : '→'} 
                </span>
                <span className={cn("ml-2", theme === 'light' ? "text-gray-700" : "text-gray-300")}>
                  {clue.clue}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={cn(
        "mt-4 p-4 rounded-lg",
        theme === 'light' ? "bg-yellow-50 text-yellow-900" : "bg-yellow-900/30 text-yellow-200"
      )}>
        <p className="text-sm">
          <strong>How to play:</strong> Click a cell to select it. Type letters to fill in answers.
          Press Space to switch between Across/Down. Click clue numbers or clues list to jump to word.
        </p>
      </div>
    </div>
  );
}
