import { motion } from 'framer-motion';
import { CellData } from './crosswordEngine';

interface CrosswordCellProps {
  cell: CellData;
  isActive: boolean;
  isHighlighted: boolean;
  isCrossHighlighted: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  isHintRevealing: boolean;
  onClick: () => void;
}

export default function CrosswordCell({
  cell,
  isActive,
  isHighlighted,
  isCrossHighlighted,
  isCorrect,
  isIncorrect,
  isHintRevealing,
  onClick,
}: CrosswordCellProps) {
  if (cell.isBlack) {
    return (
      <div
        className="aspect-square"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#202124',
          border: '1px solid #dadce0',
          boxSizing: 'border-box',
        }}
      />
    );
  }

  let bgColor = '#ffffff';
  if (isCorrect) {
    bgColor = '#d4edda';
  } else if (isIncorrect) {
    bgColor = '#f8d7da';
  } else if (isActive) {
    bgColor = '#ffffff';
  } else if (isHighlighted) {
    bgColor = '#e8f0fe';
  } else if (isCrossHighlighted) {
    bgColor = '#f1f3f4';
  }

  const textColor = cell.isHinted ? '#1a73e8' : '#202124';

  return (
    <motion.div
      onClick={onClick}
      animate={isHintRevealing ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="relative aspect-square flex items-center justify-center cursor-pointer select-none"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bgColor,
        border: '1px solid #dadce0',
        boxSizing: 'border-box',
      }}
    >
      {cell.number && (
        <span
          className="absolute font-normal text-gray-600 pointer-events-none"
          style={{
            top: '2px',
            left: '3px',
            fontSize: '10px',
            lineHeight: 1,
            color: '#5f6368',
          }}
        >
          {cell.number}
        </span>
      )}
      <span
        className="font-semibold pointer-events-none uppercase"
        style={{
          fontSize: 'clamp(12px, 3.5vw, 18px)',
          lineHeight: 1,
          color: textColor,
        }}
      >
        {cell.value || ''}
      </span>
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: '2px solid #1a73e8',
            boxSizing: 'border-box',
            zIndex: 10,
          }}
        />
      )}
    </motion.div>
  );
}
