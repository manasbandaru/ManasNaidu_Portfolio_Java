import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  useEffect(() => {
    // Optimize for mobile devices
    const optimizeForMobile = () => {
      if (window.innerWidth < 768) {
        // Disable expensive CSS animations on mobile
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
        
        // Reduce motion for better performance
        document.documentElement.classList.add('reduce-motion');
      }
    };

    // Optimize for low-end devices
    const optimizeForLowEnd = () => {
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        // Disable complex animations
        document.documentElement.classList.add('low-end-device');
        
        // Reduce particle effects
        const particles = document.querySelectorAll('[class*="animate-float"]');
        particles.forEach(particle => {
          (particle as HTMLElement).style.animation = 'none';
        });
      }
    };

    // Optimize for slow connections
    const optimizeForConnection = () => {
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const slowConnections = ['slow-2g', '2g', '3g'];
        if (slowConnections.includes(connection.effectiveType)) {
          // Disable background animations
          document.documentElement.classList.add('slow-connection');
        }
      }
    };

    // Apply optimizations
    optimizeForMobile();
    optimizeForLowEnd();
    optimizeForConnection();

    // Monitor performance and adjust
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitorPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // If FPS drops below 30, apply aggressive optimizations
        if (fps < 30) {
          document.documentElement.classList.add('performance-mode');
          
          // Disable all non-essential animations
          const style = document.createElement('style');
          style.textContent = `
            .performance-mode * {
              animation-duration: 0.01s !important;
              transition-duration: 0.01s !important;
            }
            .performance-mode .animate-pulse,
            .performance-mode .animate-float-1,
            .performance-mode .animate-float-2,
            .performance-mode .animate-float-3,
            .performance-mode .animate-float-4,
            .performance-mode .animate-float-5,
            .performance-mode .animate-float-6 {
              animation: none !important;
            }
          `;
          document.head.appendChild(style);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorPerformance);
    };
    
    // Start monitoring after a delay to avoid initial load impact
    setTimeout(() => {
      requestAnimationFrame(monitorPerformance);
    }, 2000);

    // Cleanup on unmount
    return () => {
      document.documentElement.classList.remove('reduce-motion', 'low-end-device', 'slow-connection', 'performance-mode');
    };
  }, []);

  return <>{children}</>;
};