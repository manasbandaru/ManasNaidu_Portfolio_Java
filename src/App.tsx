import { StaticBackground } from './components/3d/StaticBackground';
import { Layout } from './components/layout';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { ErrorBoundary } from './components/error';
import { portfolioData } from './data/portfolio';
import './styles/mobile-optimizations.css';

// Get social links and email from portfolio data
const { socialLinks, personalInfo } = portfolioData;

function App() {
  return (
    <ErrorBoundary>
      {/* Static Background */}
      <StaticBackground />
      
      {/* Scroll Progress */}
      <ScrollProgress />
      
      <Layout 
        socialLinks={socialLinks} 
        email={personalInfo.email}
      >
        <main>
          <ErrorBoundary fallback={
            <div className="min-h-screen text-white flex items-center justify-center">
              <div className="text-center">
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
    </ErrorBoundary>
  );
}

export default App;