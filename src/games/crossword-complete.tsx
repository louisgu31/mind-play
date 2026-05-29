import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Eye, EyeOff, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
  answer: string;
  clue: string;
}

interface CrosswordPuzzle {
  id: number;
  theme: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  grid: string[][];
  clues: CrosswordClue[];
}

const GRID_SIZE = 9;

export const THEMED_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 1,
    theme: "Technology & Computing",
    difficulty: "Medium",
    grid: [
      ['#', '#', '#', 'C', 'O', 'D', 'E', 'R', '#', '#', '#'],
      ['#', '#', '#', 'A', '#', 'Y', '#', 'O', '#', '#', '#'],
      ['#', '#', '#', 'P', 'A', 'Y', 'L', 'O', 'A', 'D', '#'],
      ['#', '#', '#', 'H', '#', '#', 'L', '#', 'S', '#', '#'],
      ['#', '#', '#', 'I', 'N', 'T', 'E', 'R', 'N', 'E', 'T'],
      ['#', '#', '#', 'N', '#', 'E', '#', '#', 'E', '#', '#'],
      ['#', 'W', 'E', 'B', 'S', 'E', 'R', 'V', 'E', 'R', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', 'D', 'A', 'T', 'A', 'B', 'A', 'S', 'E'],
    ],
    clues: [
      { number: 1, direction: 'down', row: 0, col: 3, answer: 'CAP', clue: 'To surpass or outdo someone (3)' },
      { number: 2, direction: 'down', row: 4, col: 0, answer: 'JAVA', clue: 'Programming language named after coffee (4)' },
      { number: 3, direction: 'down', row: 0, col: 6, answer: 'CYBER', clue: 'Prefix meaning related to computers (5)' },
      { number: 4, direction: 'down', row: 6, col: 1, answer: 'WEB', clue: 'World Wide ___ or spider home (3)' },
      { number: 5, direction: 'down', row: 8, col: 3, answer: 'DATABASE', clue: 'Organized collection of digital information (8)' },
      { number: 1, direction: 'across', row: 0, col: 3, answer: 'CODER', clue: 'Software programmer or developer (5)' },
      { number: 6, direction: 'across', row: 2, col: 3, answer: 'PYLOAD', clue: 'Data transmitted over a network (6)' },
      { number: 7, direction: 'across', row: 4, col: 3, answer: 'INTERNET', clue: 'Global computer network (8)' },
      { number: 8, direction: 'across', row: 6, col: 1, answer: 'WEBSERVER', clue: 'Computer that delivers web pages (9)' },
      { number: 9, direction: 'across', row: 8, col: 3, answer: 'DATABASE', clue: 'System for storing organized data (8)' }
    ]
  },
  {
    id: 2,
    theme: "Sports & Athletics",
    difficulty: "Easy",
    grid: [
      ['#', '#', '#', 'F', 'O', 'O', 'T', '#', '#'],
      ['#', '#', '#', 'A', '#', '#', 'H', '#', '#'],
      ['#', '#', '#', 'L', 'U', 'N', 'A', 'R', '#'],
      ['#', '#', '#', 'L', '#', '#', 'T', '#', '#'],
      ['#', '#', 'B', 'A', 'S', 'K', 'E', 'T', 'B'],
      ['#', '#', '#', '#', '#', '#', 'L', '#', '#'],
      ['#', '#', 'S', 'O', 'C', 'C', 'E', 'R', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    clues: [
      { number: 1, direction: 'down', row: 0, col: 3, answer: 'FALL', clue: 'Season between summer and winter (4)' },
      { number: 2, direction: 'down', row: 4, col: 2, answer: 'BASKET', clue: 'Container for holding items, or score in basketball (6)' },
      { number: 3, direction: 'down', row: 6, col: 2, answer: 'SCRIM', clue: 'Practice game in sports (6)' },
      { number: 1, direction: 'across', row: 0, col: 3, answer: 'FOOT', clue: 'Body part or unit of measurement (4)' },
      { number: 4, direction: 'across', row: 2, col: 3, answer: 'LUNAR', clue: 'Relating to the moon (5)' },
      { number: 5, direction: 'across', row: 4, col: 2, answer: 'BASKETBALL', clue: 'Popular team sport with hoops (10)' },
      { number: 6, direction: 'across', row: 6, col: 2, answer: 'SOCCER', clue: 'Football or kicks the ball around (6)' }
    ]
  },
  {
    id: 3,
    theme: "Nature & Wildlife",
    difficulty: "Easy",
    grid: [
      ['#', '#', 'T', 'R', 'E', 'E', '#', '#', '#'],
      ['#', '#', 'R', '#', 'A', '#', '#', '#', '#'],
      ['#', '#', 'E', 'A', 'G', 'L', 'E', '#', '#'],
      ['#', '#', 'E', '#', 'L', '#', '#', '#', '#'],
      ['#', '#', '#', '#', 'E', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    clues: [
      { number: 1, direction: 'down', row: 0, col: 2, answer: 'TREE', clue: 'Large plant with a trunk and branches (4)' },
      { number: 2, direction: 'down', row: 2, col: 2, answer: 'EAGLE', clue: 'Large bird of prey (5)' },
      { number: 1, direction: 'across', row: 0, col: 2, answer: 'TREE', clue: 'Plant with bark and leaves (4)' },
      { number: 3, direction: 'across', row: 2, col: 2, answer: 'EAGLE', clue: 'Bald or golden bird (5)' }
    ]
  },
  {
    id: 4,
    theme: "Food & Cooking",
    difficulty: "Medium",
    grid: [
      ['#', '#', '#', 'B', 'R', 'E', 'A', 'D', '#'],
      ['#', '#', '#', 'A', '#', '#', 'T', '#', '#'],
      ['#', '#', '#', 'K', 'E', '#', '#', '#', '#'],
      ['#', '#', '#', 'E', '#', '#', '#', '#', '#'],
      ['#', '#', 'P', 'I', 'Z', 'Z', 'A', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    clues: [
      { number: 1, direction: 'down', row: 0, col: 3, answer: 'BAKE', clue: 'To cook in an oven (4)' },
      { number: 2, direction: 'down', row: 4, col: 2, answer: 'PIZZA', clue: 'Italian dish with cheese and toppings (5)' },
      { number: 1, direction: 'across', row: 0, col: 3, answer: 'BREAD', clue: 'Staple food made from flour and yeast (5)' },
      { number: 3, direction: 'across', row: 4, col: 2, answer: 'PIZZA', clue: 'Round dish with tomato sauce and cheese (5)' }
    ]
  },
  {
    id: 5,
    theme: "Music & Arts",
    difficulty: "Easy",
    grid: [
      ['#', '#', '#', 'M', 'U', 'S', 'I', 'C', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    clues: [
      { number: 1, direction: 'across', row: 0, col: 3, answer: 'MUSIC', clue: 'Sound organized in time (5)' }
    ]
  }
];

export default function CrosswordScreen() {
  const theme = useAppStore((state) => state.theme);
  const recordGame = useAppStore((state) => state.recordGame);
  const [currentPuzzle, setCurrentPuzzle] = useState<CrosswordPuzzle>(() => 
    THEMED_PUZZLES[Math.floor(Math.random() * THEMED_PUZZLES.length)]
  );
  const [grid, setGrid] = useState<any[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [showClues, setShowClues] = useState(true);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [progress, setProgress] = useState({ filled: 0, total: 0 });

  const initializeGrid = useCallback(() => {
    const newGrid: any[][] = [];
    let totalLetters = 0;

    for (let r = 0; r < GRID_SIZE; r++) {
      const row: any[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const char = currentPuzzle.grid[r]?.[c] || ' ';
        const isBlock = char === '#';
        if (!isBlock) totalLetters++;
        
        row.push({
          letter: '',
          isBlock,
          number: null,
          isPartOfAcross: false,
          isPartOfDown: false
        });
      }
      newGrid.push(row);
    }

    let clueNumber = 1;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c].isBlock) continue;
        
        const acrossStart = (c === 0 || newGrid[r][c - 1].isBlock) && 
                          c < GRID_SIZE - 1 && !newGrid[r][c + 1].isBlock;
        const downStart = (r === 0 || newGrid[r - 1][c].isBlock) && 
                        r < GRID_SIZE - 1 && !newGrid[r + 1][c].isBlock;
        
        if (acrossStart || downStart) {
          newGrid[r][c].number = clueNumber;
          clueNumber++;
        }

        if (acrossStart) {
          for (let i = c; i < GRID_SIZE && !newGrid[r][i].isBlock; i++) {
            newGrid[r][i].isPartOfAcross = true;
          }
        }
        
        if (downStart) {
          for (let i = r; i < GRID_SIZE && !newGrid[i][c].isBlock; i++) {
            newGrid[i][c].isPartOfDown = true;
          }
        }
      }
    }

    setGrid(newGrid);
    setProgress({ filled: 0, total: totalLetters });
  }, [currentPuzzle]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const startNewGame = useCallback(() => {
    const newPuzzle = THEMED_PUZZLES[Math.floor(Math.random() * THEMED_PUZZLES.length)];
    setCurrentPuzzle(newPuzzle);
    setSelected(null);
    setShowPlayAgain(false);
    setGameWon(false);
  }, []);

  const checkWin = useCallback((currentGrid: any[][]) => {
    let allCorrect = true;
    let filled = 0;
    let total = 0;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentGrid[r][c].isBlock) continue;
        
        total++;
        const puzzleChar = currentPuzzle.grid[r]?.[c];
        const userChar = currentGrid[r][c].letter;
        
        if (userChar) filled++;
        
        if (!userChar || userChar.toUpperCase() !== puzzleChar?.toUpperCase()) {
          allCorrect = false;
        }
      }
    }

    setProgress({ filled, total });
    
    if (allCorrect && filled === total) {
      setGameWon(true);
      setShowPlayAgain(true);
      recordGame(true, 100);
    }
  }, [currentPuzzle, recordGame]);

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
      
      checkWin(newGrid);
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
    if (!cell?.number) return null;
    
    const clue = currentPuzzle.clues.find(cl => 
      cl.row === row && cl.col === col && cl.direction === direction
    );
    return clue || null;
  };

  const currentClue = getCurrentClue();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <Link to="/games">
          <ArrowLeft className={cn("w-6 h-6", theme === 'light' ? "text-gray-600" : "text-gray-300")} />
        </Link>
        <div className="text-center">
          <h1 className={cn("text-xl font-bold", theme === 'light' ? "text-gray-900" : "text-white")}>
            {currentPuzzle.theme}
          </h1>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            currentPuzzle.difficulty === 'Easy' ? "bg-green-100 text-green-700" :
            currentPuzzle.difficulty === 'Medium' ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          )}>
            {currentPuzzle.difficulty}
          </span>
        </div>
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
        <div className={cn(
          "inline-block px-4 py-2 rounded-full",
          theme === 'light' ? "bg-gray-100 text-gray-700" : "bg-gray-800 text-gray-300"
        )}>
          <span className="font-bold">{progress.filled}</span> / {progress.total} letters • {direction === 'across' ? '→' : '↓'}
        </div>
        {currentClue && (
          <motion.div
            key={currentClue.clue}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-3 p-4 rounded-lg text-left max-w-md mx-auto",
              theme === 'light' ? "bg-blue-50 text-blue-900" : "bg-blue-900/30 text-blue-200"
            )}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">{currentClue.number}{currentClue.direction === 'down' ? '↓' : '→'} ({currentClue.answer.length} letters): </span>
                <span>{currentClue.clue}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showPlayAgain && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 rounded-2xl text-center bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-2">🎉 Congratulations! 🎉</h2>
            <p className="text-lg mb-4 opacity-90">
              You completed the {currentPuzzle.theme} crossword!
            </p>
            <button
              onClick={startNewGame}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-md"
            >
              New Puzzle
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <div 
          className={cn(
            "grid gap-1 mx-auto shadow-xl rounded-lg overflow-hidden",
            theme === 'light' ? "bg-gray-900" : "bg-gray-900"
          )}
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            maxWidth: '500px'
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {grid.map((row: any[], rowIndex: number) =>
            row.map((cell: any, colIndex: number) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={cn(
                  "aspect-square flex items-center justify-center text-lg font-bold cursor-pointer relative transition-all select-none",
                  cell.isBlock 
                    ? "bg-gray-900 cursor-default" 
                    : "bg-white hover:bg-blue-50 dark:bg-gray-100 dark:hover:bg-blue-100",
                  selected && selected[0] === rowIndex && selected[1] === colIndex
                    ? "ring-4 ring-blue-500 ring-inset bg-blue-100 dark:bg-blue-200"
                    : "",
                  cell.letter ? "text-gray-900 dark:text-gray-900" : "text-transparent"
                )}
              >
                {!cell.isBlock && cell.number && (
                  <span className={cn(
                    "absolute top-0.5 left-0.5 text-xs font-normal",
                    theme === 'light' ? "text-gray-600" : "text-gray-700"
                  )}>
                    {cell.number}
                  </span>
                )}
                {cell.letter}
              </div>
            ))
          )}
        </div>
      </div>

      {showClues && (
        <div className={cn(
          "rounded-lg p-4 shadow-md",
          theme === 'light' ? "bg-white" : "bg-gray-800"
        )}>
          <h3 className={cn("font-bold mb-3 flex items-center gap-2", theme === 'light' ? "text-gray-900" : "text-white")}>
            <Lightbulb className="w-5 h-5" />
            Clues
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {currentPuzzle.clues.map((clue) => (
              <div 
                key={`${clue.number}-${clue.direction}`}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-all hover:scale-102",
                  theme === 'light' ? "bg-gray-50 hover:bg-gray-100" : "bg-gray-700 hover:bg-gray-600"
                )}
                onClick={() => {
                  const cell = grid[clue.row]?.[clue.col];
                  if (cell && !cell.isBlock) {
                    setSelected([clue.row, clue.col]);
                    setDirection(clue.direction);
                  }
                }}
              >
                <span className={cn(
                  "font-bold mr-2 inline-block min-w-[60px]",
                  theme === 'light' ? "text-blue-600" : "text-blue-400"
                )}>
                  {clue.number}{clue.direction === 'down' ? ' ↓' : ' →'}
                </span>
                <span className={cn(
                  "text-sm",
                  theme === 'light' ? "text-gray-700" : "text-gray-300"
                )}>
                  {clue.clue}
                </span>
                <span className={cn(
                  "ml-2 text-xs",
                  theme === 'light' ? "text-gray-500" : "text-gray-400"
                )}>
                  ({clue.answer.length})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={cn(
        "mt-6 p-4 rounded-lg border-l-4 border-yellow-500",
        theme === 'light' ? "bg-yellow-50 text-yellow-900" : "bg-yellow-900/20 text-yellow-200"
      )}>
        <h4 className="font-bold mb-2">📝 How to Play:</h4>
        <ul className="text-sm space-y-1">
          <li>• Click any cell to select it</li>
          <li>• Type letters to fill in the crossword</li>
          <li>• Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Space</kbd> to toggle between Across/Down</li>
          <li>• Click clue numbers in the grid or list to jump to that word</li>
          <li>• Fill all letters correctly to win!</li>
        </ul>
      </div>
    </div>
  );
}
