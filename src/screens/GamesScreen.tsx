import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Type, Grid3X3, Brain, Trophy, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function GamesScreen() {
  const { t } = useTranslation();
  const theme = useAppStore((state) => state.theme);

  const games = [
    { id: 'wordle', title: t('games.wordle.title'), description: t('games.wordle.description'), icon: Type, color: 'from-green-500 to-emerald-600', path: '/games/wordle' },
    { id: 'crossword', title: t('games.crossword.title'), description: t('games.crossword.description'), icon: Grid3X3, color: 'from-blue-500 to-indigo-600', path: '/games/crossword' },
    { id: 'connections', title: t('games.connections.title'), description: t('games.connections.description'), icon: Brain, color: 'from-purple-500 to-pink-600', path: '/games/connections' },
    { id: 'chess', title: t('games.chess.title'), description: t('games.chess.description'), icon: Trophy, color: 'from-orange-500 to-red-600', path: '/games/chess' },
    { id: 'sudoku', title: t('games.sudoku.title'), description: t('games.sudoku.description'), icon: Grid3X3, color: 'from-yellow-500 to-amber-600', path: '/games/sudoku' },
    { id: 'memory', title: t('games.memory.title'), description: t('games.memory.description'), icon: Heart, color: 'from-pink-500 to-rose-600', path: '/games/memory' },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("text-3xl font-bold mb-8", theme === 'light' ? "text-gray-900" : "text-white")}
      >
        {t('nav.games')}
      </motion.h1>

      <div className="space-y-4">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link to={game.path}>
              <div className={cn(
                "p-4 rounded-2xl flex items-center gap-4 cursor-pointer",
                theme === 'light' ? "bg-white shadow-sm hover:shadow-md" : "bg-gray-900 shadow-lg hover:shadow-xl"
              )}>
                <div className={cn("p-3 rounded-xl bg-gradient-to-br", game.color)}>
                  <game.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={cn("font-semibold", theme === 'light' ? "text-gray-900" : "text-white")}>
                    {game.title}
                  </h3>
                  <p className={cn("text-sm", theme === 'light' ? "text-gray-500" : "text-gray-400")}>
                    {game.description}
                  </p>
                </div>
                <Play className={cn("w-5 h-5", theme === 'light' ? "text-gray-400" : "text-gray-500")} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
