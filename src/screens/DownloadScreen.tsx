import { motion } from 'framer-motion';
import { Download, Monitor, Globe, CheckCircle2 } from 'lucide-react';
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
      link: '#', // Replace with your actual link!
      recommended: true
    },
    {
      platform: 'Windows',
      icon: Monitor,
      description: 'For Windows 10/11',
      color: 'from-purple-500 to-pink-600',
      size: '~150 MB',
      link: '#',
      disabled: true // You haven't built Windows yet
    },
    {
      platform: 'Linux',
      icon: Monitor,
      description: 'For Ubuntu, Fedora, etc.',
      color: 'from-green-500 to-emerald-600',
      size: '~130 MB',
      link: '#',
      disabled: true // You haven't built Linux yet
    },
    {
      platform: 'Web (Beta)',
      icon: Globe,
      description: 'Play directly in your browser',
      color: 'from-orange-500 to-red-600',
      size: 'Instant',
      link: '/'
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
        <div className="grid md:grid-cols-2 gap-6">
          {downloads.map((download, index) => (
            <motion.div
              key={download.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={download.disabled ? {} : { y: -5, scale: 1.02 }}
              className={cn(
                "relative p-6 rounded-3xl shadow-xl overflow-hidden transition-all duration-300",
                theme === 'light' ? "bg-white" : "bg-gray-800 border border-gray-700",
                download.disabled && "opacity-50 cursor-not-allowed"
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
                {download.disabled && <span className="text-sm ml-2">(Coming Soon)</span>}
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
                  onClick={(e) => download.disabled && e.preventDefault()}
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300",
                    !download.disabled && "hover:scale-105 bg-gradient-to-r",
                    download.color,
                    "text-white shadow-lg hover:shadow-xl",
                    download.disabled && "cursor-not-allowed"
                  )}
                >
                  <Download className="w-5 h-5" />
                  Download
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-center"
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
