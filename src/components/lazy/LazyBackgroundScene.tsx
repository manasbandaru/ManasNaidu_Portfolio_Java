import React from 'react';
import { StaticBackground } from '../3d/StaticBackground';

export const LazyBackgroundScene: React.FC = () => {
  // Always use static background for maximum compatibility and performance
  return <StaticBackground />;
};