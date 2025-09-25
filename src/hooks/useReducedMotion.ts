import { useState, useEffect } from 'react';

export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if the browser supports the media query
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener (use deprecated addListener for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

// Hook to get motion-safe animation variants
export const useMotionVariants = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    // Standard animation variants
    fadeIn: prefersReducedMotion 
      ? { opacity: 1 }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        },
    slideUp: prefersReducedMotion
      ? { y: 0, opacity: 1 }
      : {
          initial: { y: 30, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -30, opacity: 0 }
        },
    scale: prefersReducedMotion
      ? { scale: 1 }
      : {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 }
        }
  };
};