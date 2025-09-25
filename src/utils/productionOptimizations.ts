/**
 * Production-specific optimizations to handle deployment differences
 */

// Detect if we're in production
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

// Optimize animations for production
export const getOptimizedAnimationProps = (baseProps: any) => {
  if (isProduction()) {
    return {
      ...baseProps,
      transition: {
        ...baseProps.transition,
        duration: Math.min(baseProps.transition?.duration || 0.3, 0.2),
      },
      // Reduce complex animations in production
      whileHover: baseProps.whileHover ? { scale: 1.01 } : undefined,
      whileTap: baseProps.whileTap ? { scale: 0.99 } : undefined,
    };
  }
  return baseProps;
};

// Optimize CSS classes for production
export const getOptimizedClassName = (baseClassName: string): string => {
  if (isProduction()) {
    return `${baseClassName} production-optimized`;
  }
  return baseClassName;
};

// Debounce function for performance-sensitive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for high-frequency events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Optimize image loading for production
export const getOptimizedImageProps = (src: string, alt: string) => {
  return {
    src,
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };
};

// Reduce motion for users who prefer it or in production
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return prefersReducedMotion || isProduction();
};

// Get optimized framer motion variants
export const getOptimizedVariants = (variants: any) => {
  if (shouldReduceMotion()) {
    // Return simplified variants with minimal animation
    return Object.keys(variants).reduce((acc, key) => {
      acc[key] = {
        ...variants[key],
        transition: { duration: 0.1 },
        // Remove complex transforms
        scale: variants[key].scale ? 1 : undefined,
        rotate: variants[key].rotate ? 0 : undefined,
      };
      return acc;
    }, {} as any);
  }
  return variants;
};

// Performance monitoring for production issues
export const logPerformanceIssue = (issue: string, data?: any) => {
  if (isProduction()) {
    // In a real app, this would send to monitoring service
    console.warn(`Performance Issue: ${issue}`, data);
  } else {
    console.log(`Performance Issue: ${issue}`, data);
  }
};

// Optimize bundle loading
export const preloadCriticalResources = () => {
  if (isProduction()) {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
  }
};

// Handle viewport changes efficiently
export const createViewportObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  if (typeof window === 'undefined') return null;
  
  const options = {
    root: null,
    rootMargin: isProduction() ? '50px' : '100px', // Smaller margin in production
    threshold: isProduction() ? [0, 0.5] : [0, 0.25, 0.5, 0.75, 1], // Fewer thresholds in production
  };
  
  return new IntersectionObserver(callback, options);
};

// Memory management for production
export const cleanupResources = () => {
  if (isProduction()) {
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }
};