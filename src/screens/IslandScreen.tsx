import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trees,
  Gamepad2,
  Coins,
  Apple,
  Gift,
  Trophy,
  Sparkles,
  BookOpen,
  Home,
  ShoppingCart,
  Calendar,
  Settings,
  ChevronRight,
  Sprout,
  CheckCircle
} from 'lucide-react';
import { useMetaStore } from '../metaStore';
import { IslandRenderer } from '../components/island/IslandRenderer';
import { CreatureDetailModal } from '../components/creatures/CreatureDetailModal';
import { MerchantAvatar } from '../components/shop/MerchantAvatar';
import { CreatureSprite } from '../components/creatures/CreatureSprite';
import { MysteryChest } from '../components/creatures/MysteryChest';
import { Encyclopedia } from '../components/creatures/Encyclopedia';
import { SHOP_ITEMS } from '../constants/shopData';

export default function IslandScreen() {
  const {
    coins,
    food,
    creatures,
    dailyRewards,
    addCoins,
    addFood,
    buyEgg,
    updateDailyQuest,
    devAddCoins,
    devAddFood,
    devSpawnEgg,
    devIncreaseIslandLevel
  } = useMetaStore();

  const [activeTab, setActiveTab] = useState<'island' | 'creatures' | 'shop' | 'daily'>('island');
  const [selectedCreature, setSelectedCreature] = useState<any>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [currentReward, setCurrentReward] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDailyLogin = () => {
    const randomReward = Math.random();
    let reward: any;
    if (randomReward < 0.4) reward = { type: 'coins', amount: 250 };
    else if (randomReward < 0.7) reward = { type: 'food', amount: 100 };
    else if (randomReward < 0.9) reward = { type: 'coins', amount: 500 };
    else reward = { type: 'egg', tier: 'rare' };
    
    setCurrentReward(reward);
    setShowRewardModal(true);
    
    if (reward.type === 'coins') addCoins(reward.amount);
    if (reward.type === 'food') addFood(reward.amount);
    if (reward.type === 'egg') buyEgg(reward.tier);
  };

  const dailyRewardClaimed = dailyRewards.some(r => r.claimed);

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Dreamy cloud-and-mountain backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-indigo-100 to-purple-100" />
        {/* Floating clouds */}
        <motion.div 
          className="absolute top-10 left-10 w-64 h-32 bg-white/70 rounded-full blur-3xl"
          animate={{ x: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute top-20 right-20 w-48 h-24 bg-white/60 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/4 w-80 h-40 bg-white/50 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        {/* Mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3">
          <svg viewBox="0 0 1200 200" className="w-full h-full">
            <path d="M0 200 L200 50 L400 150 L600 80 L800 180 L1000 60 L1200 200 Z" fill="#a5b4fc" />
            <path d="M0 200 L150 80 L350 160 L550 100 L750 170 L950 90 L1200 200 Z" fill="#818cf8" />
          </svg>
        </div>
      </div>

      {/* Widescreen 3-column dashboard */}
      <div className="relative z-10 h-screen w-full flex gap-4 p-6">
        {/* Left Column */}
        <div className="w-80 flex-shrink-0 space-y-4">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/30"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg border-4 border-white">
                <Sprout className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Lv. 10
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Island Keeper
                  </span>
                </h2>
                <div className="text-sm text-gray-500">Next Lv. in 180 XP</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700">Player XP</span>
                <span className="text-gray-500">850/1000</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Trees className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-gray-800">Island Level 5</span>
                </div>
                <span className="text-sm text-gray-500">420/600</span>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: '70%' }} />
              </div>
            </div>
          </motion.div>

          {/* Today's Quests */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/30"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-500" />
              Today's Quests
            </h3>
            <div className="space-y-3">
              {[
                { id: 1, name: 'Play 3 Games', progress: 2, target: 3, reward: { type: 'coins', amount: 100 }, icon: Gamepad2, iconColor: 'text-purple-500' },
                { id: 2, name: 'Earn 200 Coins', progress: 120, target: 200, reward: { type: 'coins', amount: 200 }, icon: Coins, iconColor: 'text-yellow-500' },
                { id: 3, name: 'Feed a Creature', progress: 1, target: 1, reward: { type: 'food', amount: 50 }, icon: Apple, iconColor: 'text-green-500', complete: true },
              ].map((quest, idx) => (
                <motion.div 
                  key={quest.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  className={`p-4 rounded-2xl border-2 ${quest.complete ? 'border-green-200 bg-green-50/60' : 'border-gray-100 bg-gray-50/60'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <quest.icon className={`w-5 h-5 ${quest.iconColor}`} />
                    <span className={`font-semibold text-sm ${quest.complete ? 'text-green-700 line-through' : 'text-gray-700'}`}>{quest.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${quest.complete ? 'bg-green-500' : 'bg-purple-500'}`}
                        style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500">{quest.progress}/{quest.target}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {quest.reward.type === 'coins' && <Coins className="w-4 h-4 text-yellow-500" />}
                    {quest.reward.type === 'food' && <Apple className="w-4 h-4 text-green-500" />}
                    <span className="text-xs font-semibold text-gray-600">{quest.reward.amount}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Center Column */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Currency bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-200">
                <Coins className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-700">{mounted ? coins : 0}</span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full border-2 border-green-200">
                <Apple className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-700">{mounted ? food : 0}</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full border-2 border-purple-200">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-700">320</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full border border-white/50">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded" />
              <span className="font-semibold text-gray-700">Rainy</span>
              <span className="text-gray-500">18°C</span>
            </div>
          </motion.div>

          {/* Debug shortcut buttons */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 justify-center"
          >
            <button 
              onClick={() => { devAddCoins(100); updateDailyQuest('earnCoins', 100); }}
              className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded-xl font-semibold text-yellow-700 transition-all border border-yellow-200"
            >
              <Coins className="w-4 h-4" />
              +100 Coins
            </button>
            <button 
              onClick={() => { devAddFood(50); }}
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-xl font-semibold text-green-700 transition-all border border-green-200"
            >
              <Apple className="w-4 h-4" />
              +50 Food
            </button>
            <button 
              onClick={() => devSpawnEgg('rare')}
              className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 px-4 py-2 rounded-xl font-semibold text-purple-700 transition-all border border-purple-200"
            >
              <Gift className="w-4 h-4" />
              Spawn Rare Egg
            </button>
            <button 
              onClick={() => devIncreaseIslandLevel()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl font-semibold text-gray-700 transition-all border border-gray-200"
            >
              <Settings className="w-4 h-4" />
              Dev Panel
            </button>
          </motion.div>

          {/* Main island canvas */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/30"
          >
            <IslandRenderer />
          </motion.div>

          {/* Navigation tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-center"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-1.5 shadow-xl border border-white/50">
              <div className="flex gap-1">
                {[
                  { id: 'island', icon: Home, label: 'Island' },
                  { id: 'creatures', icon: Sprout, label: 'Creatures' },
                  { id: 'shop', icon: ShoppingCart, label: 'Shop' },
                  { id: 'daily', icon: Calendar, label: 'Daily' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="w-80 flex-shrink-0 space-y-4">
          {/* Daily Chest Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/30"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Daily Chest</h3>
            <div className="flex flex-col items-center py-4">
              <MysteryChest onClick={handleDailyLogin} disabled={dailyRewardClaimed} />
              <p className={`text-sm mt-3 font-semibold ${dailyRewardClaimed ? 'text-gray-500' : 'text-purple-600'}`}>{dailyRewardClaimed ? 'Come back tomorrow!' : 'Ready to open!'}</p>
            </div>
            <button
              onClick={handleDailyLogin}
              disabled={dailyRewardClaimed}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${dailyRewardClaimed ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl'}`}
            >
              {dailyRewardClaimed ? 'Claimed!' : 'Open Chest'}
            </button>
          </motion.div>

          {/* Island Rank Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/30"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Island Rank</h3>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M50 10 L65 35 L95 38 L72 58 L78 88 L50 74 L22 88 L28 58 L5 38 L35 35 Z" fill="url(#trophyGradient)" />
                  <path d="M50 25 L60 40 L80 42 L66 55 L70 75 L50 65 L30 75 L34 55 L20 42 L40 40 Z" fill="#fbbf24" />
                  <circle cx="50" cy="52" r="10" fill="#fef3c7" />
                  <text x="50" y="56" textAnchor="middle" fill="#854d0e" fontSize="12" fontWeight="bold">III</text>
                  <defs>
                    <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fde68a" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Bronze III</h4>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">320 / 500</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-full">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: '64%' }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals and Sub-panels */}
      <AnimatePresence>
        {activeTab !== 'island' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveTab('island')}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center gap-3">
                  {activeTab === 'creatures' && <Sprout className="w-6 h-6 text-indigo-600" />}
                  {activeTab === 'shop' && <ShoppingCart className="w-6 h-6 text-orange-600" />}
                  {activeTab === 'daily' && <Calendar className="w-6 h-6 text-purple-600" />}
                  <h2 className="text-2xl font-bold text-gray-900">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                </div>
                <button onClick={() => setActiveTab('island')} className="p-2 hover:bg-white rounded-full transition-colors">
                  <ChevronRight className="w-6 h-6 text-gray-500 rotate-180" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'creatures' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{creatures.length} / 20</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {['sprout', 'ember', 'aqua', 'volt', 'crystalSprout', 'shadowEmber', 'coralAqua', 'stormVolt'].map((type, idx) => {
                        const owned = creatures.some(c => c.type === type);
                        return (
                          <motion.div
                            key={type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              const creature = creatures.find(c => c.type === type);
                              if (creature) setSelectedCreature(creature);
                            }}
                            className={`aspect-square rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${owned ? 'bg-gradient-to-br from-white to-gray-50 hover:shadow-lg border border-gray-100' : 'bg-gray-100'}`}
                          >
                            {owned ? (
                              <>
                                <CreatureSprite 
                                  creature={creatures.find(c => c.type === type)!} 
                                  size={80} 
                                />
                                <span className="font-bold text-gray-800 mt-2 capitalize">{type}</span>
                                <span className="text-xs text-gray-500">Lv. {creatures.find(c => c.type === type)?.level}</span>
                              </>
                            ) : (
                              <>
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                  <span className="text-3xl text-gray-300">?</span>
                                </div>
                                <span className="font-bold text-gray-400 capitalize">{type}</span>
                              </>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => { setActiveTab('island'); setTimeout(() => setActiveTab('encyclopedia' as any), 100); }}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-700 transition-all"
                    >
                      <BookOpen className="w-5 h-5" />
                      View Encyclopedia
                    </button>
                  </div>
                )}

                {activeTab === 'shop' && (
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <MerchantAvatar dialogueType="welcome" />
                    </div>
                    <div className="flex-1">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Gift className="w-4 h-4 text-purple-500" />
                            Eggs
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            {SHOP_ITEMS.filter(i => i.category === 'eggs').map((item, idx) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => {
                                  if (coins >= item.price) {
                                    if (item.tier) {
                                      buyEgg(item.tier);
                                      setActiveTab('island');
                                    }
                                  }
                                }}
                                className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg cursor-pointer transition-all"
                              >
                                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                                  <span className="text-3xl">🥚</span>
                                </div>
                                <h5 className="font-bold text-gray-800 text-center">{item.name}</h5>
                                <div className="flex items-center justify-center gap-1 mt-2 px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full">
                                  <Coins className="w-4 h-4 text-orange-600" />
                                  <span className="font-bold text-orange-700">{item.price}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Apple className="w-4 h-4 text-green-500" />
                            Food
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            {SHOP_ITEMS.filter(i => i.category === 'food').map((item, idx) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.15 + idx * 0.05 }}
                                onClick={() => {
                                  if (coins >= item.price) {
                                    addCoins(-item.price);
                                    addFood(100);
                                  }
                                }}
                                className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg cursor-pointer transition-all"
                              >
                                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                                  <Apple className="w-10 h-10 text-green-500" />
                                </div>
                                <h5 className="font-bold text-gray-800 text-center">{item.name}</h5>
                                <div className="flex items-center justify-center gap-1 mt-2 px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full">
                                  <Coins className="w-4 h-4 text-orange-600" />
                                  <span className="font-bold text-orange-700">{item.price}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'daily' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800 text-lg">Daily Rewards</h4>
                      <div className="grid grid-cols-7 gap-2">
                        {[1,2,3,4,5,6,7].map((day, idx) => (
                          <motion.div
                            key={day}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold ${idx < 2 ? 'bg-green-100 text-green-700' : idx === 2 ? 'bg-purple-200 text-purple-800 scale-110 shadow-lg' : 'bg-gray-100 text-gray-400'}`}
                          >
                            {idx < 2 && <CheckCircle className="w-4 h-4 mb-1" />}
                            Day {day}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800 text-lg">Quest Progress</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'Play Games', progress: '2/3' },
                          { name: 'Collect Coins', progress: '120/200' },
                          { name: 'Feed a Pet', progress: 'Complete!' },
                        ].map((q, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold text-gray-700">{q.name}</span>
                              <span className="text-gray-500">{q.progress}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-500" style={{ width: idx === 0 ? '66%' : idx === 1 ? '60%' : '100%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encyclopedia modal hack */}
      {activeTab === ('encyclopedia' as any) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveTab('island')}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                Encyclopedia
              </h2>
              <button onClick={() => setActiveTab('island')} className="p-2 hover:bg-white rounded-full transition-colors">
                <ChevronRight className="w-6 h-6 text-gray-500 rotate-180" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <Encyclopedia />
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedCreature && (
        <CreatureDetailModal
          creature={selectedCreature}
          onClose={() => setSelectedCreature(null)}
        />
      )}

      {/* Reward reveal modal */}
      {showRewardModal && currentReward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowRewardModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">Daily Chest</h2>
            <div className="text-center mb-8">
              <div className="relative w-32 h-32 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="15" y="45" width="70" height="45" rx="8" fill="#78350f" />
                  <rect x="20" y="50" width="60" height="35" rx="5" fill="#a16207" />
                  <path d="M10 45 L10 30 Q50 10 90 30 L90 45" fill="#854d0e" />
                  <path d="M15 42 L15 33 Q50 18 85 33 L85 42" fill="#ca8a04" />
                  <rect x="45" y="55" width="10" height="10" rx="2" fill="#fbbf24" />
                  <circle cx="50" cy="60" r="3" fill="#78350f" />
                  {[...Array(6)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={20 + i * 15}
                      cy={20 + Math.sin(i) * 10}
                      r={3}
                      fill={['#fbbf24', '#f472b6', '#34d399', '#60a5fa', '#f472b6', '#fbbf24'][i]}
                      animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </svg>
              </div>
              <p className="text-purple-200 text-lg mt-4">You received:</p>
            </div>
            <div className="flex justify-center gap-4 mb-8">
              {currentReward.type === 'coins' && (
                <div className="bg-yellow-400/20 px-6 py-4 rounded-2xl flex flex-col items-center">
                  <Coins className="w-12 h-12 text-yellow-400" />
                  <span className="text-white font-bold text-2xl mt-2">{currentReward.amount}</span>
                </div>
              )}
              {currentReward.type === 'food' && (
                <div className="bg-green-400/20 px-6 py-4 rounded-2xl flex flex-col items-center">
                  <Apple className="w-12 h-12 text-green-400" />
                  <span className="text-white font-bold text-2xl mt-2">{currentReward.amount}</span>
                </div>
              )}
              {currentReward.type === 'egg' && (
                <div className="bg-purple-400/20 px-6 py-4 rounded-2xl flex flex-col items-center">
                  <Gift className="w-12 h-12 text-purple-400" />
                  <span className="text-white font-bold text-xl mt-2">Rare Egg</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowRewardModal(false)}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-2xl font-bold text-xl hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
            >
              Claim All
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
