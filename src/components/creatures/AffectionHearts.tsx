import React from 'react';

interface AffectionHeartsProps {
  affection: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

export const AffectionHearts: React.FC<AffectionHeartsProps> = ({ affection, size = 'md' }) => {
  const filledHearts = Math.floor(affection / 20);
  const hearts = [];
  const fontSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  for (let i = 0; i < 5; i++) {
    hearts.push(
      <span key={i} className={fontSize}>
        {i < filledHearts ? '❤️' : '🤍'}
      </span>
    );
  }
  return <div className="flex gap-1">{hearts}</div>;
};
