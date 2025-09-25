import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { 
  initProductionMonitoring, 
  logBundleInfo, 
  runHealthCheck,
  trackPageView 
} from './utils/deploymentUtils'

// Initialize production monitoring
initProductionMonitoring();

// Log bundle information in development
logBundleInfo();

// Run health check
runHealthCheck().then((healthy) => {
  if (!healthy) {
    console.warn('⚠️ Some health checks failed. Check console for details.');
  }
});

// Track initial page view
trackPageView('home');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
