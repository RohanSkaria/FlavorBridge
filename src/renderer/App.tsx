import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import { usePairingStore } from './stores/pairingStore';

// Animation wrapper component for page transitions
const AnimatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={location.pathname} className="h-full">
        {children}
      </div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const { appSettings, initializeApp } = usePairingStore();
  const { theme } = appSettings;

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Apply theme class to document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`app min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-cozy-charcoal text-cozy-cream' 
        : 'bg-cozy-cream text-cozy-sage-green'
    }`}>
      <Router>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar Navigation */}
          <Sidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-hidden relative">
            {/* Background texture overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(42, 89, 101, 0.1) 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              />
            </div>
            
            {/* Page Content with smooth transitions */}
            <div className="relative z-10 h-full">
              <AnimatedRoute>
                <Routes>
                  <Route path="/" element={<SearchPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </AnimatedRoute>
            </div>
          </main>
        </div>
        
        {/* Global floating elements could go here */}
        <div id="portal-root" />
      </Router>
    </div>
  );
};

export default App;