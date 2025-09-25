import React, { useState, useEffect } from 'react';

interface LoadingAnimationProps {
  onComplete?: () => void;
  duration?: number;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  onComplete, 
  duration = 800 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simple timer to hide loading screen
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" />
      
      {/* Loading content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-2">
          Portfolio
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Java Developer
        </p>

        {/* Simple spinning loader */}
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full mx-auto animate-spin" />
        
        <p className="text-gray-500 text-sm mt-4">
          Loading...
        </p>
      </div>
    </div>
  );
};