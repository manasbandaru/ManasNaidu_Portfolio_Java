interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

export class CacheManager<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private readonly maxSize: number;
  private readonly defaultTTL: number;
  private readonly storage: 'memory' | 'localStorage' | 'sessionStorage';

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.storage = options.storage || 'memory';
    
    // Load from persistent storage if applicable
    if (this.storage !== 'memory') {
      this.loadFromStorage();
    }
  }

  public set(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt
    };

    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, item);
    this.saveToStorage();
  }

  public get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    return item.data;
  }

  public has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Check if item has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  public delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.saveToStorage();
    return result;
  }

  public clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  public size(): number {
    return this.cache.size;
  }

  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private loadFromStorage(): void {
    if (this.storage === 'memory') return;

    try {
      const storageObj = this.storage === 'localStorage' ? localStorage : sessionStorage;
      const cached = storageObj.getItem(`cache_${this.constructor.name}`);
      
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        
        // Filter out expired items
        for (const [key, item] of Object.entries(parsed)) {
          const cacheItem = item as CacheItem<T>;
          if (now <= cacheItem.expiresAt) {
            this.cache.set(key, cacheItem);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    if (this.storage === 'memory') return;

    try {
      const storageObj = this.storage === 'localStorage' ? localStorage : sessionStorage;
      const cacheObject = Object.fromEntries(this.cache.entries());
      storageObj.setItem(`cache_${this.constructor.name}`, JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  // Cleanup expired items
  public cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      this.saveToStorage();
    }
  }
}

// Specialized cache for images
export class ImageCache extends CacheManager<string> {
  constructor() {
    super({
      ttl: 30 * 60 * 1000, // 30 minutes for images
      maxSize: 50,
      storage: 'localStorage'
    });
  }

  public async cacheImage(url: string): Promise<string> {
    // Check if already cached
    const cached = this.get(url);
    if (cached) {
      return cached;
    }

    try {
      // Convert image to data URL for caching
      const response = await fetch(url);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          this.set(url, dataUrl);
          resolve(dataUrl);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Failed to cache image:', error);
      return url; // Return original URL as fallback
    }
  }
}

// Specialized cache for API responses
export class APICache extends CacheManager<any> {
  constructor() {
    super({
      ttl: 10 * 60 * 1000, // 10 minutes for API responses
      maxSize: 20,
      storage: 'sessionStorage'
    });
  }
}

// Cache instances
export const imageCache = new ImageCache();
export const apiCache = new APICache();

// Service Worker registration for advanced caching
export const registerServiceWorker = async (): Promise<void> => {
  // Disable service worker for now to avoid loading issues
  if (false && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  }
};

// Preload critical resources
export const preloadCriticalResources = (resources: string[]): void => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    // Determine resource type
    if (resource.match(/\.(woff2?|ttf|otf)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
      link.as = 'image';
    } else if (resource.match(/\.(css)$/)) {
      link.as = 'style';
    } else if (resource.match(/\.(js|ts)$/)) {
      link.as = 'script';
    } else {
      // Skip resources that don't have a valid 'as' value
      console.warn(`Skipping preload for ${resource} - no valid 'as' value`);
      return;
    }
    
    link.href = resource;
    document.head.appendChild(link);
  });
};