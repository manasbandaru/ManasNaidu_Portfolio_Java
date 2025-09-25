/**
 * Diagnostic utilities for identifying deployment issues
 */

export interface DiagnosticReport {
  environment: 'development' | 'production';
  viewport: { width: number; height: number };
  deviceInfo: {
    userAgent: string;
    platform: string;
    hardwareConcurrency: number;
    devicePixelRatio: number;
    touchSupport: boolean;
  };
  performance: {
    webglSupported: boolean;
    memoryInfo?: any;
    connectionType?: string;
  };
  issues: string[];
}

export const runDiagnostics = (): DiagnosticReport => {
  const issues: string[] = [];
  
  // Environment detection
  const environment = import.meta.env.PROD ? 'production' : 'development';
  
  // Viewport info
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  // Device info
  const deviceInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    devicePixelRatio: window.devicePixelRatio,
    touchSupport: 'ontouchstart' in window
  };
  
  // Performance checks
  const canvas = document.createElement('canvas');
  const webglSupported = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  
  const performance = {
    webglSupported,
    // @ts-ignore
    memoryInfo: (window.performance as any)?.memory,
    // @ts-ignore
    connectionType: (navigator as any)?.connection?.effectiveType
  };
  
  // Issue detection
  if (!webglSupported) {
    issues.push('WebGL not supported - 3D background will use fallback');
  }
  
  if (viewport.width < 768) {
    issues.push('Mobile viewport detected - using optimized settings');
  }
  
  if (deviceInfo.hardwareConcurrency < 4) {
    issues.push('Low-end device detected - reducing animation complexity');
  }
  
  if (environment === 'production' && deviceInfo.devicePixelRatio > 2) {
    issues.push('High DPI display in production - may affect performance');
  }
  
  // @ts-ignore
  if (performance.memoryInfo && performance.memoryInfo.usedJSHeapSize > 50 * 1024 * 1024) {
    issues.push('High memory usage detected');
  }
  
  // @ts-ignore
  if ((navigator as any)?.connection?.effectiveType === 'slow-2g' || (navigator as any)?.connection?.effectiveType === '2g') {
    issues.push('Slow network connection detected');
  }
  
  return {
    environment,
    viewport,
    deviceInfo,
    performance,
    issues
  };
};

export const logDiagnostics = () => {
  const report = runDiagnostics();
  
  console.group('🔍 Portfolio Diagnostics');
  console.log('Environment:', report.environment);
  console.log('Viewport:', `${report.viewport.width}x${report.viewport.height}`);
  console.log('Device:', {
    platform: report.deviceInfo.platform,
    cores: report.deviceInfo.hardwareConcurrency,
    pixelRatio: report.deviceInfo.devicePixelRatio,
    touch: report.deviceInfo.touchSupport
  });
  console.log('Performance:', {
    webgl: report.performance.webglSupported,
    memory: report.performance.memoryInfo ? `${Math.round(report.performance.memoryInfo.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A',
    connection: report.performance.connectionType || 'Unknown'
  });
  
  if (report.issues.length > 0) {
    console.warn('Issues detected:');
    report.issues.forEach(issue => console.warn(`- ${issue}`));
  } else {
    console.log('✅ No issues detected');
  }
  
  console.groupEnd();
  
  return report;
};

// Auto-run diagnostics in development
if (import.meta.env.DEV) {
  setTimeout(logDiagnostics, 1000);
}