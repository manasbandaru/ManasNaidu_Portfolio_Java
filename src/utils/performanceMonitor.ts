interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  isLowPerformance: boolean;
}

interface PerformanceSettings {
  particleCount: number;
  geometryCount: number;
  enableLighting: boolean;
  enablePostProcessing: boolean;
  maxFPS: number;
  pixelRatio: number;
  shadowMapSize: number;
}

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private frameTime = 16.67;
  private fpsHistory: number[] = [];
  private readonly maxHistoryLength = 60; // 1 second at 60fps
  private performanceCallbacks: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    const monitor = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastTime;
      
      this.frameCount++;
      this.frameTime = deltaTime;
      
      // Calculate FPS every 10 frames for smoother readings
      if (this.frameCount % 10 === 0) {
        this.fps = 1000 / deltaTime;
        this.fpsHistory.push(this.fps);
        
        // Keep history within bounds
        if (this.fpsHistory.length > this.maxHistoryLength) {
          this.fpsHistory.shift();
        }
        
        // Notify callbacks with current metrics
        const metrics = this.getMetrics();
        this.performanceCallbacks.forEach(callback => callback(metrics));
      }
      
      this.lastTime = currentTime;
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
  }

  public getMetrics(): PerformanceMetrics {
    const averageFPS = this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
      : this.fps;

    return {
      fps: Math.round(averageFPS),
      frameTime: this.frameTime,
      memoryUsage: this.getMemoryUsage(),
      isLowPerformance: averageFPS < 30
    };
  }

  private getMemoryUsage(): number | undefined {
    // @ts-ignore - performance.memory is not in all browsers
    if (performance.memory) {
      // @ts-ignore
      return performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return undefined;
  }

  public onPerformanceChange(callback: (metrics: PerformanceMetrics) => void) {
    this.performanceCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.performanceCallbacks.indexOf(callback);
      if (index > -1) {
        this.performanceCallbacks.splice(index, 1);
      }
    };
  }

  public getOptimalSettings(): PerformanceSettings {
    const metrics = this.getMetrics();
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const hasHighDPI = window.devicePixelRatio > 1.5;
    const isLowPerformance = metrics.isLowPerformance;

    // Ultra-low settings for very poor performance
    if (isLowPerformance && metrics.fps < 20) {
      return {
        particleCount: 200,
        geometryCount: 1,
        enableLighting: false,
        enablePostProcessing: false,
        maxFPS: 20,
        pixelRatio: 1,
        shadowMapSize: 256
      };
    }

    // Low settings for mobile or low-end devices
    if (isMobile || isLowEnd || isLowPerformance) {
      return {
        particleCount: 500,
        geometryCount: 3,
        enableLighting: false,
        enablePostProcessing: false,
        maxFPS: 30,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        shadowMapSize: 512
      };
    }

    // Medium settings for average devices
    if (!hasHighDPI || metrics.fps < 45) {
      return {
        particleCount: 1000,
        geometryCount: 5,
        enableLighting: true,
        enablePostProcessing: false,
        maxFPS: 60,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        shadowMapSize: 1024
      };
    }

    // High settings for powerful devices
    return {
      particleCount: 1500,
      geometryCount: 8,
      enableLighting: true,
      enablePostProcessing: true,
      maxFPS: 60,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      shadowMapSize: 2048
    };
  }

  public adaptSettings(currentSettings: PerformanceSettings): PerformanceSettings {
    const metrics = this.getMetrics();
    const optimalSettings = this.getOptimalSettings();

    // If performance is good, we can potentially increase quality
    if (metrics.fps > 55 && !metrics.isLowPerformance) {
      return {
        ...currentSettings,
        particleCount: Math.min(currentSettings.particleCount * 1.1, optimalSettings.particleCount),
        geometryCount: Math.min(currentSettings.geometryCount + 1, optimalSettings.geometryCount)
      };
    }

    // If performance is poor, reduce quality
    if (metrics.fps < 25 || metrics.isLowPerformance) {
      return {
        ...currentSettings,
        particleCount: Math.max(currentSettings.particleCount * 0.8, 100),
        geometryCount: Math.max(currentSettings.geometryCount - 1, 1),
        enableLighting: false,
        enablePostProcessing: false,
        maxFPS: Math.min(currentSettings.maxFPS, 30)
      };
    }

    return currentSettings;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Device capability detection
export const getDeviceCapabilities = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
  
  if (!gl) {
    return {
      webglSupported: false,
      maxTextureSize: 0,
      maxRenderbufferSize: 0,
      maxVertexAttribs: 0,
      maxVaryingVectors: 0,
      maxFragmentUniforms: 0,
      maxVertexUniforms: 0
    };
  }

  return {
    webglSupported: true,
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
    maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
    maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
    maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
  };
};

// Memory management utilities
export const cleanupThreeJSResources = (object: any) => {
  if (!object) return;

  // Dispose geometries
  if (object.geometry) {
    object.geometry.dispose();
  }

  // Dispose materials
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach((material: any) => material.dispose());
    } else {
      object.material.dispose();
    }
  }

  // Dispose textures
  if (object.material && object.material.map) {
    object.material.map.dispose();
  }

  // Recursively clean children
  if (object.children) {
    object.children.forEach((child: any) => cleanupThreeJSResources(child));
  }
};