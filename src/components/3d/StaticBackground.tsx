import React from 'react';

interface StaticBackgroundProps {
  className?: string;
}

export const StaticBackground: React.FC<StaticBackgroundProps> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* High-performance gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/15 to-blue-900/15"></div>
      
      {/* Subtle animated gradient overlay - optimized */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 animate-pulse-slow"></div>
      
      {/* Minimal particle effect using CSS transforms for GPU acceleration */}
      <div className="absolute inset-0 opacity-20 will-change-transform">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-float-1"></div>
        <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-blue-400 rounded-full animate-float-2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-float-3"></div>
        <div className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-purple-300 rounded-full animate-float-4"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-blue-300 rounded-full animate-float-5"></div>
        <div className="absolute top-3/4 left-1/2 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-float-6"></div>
      </div>
      
      {/* Ultra-subtle mesh pattern - reduced opacity */}
      <div 
        className="absolute inset-0 opacity-2"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      ></div>
    </div>
  );
};