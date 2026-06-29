import React from 'react';
import { CreatureRarity } from '../../metaStore';
import { getRarityGlowClass } from '../../constants/creatureData';

interface RarityEffectProps {
  rarity: CreatureRarity;
  children: React.ReactNode;
  className?: string;
}

export const RarityEffect: React.FC<RarityEffectProps> = ({ rarity, children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute -inset-2 rounded-full ${getRarityGlowClass(rarity)} opacity-75`} />
      {rarity === 'legendary' && (
        <>
          <span className="absolute -top-1 -left-1 animate-ping text-yellow-400 text-xs">✨</span>
          <span className="absolute -top-1 -right-1 animate-pulse text-yellow-500 text-xs" style={{ animationDelay: '0.5s' }}>⭐</span>
          <span className="absolute -bottom-1 -left-1 animate-ping text-yellow-400 text-xs" style={{ animationDelay: '1s' }}>✨</span>
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
