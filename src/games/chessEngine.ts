export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type PieceColor = 'white' | 'black';

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
}

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

export const getRandomAiMove = (state: GameState): Move => {
  const legalMoves = getAllLegalMoves(state);
  if (legalMoves.length === 0) throw new Error('No legal moves');
  
  const captureMoves = legalMoves.filter(m => m.captured);
  if (captureMoves.length > 0) {
    return captureMoves[Math.floor(Math.random() * captureMoves.length)];
  }
  return legalMoves[Math.floor(Math.random() * legalMoves.length)];
};
