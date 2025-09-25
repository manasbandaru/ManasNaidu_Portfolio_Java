import { useState, useEffect } from 'react';
import { Layout } from './components/layout';
import { Hero, About, Skills, Projects, Contact } from './components/sections';
import { LoadingAnimation, ScrollProgress } from './components/ui';
import { ErrorBoundary } from './components/error';
import { WebGLErrorBoundary } from './components/3d/WebGLErrorBoundary';
import { LazyBackgroundScene } from './components/lazy/LazyBackgroundScene';
import { PerformanceOptimizer } from './components/performance/PerformanceOptimizer';
import { portfolioData } from './data/portfolio';
import { preloadCriticalResources } from './utils/productionOptimizations';

import { useAnnouncer } from './hooks/useAnnouncer';

// Import diagnostics in development
if (import.meta.env.DEV) {
  import('./utils/diagnostics');
}

// Get social links and email from portfolio data
const { socialLinks, personalInfo } = portfolioData;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { announce } = useAnnouncer();

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Preload critical resources for production
    preloadCriticalResources();
    
    // Announce to screen readers that the page has loaded
    setTimeout(() => {
      announce('Portfolio website loaded successfully. Navigate through sections using the menu or scroll to explore.');
    }, 500);
  };

  // Set up skip link functionality
  useEffect(() => {
    const skipLink = document.getElementById('skip-to-main');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, []);

  return (
    <PerformanceOptimizer>
      <ErrorBoundary>
        {/* Skip to main content link for keyboard users */}
        <a
          id="skip-to-main"
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>

        {isLoading && (
          <LoadingAnimation onComplete={handleLoadingComplete} />
        )}
        
        {!isLoading && (
          <>
            <ScrollProgress />
            
            {/* WebGL Background with error boundary */}
            <WebGLErrorBoundary>
              <LazyBackgroundScene />
            </WebGLErrorBoundary>
            
            <Layout 
              socialLinks={socialLinks} 
              email={personalInfo.email}
            >
              <main id="main-content" tabIndex={-1}>
                <ErrorBoundary fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-2xl font-bold mb-4">Section temporarily unavailable</h2>
                      <p className="text-gray-300">Please refresh the page or try again later.</p>
                    </div>
                  </div>
                }>
                  <Hero />
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <About />
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <Skills />
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <Projects />
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <Contact />
                </ErrorBoundary>
              </main>
            </Layout>

          </>
        )}
      </ErrorBoundary>
    </PerformanceOptimizer>
  );
}

export default App;