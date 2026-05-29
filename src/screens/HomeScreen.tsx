import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Flame, Trophy, Play, Gamepad2, Type, Grid3X3, Brain, Heart, Zap, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useAppStore((state) => state.theme);
  const stats = useAppStore((state) => state.stats);
  const level = useAppStore((state) => state.level);
  const totalXp = useAppStore((state) => state.totalXp);
  const xpForNext = useAppStore((state) => state.xpForNextLevel);
  const xpForCurrent = useAppStore((state) => state.xpForCurrentLevel);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const games = [
    { id: 'wordle', title: t('games.wordle.title'), description: t('games.wordle.description'), icon: Type, color: 'from-green-500 to-emerald-600', gradient: 'bg-gradient-to-br from-green-500 to-emerald-600', path: '/games/wordle' },
    { id: 'crossword', title: t('games.crossword.title'), description: t('games.crossword.description'), icon: Grid3X3, color: 'from-blue-500 to-indigo-600', gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600', path: '/games/crossword' },
    { id: 'connections', title: t('games.connections.title'), description: t('games.connections.description'), icon: Brain, color: 'from-purple-500 to-pink-600', gradient: 'bg-gradient-to-br from-purple-500 to-pink-600', path: '/games/connections' },
    { id: 'chess', title: t('games.chess.title'), description: t('games.chess.description'), icon: Trophy, color: 'from-orange-500 to-red-600', gradient: 'bg-gradient-to-br from-orange-500 to-red-600', path: '/games/chess' },
    { id: 'sudoku', title: t('games.sudoku.title'), description: t('games.sudoku.description'), icon: Grid3X3, color: 'from-yellow-500 to-amber-600', gradient: 'bg-gradient-to-br from-yellow-500 to-amber-600', path: '/games/sudoku' },
    { id: 'memory', title: t('games.memory.title'), description: t('games.memory.description'), icon: Heart, color: 'from-pink-500 to-rose-600', gradient: 'bg-gradient-to-br from-pink-500 to-rose-600', path: '/games/memory' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl animate-pulse opacity-20",
          theme === 'light' ? "bg-purple-300" : "bg-purple-700"
        )} />
        <div className={cn(
          "absolute top-40 right-20 w-48 h-48 rounded-full blur-3xl animate-pulse opacity-20",
          theme === 'light' ? "bg-blue-300" : "bg-blue-700"
        )} style={{ animationDelay: '1s' }} />
        <div className={cn(
          "absolute bottom-40 left-1/4 w-40 h-40 rounded-full blur-3xl animate-pulse opacity-20",
          theme === 'light' ? "bg-green-300" : "bg-green-700"
        )} style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-md mx-auto px-4 py-6 relative z-10">
        {/* Sticky Progress Header */}
        <div className={cn(
          "sticky top-0 z-30 mb-6 -mx-4 px-4 py-3 shadow-lg backdrop-blur-xl",
          theme === 'light' ? "bg-white/90" : "bg-gray-900/90"
        )}>
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-sm font-semibold",
              theme === 'light' ? "text-gray-700" : "text-gray-200"
            )}>
              Progress
            </span>
            
            <div className="flex items-center gap-3">
              {/* XP */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1.5 rounded-full shadow-md"
              >
                <Zap className="w-5 h-5 text-white" />
                <span className="font-bold text-white">Lvl {mounted ? level : 1}</span>
              </motion.div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          {mounted && (
            <div className="mt-3">
              <div className={cn(
                "h-2 rounded-full overflow-hidden",
                theme === 'light' ? "bg-gray-200" : "bg-gray-700"
              )}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((totalXp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100, 100)}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className={cn("text-xs font-medium", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
                  {totalXp} XP
                </span>
                <span className={cn("text-xs font-medium", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
                  {xpForNext} XP
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Header with Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className={cn(
            "p-6 rounded-3xl mb-6 shadow-xl",
            theme === 'light' 
              ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white" 
              : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  {t('app.name')}
                </h1>
                <p className="text-sm opacity-90">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                theme === 'light' ? "bg-white/20 backdrop-blur-sm" : "bg-white/10"
              )}>
                <Flame className="w-6 h-6 fill-current animate-pulse" />
                <span className="font-bold text-xl">{mounted ? stats.dailyStreak : 0}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "p-3 rounded-2xl text-center",
                  theme === 'light' ? "bg-white/20 backdrop-blur-sm" : "bg-white/10"
                )}
              >
                <Trophy className="w-6 h-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{mounted ? stats.xp : 0}</div>
                <div className="text-xs opacity-80">XP</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "p-3 rounded-2xl text-center",
                  theme === 'light' ? "bg-white/20 backdrop-blur-sm" : "bg-white/10"
                )}
              >
                <Gamepad2 className="w-6 h-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{mounted ? stats.gamesPlayed : 0}</div>
                <div className="text-xs opacity-80">Played</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "p-3 rounded-2xl text-center",
                  theme === 'light' ? "bg-white/20 backdrop-blur-sm" : "bg-white/10"
                )}
              >
                <Target className="w-6 h-6 mx-auto mb-1" />
                <div className="text-2xl font-bold">{mounted ? stats.gamesWon : 0}</div>
                <div className="text-xs opacity-80">Wins</div>
              </motion.div>
            </div>
          </div>

          {/* Win Rate Bar */}
          {mounted && stats.gamesPlayed > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={cn(
                "p-4 rounded-2xl shadow-lg mb-4",
                theme === 'light' ? "bg-white" : "bg-gray-900"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className={cn("w-5 h-5", theme === 'light' ? "text-green-500" : "text-green-400")} />
                  <span className={cn("font-semibold", theme === 'light' ? "text-gray-900" : "text-white")}>
                    Win Rate
                  </span>
                </div>
                <span className={cn("font-bold", theme === 'light' ? "text-gray-900" : "text-white")}>
                  {Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%
                </span>
              </div>
              <div className={cn(
                "w-full h-2 rounded-full overflow-hidden",
                theme === 'light' ? "bg-gray-200" : "bg-gray-700"
              )}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.gamesWon / stats.gamesPlayed) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Games Grid */}
        <div className="mb-8">
          <h2 className={cn(
            "text-lg font-semibold mb-4 flex items-center gap-2",
            theme === 'light' ? "text-gray-900" : "text-white"
          )}>
            <Zap className="w-5 h-5 text-yellow-500" />
            {t('home.exploreGames')}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={game.path}>
                  <div className={cn(
                    "relative p-5 rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl group",
                    theme === 'light' ? "bg-white" : "bg-gray-900 border border-gray-700"
                  )}>
                    {/* Gradient Background */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                      game.gradient
                    )} />
                    
                    {/* Icon */}
                    <div className={cn(
                      "p-3 rounded-2xl w-fit mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300",
                      game.gradient
                    )}>
                      <game.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className={cn(
                      "font-bold text-lg mb-1 group-hover:translate-x-1 transition-transform duration-300",
                      theme === 'light' ? "text-gray-900" : "text-white"
                    )}>
                      {game.title}
                    </h3>
                    <p className={cn(
                      "text-xs mb-3 line-clamp-2",
                      theme === 'light' ? "text-gray-500" : "text-gray-400"
                    )}>
                      {game.description}
                    </p>
                    
                    {/* Play Indicator */}
                    <div className={cn(
                      "flex items-center justify-between",
                      theme === 'light' ? "text-gray-400" : "text-gray-500"
                    )}>
                      <span className="text-xs font-medium">Play Now</span>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        className="relative"
                      >
                        <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className={cn(
                      "absolute top-2 right-2 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                      game.gradient
                    )} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={cn(
            "p-4 rounded-2xl text-center",
            theme === 'light' 
              ? "bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-900" 
              : "bg-gradient-to-r from-yellow-900/20 to-orange-900/20 text-yellow-200"
          )}
        >
          <p className="text-sm font-medium">
            💡 Tip: Complete games to earn XP and maintain your daily streak!
          </p>
        </motion.div>

        {/* Recent Activity */}
        {mounted && stats.gamesPlayed > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className={cn(
              "mt-6 p-4 rounded-2xl",
              theme === 'light' ? "bg-gray-50" : "bg-gray-900/50"
            )}
          >
            <h3 className={cn(
              "font-semibold mb-3 flex items-center gap-2",
              theme === 'light' ? "text-gray-900" : "text-white"
            )}>
              <Trophy className="w-5 h-5 text-yellow-500" />
              Your Journey
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className={cn(
                  "text-2xl font-bold",
                  theme === 'light' ? "text-gray-900" : "text-white"
                )}>
                  {stats.gamesPlayed}
                </div>
                <div className={cn("text-xs", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
                  Games
                </div>
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold",
                  theme === 'light' ? "text-gray-900" : "text-white"
                )}>
                  {stats.gamesWon}
                </div>
                <div className={cn("text-xs", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
                  Wins
                </div>
              </div>
              <div>
                <div className={cn(
                  "text-2xl font-bold",
                  theme === 'light' ? "text-gray-900" : "text-white"
                )}>
                  {stats.dailyStreak}
                </div>
                <div className={cn("text-xs", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
                  Streak 🔥
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
