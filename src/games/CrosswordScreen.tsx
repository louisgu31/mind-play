import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Lightbulb, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';
import { CROSSWORD_PUZZLES, CrosswordPuzzle as PuzzleType } from './crossword-puzzles-full';
import CrosswordGrid from './CrosswordGrid';
import {
  CrosswordState,
  buildCrosswordState,
  getCurrentClue,
  moveToNextCell,
  moveToPrevCell,
  moveDirection,
  determineDirectionFromClick,
  checkWin,
  getFilledCount,
  checkWordComplete,
  checkWordCorrect,
  useHint,
  getWordKey,
  Direction,
  WordInfo,
} from './crosswordEngine';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

function getRandomPuzzle(): PuzzleType {
  const validPuzzles = CROSSWORD_PUZZLES.filter((p) => p.clues.length > 2);
  return validPuzzles[Math.floor(Math.random() * validPuzzles.length)];
}

export default function CrosswordScreen() {
  const theme = useAppStore((state) => state.theme);
  const recordGame = useAppStore((state) => state.recordGame);
  const gridRef = useRef<HTMLDivElement>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType>(() => getRandomPuzzle());
  const [crosswordState, setCrosswordState] = useState<CrosswordState | null>(null);
  const [showClues, setShowClues] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [hintCell, setHintCell] = useState<{ row: number; col: number } | null>(null);

  useEffect(() => {
    const state = buildCrosswordState(currentPuzzle);
    setCrosswordState(state);
    setGameWon(false);
    setShowPlayAgain(false);
    setHintCell(null);
  }, [currentPuzzle]);

  const validateWord = useCallback(
    (state: CrosswordState, wordNum: number, direction: Direction): CrosswordState => {
      const wordKey = getWordKey(direction, wordNum);
      if (state.lockedWords.has(wordKey)) return state;
      if (!checkWordComplete(state, wordKey)) return state;

      const isCorrect = checkWordCorrect(state, wordKey);

      const newLocked = new Set(state.lockedWords);
      const newIncorrect = new Set(state.incorrectWords);

      if (isCorrect) {
        newLocked.add(wordKey);
        newIncorrect.delete(wordKey);
      } else {
        newIncorrect.add(wordKey);
      }

      const newCells = state.cells.map((row) =>
        row.map((cell) => ({
          ...cell,
          isLocked: isCorrect && newLocked.has(wordKey) ? true : cell.isLocked,
        }))
      );

      if (isCorrect) {
        const word = state.words[wordKey];
        if (word) {
          for (const pos of word.cells) {
            newCells[pos.row][pos.col].isLocked = true;
          }
        }
      }

      return {
        ...state,
        cells: newCells,
        lockedWords: newLocked,
        incorrectWords: newIncorrect,
      };
    },
    []
  );

  const handleTypeLetter = useCallback(
    (letter: string) => {
      if (!crosswordState || !crosswordState.activeCell || gameWon) return;
      const { row, col } = crosswordState.activeCell;
      const cell = crosswordState.cells[row][col];

      if (cell.isLocked || cell.isBlack) return;

      const newCells = crosswordState.cells.map((r) => r.map((c) => ({ ...c })));
      newCells[row][col].value = letter.toUpperCase();

      let newState: CrosswordState = {
        ...crosswordState,
        cells: newCells,
      };

      const wordNum =
        crosswordState.activeDirection === 'ACROSS' ? cell.acrossWord : cell.downWord;
      const crossWordNum =
        crosswordState.activeDirection === 'ACROSS' ? cell.downWord : cell.acrossWord;
      const crossDir: Direction = crosswordState.activeDirection === 'ACROSS' ? 'DOWN' : 'ACROSS';

      if (wordNum) {
        newState = validateWord(newState, wordNum, crosswordState.activeDirection);
      }
      if (crossWordNum) {
        newState = validateWord(newState, crossWordNum, crossDir);
      }

      const next = moveToNextCell(newState);
      if (next && (next.row !== row || next.col !== col)) {
        newState = { ...newState, activeCell: next };
      }

      if (checkWin(newState, currentPuzzle)) {
        setGameWon(true);
        setShowPlayAgain(true);
        recordGame(true, 100);
      }

      setCrosswordState(newState);
    },
    [crosswordState, gameWon, validateWord, currentPuzzle, recordGame]
  );

  const handleBackspace = useCallback(() => {
    if (!crosswordState || !crosswordState.activeCell || gameWon) return;
    const { row, col } = crosswordState.activeCell;
    const cell = crosswordState.cells[row][col];

    if (cell.isLocked || cell.isBlack) return;

    let newCells = crosswordState.cells.map((r) => r.map((c) => ({ ...c })));
    let newActive = crosswordState.activeCell;

    const currentHasLetter = newCells[row][col].value !== '';

    if (currentHasLetter) {
      newCells[row][col].value = '';
    } else {
      const prev = moveToPrevCell(crosswordState);
      if (prev && (prev.row !== row || prev.col !== col)) {
        const prevCell = newCells[prev.row][prev.col];
        if (!prevCell.isLocked) {
          newCells[prev.row][prev.col].value = '';
          newActive = prev;
        }
      }
    }

    const wordNum =
      crosswordState.activeDirection === 'ACROSS' ? cell.acrossWord : cell.downWord;
    const newIncorrect = new Set(crosswordState.incorrectWords);
    if (wordNum) {
      const wordKey = getWordKey(crosswordState.activeDirection, wordNum);
      newIncorrect.delete(wordKey);
    }

    let newState: CrosswordState = {
      ...crosswordState,
      cells: newCells,
      activeCell: newActive,
      incorrectWords: newIncorrect,
    };

    setCrosswordState(newState);
  }, [crosswordState, gameWon]);

  const setActiveCell = useCallback((row: number, col: number, direction?: Direction) => {
    setCrosswordState((prev) => {
      if (!prev) return prev;
      if (prev.cells[row][col].isBlack) return prev;
      const newDir = direction || prev.activeDirection;
      return { ...prev, activeCell: { row, col }, activeDirection: newDir };
    });
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!crosswordState) return;
      if (crosswordState.cells[row][col].isBlack) return;

      const isSameCell =
        crosswordState.activeCell?.row === row && crosswordState.activeCell?.col === col;

      if (isSameCell) {
        const newDir = determineDirectionFromClick(crosswordState, row, col);
        setActiveCell(row, col, newDir);
      } else {
        const cell = crosswordState.cells[row][col];
        let newDir: Direction = crosswordState.activeDirection;
        if (crosswordState.activeDirection === 'ACROSS' && !cell.acrossWord) {
          newDir = 'DOWN';
        } else if (crosswordState.activeDirection === 'DOWN' && !cell.downWord) {
          newDir = 'ACROSS';
        }
        setActiveCell(row, col, newDir);
      }

      gridRef.current?.focus();
    },
    [crosswordState, setActiveCell]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!crosswordState || gameWon) return;
      if (!crosswordState.activeCell) return;

      if (/^[A-Za-z]$/.test(e.key)) {
        e.preventDefault();
        handleTypeLetter(e.key);
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = moveDirection(crosswordState, 'up');
        if (next) setActiveCell(next.row, next.col, 'DOWN');
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = moveDirection(crosswordState, 'down');
        if (next) setActiveCell(next.row, next.col, 'DOWN');
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = moveDirection(crosswordState, 'left');
        if (next) setActiveCell(next.row, next.col, 'ACROSS');
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = moveDirection(crosswordState, 'right');
        if (next) setActiveCell(next.row, next.col, 'ACROSS');
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        setCrosswordState((prev) => {
          if (!prev) return prev;
          const cell = prev.activeCell
            ? prev.cells[prev.activeCell.row][prev.activeCell.col]
            : null;
          if (!cell) return prev;
          if (cell.acrossWord && cell.downWord) {
            return {
              ...prev,
              activeDirection: prev.activeDirection === 'ACROSS' ? 'DOWN' : 'ACROSS',
            };
          }
          return prev;
        });
        return;
      }
    },
    [crosswordState, gameWon, handleTypeLetter, handleBackspace, setActiveCell]
  );

  const startNewGame = useCallback(() => {
    const newPuzzle = getRandomPuzzle();
    setCurrentPuzzle(newPuzzle);
  }, []);

  const handleHint = useCallback(() => {
    if (!crosswordState || gameWon) return;
    if (crosswordState.hintsRemaining <= 0) return;

    const result = useHint(crosswordState, currentPuzzle);
    if (!result.used) return;

    let newState = result.newState;

    if (result.row !== null && result.col !== null) {
      const cell = newState.cells[result.row][result.col];
      if (cell.acrossWord) {
        newState = validateWord(newState, cell.acrossWord, 'ACROSS');
      }
      if (cell.downWord) {
        newState = validateWord(newState, cell.downWord, 'DOWN');
      }
    }

    setHintCell({ row: result.row!, col: result.col! });
    setTimeout(() => setHintCell(null), 600);

    if (checkWin(newState, currentPuzzle)) {
      setGameWon(true);
      setShowPlayAgain(true);
      recordGame(true, 100);
    }

    setCrosswordState(newState);
  }, [crosswordState, gameWon, currentPuzzle, validateWord, recordGame]);

  const handleClueClick = useCallback(
    (clue: { number: number; direction: 'across' | 'down' }) => {
      if (!crosswordState) return;
      const wordKey = `${clue.direction}-${clue.number}`;
      const word = crosswordState.words[wordKey];
      if (word) {
        setActiveCell(word.startRow, word.startCol, clue.direction.toUpperCase() as Direction);
      }
      gridRef.current?.focus();
    },
    [crosswordState, setActiveCell]
  );

  const currentClue: WordInfo | null = crosswordState ? getCurrentClue(crosswordState) : null;
  const { count, total } = crosswordState
    ? getFilledCount(crosswordState)
    : { count: 0, total: 0 };

  const acrossClues = currentPuzzle.clues.filter((c) => c.direction === 'across');
  const downClues = currentPuzzle.clues.filter((c) => c.direction === 'down');

  const isLight = theme === 'light';

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: isLight ? '#f8f9fa' : '#1a1a2e' }}
    >
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <ArrowLeft
              className={cn('w-6 h-6', isLight ? 'text-gray-600' : 'text-gray-300')}
            />
          </Link>
          <h1
            className={cn(
              'text-lg md:text-xl font-bold tracking-tight',
              isLight ? 'text-gray-900' : 'text-white'
            )}
          >
            {currentPuzzle.theme}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleHint}
              disabled={!crosswordState || crosswordState.hintsRemaining <= 0}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                !crosswordState || crosswordState.hintsRemaining <= 0
                  ? isLight
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : isLight
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-amber-900/40 text-amber-300 hover:bg-amber-900/60'
              )}
            >
              <Lightbulb className="w-4 h-4" />
              <span>{crosswordState?.hintsRemaining ?? 5}</span>
            </button>
            <button
              onClick={() => setShowClues(!showClues)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isLight ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              )}
            >
              {showClues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={startNewGame}
              className={cn(
                'p-2 rounded-lg transition-colors text-white',
                isLight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div
            className={cn(
              'flex items-center justify-between text-sm mb-2',
              isLight ? 'text-gray-600' : 'text-gray-400'
            )}
          >
            <span>
              {count}/{total} letters
            </span>
            <span className="font-medium">
              {crosswordState?.activeDirection === 'ACROSS' ? 'Across' : 'Down'}
            </span>
          </div>
          {currentClue && (
            <motion.div
              key={`${currentClue.direction}-${currentClue.number}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'p-3 rounded-lg text-sm',
                isLight ? 'bg-white border border-gray-200 text-gray-800' : 'bg-gray-800 border border-gray-700 text-gray-200'
              )}
            >
              <span className="font-bold mr-2">
                {currentClue.number}.
              </span>
              {currentClue.clue}
              <span className="ml-2 text-gray-400">({currentClue.answer.length})</span>
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
              <h2 className="text-2xl font-bold text-green-600 mb-2">Puzzle Complete! 🎉</h2>
              <p className={cn('mb-4', isLight ? 'text-gray-700' : 'text-gray-300')}>
                Great job solving the {currentPuzzle.theme} crossword!
              </p>
              <button
                onClick={startNewGame}
                className={cn(
                  'px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105',
                  'bg-blue-600 hover:bg-blue-700'
                )}
              >
                New Puzzle
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={gridRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="mb-6 outline-none"
          style={{ cursor: 'default' }}
        >
          {crosswordState && (
            <CrosswordGrid
              state={crosswordState}
              hintCell={hintCell}
              onCellClick={handleCellClick}
            />
          )}
        </div>

        {showClues && (
          <div
            className={cn(
              'rounded-xl p-4 md:p-5',
              isLight ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700'
            )}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3
                  className={cn(
                    'font-bold mb-3 text-sm uppercase tracking-wide',
                    isLight ? 'text-gray-500' : 'text-gray-400'
                  )}
                >
                  Across
                </h3>
                <div className="space-y-1">
                  {acrossClues.map((clue) => {
                    const wordKey = `across-${clue.number}`;
                    const isSolved = crosswordState?.lockedWords.has(wordKey);
                    const isActive =
                      currentClue?.direction === 'ACROSS' &&
                      currentClue?.number === clue.number;
                    return (
                      <div
                        key={wordKey}
                        onClick={() => handleClueClick(clue)}
                        className={cn(
                          'p-2 rounded cursor-pointer transition-colors text-sm line-clamp-2',
                          isSolved
                            ? isLight
                              ? 'bg-green-50 text-green-700 line-through opacity-60'
                              : 'bg-green-900/20 text-green-400 line-through opacity-60'
                            : isActive
                            ? isLight
                              ? 'bg-blue-50 text-blue-900'
                              : 'bg-blue-900/30 text-blue-200'
                            : isLight
                            ? 'hover:bg-gray-100 text-gray-700'
                            : 'hover:bg-gray-700 text-gray-300'
                        )}
                      >
                        <span
                          className={cn(
                            'font-semibold mr-2',
                            isLight ? 'text-gray-900' : 'text-white'
                          )}
                        >
                          {clue.number}.
                        </span>
                        {clue.clue}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3
                  className={cn(
                    'font-bold mb-3 text-sm uppercase tracking-wide',
                    isLight ? 'text-gray-500' : 'text-gray-400'
                  )}
                >
                  Down
                </h3>
                <div className="space-y-1">
                  {downClues.map((clue) => {
                    const wordKey = `down-${clue.number}`;
                    const isSolved = crosswordState?.lockedWords.has(wordKey);
                    const isActive =
                      currentClue?.direction === 'DOWN' &&
                      currentClue?.number === clue.number;
                    return (
                      <div
                        key={wordKey}
                        onClick={() => handleClueClick(clue)}
                        className={cn(
                          'p-2 rounded cursor-pointer transition-colors text-sm line-clamp-2',
                          isSolved
                            ? isLight
                              ? 'bg-green-50 text-green-700 line-through opacity-60'
                              : 'bg-green-900/20 text-green-400 line-through opacity-60'
                            : isActive
                            ? isLight
                              ? 'bg-blue-50 text-blue-900'
                              : 'bg-blue-900/30 text-blue-200'
                            : isLight
                            ? 'hover:bg-gray-100 text-gray-700'
                            : 'hover:bg-gray-700 text-gray-300'
                        )}
                      >
                        <span
                          className={cn(
                            'font-semibold mr-2',
                            isLight ? 'text-gray-900' : 'text-white'
                          )}
                        >
                          {clue.number}.
                        </span>
                        {clue.clue}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={cn(
            'mt-4 p-3 rounded-lg text-sm',
            isLight
              ? 'bg-blue-50 text-blue-800 border border-blue-100'
              : 'bg-blue-900/20 text-blue-300 border border-blue-900/30'
          )}
        >
          <p className="font-medium mb-1">How to play</p>
          <p className="text-xs opacity-80">
            Click a cell to select. Type to fill letters. Press Space to toggle Across/Down.
            Use arrow keys to navigate. Words are automatically checked when complete.
          </p>
        </div>
      </div>
    </div>
  );
}
