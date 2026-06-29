export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'ultimate' | 'impossible';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface Move {
  from: [number, number];
  to: [number, number];
  piece: Piece;
  captured?: Piece;
  enPassant?: boolean;
  castling?: 'kingside' | 'queenside';
  promotion?: PieceType;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: PieceColor;
  moveHistory: Move[];
  whiteKingMoved: boolean;
  whiteLeftRookMoved: boolean;
  whiteRightRookMoved: boolean;
  blackKingMoved: boolean;
  blackLeftRookMoved: boolean;
  blackRightRookMoved: boolean;
  enPassantTarget: [number, number] | null;
  aiDifficulty?: AIDifficulty;
}

export const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

const PIECE_SQUARE_TABLES: Record<PieceType, number[][]> = {
  pawn: PAWN_TABLE,
  knight: KNIGHT_TABLE,
  bishop: BISHOP_TABLE,
  rook: ROOK_TABLE,
  queen: QUEEN_TABLE,
  king: KING_TABLE,
};

export const INITIAL_BOARD: (Piece | null)[][] = [
  [{ type: 'rook', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'queen', color: 'black' }, { type: 'king', color: 'black' }, { type: 'bishop', color: 'black' }, { type: 'knight', color: 'black' }, { type: 'rook', color: 'black' }],
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black' })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white' })),
  [{ type: 'rook', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'queen', color: 'white' }, { type: 'king', color: 'white' }, { type: 'bishop', color: 'white' }, { type: 'knight', color: 'white' }, { type: 'rook', color: 'white' }],
];

export const createInitialState = (): GameState => ({
  board: INITIAL_BOARD.map(row => row.map(p => p ? { ...p } : null)),
  currentPlayer: 'white',
  moveHistory: [],
  whiteKingMoved: false,
  whiteLeftRookMoved: false,
  whiteRightRookMoved: false,
  blackKingMoved: false,
  blackLeftRookMoved: false,
  blackRightRookMoved: false,
  enPassantTarget: null,
});

export const cloneBoard = (board: (Piece | null)[][]): (Piece | null)[][] =>
  board.map(row => row.map(p => p ? { ...p } : null));

export const cloneState = (state: GameState): GameState => ({
  ...state,
  board: cloneBoard(state.board),
  moveHistory: [...state.moveHistory],
});

export const findKing = (board: (Piece | null)[][], color: PieceColor): [number, number] => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p?.type === 'king' && p.color === color) return [r, c];
    }
  }
  throw new Error('King not found');
};

const isValidPosition = (row: number, col: number): boolean =>
  row >= 0 && row < 8 && col >= 0 && col < 8;

export const getLegalMoves = (state: GameState, row: number, col: number): Move[] => {
  const piece = state.board[row][col];
  if (!piece) return [];

  const moves: Move[] = [];
  const { board } = state;
  const isWhite = piece.color === 'white';

  switch (piece.type) {
    case 'pawn': {
      const dir = isWhite ? -1 : 1;
      const startRow = isWhite ? 6 : 1;

      if (isValidPosition(row + dir, col) && !board[row + dir][col]) {
        moves.push({ from: [row, col], to: [row + dir, col], piece });
        if (row === startRow && !board[row + 2 * dir][col]) {
          moves.push({ from: [row, col], to: [row + 2 * dir, col], piece });
        }
      }

      for (const dc of [-1, 1]) {
        const nr = row + dir;
        const nc = col + dc;
        if (isValidPosition(nr, nc)) {
          const target = board[nr][nc];
          if (target && target.color !== piece.color) {
            moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
          }
          if (state.enPassantTarget && state.enPassantTarget[0] === nr && state.enPassantTarget[1] === nc) {
            const capturedPawn = board[row][nc];
            if (capturedPawn?.type === 'pawn' && capturedPawn.color !== piece.color) {
              moves.push({ from: [row, col], to: [nr, nc], piece, captured: capturedPawn, enPassant: true });
            }
          }
        }
      }
      break;
    }

    case 'rook': {
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of dirs) {
        for (let i = 1; i < 8; i++) {
          const nr = row + dr * i;
          const nc = col + dc * i;
          if (!isValidPosition(nr, nc)) break;
          const target = board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else {
            if (target.color !== piece.color) {
              moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
            }
            break;
          }
        }
      }
      break;
    }

    case 'knight': {
      const dirs = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;
        if (isValidPosition(nr, nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else if (target.color !== piece.color) {
            moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
          }
        }
      }
      break;
    }

    case 'bishop': {
      const dirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of dirs) {
        for (let i = 1; i < 8; i++) {
          const nr = row + dr * i;
          const nc = col + dc * i;
          if (!isValidPosition(nr, nc)) break;
          const target = board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else {
            if (target.color !== piece.color) {
              moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
            }
            break;
          }
        }
      }
      break;
    }

    case 'queen': {
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of dirs) {
        for (let i = 1; i < 8; i++) {
          const nr = row + dr * i;
          const nc = col + dc * i;
          if (!isValidPosition(nr, nc)) break;
          const target = board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else {
            if (target.color !== piece.color) {
              moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
            }
            break;
          }
        }
      }
      break;
    }

    case 'king': {
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;
        if (isValidPosition(nr, nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else if (target.color !== piece.color) {
            moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
          }
        }
      }

      if (piece.color === 'white') {
        if (!state.whiteKingMoved && !state.whiteRightRookMoved && !board[7][5] && !board[7][6]) {
          moves.push({ from: [7, 4], to: [7, 6], piece, castling: 'kingside' });
        }
        if (!state.whiteKingMoved && !state.whiteLeftRookMoved && !board[7][3] && !board[7][2] && !board[7][1]) {
          moves.push({ from: [7, 4], to: [7, 2], piece, castling: 'queenside' });
        }
      } else {
        if (!state.blackKingMoved && !state.blackRightRookMoved && !board[0][5] && !board[0][6]) {
          moves.push({ from: [0, 4], to: [0, 6], piece, castling: 'kingside' });
        }
        if (!state.blackKingMoved && !state.blackLeftRookMoved && !board[0][3] && !board[0][2] && !board[0][1]) {
          moves.push({ from: [0, 4], to: [0, 2], piece, castling: 'queenside' });
        }
      }
      break;
    }
  }

  return moves.filter(move => !doesMoveLeaveInCheck(state, move));
};

export const applyMove = (state: GameState, move: Move): GameState => {
  const newState = cloneState(state);
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;

  newState.board[tr][tc] = { ...move.piece };
  newState.board[fr][fc] = null;

  if (move.castling === 'kingside') {
    if (move.piece.color === 'white') {
      newState.board[7][5] = newState.board[7][7];
      newState.board[7][7] = null;
      newState.whiteKingMoved = true;
      newState.whiteRightRookMoved = true;
    } else {
      newState.board[0][5] = newState.board[0][7];
      newState.board[0][7] = null;
      newState.blackKingMoved = true;
      newState.blackRightRookMoved = true;
    }
  } else if (move.castling === 'queenside') {
    if (move.piece.color === 'white') {
      newState.board[7][3] = newState.board[7][0];
      newState.board[7][0] = null;
      newState.whiteKingMoved = true;
      newState.whiteLeftRookMoved = true;
    } else {
      newState.board[0][3] = newState.board[0][0];
      newState.board[0][0] = null;
      newState.blackKingMoved = true;
      newState.blackLeftRookMoved = true;
    }
  }

  if (move.enPassant) {
    newState.board[fr][tc] = null;
  }

  if (move.promotion) {
    newState.board[tr][tc] = { type: move.promotion, color: move.piece.color };
  }

  if (move.piece.type === 'king') {
    if (move.piece.color === 'white') newState.whiteKingMoved = true;
    else newState.blackKingMoved = true;
  }
  if (move.piece.type === 'rook') {
    if (move.piece.color === 'white') {
      if (fc === 0) newState.whiteLeftRookMoved = true;
      if (fc === 7) newState.whiteRightRookMoved = true;
    } else {
      if (fc === 0) newState.blackLeftRookMoved = true;
      if (fc === 7) newState.blackRightRookMoved = true;
    }
  }

  if (move.piece.type === 'pawn' && Math.abs(tr - fr) === 2) {
    newState.enPassantTarget = [(fr + tr) / 2, fc];
  } else {
    newState.enPassantTarget = null;
  }

  newState.currentPlayer = newState.currentPlayer === 'white' ? 'black' : 'white';
  newState.moveHistory.push(move);

  return newState;
};

export const isInCheck = (state: GameState, color: PieceColor): boolean => {
  const kingPos = findKing(state.board, color);
  const opponent = color === 'white' ? 'black' : 'white';

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c];
      if (p?.color === opponent) {
        const moves = getLegalMovesInternal(state, r, c);
        if (moves.some(m => m.to[0] === kingPos[0] && m.to[1] === kingPos[1])) {
          return true;
        }
      }
    }
  }
  return false;
};

const getLegalMovesInternal = (state: GameState, row: number, col: number): Move[] => {
  const piece = state.board[row][col];
  if (!piece) return [];

  const moves: Move[] = [];
  const isWhite = piece.color === 'white';

  switch (piece.type) {
    case 'pawn': {
      const dir = isWhite ? -1 : 1;
      const startRow = isWhite ? 6 : 1;

      if (isValidPosition(row + dir, col) && !state.board[row + dir][col]) {
        moves.push({ from: [row, col], to: [row + dir, col], piece });
        if (row === startRow && !state.board[row + 2 * dir][col]) {
          moves.push({ from: [row, col], to: [row + 2 * dir, col], piece });
        }
      }

      for (const dc of [-1, 1]) {
        const nr = row + dir;
        const nc = col + dc;
        if (isValidPosition(nr, nc)) {
          const target = state.board[nr][nc];
          if (target && target.color !== piece.color) {
            moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
          }
        }
      }
      break;
    }

    case 'rook': {
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of dirs) {
        for (let i = 1; i < 8; i++) {
          const nr = row + dr * i;
          const nc = col + dc * i;
          if (!isValidPosition(nr, nc)) break;
          const target = state.board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else {
            if (target.color !== piece.color) {
              moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
            }
            break;
          }
        }
      }
      break;
    }

    case 'knight': {
      const dirs = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;
        if (isValidPosition(nr, nc)) {
          const target = state.board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else if (target.color !== piece.color) {
            moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
          }
        }
      }
      break;
    }

    case 'bishop': {
      const dirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of dirs) {
        for (let i = 1; i < 8; i++) {
          const nr = row + dr * i;
          const nc = col + dc * i;
          if (!isValidPosition(nr, nc)) break;
          const target = state.board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else {
            if (target.color !== piece.color) {
              moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
            }
            break;
          }
        }
      }
      break;
    }

    case 'queen': {
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of dirs) {
        for (let i = 1; i < 8; i++) {
          const nr = row + dr * i;
          const nc = col + dc * i;
          if (!isValidPosition(nr, nc)) break;
          const target = state.board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else {
            if (target.color !== piece.color) {
              moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
            }
            break;
          }
        }
      }
      break;
    }

    case 'king': {
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;
        if (isValidPosition(nr, nc)) {
          const target = state.board[nr][nc];
          if (!target) {
            moves.push({ from: [row, col], to: [nr, nc], piece });
          } else if (target.color !== piece.color) {
            moves.push({ from: [row, col], to: [nr, nc], piece, captured: target });
          }
        }
      }
      break;
    }
  }

  return moves;
};

const doesMoveLeaveInCheck = (state: GameState, move: Move): boolean => {
  const newState = applyMoveIgnoringCheck(state, move);
  return isInCheck(newState, move.piece.color);
};

const applyMoveIgnoringCheck = (state: GameState, move: Move): GameState => {
  const newState = cloneState(state);
  const [fr, fc] = move.from;
  const [tr, tc] = move.to;

  newState.board[tr][tc] = { ...move.piece };
  newState.board[fr][fc] = null;

  if (move.enPassant) {
    newState.board[fr][tc] = null;
  }

  return newState;
};

export const getAllLegalMoves = (state: GameState): Move[] => {
  const moves: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (piece?.color === state.currentPlayer) {
        moves.push(...getLegalMoves(state, r, c));
      }
    }
  }
  return moves;
};

export const getGameStatus = (state: GameState): { status: 'playing' | 'checkmate' | 'stalemate', winner?: PieceColor } => {
  const legalMoves = getAllLegalMoves(state);
  const inCheck = isInCheck(state, state.currentPlayer);

  if (legalMoves.length === 0) {
    if (inCheck) {
      return { status: 'checkmate', winner: state.currentPlayer === 'white' ? 'black' : 'white' };
    } else {
      return { status: 'stalemate' };
    }
  }

  return { status: 'playing' };
};

export function evaluateBoard(state: GameState): number {
  let materialScore = 0;
  let positionalScore = 0;
  let mobilityScore = 0;
  let kingSafetyScore = 0;

  let whiteMobility = 0;
  let blackMobility = 0;
  let whitePawns = 0;
  let blackPawns = 0;

  const whiteKingPos: [number, number] = [0, 0];
  const blackKingPos: [number, number] = [0, 0];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (!piece) continue;

      const value = PIECE_VALUES[piece.type];
      const table = PIECE_SQUARE_TABLES[piece.type];
      const posRow = piece.color === 'white' ? r : 7 - r;
      const posValue = table[posRow][c];

      if (piece.color === 'white') {
        materialScore += value;
        positionalScore += posValue;
        if (piece.type === 'king') {
          whiteKingPos[0] = r;
          whiteKingPos[1] = c;
        }
        if (piece.type === 'pawn') whitePawns++;
        whiteMobility += getPieceMobility(piece.type, r, c);
      } else {
        materialScore -= value;
        positionalScore -= posValue;
        if (piece.type === 'king') {
          blackKingPos[0] = r;
          blackKingPos[1] = c;
        }
        if (piece.type === 'pawn') blackPawns++;
        blackMobility += getPieceMobility(piece.type, r, c);
      }
    }
  }

  mobilityScore = (whiteMobility - blackMobility) * 1;

  const whiteKingSafety = calculateKingSafety(state, whiteKingPos, 'white', whitePawns);
  const blackKingSafety = calculateKingSafety(state, blackKingPos, 'black', blackPawns);
  kingSafetyScore = whiteKingSafety - blackKingSafety;

  const total = materialScore + positionalScore + mobilityScore + kingSafetyScore;
  return state.currentPlayer === 'white' ? total : -total;
}

function getPieceMobility(pieceType: PieceType, row: number, col: number): number {
  const centerDist = Math.abs(3.5 - row) + Math.abs(3.5 - col);
  const centerBonus = Math.max(0, 7 - centerDist);

  switch (pieceType) {
    case 'pawn': return 2 + centerBonus * 0.5;
    case 'knight': return 6 + centerBonus;
    case 'bishop': return 7 + centerBonus * 0.5;
    case 'rook': return 10 + centerBonus * 0.3;
    case 'queen': return 14 + centerBonus * 0.3;
    case 'king': return 3;
    default: return 0;
  }
}

function calculateKingSafety(state: GameState, kingPos: [number, number], color: PieceColor, pawnCount: number): number {
  let safety = 0;
  const [kr, kc] = kingPos;

  const pawnShieldPositions = color === 'white'
    ? [[kr - 1, kc - 1], [kr - 1, kc], [kr - 1, kc + 1]]
    : [[kr + 1, kc - 1], [kr + 1, kc], [kr + 1, kc + 1]];

  for (const [r, c] of pawnShieldPositions) {
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const piece = state.board[r][c];
      if (piece?.type === 'pawn' && piece.color === color) {
        safety += 10;
      }
    }
  }

  const castledKingside = (color === 'white' && kc >= 5) || (color === 'black' && kc >= 5);
  const castledQueenside = (color === 'white' && kc <= 2) || (color === 'black' && kc <= 2);
  if (castledKingside || castledQueenside) {
    safety += 15;
  }

  if (kc === 3 || kc === 4) {
    safety -= 8;
  }

  safety += pawnCount * 2;

  return safety;
}

function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => {
    const aScore = a.captured ? PIECE_VALUES[a.captured.type] - PIECE_VALUES[a.piece.type] / 10 : 0;
    const bScore = b.captured ? PIECE_VALUES[b.captured.type] - PIECE_VALUES[b.piece.type] / 10 : 0;
    return bScore - aScore;
  });
}

function minimax(state: GameState, depth: number, alpha: number, beta: number, usePruning: boolean = true): number {
  if (depth === 0) {
    return evaluateBoard(state);
  }

  const moves = getAllLegalMoves(state);
  if (moves.length === 0) {
    const status = getGameStatus(state);
    if (status.status === 'checkmate') {
      return -10000 - depth;
    }
    return 0;
  }

  const orderedMoves = orderMoves(moves);

  if (usePruning) {
    let maxEval = -Infinity;
    for (const move of orderedMoves) {
      const newState = applyMove(state, move);
      const eval_ = -minimax(newState, depth - 1, -beta, -alpha, true);
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let best = -Infinity;
    for (const move of orderedMoves) {
      const newState = applyMove(state, move);
      const val = -minimax(newState, depth - 1, -Infinity, Infinity, false);
      best = Math.max(best, val);
    }
    return best;
  }
}

export function getAIMove(state: GameState, difficulty: AIDifficulty): Move {
  const legalMoves = getAllLegalMoves(state);
  if (legalMoves.length === 0) throw new Error('No legal moves');

  const captureMoves = legalMoves.filter(m => m.captured);
  const nonCaptureMoves = legalMoves.filter(m => !m.captured);

  switch (difficulty) {
    case 'easy':
      return getEasyMove(legalMoves, captureMoves, nonCaptureMoves);
    case 'medium':
      return getMediumMove(state, legalMoves);
    case 'hard':
      return getHardMove(state, legalMoves);
    case 'ultimate':
      return getUltimateMove(state, legalMoves);
    case 'impossible':
      return getImpossibleMove(state, legalMoves);
    default:
      return getEasyMove(legalMoves, captureMoves, nonCaptureMoves);
  }
}

function getEasyMove(allMoves: Move[], captureMoves: Move[], nonCaptureMoves: Move[]): Move {
  if (Math.random() < 0.3 && captureMoves.length > 0) {
    return captureMoves[Math.floor(Math.random() * captureMoves.length)];
  }

  if (Math.random() < 0.1) {
    const blunderMoves = findBlunderMoves(allMoves);
    if (blunderMoves.length > 0) {
      return blunderMoves[Math.floor(Math.random() * blunderMoves.length)];
    }
  }

  if (nonCaptureMoves.length > 0) {
    return nonCaptureMoves[Math.floor(Math.random() * nonCaptureMoves.length)];
  }
  return allMoves[Math.floor(Math.random() * allMoves.length)];
}

function findBlunderMoves(moves: Move[]): Move[] {
  return moves.filter(m => {
    if (m.captured) return false;
    return m.piece.type === 'queen' || m.piece.type === 'rook' || m.piece.type === 'bishop' || m.piece.type === 'knight';
  });
}

function getMediumMove(state: GameState, allMoves: Move[]): Move {
  let bestMove = allMoves[0];
  let bestScore = -Infinity;

  for (const move of allMoves) {
    let score = 0;
    if (move.captured) {
      score += PIECE_VALUES[move.captured.type];
    }

    const newState = applyMove(state, move);
    const opponentMoves = getAllLegalMoves(newState);
    const opponentCaptures = opponentMoves.filter(m => m.captured?.type === move.piece.type);
    if (opponentCaptures.length > 0) {
      score -= PIECE_VALUES[move.piece.type] * 0.5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  if (Math.random() < 0.25) {
    const decentMoves = allMoves.filter(m => {
      let s = 0;
      if (m.captured) s += PIECE_VALUES[m.captured.type];
      return s >= bestScore * 0.5;
    });
    if (decentMoves.length > 0) {
      return decentMoves[Math.floor(Math.random() * decentMoves.length)];
    }
  }

  return bestMove;
}

function getHardMove(state: GameState, moves: Move[]): Move {
  const pieceCount = countPieces(state.board);
  let depth = 2;
  if (pieceCount <= 16) depth = 3;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  const orderedMoves = orderMoves(moves);

  for (const move of orderedMoves) {
    const newState = applyMove(state, move);
    const score = -minimax(newState, depth - 1, -Infinity, Infinity, true);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  if (Math.random() < 0.08) {
    const topMoves = orderedMoves.filter(m => {
      const newState = applyMove(state, m);
      const s = -minimax(newState, depth - 1, -Infinity, Infinity, true);
      return s >= bestScore - 50;
    });
    if (topMoves.length > 0) {
      return topMoves[Math.floor(Math.random() * topMoves.length)];
    }
  }

  return bestMove;
}

function getUltimateMove(state: GameState, moves: Move[]): Move {
  const pieceCount = countPieces(state.board);
  let depth = 3;
  if (pieceCount <= 16) depth = 4;
  if (pieceCount <= 8) depth = 5;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  const orderedMoves = orderMoves(moves);

  for (const move of orderedMoves) {
    const newState = applyMove(state, move);
    const score = -minimax(newState, depth - 1, -Infinity, Infinity, true);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function getImpossibleMove(state: GameState, moves: Move[]): Move {
  const pieceCount = countPieces(state.board);
  let depth = 4;
  if (pieceCount <= 16) depth = 5;
  if (pieceCount <= 8) depth = 6;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  const orderedMoves = orderMoves(moves);

  for (const move of orderedMoves) {
    const newState = applyMove(state, move);
    const score = -minimax(newState, depth - 1, -Infinity, Infinity, true);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function countPieces(board: (Piece | null)[][]): number {
  let count = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]) count++;
    }
  }
  return count;
}

export const getRandomAiMove = (state: GameState): Move => {
  return getAIMove(state, 'easy');
};
