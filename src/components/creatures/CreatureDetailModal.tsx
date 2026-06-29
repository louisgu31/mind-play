import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Creature, useMetaStore } from '../../metaStore';
import { CreatureSprite } from './CreatureSprite';
import { AffectionHearts } from './AffectionHearts';
import { getRarityColor } from '../../constants/creatureData';

interface CreatureDetailModalProps {
  creature: Creature;
  onClose: () => void;
}

const formatTimeLeft = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const CreatureDetailModal: React.FC<CreatureDetailModalProps> = ({ creature, onClose }) => {
  const [nickname, setNickname] = useState(creature.nickname);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedMessage, setFeedMessage] = useState<string | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);
  
  const { petCreature, feedCreature, food, updateDailyQuest, evolveCreature } = useMetaStore();
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const timeUntilCanPet = Math.max(0, oneHour - (now - creature.lastPetTime));
  const canPet = timeUntilCanPet <= 0;
  const canFeed = food > 0;
  const xpNeeded = creature.level * 50;
  const canEvolve = creature.affection >= 100;

  useEffect(() => {
    if (!canPet) {
      const timer = setInterval(() => {
        const remaining = oneHour - (Date.now() - creature.lastPetTime);
        setTimeLeft(Math.max(0, remaining));
        if (remaining <= 0) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [creature.lastPetTime, canPet]);

  const handlePet = useCallback(() => {
    const success = petCreature(creature.id);
    if (success) {
      setTimeLeft(oneHour);
    }
  }, [creature.id, petCreature]);

  const handleFeed = useCallback(() => {
    const result = feedCreature(creature.id, 1);
    if (result.bonusApplied) {
      setFeedMessage(`🎉 ${creature.nickname} loved that favorite food! +2 Affection!`);
    } else {
      setFeedMessage(`✅ ${creature.nickname} is happy! +1 Affection!`);
    }
    updateDailyQuest('feedCreature', 1);
    setTimeout(() => setFeedMessage(null), 3000);
  }, [creature.id, creature.nickname, feedCreature, updateDailyQuest]);

  const handleEvolve = useCallback(() => {
    setIsEvolving(true);
    setTimeout(() => {
      evolveCreature(creature.id);
      setTimeout(() => setIsEvolving(false), 500);
    }, 1500);
  }, [creature.id, evolveCreature]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Evolution Animation Overlay */}
        <AnimatePresence>
          {isEvolving && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-orange-300 to-purple-400 flex items-center justify-center z-10"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1.2, 1],
                  rotate: [0, 360, 360, 0],
                  opacity: [1, 0.5, 0.5, 1],
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="text-8xl"
              >
                ✨
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-20"
        >
          ✕
        </button>

        {/* Creature Sprite */}
        <div className="flex justify-center mb-6">
          <CreatureSprite creature={creature} size={140} />
        </div>

        {/* Name and Rarity */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {isEditingNickname ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingNickname(false);
                  }}
                  autoFocus
                  className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-xl"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{nickname}</h2>
                <button
                  onClick={() => setIsEditingNickname(true)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">{creature.name}</p>
          <span
            className="inline-block px-4 py-1 rounded-full font-bold text-sm"
            style={{ 
              backgroundColor: getRarityColor(creature.rarity) + '20', 
              color: getRarityColor(creature.rarity) 
            }}
          >
            {creature.rarity.charAt(0).toUpperCase() + creature.rarity.slice(1)}
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-4 mb-6">
          {/* Level & XP */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-gray-900 dark:text-white">Level {creature.level}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{creature.experience}/{xpNeeded} XP</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${(creature.experience / xpNeeded) * 100}%` }}
              />
            </div>
          </div>

          {/* Affection */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">Affection</span>
            <AffectionHearts affection={creature.affection} />
          </div>

          {/* Favorite Food */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">Favorite Food</span>
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-medium">
              🍽️ {creature.favoriteFood}
            </span>
          </div>

          {/* Hunger */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-gray-900 dark:text-white">Hunger</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{100 - creature.hunger}% Full</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${100 - creature.hunger}%` }}
              />
            </div>
          </div>

          {/* Happiness */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-gray-900 dark:text-white">Happiness</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{creature.happiness}%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${creature.happiness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Feed Message */}
        {feedMessage && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl text-center font-medium animate-bounce">
            {feedMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            onClick={handlePet}
            disabled={!canPet}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl font-bold transition-all ${
              canPet 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 active:scale-95' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl">🐾</span>
            <span>{canPet ? 'Pet' : formatTimeLeft(timeLeft)}</span>
          </button>

          <button
            onClick={handleFeed}
            disabled={!canFeed}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl font-bold transition-all ${
              canFeed 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 active:scale-95' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl">🍎</span>
            <span>Feed</span>
          </button>

          <button
            onClick={handleEvolve}
            disabled={!canEvolve || isEvolving}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl font-bold transition-all ${
              canEvolve 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105 active:scale-95 animate-pulse' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl">✨</span>
            <span>{canEvolve ? 'Evolve!' : 'Max Love'}</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
