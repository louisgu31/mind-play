import { motion } from 'framer-motion';
import { Download, Monitor, Globe, CheckCircle2, Terminal } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAppStore } from '../store';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function DownloadScreen() {
  const theme = useAppStore((state) => state.theme);

  const downloads = [
    {
      platform: 'macOS (Apple Silicon)',
      icon: Monitor,
      description: 'For Mac with M1/M2/M3 chips',
      color: 'from-blue-500 to-indigo-600',
      size: '~120 MB',
      link: 'https://github.com/louisgu31/mind-play/releases/download/v1.0.1/MindPlay-1.0.0-arm64.dmg',
      recommended: true
    },
    {
      platform: 'Web (Beta)',
      icon: Globe,
      description: 'Play directly in your browser',
      color: 'from-orange-500 to-red-600',
      size: 'Instant',
      link: 'https://louisgu31.github.io/mind-play/'
    }
  ];

  const features = [
    'No internet required to play',
    'Full-screen gaming experience',
    'Automatic saves and progress tracking',
    'Dark and light theme support',
    'Daily challenges and XP system',
    'Multiple brain-training games included'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-20",
          theme === 'light' ? "bg-purple-300" : "bg-purple-700"
        )} />
        <div className={cn(
          "absolute top-60 right-20 w-80 h-80 rounded-full blur-3xl animate-pulse opacity-20",
          theme === 'light' ? "bg-blue-300" : "bg-blue-700"
        )} style={{ animationDelay: '1s' }} />
        <div className={cn(
          "absolute bottom-20 left-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse opacity-20",
          theme === 'light' ? "bg-green-300" : "bg-green-700"
        )} style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full shadow-lg mb-6"
          >
            <Download className="w-5 h-5" />
            <span className="font-semibold">Download MindPlay</span>
          </motion.div>
          
          <h1 className={cn(
            "text-5xl font-extrabold mb-4",
            theme === 'light' ? "text-gray-900" : "text-white"
          )}>
            Get MindPlay on Your Device
          </h1>
          
          <p className={cn(
            "text-xl max-w-2xl mx-auto",
            theme === 'light' ? "text-gray-600" : "text-gray-300"
          )}>
            Download our desktop app for the best gaming experience or play directly in your browser!
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl",
                theme === 'light' ? "bg-white shadow-md" : "bg-gray-800/50"
              )}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className={cn(
                "text-sm font-medium",
                theme === 'light' ? "text-gray-700" : "text-gray-200"
              )}>
                {feature}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Downloads Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {downloads.map((download, index) => (
            <motion.div
              key={download.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={cn(
                "relative p-6 rounded-3xl shadow-xl overflow-hidden transition-all duration-300",
                theme === 'light' ? "bg-white" : "bg-gray-800 border border-gray-700"
              )}
            >
              {download.recommended && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Recommended
                </div>
              )}
              
              <div className={cn(
                "p-4 rounded-2xl w-fit mb-4 bg-gradient-to-br",
                download.color
              )}>
                <download.icon className="w-10 h-10 text-white" />
              </div>
              
              <h3 className={cn(
                "text-2xl font-bold mb-2",
                theme === 'light' ? "text-gray-900" : "text-white"
              )}>
                {download.platform}
              </h3>
              
              <p className={cn(
                "mb-4",
                theme === 'light' ? "text-gray-600" : "text-gray-400"
              )}>
                {download.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-sm font-semibold",
                  theme === 'light' ? "text-gray-500" : "text-gray-500"
                )}>
                  {download.size}
                </span>
                
                <a
                  href={download.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r",
                    download.color,
                    "text-white shadow-lg hover:shadow-xl"
                  )}
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* macOS Gatekeeper Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={cn(
            "p-6 rounded-3xl mb-12",
            theme === 'light' ? "bg-yellow-50 border border-yellow-200" : "bg-yellow-900/20 border border-yellow-800"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-2xl flex-shrink-0",
              theme === 'light' ? "bg-yellow-100" : "bg-yellow-800/30"
            )}>
              <Terminal className={cn("w-6 h-6", theme === 'light' ? "text-yellow-600" : "text-yellow-400")} />
            </div>
            <div className="flex-1">
              <h3 className={cn(
                "text-lg font-bold mb-2",
                theme === 'light' ? "text-yellow-800" : "text-yellow-200"
              )}>
                macOS users: Quick fix for "damaged app" message
              </h3>
              <p className={cn(
                "mb-4",
                theme === 'light' ? "text-yellow-700" : "text-yellow-300"
              )}>
                Our app isn't signed with Apple yet (it costs $99/year!). Here's how to open it:
              </p>
              <ol className={cn(
                "list-decimal list-inside space-y-2 mb-4",
                theme === 'light' ? "text-yellow-700" : "text-yellow-300"
              )}>
                <li>Open <strong>Terminal</strong> (Applications &gt; Utilities)</li>
                <li>Paste this command and press Enter:</li>
              </ol>
              <div className={cn(
                "p-4 rounded-xl font-mono text-sm mb-4 select-all cursor-copy",
                theme === 'light' ? "bg-white border border-yellow-200" : "bg-gray-900 border border-yellow-800"
              )}>
                xattr -cr /Applications/MindPlay.app
              </div>
              <p className={cn(
                "text-sm",
                theme === 'light' ? "text-yellow-600" : "text-yellow-400"
              )}>
                Now you can open MindPlay normally from Applications! 🎉
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <p className={cn(
            "text-sm",
            theme === 'light' ? "text-gray-500" : "text-gray-400"
          )}>
            Having trouble downloading? Contact our support team for assistance.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
