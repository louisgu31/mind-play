
import React from 'react';
import { motion } from 'framer-motion';
import { Egg } from '../../metaStore';
import { getEggElementColor, getEggTierGlowClass } from '../../constants/creatureData';

interface EggSpriteProps {
  egg: Egg;
  onClick?: () => void;
  size?: number;
}

export const EggSprite: React.FC<EggSpriteProps> = ({ egg, onClick, size = 60 }) => {
  const eggColor = getEggElementColor(egg.tier);
  const glowClass = getEggTierGlowClass(egg.tier);

  // Subtle bobbing
  const bobAnimation = {
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer"
      style={{ width: size, height: size }}
    >
      {/* Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1/5 bg-black/20 rounded-full blur-sm"
      ></div>
      
      {/* Egg */}
      <motion.div
        className={`w-full h-full rounded-full ${glowClass} flex items-center justify-center`}
        style={{
          background: `linear-gradient(135deg, ${eggColor} 0%, ${eggColor}dd 100%)`,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }}
        animate={bobAnimation}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">🥚</span>
        {/* Clicks indicator */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
          {egg.clicksToHatch} clicks left
        </div>
      </motion.div>
    </div>
  );
};
