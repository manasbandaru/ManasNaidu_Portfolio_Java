import { useState, useEffect, useRef } from 'react';

interface UseLazyLoadingOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export const useLazyLoading = (options: UseLazyLoadingOptions = {}) => {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    triggerOnce = true
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [rootMargin, threshold, triggerOnce]);

  return {
    elementRef,
    isInView,
    isLoaded,
    setIsLoaded
  };
};

export const useImagePreloader = (imageSources: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageSources.length === 0) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageSources.length;

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        
        const handleLoad = () => {
          setLoadedImages(prev => new Set(prev).add(src));
          loadedCount++;
          
          if (loadedCount === totalImages) {
            setIsLoading(false);
          }
          resolve();
        };

        const handleError = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setIsLoading(false);
          }
          resolve();
        };

        img.onload = handleLoad;
        img.onerror = handleError;
        img.src = src;
      });
    };

    // Preload all images
    Promise.all(imageSources.map(preloadImage));
  }, [imageSources]);

  return {
    loadedImages,
    isLoading,
    isImageLoaded: (src: string) => loadedImages.has(src)
  };
};