import React, { useState } from 'react';
import { motion } from 'framer-motion';

type ChestState = 'idle' | 'hover' | 'opening' | 'open';

export const MysteryChest: React.FC<{
  onClick: () => void;
  disabled?: boolean;
}> = ({ onClick, disabled }) => {
  const [state, setState] = useState<ChestState>('idle');

  const handleClick = () => {
    if (disabled || state === 'open') return;
    setState('opening');
    setTimeout(() => {
      setState('open');
      onClick();
    }, 500);
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={handleClick}
      whileHover={state === 'idle' ? { scale: 1.05 } : {}}
      whileTap={state === 'idle' ? { scale: 0.95 } : {}}
    >
      <svg
        width="120"
        height="100"
        viewBox="0 0 120 100"
        className="drop-shadow-lg"
      >
        {/* Base */}
        <motion.rect
          x="10"
          y="50"
          width="100"
          height="40"
          rx="8"
          fill="#8B4513"
          animate={{
            fill: state === 'open' ? '#CD853F' : '#8B4513'
          }}
        />
        <motion.rect
          x="15"
          y="55"
          width="90"
          height="30"
          rx="5"
          fill="#D2691E"
          animate={{
            fill: state === 'open' ? '#DEB887' : '#D2691E'
          }}
        />
        
        {/* Lid */}
        <motion.g
          animate={{
            rotateX: state === 'opening' || state === 'open' ? -60 : 0,
            y: state === 'opening' || state === 'open' ? -5 : 0
          }}
          style={{
            transformOrigin: '50% 50px'
          }}
          transition={{ duration: 0.3, type: 'spring' }}
        >
          <rect
            x="8"
            y="20"
            width="104"
            height="35"
            rx="8"
            fill="#A0522D"
          />
          <rect
            x="13"
            y="25"
            width="94"
            height="25"
            rx="5"
            fill="#CD853F"
          />
          
          {/* Lock */}
          <motion.rect
            x="52"
            y="40"
            width="16"
            height="16"
            rx="4"
            fill={state === 'open' ? '#FFD700' : '#FFA500'}
            whileHover={state === 'idle' ? { scale: 1.1 } : {}}
          />
          <motion.circle
            cx="60"
            cy="48"
            r="3"
            fill="#8B4513"
          />
        </motion.g>

        {/* Shine effect */}
        {state === 'idle' && (
          <motion.rect
            x="20"
            y="30"
            width="20"
            height="5"
            rx="2"
            fill="rgba(255,255,255,0.3)"
            animate={{
              x: [20, 80],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}

        {/* Sparkles when open */}
        {state === 'open' && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={i}
                cx={30 + Math.random() * 60}
                cy={30 + Math.random() * 20}
                r={3 + Math.random() * 3}
                fill={['#FFD700', '#FF69B4', '#00CED1', '#98FB98'][i % 4]}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -30],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </>
        )}
      </svg>
    </motion.div>
  );
};
