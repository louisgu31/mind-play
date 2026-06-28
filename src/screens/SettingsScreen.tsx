import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Moon, Sun, Volume2, VolumeX, Trash2, AlertTriangle, RefreshCw, Download, CheckCircle, XCircle, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

declare global {
  interface Window {
    electronAPI?: {
      isDesktop: boolean;
      checkForUpdates: () => Promise<{ success: boolean; updateInfo?: any; error?: string }>;
      downloadUpdate: () => Promise<{ success: boolean; error?: string }>;
      installUpdate: () => Promise<{ success: boolean }>;
      getAppVersion: () => Promise<string>;
      onUpdateMessage: (callback: (data: any) => void) => void;
      removeUpdateListener: () => void;
    };
  }
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
  const [appVersion, setAppVersion] = useState<string>('');
  const [updateStatus, setUpdateStatus] = useState<string>('idle');
  const [updateVersion, setUpdateVersion] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [updateError, setUpdateError] = useState<string>('');
  const isDesktop = typeof window !== 'undefined' && !!window.electronAPI;

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then(version => {
        setAppVersion(version);
      });

      window.electronAPI.onUpdateMessage((data: any) => {
        if (data.message === 'Checking for update...') {
          setUpdateStatus('checking');
        } else if (data.message === 'update-available') {
          setUpdateStatus('available');
          setUpdateVersion(data.version);
        } else if (data.message === 'update-not-available') {
          setUpdateStatus('not-available');
        } else if (data.message === 'update-error') {
          setUpdateStatus('error');
          setUpdateError(data.error);
        } else if (data.message === 'download-progress') {
          setUpdateStatus('downloading');
          setDownloadProgress(data.percent);
        } else if (data.message === 'update-downloaded') {
          setUpdateStatus('downloaded');
          setUpdateVersion(data.version);
        }
      });

      return () => {
        window.electronAPI?.removeUpdateListener();
      };
    }
  }, []);

  const handleCheckUpdates = async () => {
    if (!window.electronAPI) return;
    setUpdateError('');
    setUpdateStatus('checking');
    const result = await window.electronAPI.checkForUpdates();
    if (!result.success) {
      setUpdateStatus('error');
      setUpdateError(result.error || 'Unknown error');
    }
  };

  const handleDownloadUpdate = async () => {
    if (!window.electronAPI) return;
    setUpdateError('');
    setUpdateStatus('downloading');
    const result = await window.electronAPI.downloadUpdate();
    if (!result.success) {
      setUpdateStatus('error');
      setUpdateError(result.error || 'Unknown error');
    }
  };

  const handleInstallUpdate = async () => {
    if (!window.electronAPI) return;
    await window.electronAPI.installUpdate();
  };

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
        {isDesktop && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-4 rounded-2xl",
              theme === 'light' ? "bg-white shadow-sm" : "bg-gray-900 shadow-lg"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <RefreshCw className={cn("w-6 h-6", theme === 'light' ? "text-blue-500" : "text-blue-400")} />
                <div>
                  <span className={cn("font-medium block", theme === 'light' ? "text-gray-900" : "text-white")}>
                    Check for Updates
                  </span>
                  <span className={cn("text-xs", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
                    Version {appVersion || '...'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCheckUpdates}
                disabled={updateStatus === 'checking' || updateStatus === 'downloading'}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  (updateStatus === 'checking' || updateStatus === 'downloading')
                    ? (theme === 'light' ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-800 text-gray-600 cursor-not-allowed")
                    : (theme === 'light' ? "bg-blue-100 text-blue-600 hover:bg-blue-200" : "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50")
                )}
              >
                {updateStatus === 'checking' ? 'Checking...' : 'Check'}
              </button>
            </div>

            {updateStatus === 'available' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  "mt-3 p-3 rounded-xl flex items-center justify-between",
                  theme === 'light' ? "bg-blue-50" : "bg-blue-900/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <Download className={cn("w-5 h-5", theme === 'light' ? "text-blue-600" : "text-blue-400")} />
                  <div>
                    <p className={cn("text-sm font-medium", theme === 'light' ? "text-blue-900" : "text-blue-300")}>
                      Version {updateVersion} available!
                    </p>
                    <p className={cn("text-xs", theme === 'light' ? "text-blue-600" : "text-blue-400")}>
                      A new version is ready to download
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadUpdate}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Download
                </button>
              </motion.div>
            )}

            {updateStatus === 'downloading' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  "mt-3 p-3 rounded-xl",
                  theme === 'light' ? "bg-blue-50" : "bg-blue-900/20"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className={cn("w-5 h-5 animate-spin", theme === 'light' ? "text-blue-600" : "text-blue-400")} />
                  <p className={cn("text-sm font-medium", theme === 'light' ? "text-blue-900" : "text-blue-300")}>
                    Downloading update...
                  </p>
                </div>
                <div className={cn(
                  "w-full h-2 rounded-full overflow-hidden",
                  theme === 'light' ? "bg-blue-200" : "bg-blue-800"
                )}>
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${downloadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className={cn("text-xs mt-1 text-right", theme === 'light' ? "text-blue-600" : "text-blue-400")}>
                  {Math.round(downloadProgress)}%
                </p>
              </motion.div>
            )}

            {updateStatus === 'downloaded' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  "mt-3 p-3 rounded-xl flex items-center justify-between",
                  theme === 'light' ? "bg-green-50" : "bg-green-900/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className={cn("w-5 h-5", theme === 'light' ? "text-green-600" : "text-green-400")} />
                  <div>
                    <p className={cn("text-sm font-medium", theme === 'light' ? "text-green-900" : "text-green-300")}>
                      Version {updateVersion} ready!
                    </p>
                    <p className={cn("text-xs", theme === 'light' ? "text-green-600" : "text-green-400")}>
                      Restart to install
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleInstallUpdate}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  Install Now
                </button>
              </motion.div>
            )}

            {updateStatus === 'not-available' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  "mt-3 p-3 rounded-xl flex items-center gap-2",
                  theme === 'light' ? "bg-gray-100" : "bg-gray-800"
                )}
              >
                <CheckCircle className={cn("w-5 h-5", theme === 'light' ? "text-green-600" : "text-green-400")} />
                <p className={cn("text-sm", theme === 'light' ? "text-gray-700" : "text-gray-300")}>
                  You're up to date!
                </p>
              </motion.div>
            )}

            {updateStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  "mt-3 p-3 rounded-xl flex items-center gap-2",
                  theme === 'light' ? "bg-red-50" : "bg-red-900/20"
                )}
              >
                <XCircle className={cn("w-5 h-5", theme === 'light' ? "text-red-600" : "text-red-400")} />
                <p className={cn("text-sm", theme === 'light' ? "text-red-700" : "text-red-300")}>
                  {updateError || 'Failed to check for updates'}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

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
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
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

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            "p-4 rounded-2xl",
            theme === 'light' ? "bg-white shadow-sm" : "bg-gray-900 shadow-lg"
          )}
        >
          <div className="flex items-center gap-3">
            <Info className={cn("w-6 h-6", theme === 'light' ? "text-gray-400" : "text-gray-500")} />
            <div>
              <span className={cn("font-medium block", theme === 'light' ? "text-gray-900" : "text-white")}>
                MindPlay
              </span>
              <span className={cn("text-xs", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
                {isDesktop ? `Version ${appVersion || '...'} (Desktop)` : 'Web Version'}
              </span>
            </div>
          </div>
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
