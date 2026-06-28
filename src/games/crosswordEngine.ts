export type Direction = 'ACROSS' | 'DOWN';
export type WordStatus = 'empty' | 'partial' | 'filled' | 'correct' | 'incorrect';

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellData {
  row: number;
  col: number;
  value: string;
  isBlack: boolean;
  number: number | null;
  acrossWord: number | null;
  downWord: number | null;
  isLocked: boolean;
  isHinted: boolean;
}

export interface WordInfo {
  number: number;
  direction: Direction;
  startRow: number;
  startCol: number;
  cells: CellPosition[];
  clue: string;
  answer: string;
}

export interface CrosswordState {
  cells: CellData[][];
  activeCell: CellPosition | null;
  activeDirection: Direction;
  words: Record<string, WordInfo>;
  acrossWords: Record<number, WordInfo>;
  downWords: Record<number, WordInfo>;
  gridSize: number;
  lockedWords: Set<string>;
  incorrectWords: Set<string>;
  hintsRemaining: number;
}

export interface CrosswordPuzzle {
  id: number;
  theme: string;
  difficulty: string;
  grid: string[][];
  clues: {
    number: number;
    direction: 'across' | 'down';
    row: number;
    col: number;
    answer: string;
    clue: string;
  }[];
}

export function buildCrosswordState(puzzle: CrosswordPuzzle): CrosswordState {
  const gridSize = puzzle.grid.length;
  const cells: CellData[][] = [];
  const words: Record<string, WordInfo> = {};
  const acrossWords: Record<number, WordInfo> = {};
  const downWords: Record<number, WordInfo> = {};

  for (let r = 0; r < gridSize; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < gridSize; c++) {
      const char = puzzle.grid[r]?.[c] || '#';
      row.push({
        row: r,
        col: c,
        value: '',
        isBlack: char === '#',
        number: null,
        acrossWord: null,
        downWord: null,
        isLocked: false,
        isHinted: false,
      });
    }
    cells.push(row);
  }

  let clueNumber = 1;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (cells[r][c].isBlack) continue;

      const hasLeftBlack = c === 0 || cells[r][c - 1].isBlack;
      const hasRightWhite = c < gridSize - 1 && !cells[r][c + 1].isBlack;
      const isAcrossStart = hasLeftBlack && hasRightWhite;

      const hasTopBlack = r === 0 || cells[r - 1][c].isBlack;
      const hasBottomWhite = r < gridSize - 1 && !cells[r + 1][c].isBlack;
      const isDownStart = hasTopBlack && hasBottomWhite;

      if (isAcrossStart || isDownStart) {
        cells[r][c].number = clueNumber;

        if (isAcrossStart) {
          const wordCells: CellPosition[] = [];
          let cc = c;
          while (cc < gridSize && !cells[r][cc].isBlack) {
            wordCells.push({ row: r, col: cc });
            cells[r][cc].acrossWord = clueNumber;
            cc++;
          }
          const clue = puzzle.clues.find(
            (cl) => cl.direction === 'across' && cl.row === r && cl.col === c
          );
          const word: WordInfo = {
            number: clueNumber,
            direction: 'ACROSS',
            startRow: r,
            startCol: c,
            cells: wordCells,
            clue: clue?.clue || '',
            answer: clue?.answer || '',
          };
          words[`across-${clueNumber}`] = word;
          acrossWords[clueNumber] = word;
        }

        if (isDownStart) {
          const wordCells: CellPosition[] = [];
          let rr = r;
          while (rr < gridSize && !cells[rr][c].isBlack) {
            wordCells.push({ row: rr, col: c });
            cells[rr][c].downWord = clueNumber;
            rr++;
          }
          const clue = puzzle.clues.find(
            (cl) => cl.direction === 'down' && cl.row === r && cl.col === c
          );
          const word: WordInfo = {
            number: clueNumber,
            direction: 'DOWN',
            startRow: r,
            startCol: c,
            cells: wordCells,
            clue: clue?.clue || '',
            answer: clue?.answer || '',
          };
          words[`down-${clueNumber}`] = word;
          downWords[clueNumber] = word;
        }

        clueNumber++;
      }
    }
  }

  let firstCell: CellPosition | null = null;
  for (let r = 0; r < gridSize && !firstCell; r++) {
    for (let c = 0; c < gridSize && !firstCell; c++) {
      if (!cells[r][c].isBlack) {
        firstCell = { row: r, col: c };
      }
    }
  }

  return {
    cells,
    activeCell: firstCell,
    activeDirection: 'ACROSS',
    words,
    acrossWords,
    downWords,
    gridSize,
    lockedWords: new Set(),
    incorrectWords: new Set(),
    hintsRemaining: 5,
  };
}

export function getActiveWordCells(state: CrosswordState): CellPosition[] {
  if (!state.activeCell) return [];
  const cell = state.cells[state.activeCell.row][state.activeCell.col];
  if (cell.isBlack) return [];

  const wordNum =
    state.activeDirection === 'ACROSS' ? cell.acrossWord : cell.downWord;
  if (!wordNum) return [state.activeCell];

  const key = `${state.activeDirection.toLowerCase()}-${wordNum}`;
  return state.words[key]?.cells || [state.activeCell];
}

export function getCrossWordCells(state: CrosswordState): CellPosition[] {
  if (!state.activeCell) return [];
  const cell = state.cells[state.activeCell.row][state.activeCell.col];
  if (cell.isBlack) return [];

  const crossDir: Direction = state.activeDirection === 'ACROSS' ? 'DOWN' : 'ACROSS';
  const wordNum = crossDir === 'ACROSS' ? cell.acrossWord : cell.downWord;
  if (!wordNum) return [];

  const key = `${crossDir.toLowerCase()}-${wordNum}`;
  return state.words[key]?.cells || [];
}

export function getCurrentClue(state: CrosswordState): WordInfo | null {
  if (!state.activeCell) return null;
  const cell = state.cells[state.activeCell.row][state.activeCell.col];
  if (cell.isBlack) return null;

  const wordNum =
    state.activeDirection === 'ACROSS' ? cell.acrossWord : cell.downWord;
  if (!wordNum) return null;

  const key = `${state.activeDirection.toLowerCase()}-${wordNum}`;
  return state.words[key] || null;
}

export function getWordStatus(state: CrosswordState, wordKey: string): WordStatus {
  const word = state.words[wordKey];
  if (!word) return 'empty';

  if (state.lockedWords.has(wordKey)) return 'correct';

  let filled = 0;
  let correct = 0;
  for (const pos of word.cells) {
    const cell = state.cells[pos.row][pos.col];
    if (cell.value) {
      filled++;
      if (cell.value.toUpperCase() === word.answer[word.cells.indexOf(pos)]?.toUpperCase()) {
        correct++;
      }
    }
  }

  if (filled === 0) return 'empty';
  if (filled < word.cells.length) return 'partial';
  
  if (state.incorrectWords.has(wordKey)) return 'incorrect';
  return 'filled';
}

export function checkWordComplete(state: CrosswordState, wordKey: string): boolean {
  const word = state.words[wordKey];
  if (!word) return false;
  for (const pos of word.cells) {
    if (!state.cells[pos.row][pos.col].value) return false;
  }
  return true;
}

export function checkWordCorrect(state: CrosswordState, wordKey: string): boolean {
  const word = state.words[wordKey];
  if (!word) return false;
  for (let i = 0; i < word.cells.length; i++) {
    const pos = word.cells[i];
    const cellVal = state.cells[pos.row][pos.col].value.toUpperCase();
    const answer = word.answer[i]?.toUpperCase() || '';
    if (cellVal !== answer) return false;
  }
  return true;
}

export function moveToNextCell(state: CrosswordState): CellPosition | null {
  if (!state.activeCell) return state.activeCell;
  const cells = getActiveWordCells(state);
  const idx = cells.findIndex(
    (c) => c.row === state.activeCell!.row && c.col === state.activeCell!.col
  );
  if (idx < cells.length - 1) {
    return cells[idx + 1];
  }
  return state.activeCell;
}

export function moveToPrevCell(state: CrosswordState): CellPosition | null {
  if (!state.activeCell) return state.activeCell;
  const cells = getActiveWordCells(state);
  const idx = cells.findIndex(
    (c) => c.row === state.activeCell!.row && c.col === state.activeCell!.col
  );
  if (idx > 0) {
    return cells[idx - 1];
  }
  return state.activeCell;
}

export function moveDirection(
  state: CrosswordState,
  dir: 'up' | 'down' | 'left' | 'right'
): CellPosition | null {
  if (!state.activeCell) return state.activeCell;
  let { row, col } = state.activeCell;

  const dr = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
  const dc = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;

  let r = row + dr;
  let c = col + dc;

  while (r >= 0 && r < state.gridSize && c >= 0 && c < state.gridSize) {
    if (!state.cells[r][c].isBlack) {
      return { row: r, col: c };
    }
    r += dr;
    c += dc;
  }
  return state.activeCell;
}

export function determineDirectionFromClick(
  state: CrosswordState,
  row: number,
  col: number
): Direction {
  if (state.cells[row][col].isBlack) return state.activeDirection;

  const hasAcross = state.cells[row][col].acrossWord !== null;
  const hasDown = state.cells[row][col].downWord !== null;

  if (hasAcross && hasDown) {
    return state.activeDirection === 'ACROSS' ? 'DOWN' : 'ACROSS';
  }
  if (hasAcross) return 'ACROSS';
  if (hasDown) return 'DOWN';
  return state.activeDirection;
}

export function useHint(state: CrosswordState, puzzle: CrosswordPuzzle): {
  newState: CrosswordState;
  used: boolean;
  row: number | null;
  col: number | null;
} {
  if (state.hintsRemaining <= 0) {
    return { newState: state, used: false, row: null, col: null };
  }

  const emptyCells: CellPosition[] = [];
  for (let r = 0; r < state.gridSize; r++) {
    for (let c = 0; c < state.gridSize; c++) {
      const cell = state.cells[r][c];
      if (!cell.isBlack && !cell.value && !cell.isLocked) {
        emptyCells.push({ row: r, col: c });
      }
    }
  }

  if (emptyCells.length === 0) {
    return { newState: state, used: false, row: null, col: null };
  }

  const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const answer = puzzle.grid[target.row][target.col];

  const newCells = state.cells.map((row) => row.map((cell) => ({ ...cell })));
  newCells[target.row][target.col].value = answer;
  newCells[target.row][target.col].isHinted = true;

  const newState = {
    ...state,
    cells: newCells,
    hintsRemaining: state.hintsRemaining - 1,
  };

  return { newState, used: true, row: target.row, col: target.col };
}

export function checkWin(state: CrosswordState, puzzle: CrosswordPuzzle): boolean {
  for (let r = 0; r < state.gridSize; r++) {
    for (let c = 0; c < state.gridSize; c++) {
      const cell = state.cells[r][c];
      if (cell.isBlack) continue;
      const answer = puzzle.grid[r]?.[c] || '';
      if (cell.value.toUpperCase() !== answer.toUpperCase()) {
        return false;
      }
    }
  }
  return true;
}

export function getFilledCount(state: CrosswordState): { count: number; total: number } {
  let count = 0;
  let total = 0;
  for (let r = 0; r < state.gridSize; r++) {
    for (let c = 0; c < state.gridSize; c++) {
      if (!state.cells[r][c].isBlack) {
        total++;
        if (state.cells[r][c].value) count++;
      }
    }
  }
  return { count, total };
}

export function getWordKey(direction: Direction | 'across' | 'down', number: number): string {
  return `${direction.toLowerCase()}-${number}`;
}
