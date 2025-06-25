import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// === ERROR BOUNDARY FOR PRODUCTION STABILITY ===
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('FlavorBridge Error Boundary caught an error:', error, errorInfo);
    
    // TODO: Add error reporting service here
    // reportErrorToService(error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cozy-cream flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            {/* Cute error sticker */}
            <div className="text-8xl mb-6">😅</div>
            <h1 className="text-2xl font-serif font-bold text-cozy-sage-green mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-cozy-rosy-brown mb-6">
              FlavorBridge encountered an unexpected error. Don't worry, your data is safe!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cozy-soft-orange text-white rounded-lg hover:bg-opacity-90 transition-colors duration-200 font-medium"
            >
              🔄 Refresh App
            </button>
            <div className="mt-4 text-xs text-cozy-rosy-brown opacity-75">
              Error: {this.state.error?.message}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// === PERFORMANCE MONITORING ===
const logPerformanceMetrics = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
      
      console.log(`🚀 FlavorBridge loaded in ${loadTime}ms`);
      
      // TODO: Send metrics to analytics service
      // analytics.track('app_load_time', { duration: loadTime });
    });
  }
};

// === PROGRESSIVE WEB APP SUPPORT ===
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('🔧 Service Worker registered successfully:', registration);
      
      // Show update notification when new version is available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              console.log('🎉 New version of FlavorBridge is available!');
              // TODO: Show cute update notification to user
            }
          });
        }
      });
    } catch (error) {
      console.log('❌ Service Worker registration failed:', error);
    }
  }
};

// === APP INITIALIZATION ===
const initializeApp = () => {
  // Get the root element
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found! Please check your HTML file.');
  }

  // Create React root
  const root = createRoot(container);

  // Render the app with error boundary
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  // Initialize additional features
  logPerformanceMetrics();
  registerServiceWorker();

  // Add cute console message for developers
  console.log(`
    🍳 FlavorBridge v1.0.0
    =====================
    Welcome to the most delicious app development experience!
    
    Made with 💖 for culinary adventures
    
    🎨 Cozy Bear Cafe inspired design
    ⚡ Built with React + TypeScript + Tailwind
    🏆 Gamified with achievements and progress tracking
    🔍 Intelligent ingredient search and pairing algorithms
    
    Happy cooking! 👨‍🍳✨
  `);
};

// === LAUNCH THE APP ===
try {
  initializeApp();
} catch (error) {
  console.error('❌ Failed to initialize FlavorBridge:', error);
  
  // Fallback error display
  document.body.innerHTML = `
    <div style="
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-family: system-ui, sans-serif;
      background: #fdf2ed;
      color: #2a5965;
      text-align: center;
      padding: 2rem;
    ">
      <div>
        <div style="font-size: 4rem; margin-bottom: 1rem;">😕</div>
        <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Failed to start FlavorBridge</h1>
        <p style="color: #B89088; margin-bottom: 1.5rem;">
          There was a problem loading the app. Please try refreshing the page.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            padding: 0.75rem 1.5rem;
            background: #FFA756;
            color: white;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 500;
          "
        >
          🔄 Refresh Page
        </button>
        <div style="margin-top: 1rem; font-size: 0.75rem; opacity: 0.7;">
          Error: ${error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    </div>
  `;
}