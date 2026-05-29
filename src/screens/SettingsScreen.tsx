import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Moon, Sun, Volume2, VolumeX, Trash2, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useAppStore((state) => state.theme);
  const language = useAppStore((state) => state.language);
  const sound = useAppStore((state) => state.sound);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const toggleSound = useAppStore((state) => state.toggleSound);
  const resetProgress = useAppStore((state) => state.resetProgress);
  const stats = useAppStore((state) => state.stats);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("text-3xl font-bold mb-8", theme === 'light' ? "text-gray-900" : "text-white")}
      >
        {t('nav.settings')}
      </motion.h1>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "p-4 rounded-2xl",
            theme === 'light' ? "bg-white shadow-sm" : "bg-gray-900 shadow-lg"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className={cn("w-6 h-6", theme === 'light' ? "text-blue-500" : "text-blue-400")} />
              <span className={cn("font-medium", theme === 'light' ? "text-gray-900" : "text-white")}>
                {t('settings.language')}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                  language === 'en'
                    ? (theme === 'light' ? "bg-blue-500 text-white" : "bg-blue-600 text-white")
                    : (theme === 'light' ? "bg-gray-100 text-gray-600" : "bg-gray-800 text-gray-300")
                )}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('zh')}
                className={cn(
                  "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                  language === 'zh'
                    ? (theme === 'light' ? "bg-blue-500 text-white" : "bg-blue-600 text-white")
                    : (theme === 'light' ? "bg-gray-100 text-gray-600" : "bg-gray-800 text-gray-300")
                )}
              >
                中文
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-4 rounded-2xl",
            theme === 'light' ? "bg-white shadow-sm" : "bg-gray-900 shadow-lg"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-indigo-400" />
              )}
              <span className={cn("font-medium", theme === 'light' ? "text-gray-900" : "text-white")}>
                {t('settings.theme')}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className={cn(
                "w-14 h-7 rounded-full relative transition-colors",
                theme === 'light' ? "bg-gray-200" : "bg-blue-600"
              )}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm",
                  theme === 'light' ? "left-1" : "left-8"
                )}
              />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-4 rounded-2xl",
            theme === 'light' ? "bg-white shadow-sm" : "bg-gray-900 shadow-lg"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {sound ? (
                <Volume2 className={cn("w-6 h-6", theme === 'light' ? "text-green-500" : "text-green-400")} />
              ) : (
                <VolumeX className={cn("w-6 h-6", theme === 'light' ? "text-red-500" : "text-red-400")} />
              )}
              <span className={cn("font-medium", theme === 'light' ? "text-gray-900" : "text-white")}>
                {t('settings.sound')}
              </span>
            </div>
            <button
              onClick={toggleSound}
              className={cn(
                "w-14 h-7 rounded-full relative transition-colors",
                sound ? (theme === 'light' ? "bg-green-500" : "bg-green-600") : (theme === 'light' ? "bg-gray-200" : "bg-gray-700")
              )}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm",
                  sound ? "left-8" : "left-1"
                )}
              />
            </button>
          </div>
        </motion.div>

        {/* Reset Progress Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "p-4 rounded-2xl",
            theme === 'light' ? "bg-white shadow-sm" : "bg-gray-900 shadow-lg"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 className={cn("w-6 h-6", theme === 'light' ? "text-red-500" : "text-red-400")} />
              <span className={cn("font-medium", theme === 'light' ? "text-gray-900" : "text-white")}>
                Reset Progress
              </span>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={stats.gamesPlayed === 0}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                stats.gamesPlayed === 0
                  ? (theme === 'light' ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-800 text-gray-600 cursor-not-allowed")
                  : (theme === 'light' ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-red-900/30 text-red-400 hover:bg-red-900/50")
              )}
            >
              Reset
            </button>
          </div>
          <p className={cn("text-xs mt-2 ml-9", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
            Clear all game progress, XP, and stats. This action cannot be undone.
          </p>
        </motion.div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "max-w-sm w-full p-6 rounded-2xl shadow-xl",
                theme === 'light' ? "bg-white" : "bg-gray-900"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "p-2 rounded-full",
                  theme === 'light' ? "bg-red-100" : "bg-red-900/30"
                )}>
                  <AlertTriangle className={cn("w-6 h-6", theme === 'light' ? "text-red-600" : "text-red-400")} />
                </div>
                <h3 className={cn("text-lg font-semibold", theme === 'light' ? "text-gray-900" : "text-white")}>
                  Reset All Progress?
                </h3>
              </div>
              
              <p className={cn("text-sm mb-6", theme === 'light' ? "text-gray-600" : "text-gray-300")}>
                This will permanently delete all your game progress, including:
              </p>
              
              <ul className={cn("text-sm mb-6 space-y-1", theme === 'light' ? "text-gray-600" : "text-gray-300")}>
                <li>• {stats.gamesPlayed} games played</li>
                <li>• {stats.xp} XP points</li>
                <li>• Level {useAppStore((state) => state.level)} progress</li>
                <li>• {stats.dailyStreak} day streak</li>
              </ul>
              
              <p className={cn("text-xs mb-6", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
                Your theme and language preferences will be preserved.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg font-medium transition-colors",
                    theme === 'light' 
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetProgress();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
