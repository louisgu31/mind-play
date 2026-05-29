import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy, Gamepad2, Flame, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function StatsScreen() {
  const { t } = useTranslation();
  const theme = useAppStore((state) => state.theme);
  const appStats = useAppStore((state) => state.stats);

  const stats = [
    { label: 'Total XP', value: appStats.xp.toString(), icon: Trophy, color: 'text-yellow-500' },
    { label: 'Games Played', value: appStats.gamesPlayed.toString(), icon: Gamepad2, color: 'text-blue-500' },
    { label: 'Current Streak', value: appStats.dailyStreak.toString(), icon: Flame, color: 'text-orange-500' },
    { label: 'Games Won', value: appStats.gamesWon.toString(), icon: TrendingUp, color: 'text-green-500' },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("text-3xl font-bold mb-8", theme === 'light' ? "text-gray-900" : "text-white")}
      >
        {t('nav.stats')}
      </motion.h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-6 rounded-2xl text-center",
              theme === 'light' ? "bg-white shadow-sm" : "bg-gray-900 shadow-lg"
            )}
          >
            <stat.icon className={cn("w-10 h-10 mx-auto mb-3", stat.color)} />
            <div className={cn("text-3xl font-bold mb-1", theme === 'light' ? "text-gray-900" : "text-white")}>
              {stat.value}
            </div>
            <div className={cn("text-sm", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={cn(
          "p-6 rounded-2xl",
          theme === 'light' ? "bg-white shadow-sm" : "bg-gray-900 shadow-lg"
        )}
      >
        <h3 className={cn("font-semibold mb-4", theme === 'light' ? "text-gray-900" : "text-white")}>
          Recent Activity
        </h3>
        {appStats.gamesPlayed > 0 ? (
          <div className="space-y-3">
            <div className={cn("flex items-center justify-between py-2", theme === 'light' ? "border-b border-gray-100" : "border-b border-gray-800")}>
              <span className={cn("text-sm", theme === 'light' ? "text-gray-600" : "text-gray-300")}>Last Played</span>
              <span className={cn("text-sm font-medium", theme === 'light' ? "text-gray-900" : "text-white")}>
                {appStats.lastPlayedDate ? new Date(appStats.lastPlayedDate).toLocaleDateString() : 'Never'}
              </span>
            </div>
            <div className={cn("flex items-center justify-between py-2", theme === 'light' ? "border-b border-gray-100" : "border-b border-gray-800")}>
              <span className={cn("text-sm", theme === 'light' ? "text-gray-600" : "text-gray-300")}>Win Rate</span>
              <span className={cn("text-sm font-medium", theme === 'light' ? "text-gray-900" : "text-white")}>
                {appStats.gamesPlayed > 0 ? Math.round((appStats.gamesWon / appStats.gamesPlayed) * 100) : 0}%
              </span>
            </div>
            <div className={cn("flex items-center justify-between py-2")}>
              <span className={cn("text-sm", theme === 'light' ? "text-gray-600" : "text-gray-300")}>Current Streak</span>
              <span className={cn("text-sm font-medium", theme === 'light' ? "text-gray-900" : "text-white")}>
                {appStats.dailyStreak} days
              </span>
            </div>
          </div>
        ) : (
          <div className={cn("text-center py-8", theme === 'light' ? "text-gray-400" : "text-gray-600")}>
            No activity yet. Start playing!
          </div>
        )}
      </motion.div>
    </div>
  );
}
