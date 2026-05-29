import { Link } from 'react-router-dom';
import { Home, Gamepad2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function NotFoundScreen() {
  const theme = useAppStore((state) => state.theme);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className={cn(
        "rounded-2xl p-6 shadow-sm",
        theme === 'light' ? "bg-white" : "bg-gray-900"
      )}>
        <p className={cn(
          "mb-2 text-sm font-semibold uppercase tracking-wide",
          theme === 'light' ? "text-blue-600" : "text-blue-400"
        )}>
          404
        </p>
        <h1 className={cn(
          "mb-3 text-3xl font-bold",
          theme === 'light' ? "text-gray-900" : "text-white"
        )}>
          Page not found
        </h1>
        <p className={cn(
          "mb-6 text-sm",
          theme === 'light' ? "text-gray-500" : "text-gray-400"
        )}>
          This route does not exist, but the app is still safe to use.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/games"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Gamepad2 className="h-5 w-5" />
            Go to Games
          </Link>
          <Link
            to="/"
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-colors",
              theme === 'light'
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                : "bg-gray-800 text-gray-100 hover:bg-gray-700"
            )}
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
