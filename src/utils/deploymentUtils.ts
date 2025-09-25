/**
 * Deployment and production utilities
 */

// Environment detection
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

// Performance monitoring for production
export const initProductionMonitoring = (): void => {
  if (!isProduction()) return;

  // Monitor Core Web Vitals
  if ('web-vitals' in window) {
    // This would be imported dynamically in a real implementation
    console.log('Core Web Vitals monitoring initialized');
  }

  // Monitor errors
  window.addEventListener('error', (event) => {
    console.error('Production error:', event.error);
    // In a real implementation, send to error tracking service
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // In a real implementation, send to error tracking service
  });
};

// Bundle size monitoring
export const logBundleInfo = (): void => {
  if (!isDevelopment()) return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  console.group('📦 Bundle Information');
  console.log('JavaScript files:', scripts.length);
  console.log('CSS files:', styles.length);
  
  scripts.forEach((script, index) => {
    const src = (script as HTMLScriptElement).src;
    console.log(`JS ${index + 1}:`, src.split('/').pop());
  });
  
  styles.forEach((style, index) => {
    const href = (style as HTMLLinkElement).href;
    console.log(`CSS ${index + 1}:`, href.split('/').pop());
  });
  
  console.groupEnd();
};

// SEO utilities
export const updateMetaTags = (data: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}): void => {
  if (data.title) {
    document.title = data.title;
    updateMetaTag('og:title', data.title);
    updateMetaTag('twitter:title', data.title);
  }

  if (data.description) {
    updateMetaTag('description', data.description);
    updateMetaTag('og:description', data.description);
    updateMetaTag('twitter:description', data.description);
  }

  if (data.image) {
    updateMetaTag('og:image', data.image);
    updateMetaTag('twitter:image', data.image);
  }

  if (data.url) {
    updateMetaTag('og:url', data.url);
    updateMetaTag('twitter:url', data.url);
    updateLinkTag('canonical', data.url);
  }
};

const updateMetaTag = (name: string, content: string): void => {
  let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

const updateLinkTag = (rel: string, href: string): void => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
};

// Analytics utilities
export const trackPageView = (page: string): void => {
  if (!isProduction()) return;

  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  // Custom analytics
  console.log('Page view tracked:', page);
};

export const trackEvent = (eventName: string, parameters?: Record<string, unknown>): void => {
  if (!isProduction()) return;

  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, parameters);
  }

  // Custom analytics
  console.log('Event tracked:', eventName, parameters);
};

// Performance utilities
export const measurePerformance = (name: string, fn: () => void | Promise<void>): void => {
  const start = performance.now();
  
  const finish = () => {
    const end = performance.now();
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  };

  try {
    const result = fn();
    if (result instanceof Promise) {
      result.finally(finish);
    } else {
      finish();
    }
  } catch (error) {
    finish();
    throw error;
  }
};

// Deployment health check
export const runHealthCheck = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const checks = [
      // Check if WebGL is available
      () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      },
      
      // Check if required assets are loaded
      () => {
        const scripts = document.querySelectorAll('script[src]');
        return scripts.length > 0;
      },
      
      // Check if CSS is loaded
      () => {
        const styles = document.querySelectorAll('link[rel="stylesheet"]');
        return styles.length > 0;
      }
    ];

    const results = checks.map(check => {
      try {
        return check();
      } catch {
        return false;
      }
    });

    const allPassed = results.every(Boolean);
    
    console.log('🏥 Health Check Results:');
    console.log('WebGL Support:', results[0] ? '✅' : '❌');
    console.log('Scripts Loaded:', results[1] ? '✅' : '❌');
    console.log('Styles Loaded:', results[2] ? '✅' : '❌');
    console.log('Overall Status:', allPassed ? '✅ Healthy' : '❌ Issues Detected');

    resolve(allPassed);
  });
};

// Declare global gtag function for TypeScript
declare global {
  function gtag(...args: unknown[]): void;
}