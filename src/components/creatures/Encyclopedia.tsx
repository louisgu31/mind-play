import React from 'react';
import { useMetaStore, ALL_CREATURE_TYPES, CreatureType } from '../../metaStore';
import { CreatureSVG, getRarityColor } from '../../constants/creatureData';
import { motion } from 'framer-motion';
import { Coins, Apple, Egg } from 'lucide-react';

export const Encyclopedia: React.FC = () => {
  const { discoveredCreatures, encyclopediaRewards, claimEncyclopediaReward } = useMetaStore();

  const totalCreatures = ALL_CREATURE_TYPES.length;
  const discoveredCount = ALL_CREATURE_TYPES.filter(type => discoveredCreatures[type]).length;
  const progressPercent = Math.round((discoveredCount / totalCreatures) * 100);

  const getCreatureName = (type: CreatureType): string => {
    switch (type) {
      case 'sprout': return 'Sprout';
      case 'ember': return 'Ember';
      case 'aqua': return 'Aqua';
      case 'volt': return 'Volt';
      case 'crystalSprout': return 'Crystal Sprout';
      case 'shadowEmber': return 'Shadow Ember';
      case 'coralAqua': return 'Coral Aqua';
      case 'stormVolt': return 'Storm Volt';
      case 'worldTree': return 'World Tree';
      case 'phoenix': return 'Phoenix';
      default: return 'Unknown';
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'coins': return <Coins className="w-5 h-5 text-yellow-600" />;
      case 'food': return <Apple className="w-5 h-5 text-green-600" />;
      case 'legendaryEgg': return <Egg className="w-5 h-5 text-amber-500" />;
      default: return null;
    }
  };

  const getRewardText = (reward: any): string => {
    switch (reward.type) {
      case 'coins': return `${reward.amount} Coins`;
      case 'food': return `${reward.amount} Food`;
      case 'legendaryEgg': return 'Legendary Egg';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Creature Encyclopedia</h2>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg font-semibold">
            {discoveredCount}/{totalCreatures} Discovered
          </span>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Rewards */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Milestone Rewards</h3>
        <div className="grid grid-cols-3 gap-3">
          {encyclopediaRewards.map((reward) => {
            const isUnlocked = progressPercent >= reward.threshold;
            const isClaimed = reward.claimed;
            return (
              <div
                key={reward.threshold}
                className={`text-center p-3 rounded-xl ${
                  isClaimed
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : isUnlocked
                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <div className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  {reward.threshold}%
                </div>
                <div className="flex justify-center mb-2">{getRewardIcon(reward.type)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {getRewardText(reward)}
                </div>
                {isClaimed ? (
                  <span className="text-xs text-green-600 font-semibold">Claimed!</span>
                ) : isUnlocked ? (
                  <button
                    onClick={() => claimEncyclopediaReward(reward.threshold)}
                    className="w-full py-1 px-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-xs font-semibold transition-colors"
                  >
                    Claim
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">Locked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Creature Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {ALL_CREATURE_TYPES.map((type) => {
          const isDiscovered = discoveredCreatures[type];
          const rarity =
            type === 'worldTree' || type === 'phoenix'
              ? 'legendary'
              : type === 'crystalSprout' || type === 'shadowEmber'
              ? 'epic'
              : type === 'coralAqua' || type === 'stormVolt'
              ? 'rare'
              : 'common';

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: ALL_CREATURE_TYPES.indexOf(type) * 0.05 }}
              className={`p-4 rounded-2xl text-center ${
                isDiscovered
                  ? 'bg-white dark:bg-gray-800 shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <div className="relative inline-block mb-2">
                {isDiscovered ? (
                  <CreatureSVG type={type} stage={1} rarity={rarity} size={80} />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-3xl">
                    ?
                  </div>
                )}
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getRarityColor(rarity) }}
                />
              </div>
              <h4
                className={`font-bold text-sm ${
                  isDiscovered ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                }`}
              >
                {isDiscovered ? getCreatureName(type) : '???'}
              </h4>
              <p
                className={`text-xs font-semibold mt-1 ${
                  isDiscovered
                    ? ''
                    : 'text-gray-400'
                }`}
                style={{
                  color: isDiscovered ? getRarityColor(rarity) : undefined,
                }}
              >
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
