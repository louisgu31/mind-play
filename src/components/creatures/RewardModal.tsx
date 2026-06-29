import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Apple, Egg } from 'lucide-react';

type Reward = {
  type: 'coins' | 'food' | 'egg';
  amount?: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export const RewardModal: React.FC<{
  reward: Reward;
  onClose: () => void;
}> = ({ reward, onClose }) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600'
  };

  const renderIcon = () => {
    switch (reward.type) {
      case 'coins':
        return <Coins className="w-16 h-16 text-yellow-500" />;
      case 'food':
        return <Apple className="w-16 h-16 text-green-500" />;
      case 'egg':
        return <Egg className="w-16 h-16 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 10 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${rarityColors[reward.rarity]} mb-4`}>
              {renderIcon()}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {reward.name}
            </h2>
            {reward.amount && (
              <p className="text-4xl font-bold text-gray-700 dark:text-gray-300">
                {reward.amount}
              </p>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
          >
            Awesome!
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
