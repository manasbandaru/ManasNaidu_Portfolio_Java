import React, { useState, useEffect } from 'react';
import { AnimatedBackground } from './AnimatedBackground';
import { checkWebGLSupport } from './WebGLErrorBoundary';

export const SmartBackground: React.FC = () => {
  const [, setUseWebGL] = useState<boolean>(false);

  useEffect(() => {
    // Simple capability check without performance monitoring
    const webglSupported = checkWebGLSupport();
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Use WebGL only on desktop with good hardware
    const shouldUseWebGL = webglSupported && !isMobile && !isLowEnd;
    
    setUseWebGL(shouldUseWebGL);
  }, []);

  // For now, always use AnimatedBackground to avoid loading issues
  // TODO: Re-enable WebGL after fixing performance issues
  return <AnimatedBackground />;
};