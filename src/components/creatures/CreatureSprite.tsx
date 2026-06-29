import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Creature } from '../../metaStore';
import { CreatureSVG } from '../../constants/creatureData';
import { RarityEffect } from './RarityEffect';

interface CreatureSpriteProps {
  creature: Creature;
  onClick?: () => void;
  size?: number;
  className?: string;
}

const getStage = (level: number): number => {
  if (level >= 25) return 3;
  if (level >= 10) return 2;
  return 1;
};

export const CreatureSprite: React.FC<CreatureSpriteProps> = ({ 
  creature, 
  onClick, 
  size = 70, 
  className = '' 
}) => {
  const stage = useMemo(() => getStage(creature.level), [creature.level]);
  const zIndex = useMemo(() => Math.floor(creature.position.y * 10), [creature.position.y]);

  return (
    <RarityEffect rarity={creature.rarity} className={className}>
      <motion.div
        className="relative cursor-pointer"
        style={{ 
          width: size, 
          height: size,
          zIndex: zIndex
        }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={onClick}
      >
        {/* Soft shadow */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/20"
          style={{ 
            bottom: -size * 0.15, 
            width: size * 0.8, 
            height: size * 0.25,
            filter: 'blur(3px)'
          }}
        />

        {/* Creature SVG */}
        <div className="relative w-full h-full flex items-center justify-center">
          <CreatureSVG 
            type={creature.type} 
            stage={stage} 
            rarity={creature.rarity} 
            size={size} 
          />
        </div>
      </motion.div>
    </RarityEffect>
  );
};
