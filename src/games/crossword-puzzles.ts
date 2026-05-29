export interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  row: number;
  col: number;
  answer: string;
  clue: string;
}

export interface CrosswordPuzzle {
  theme: string;
  grid: string[][];
  clues: CrosswordClue[];
}

const GRID_SIZE = 9;

function createEmptyGrid(): string[][] {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('#'));
}

function hasSymmetry(grid: string[][], size: number): boolean {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== grid[size - 1 - r][size - 1 - c]) {
        return false;
      }
    }
  }
  return true;
}

function checkInterlocks(grid: string[][], size: number): boolean {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] !== '#') {
        const hasAcross = (c > 0 && grid[r][c - 1] !== '#') || (c < size - 1 && grid[r][c + 1] !== '#');
        const hasDown = (r > 0 && grid[r - 1][c] !== '#') || (r < size - 1 && grid[r + 1][c] !== '#');
        if (!hasAcross && !hasDown) {
          return false;
        }
      }
    }
  }
  return true;
}

export const CROSSWORD_PUZZLES: CrosswordPuzzle[] = [
  {
    theme: "Technology",
    grid: [
      ['#', '#', '#', 'C', 'O', 'D', 'E', '#', '#'],
      ['#', '#', '#', 'H', '#', 'A', 'R', 'D', '#'],
      ['#', '#', '#', 'I', 'A', 'P', 'P', 'L', 'E'],
      ['#', '#', '#', 'N', '#', 'S', '#', 'S', '#'],
      ['S', 'O', 'F', 'T', 'W', 'A', 'R', 'E', '#'],
      ['#', '#', '#', 'E', '#', '#', '#', '#', '#'],
      ['D', 'A', 'T', 'A', '#', '#', '#', '#', '#'],
      ['#', '#', 'W', 'E', 'B', '#', '#', '#', '#'],
      ['#', '#', '#', '#', 'S', '#', '#', '#', '#']
    ],
    clues: [
      { number: 1, direction: 'down', row: 0, col: 3, answer: 'CHINA', clue: 'Country known for tech manufacturing (5)' },
      { number: 2, direction: 'down', row: 2, col: 2, answer: 'TIP', clue: 'Gratuity or hint (3)' },
      { number: 1, direction: 'across', row: 2, col: 3, answer: 'CHIP', clue: 'Computer processor component (4)' },
      { number: 3, direction: 'down', row: 0, col: 5, answer: 'OAPS', clue: 'Senior citizens, briefly (4)' },
      { number: 4, direction: 'down', row: 4, col: 0, answer: 'SOFTWARE', clue: 'Programs and applications (8)' },
      { number: 5, direction: 'down', row: 6, col: 0, answer: 'DATA', clue: 'Information stored digitally (4)' },
      { number: 2, direction: 'across', row: 3, col: 5, answer: 'APPLE', clue: 'Tech company with a fruit logo (5)' },
      { number: 6, direction: 'down', row: 2, col: 6, answer: 'PM', clue: 'Afternoon hours, briefly (2)' },
      { number: 7, direction: 'down', row: 7, col: 2, answer: 'WEB', clue: 'Internet or spider home (3)' },
      { number: 3, direction: 'across', row: 5, col: 3, answer: 'HARD', clue: 'Difficult or firm (4)' },
      { number: 8, direction: 'down', row: 6, col: 4, answer: 'AWS', clue: 'Amazon cloud service (3)' },
      { number: 4, direction: 'across', row: 7, col: 3, answer: 'EBS', clue: 'Elastic block store service (3)' },
      { number: 9, direction: 'across', row: 1, col: 5, answer: 'API', clue: 'Interface for software communication (3)' },
      { number: 10, direction: 'across', row: 6, col: 0, answer: 'DATABASE', clue: 'Organized collection of information (8)' },
      { number: 11, direction: 'across', row: 4, col: 0, answer: 'SOFTWARE', clue: 'Apps and programs (8)' }
    ]
  },
  {
    theme: "Sports",
    grid: [
      ['#', '#', 'F', 'O', 'O', 'T', 'B', 'A', 'L', 'L'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
      ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
    ],
    clues: [
      { number: 1, direction: 'across', row: 0, col: 2, answer: 'FOOTBALL', clue: 'Popular American sport played with an oval ball (9)' }
    ]
  },
  {
    theme: "Animals",
    grid: [
      ['#', '#', '#', 'D', 'O', 'G', '#', '#', '#'],
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
      { number: 1, direction: 'down', row: 0, col: 3, answer: 'DOG', clue: 'Man\'s best friend (3)' }
    ]
  }
];

export function getRandomPuzzle(): CrosswordPuzzle {
  return CROSSWORD_PUZZLES[Math.floor(Math.random() * CROSSWORD_PUZZLES.length)];
}

export function validateCrossword(puzzle: CrosswordPuzzle): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const size = puzzle.grid.length;

  if (!hasSymmetry(puzzle.grid, size)) {
    errors.push('Grid lacks 180-degree rotational symmetry');
  }

  if (!checkInterlocks(puzzle.grid, size)) {
    errors.push('Some white squares are not part of both Across AND Down words');
  }

  for (const clue of puzzle.clues) {
    if (clue.answer.length < 3) {
      errors.push(`Word "${clue.answer}" is less than 3 letters`);
    }
    if (!/^[A-Z]+$/.test(clue.answer)) {
      errors.push(`Word "${clue.answer}" contains invalid characters`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export { GRID_SIZE, createEmptyGrid };
