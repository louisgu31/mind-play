import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home, Gamepad2, Trophy, Settings, Download as DownloadIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import './i18n';
import { useAppStore } from './store';
import ErrorBoundary from './components/ErrorBoundary';
import HomeScreen from './screens/HomeScreen';
import GamesScreen from './screens/GamesScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';
import DownloadScreen from './screens/DownloadScreen';
import WordleScreen from './games/WordleScreen';
import ConnectionsScreen from './games/ConnectionsScreen';
import MemoryScreen from './games/MemoryScreen';
import SudokuScreen from './games/SudokuScreen';
import CrosswordScreen from './games/crossword-complete';
import ChessScreen from './games/ChessScreen';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useAppStore((state) => state.theme);
  const [isDesktop] = useState(() => typeof window !== 'undefined' && !!window.electronAPI);

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/games', icon: Gamepad2, label: t('nav.games') },
    ...(isDesktop ? [] : [{ path: '/download', icon: DownloadIcon, label: 'Download' }]),
    { path: '/stats', icon: Trophy, label: t('nav.stats') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 px-4 py-3 border-t",
      theme === 'light' ? "bg-white border-gray-200" : "bg-gray-900 border-gray-800"
    )}>
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
                  isActive
                    ? (theme === 'light' ? "bg-blue-50 text-blue-600" : "bg-blue-900/30 text-blue-400")
                    : (theme === 'light' ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-gray-200")
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "")} />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  const { i18n } = useTranslation();
  const theme = useAppStore((state) => state.theme);
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <ErrorBoundary>
        <div className={cn(
          "min-h-screen transition-colors duration-300 pb-20",
          theme === 'light' ? "bg-gray-50" : "bg-gray-950"
        )}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/games" element={<GamesScreen />} />
            <Route path="/download" element={<DownloadScreen />} />
            <Route path="/stats" element={<StatsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/games/wordle" element={<WordleScreen />} />
            <Route path="/games/connections" element={<ConnectionsScreen />} />
            <Route path="/games/memory" element={<MemoryScreen />} />
            <Route path="/games/sudoku" element={<SudokuScreen />} />
            <Route path="/games/crossword" element={<CrosswordScreen />} />
            <Route path="/games/chess" element={<ChessScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Navigation />
        </div>
      </ErrorBoundary>
    </Router>
  );
}
