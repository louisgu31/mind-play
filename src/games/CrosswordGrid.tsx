import {
  CrosswordState,
  getActiveWordCells,
  getCrossWordCells,
} from './crosswordEngine';
import CrosswordCell from './CrosswordCell';

interface CrosswordGridProps {
  state: CrosswordState;
  hintCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
}

export default function CrosswordGrid({ state, hintCell, onCellClick }: CrosswordGridProps) {
  const activeWordSet = new Set<string>();
  const crossWordSet = new Set<string>();
  const correctSet = new Set<string>();
  const incorrectSet = new Set<string>();

  const activeCells = getActiveWordCells(state);
  const crossCells = getCrossWordCells(state);

  activeCells.forEach((c) => activeWordSet.add(`${c.row}-${c.col}`));
  crossCells.forEach((c) => crossWordSet.add(`${c.row}-${c.col}`));

  state.lockedWords.forEach((wordKey) => {
    const word = state.words[wordKey];
    if (word) {
      word.cells.forEach((c) => correctSet.add(`${c.row}-${c.col}`));
    }
  });

  state.incorrectWords.forEach((wordKey) => {
    const word = state.words[wordKey];
    if (word) {
      word.cells.forEach((c) => incorrectSet.add(`${c.row}-${c.col}`));
    }
  });

  return (
    <div
      className="mx-auto"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${state.gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${state.gridSize}, 1fr)`,
        width: '100%',
        maxWidth: '480px',
        aspectRatio: '1 / 1',
        backgroundColor: '#ffffff',
        border: '2px solid #202124',
        borderRadius: '2px',
      }}
    >
      {state.cells.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r}-${c}`;
          const isActive = state.activeCell?.row === r && state.activeCell?.col === c;
          const isHighlighted = activeWordSet.has(key);
          const isCrossHighlighted = crossWordSet.has(key) && !isHighlighted;
          const isCorrect = correctSet.has(key);
          const isIncorrect = incorrectSet.has(key) && !isCorrect;
          const isHintRevealing = hintCell?.row === r && hintCell?.col === c;

          return (
            <CrosswordCell
              key={key}
              cell={cell}
              isActive={isActive}
              isHighlighted={isHighlighted && !isCorrect && !isIncorrect}
              isCrossHighlighted={isCrossHighlighted && !isCorrect && !isIncorrect}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              isHintRevealing={isHintRevealing}
              onClick={() => onCellClick(r, c)}
            />
          );
        })
      )}
    </div>
  );
}
