import { lazy, Suspense } from 'react';
import { WebGLFallback } from '../3d/WebGLErrorBoundary';

// Lazy load the BackgroundScene component
const BackgroundScene = lazy(() => 
  import('../3d/BackgroundScene').then(module => ({
    default: module.BackgroundScene
  }))
);

export const LazyBackgroundScene: React.FC = () => {
  return (
    <Suspense fallback={<WebGLFallback />}>
      <BackgroundScene />
    </Suspense>
  );
};