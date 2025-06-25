import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Heart, 
  Settings, 
  Coffee,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import { usePairingStore } from '../stores/pairingStore';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { appSettings, toggleTheme, favorites } = usePairingStore();
  const { theme } = appSettings;

  const navigationItems = [
    {
      path: '/search',
      icon: Search,
      label: 'Discover Pairings',
      description: 'Find magical flavor combinations'
    },
    {
      path: '/favorites',
      icon: Heart,
      label: 'My Favorites',
      description: 'Your saved delicious discoveries',
      badge: favorites.length > 0 ? favorites.length : undefined
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings',
      description: 'Customize your experience'
    }
  ];

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-70 h-full flex flex-col transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-cozy-forest border-cozy-charcoal' 
          : 'bg-cozy-white-chocolate border-cozy-sage-green'
      } border-r border-opacity-20 shadow-cozy-lg`}
    >
      {/* Header Section with Logo */}
      <div className="p-cozy-xl border-b border-opacity-10 border-current">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-cozy-md"
        >
          {/* App Icon/Logo */}
          <div className={`
            w-12 h-12 rounded-cozy-lg flex items-center justify-center relative
            ${theme === 'dark' ? 'bg-cozy-tan' : 'bg-cozy-soft-orange'}
            shadow-cozy-md
          `}>
            <Coffee className="w-6 h-6 text-cozy-cream" />
            <Sparkles className="w-3 h-3 text-cozy-cream absolute -top-1 -right-1 animate-cozy-pulse" />
          </div>
          
          {/* App Name */}
          <div>
            <h1 className="text-cozy-heading font-serif font-bold">
              FlavorBridge
            </h1>
            <p className={`text-cozy-xs ${
              theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'
            } opacity-80`}>
              Culinary Discovery Tool
            </p>
          </div>
        </motion.div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-cozy-md space-y-cozy-sm">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path === '/search' && location.pathname === '/');
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive: linkActive }) => `
                  flex items-center gap-cozy-md p-cozy-md rounded-cozy-lg transition-all duration-200 group relative
                  ${linkActive || isActive
                    ? theme === 'dark'
                      ? 'bg-cozy-tan text-cozy-cream shadow-cozy-md'
                      : 'bg-cozy-sage-green text-cozy-cream shadow-cozy-md'
                    : theme === 'dark'
                      ? 'text-cozy-cream hover:bg-cozy-charcoal hover:bg-opacity-50'
                      : 'text-cozy-sage-green hover:bg-cozy-cream-dark'
                  } hover-cozy-subtle
                `}
              >
                {/* Icon */}
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  
                  {/* Badge for favorites count */}
                  {item.badge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`
                        absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                        ${theme === 'dark' ? 'bg-cozy-soft-orange text-cozy-charcoal' : 'bg-cozy-soft-orange text-cozy-sage-green'}
                        shadow-cozy-sm
                      `}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </motion.div>
                  )}
                </div>
                
                {/* Label and Description */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">
                    {item.label}
                  </div>
                  <div className={`text-xs opacity-75 truncate ${
                    isActive ? 'text-current' : 
                    theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'
                  }`}>
                    {item.description}
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`w-1 h-8 rounded-full ${
                      theme === 'dark' ? 'bg-cozy-cream' : 'bg-cozy-cream'
                    }`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer Section with Theme Toggle */}
      <div className="p-cozy-md border-t border-opacity-10 border-current">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={toggleTheme}
          className={`
            w-full flex items-center gap-cozy-md p-cozy-md rounded-cozy-lg transition-all duration-200
            ${theme === 'dark' 
              ? 'text-cozy-cream hover:bg-cozy-charcoal hover:bg-opacity-50' 
              : 'text-cozy-sage-green hover:bg-cozy-cream-dark'
            } hover-cozy-subtle group
          `}
        >
          <div className={`
            w-8 h-8 rounded-cozy-md flex items-center justify-center
            ${theme === 'dark' ? 'bg-cozy-soft-orange' : 'bg-cozy-tan'}
            group-hover:scale-110 transition-transform duration-200
          `}>
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-cozy-cream" />
            ) : (
              <Moon className="w-4 h-4 text-cozy-cream" />
            )}
          </div>
          
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </div>
            <div className={`text-xs opacity-75 ${
              theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'
            }`}>
              Switch to {theme === 'dark' ? 'bright' : 'cozy'} theme
            </div>
          </div>
        </motion.button>

        {/* App Version/Credit */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className={`mt-cozy-md text-center text-xs opacity-50 ${
            theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'
          }`}
        >
          Made with 💖 for amazing flavor discoveries
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;