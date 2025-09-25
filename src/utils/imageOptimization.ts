interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
}

export class ImageOptimizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  public async optimizeImage(
    imageUrl: string, 
    options: ImageOptimizationOptions = {}
  ): Promise<string> {
    const {
      quality = 0.8,
      format = 'webp',
      width,
      height
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Calculate dimensions
          const targetWidth = width || img.width;
          const targetHeight = height || img.height;
          
          // Set canvas size
          this.canvas.width = targetWidth;
          this.canvas.height = targetHeight;
          
          // Draw and resize image
          this.ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          
          // Convert to optimized format
          const mimeType = `image/${format}`;
          const optimizedDataUrl = this.canvas.toDataURL(mimeType, quality);
          
          resolve(optimizedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
  }

  public generatePlaceholder(width: number, height: number, color = '#374151'): string {
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Fill with solid color
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, width, height);
    
    // Add subtle pattern
    this.ctx.fillStyle = '#4B5563';
    for (let i = 0; i < width; i += 20) {
      for (let j = 0; j < height; j += 20) {
        if ((i + j) % 40 === 0) {
          this.ctx.fillRect(i, j, 10, 10);
        }
      }
    }
    
    return this.canvas.toDataURL('image/png', 0.1);
  }

  public async createResponsiveImageSet(
    imageUrl: string,
    sizes: number[] = [320, 640, 1024, 1920]
  ): Promise<{ [key: number]: string }> {
    const imageSet: { [key: number]: string } = {};
    
    for (const size of sizes) {
      try {
        const optimizedImage = await this.optimizeImage(imageUrl, {
          width: size,
          quality: size <= 640 ? 0.7 : 0.8,
          format: 'webp'
        });
        imageSet[size] = optimizedImage;
      } catch (error) {
        console.warn(`Failed to optimize image for size ${size}:`, error);
      }
    }
    
    return imageSet;
  }
}

// Utility functions for responsive images
export const getOptimalImageSize = (containerWidth: number): number => {
  if (containerWidth <= 320) return 320;
  if (containerWidth <= 640) return 640;
  if (containerWidth <= 1024) return 1024;
  return 1920;
};

export const generateSrcSet = (imageSet: { [key: number]: string }): string => {
  return Object.entries(imageSet)
    .map(([size, url]) => `${url} ${size}w`)
    .join(', ');
};

export const generateSizes = (breakpoints: { [key: string]: string } = {
  '(max-width: 320px)': '320px',
  '(max-width: 640px)': '640px',
  '(max-width: 1024px)': '1024px',
  default: '1920px'
}): string => {
  const sizeEntries = Object.entries(breakpoints);
  const defaultSize = sizeEntries.find(([key]) => key === 'default')?.[1] || '100vw';
  const mediaQueries = sizeEntries
    .filter(([key]) => key !== 'default')
    .map(([query, size]) => `${query} ${size}`)
    .join(', ');
  
  return mediaQueries ? `${mediaQueries}, ${defaultSize}` : defaultSize;
};

// WebP support detection
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Singleton instance
export const imageOptimizer = new ImageOptimizer();