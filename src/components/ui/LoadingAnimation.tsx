import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface LoadingAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  onComplete, 
  duration = 1500 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5; // Faster progress
      });
    }, duration / 20); // Fewer updates

    // Hide loading screen after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 100); // Small delay to ensure animation completes
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            transition: { 
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" />
          
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Loading content */}
          <div className="relative z-10 text-center">
            {/* Logo/Name animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold gradient-text mb-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 1,
                  delay: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                Portfolio
              </motion.h1>
              <motion.p
                className="text-gray-400 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                Java Developer
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 200 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mx-auto mb-4"
            >
              <div className="w-full bg-gray-700/50 rounded-full h-1 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="text-gray-500 text-sm"
            >
              Loading experience...
            </motion.p>

            {/* Spinning loader */}
            <motion.div
              className="mt-6 w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};