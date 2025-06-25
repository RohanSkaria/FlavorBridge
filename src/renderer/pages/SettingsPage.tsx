import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Download, 
  Upload,
  RotateCcw,
  Heart,
  Trophy,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Zap,
  Info,
  ChevronRight,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { 
  usePairingStore, 
  useTheme, 
  useAchievements,
  type UserPreferences,
  type AppSettings 
} from '../stores/pairingStore';

// === TYPES ===
interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  sticker: string; // TODO: Replace with cute stickers
}

interface ToggleSettingProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  sticker?: string;
}

interface SelectSettingProps {
  label: string;
  description: string;
  value: string;
  options: { value: string; label: string; sticker?: string }[];
  onChange: (value: string) => void;
}

const SettingsPage: React.FC = () => {
  // === HOOKS ===
  const { theme, toggleTheme } = useTheme();
  const { achievements, unlockedCount } = useAchievements();
  const {
    userPreferences,
    appSettings,
    updateUserPreferences,
    updateAppSettings,
    stats,
    resetApp,
    favorites,
    searchHistory
  } = usePairingStore();

  // === STATE ===
  const [activeSection, setActiveSection] = useState<string>('general');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // === SETTINGS SECTIONS ===
  const settingSections: SettingSection[] = [
    {
      id: 'general',
      title: 'General',
      description: 'Basic app preferences',
      icon: Settings,
      sticker: '⚙️' // TODO: Replace with cute settings sticker
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Theme and visual settings',
      icon: Palette,
      sticker: '🎨' // TODO: Replace with cute palette sticker
    },
    {
      id: 'preferences',
      title: 'Food Preferences',
      description: 'Dietary restrictions and favorites',
      icon: Heart,
      sticker: '🍽️' // TODO: Replace with cute food sticker
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alerts and reminders',
      icon: Bell,
      sticker: '🔔' // TODO: Replace with cute bell sticker
    },
    {
      id: 'achievements',
      title: 'Achievements',
      description: 'Your culinary milestones',
      icon: Trophy,
      sticker: '🏆' // TODO: Replace with cute trophy sticker
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      description: 'Export, import, and reset',
      icon: Shield,
      sticker: '🛡️' // TODO: Replace with cute shield sticker
    }
  ];

  // === COMPONENT HELPERS ===
  const showToast = (message: string) => {
    setShowSuccessToast(message);
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  // === REUSABLE COMPONENTS ===
  const ToggleSetting: React.FC<ToggleSettingProps> = ({ 
    label, 
    description, 
    value, 
    onChange, 
    sticker 
  }) => (
    <div className="flex items-start justify-between gap-cozy-md">
      <div className="flex-1">
        <div className="flex items-center gap-cozy-sm mb-1">
          {sticker && <span className="text-lg">{sticker}</span>}
          <h4 className="font-medium">{label}</h4>
        </div>
        <p className={`text-sm opacity-75 ${
          theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'
        }`}>
          {description}
        </p>
      </div>
      
      <motion.button
        onClick={() => onChange(!value)}
        className={`
          relative w-12 h-6 rounded-full transition-colors duration-200
          ${value 
            ? 'bg-cozy-soft-orange' 
            : theme === 'dark' ? 'bg-cozy-charcoal' : 'bg-gray-300'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ x: value ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`
            absolute top-1 w-4 h-4 rounded-full shadow-sm
            ${value ? 'bg-white' : theme === 'dark' ? 'bg-cozy-cream' : 'bg-white'}
          `}
        />
      </motion.button>
    </div>
  );

  const SelectSetting: React.FC<SelectSettingProps> = ({ 
    label, 
    description, 
    value, 
    options, 
    onChange 
  }) => (
    <div>
      <h4 className="font-medium mb-1">{label}</h4>
      <p className={`text-sm opacity-75 mb-cozy-md ${
        theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'
      }`}>
        {description}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full p-3 rounded-cozy-md border-2 border-opacity-30 transition-all duration-200
          ${theme === 'dark' 
            ? 'bg-cozy-charcoal border-cozy-cream text-cozy-cream' 
            : 'bg-cozy-cream border-cozy-sage-green text-cozy-sage-green'
          }
          focus:border-cozy-soft-orange focus:ring-2 focus:ring-cozy-soft-orange focus:ring-opacity-20
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.sticker ? `${option.sticker} ` : ''}{option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // === ACTIONS ===
  const handleExportData = () => {
    const exportData = {
      favorites,
      searchHistory,
      userPreferences,
      appSettings,
      stats,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flavorbridge-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully! 📁');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // TODO: Validate imported data structure
        if (importedData.userPreferences) {
          updateUserPreferences(importedData.userPreferences);
        }
        if (importedData.appSettings) {
          updateAppSettings(importedData.appSettings);
        }
        
        showToast('Data imported successfully! 🎉');
      } catch (error) {
        showToast('Failed to import data. Please check the file format. ❌');
      }
    };
    reader.readAsText(file);
  };

  const handleResetApp = () => {
    resetApp();
    setShowResetConfirm(false);
    showToast('App reset successfully! 🔄');
  };

  // === RENDER ===
  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <section className="section-cozy pb-cozy-xl">
        <div className="container-cozy">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-cozy-3xl"
          >
            <div className="flex items-center justify-center gap-cozy-md mb-cozy-lg">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-5xl"
              >
                ⚙️
              </motion.div>
              <Sparkles className="text-cozy-soft-orange w-8 h-8 animate-cozy-pulse" />
            </div>
            
            <h1 className="text-cozy-heading mb-cozy-md">
              Settings & Preferences
            </h1>
            <p className="text-cozy-body">
              Customize FlavorBridge to match your culinary style
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-cozy pt-0">
        <div className="container-cozy">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-cozy-xl">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className={`
                rounded-cozy-xl p-cozy-lg shadow-cozy-md sticky top-cozy-lg
                ${theme === 'dark' ? 'bg-cozy-forest' : 'bg-cozy-white-chocolate'}
              `}>
                <h3 className="font-serif font-medium mb-cozy-lg">Settings</h3>
                <nav className="space-y-cozy-sm">
                  {settingSections.map((section, index) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        onClick={() => setActiveSection(section.id)}
                        className={`
                          w-full flex items-center gap-cozy-md p-cozy-md rounded-cozy-lg
                          text-left transition-all duration-200 group
                          ${isActive
                            ? theme === 'dark' 
                              ? 'bg-cozy-tan text-cozy-cream' 
                              : 'bg-cozy-sage-green text-cozy-cream'
                            : theme === 'dark'
                              ? 'text-cozy-cream hover:bg-cozy-charcoal'
                              : 'text-cozy-sage-green hover:bg-cozy-cream-dark'
                          }
                        `}
                      >
                        <span className="text-xl">{section.sticker}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className={`text-xs opacity-75 truncate ${
                            isActive ? 'text-current' : 
                            theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'
                          }`}>
                            {section.description}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                          isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                        }`} />
                      </motion.button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className={`
                rounded-cozy-xl p-cozy-xl shadow-cozy-md
                ${theme === 'dark' ? 'bg-cozy-forest' : 'bg-cozy-white-chocolate'}
              `}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* General Settings */}
                    {activeSection === 'general' && (
                      <div className="space-y-cozy-xl">
                        <div>
                          <h2 className="text-cozy-subheading mb-cozy-md">General Settings</h2>
                          <p className="text-cozy-body opacity-75 mb-cozy-xl">
                            Configure basic app behavior and preferences
                          </p>
                        </div>

                        <div className="space-y-cozy-lg">
                          <ToggleSetting
                            label="Auto-save preferences"
                            description="Automatically save your settings and preferences"
                            value={appSettings.autoSave}
                            onChange={(value) => updateAppSettings({ autoSave: value })}
                            sticker="💾"
                          />
                          
                          <ToggleSetting
                            label="Show helpful tooltips"
                            description="Display hints and tips throughout the app"
                            value={appSettings.showTooltips}
                            onChange={(value) => updateAppSettings({ showTooltips: value })}
                            sticker="💡"
                          />
                          
                          <ToggleSetting
                            label="Enable animations"
                            description="Show smooth transitions and animations"
                            value={appSettings.animationsEnabled}
                            onChange={(value) => updateAppSettings({ animationsEnabled: value })}
                            sticker="✨"
                          />

                          <SelectSetting
                            label="Experience Level"
                            description="Adjust recommendations based on your cooking experience"
                            value={userPreferences.experienceLevel}
                            options={[
                              { value: 'beginner', label: 'Beginner', sticker: '🌱' },
                              { value: 'intermediate', label: 'Intermediate', sticker: '👨‍🍳' },
                              { value: 'advanced', label: 'Advanced', sticker: '⭐' }
                            ]}
                            onChange={(value) => updateUserPreferences({ 
                              experienceLevel: value as 'beginner' | 'intermediate' | 'advanced' 
                            })}
                          />
                        </div>
                      </div>
                    )}

                    {/* Appearance Settings */}
                    {activeSection === 'appearance' && (
                      <div className="space-y-cozy-xl">
                        <div>
                          <h2 className="text-cozy-subheading mb-cozy-md">Appearance</h2>
                          <p className="text-cozy-body opacity-75 mb-cozy-xl">
                            Customize the visual look and feel of FlavorBridge
                          </p>
                        </div>

                        <div className="space-y-cozy-lg">
                          {/* Theme Toggle */}
                          <div className="flex items-start justify-between gap-cozy-md">
                            <div className="flex-1">
                              <div className="flex items-center gap-cozy-sm mb-1">
                                <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
                                <h4 className="font-medium">Theme</h4>
                              </div>
                              <p className={`text-sm opacity-75 ${
                                theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'
                              }`}>
                                Choose between light and dark mode
                              </p>
                            </div>
                            
                            <motion.button
                              onClick={toggleTheme}
                              className={`
                                flex items-center gap-2 px-4 py-2 rounded-cozy-lg transition-all duration-200
                                ${theme === 'dark' 
                                  ? 'bg-cozy-tan text-cozy-cream hover:bg-opacity-90' 
                                  : 'bg-cozy-sage-green text-cozy-cream hover:bg-opacity-90'
                                }
                              `}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                              <span className="text-sm font-medium">
                                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                              </span>
                            </motion.button>
                          </div>

                          <SelectSetting
                            label="Language"
                            description="Choose your preferred language"
                            value={appSettings.language}
                            options={[
                              { value: 'en', label: 'English', sticker: '🇺🇸' },
                              { value: 'es', label: 'Español', sticker: '🇪🇸' },
                              { value: 'fr', label: 'Français', sticker: '🇫🇷' },
                              { value: 'it', label: 'Italiano', sticker: '🇮🇹' },
                              { value: 'de', label: 'Deutsch', sticker: '🇩🇪' }
                            ]}
                            onChange={(value) => updateAppSettings({ language: value })}
                          />
                        </div>
                      </div>
                    )}

                    {/* Food Preferences */}
                    {activeSection === 'preferences' && (
                      <div className="space-y-cozy-xl">
                        <div>
                          <h2 className="text-cozy-subheading mb-cozy-md">Food Preferences</h2>
                          <p className="text-cozy-body opacity-75 mb-cozy-xl">
                            Set your dietary restrictions and favorite cuisines
                          </p>
                        </div>

                        <div className="space-y-cozy-lg">
                          {/* Dietary Restrictions */}
                          <div>
                            <h4 className="font-medium mb-cozy-md flex items-center gap-2">
                              <span>🥗</span>
                              Dietary Restrictions
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-cozy-sm">
                              {[
                                { id: 'vegetarian', label: 'Vegetarian', sticker: '🥬' },
                                { id: 'vegan', label: 'Vegan', sticker: '🌱' },
                                { id: 'gluten-free', label: 'Gluten-Free', sticker: '🌾' },
                                { id: 'dairy-free', label: 'Dairy-Free', sticker: '🥛' },
                                { id: 'nut-free', label: 'Nut-Free', sticker: '🥜' },
                                { id: 'keto', label: 'Keto', sticker: '🥑' }
                              ].map((restriction) => {
                                const isSelected = userPreferences.dietaryRestrictions.includes(restriction.id);
                                return (
                                  <motion.button
                                    key={restriction.id}
                                    onClick={() => {
                                      const newRestrictions = isSelected
                                        ? userPreferences.dietaryRestrictions.filter(r => r !== restriction.id)
                                        : [...userPreferences.dietaryRestrictions, restriction.id];
                                      updateUserPreferences({ dietaryRestrictions: newRestrictions });
                                    }}
                                    className={`
                                      flex items-center gap-2 p-3 rounded-cozy-md border-2 transition-all duration-200
                                      ${isSelected
                                        ? 'border-cozy-soft-orange bg-cozy-soft-orange bg-opacity-20'
                                        : theme === 'dark'
                                          ? 'border-cozy-charcoal hover:border-cozy-cream'
                                          : 'border-gray-300 hover:border-cozy-sage-green'
                                      }
                                    `}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <span>{restriction.sticker}</span>
                                    <span className="text-sm font-medium">{restriction.label}</span>
                                    {isSelected && <Check className="w-4 h-4 text-cozy-soft-orange ml-auto" />}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Preferred Cuisines */}
                          <div>
                            <h4 className="font-medium mb-cozy-md flex items-center gap-2">
                              <span>🌍</span>
                              Preferred Cuisines
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-cozy-sm">
                              {[
                                { id: 'italian', label: 'Italian', sticker: '🇮🇹' },
                                { id: 'french', label: 'French', sticker: '🇫🇷' },
                                { id: 'mexican', label: 'Mexican', sticker: '🇲🇽' },
                                { id: 'japanese', label: 'Japanese', sticker: '🇯🇵' },
                                { id: 'indian', label: 'Indian', sticker: '🇮🇳' },
                                { id: 'thai', label: 'Thai', sticker: '🇹🇭' },
                                { id: 'chinese', label: 'Chinese', sticker: '🇨🇳' },
                                { id: 'american', label: 'American', sticker: '🇺🇸' }
                              ].map((cuisine) => {
                                const isSelected = userPreferences.preferredCuisines.includes(cuisine.id);
                                return (
                                  <motion.button
                                    key={cuisine.id}
                                    onClick={() => {
                                      const newCuisines = isSelected
                                        ? userPreferences.preferredCuisines.filter(c => c !== cuisine.id)
                                        : [...userPreferences.preferredCuisines, cuisine.id];
                                      updateUserPreferences({ preferredCuisines: newCuisines });
                                    }}
                                    className={`
                                      flex flex-col items-center gap-1 p-3 rounded-cozy-md border-2 transition-all duration-200
                                      ${isSelected
                                        ? 'border-cozy-soft-orange bg-cozy-soft-orange bg-opacity-20'
                                        : theme === 'dark'
                                          ? 'border-cozy-charcoal hover:border-cozy-cream'
                                          : 'border-gray-300 hover:border-cozy-sage-green'
                                      }
                                    `}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <span className="text-2xl">{cuisine.sticker}</span>
                                    <span className="text-xs font-medium text-center">{cuisine.label}</span>
                                    {isSelected && (
                                      <Check className="w-3 h-3 text-cozy-soft-orange" />
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notifications */}
                    {activeSection === 'notifications' && (
                      <div className="space-y-cozy-xl">
                        <div>
                          <h2 className="text-cozy-subheading mb-cozy-md">Notifications</h2>
                          <p className="text-cozy-body opacity-75 mb-cozy-xl">
                            Control when and how FlavorBridge notifies you
                          </p>
                        </div>

                        <div className="space-y-cozy-lg">
                          <ToggleSetting
                            label="Push notifications"
                            description="Receive notifications about new features and updates"
                            value={appSettings.notifications}
                            onChange={(value) => updateAppSettings({ notifications: value })}
                            sticker="🔔"
                          />
                          
                          <ToggleSetting
                            label="Sound effects"
                            description="Play cute sounds for interactions and achievements"
                            value={soundEnabled}
                            onChange={setSoundEnabled}
                            sticker={soundEnabled ? "🔊" : "🔇"}
                          />
                          
                          <ToggleSetting
                            label="Daily pairing suggestions"
                            description="Get a new pairing suggestion every day"
                            value={true} // TODO: Add to store
                            onChange={() => {}}
                            sticker="📅"
                          />
                          
                          <ToggleSetting
                            label="Achievement unlocks"
                            description="Get notified when you unlock new achievements"
                            value={true} // TODO: Add to store
                            onChange={() => {}}
                            sticker="🏆"
                          />
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {activeSection === 'achievements' && (
                      <div className="space-y-cozy-xl">
                        <div>
                          <h2 className="text-cozy-subheading mb-cozy-md">Achievements</h2>
                          <p className="text-cozy-body opacity-75 mb-cozy-xl">
                            Track your culinary journey and unlock rewards
                          </p>
                          
                          <div className={`
                            inline-flex items-center gap-2 px-4 py-2 rounded-cozy-lg
                            ${theme === 'dark' ? 'bg-cozy-tan' : 'bg-cozy-soft-orange'}
                            text-white shadow-cozy-md
                          `}>
                            <Trophy className="w-5 h-5" />
                            <span className="font-medium">
                              {unlockedCount} of {achievements.length} unlocked
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-cozy-md">
                          {achievements.map((achievement, index) => (
                            <motion.div
                              key={achievement.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1, duration: 0.4 }}
                              className={`
                                p-cozy-lg rounded-cozy-lg border-2 transition-all duration-200
                                ${achievement.unlocked
                                  ? 'border-cozy-soft-orange bg-cozy-soft-orange bg-opacity-20'
                                  : theme === 'dark'
                                    ? 'border-cozy-charcoal bg-cozy-charcoal bg-opacity-30'
                                    : 'border-gray-300 bg-gray-50'
                                }
                              `}
                            >
                              <div className="flex items-start gap-cozy-md">
                                <div className={`
                                  text-3xl ${achievement.unlocked ? '' : 'opacity-30 grayscale'}
                                `}>
                                  {achievement.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className={`font-medium mb-1 ${
                                    achievement.unlocked ? '' : 'opacity-50'
                                  }`}>
                                    {achievement.name}
                                  </h4>
                                  <p className={`text-sm opacity-75 mb-cozy-md ${
                                    achievement.unlocked ? '' : 'opacity-50'
                                  }`}>
                                    {achievement.description}
                                  </p>
                                  
                                  {/* Progress Bar */}
                                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ 
                                        width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                                      }}
                                      transition={{ duration: 1, delay: index * 0.2 }}
                                      className={`
                                        h-2 rounded-full transition-colors duration-300
                                        ${achievement.unlocked ? 'bg-cozy-soft-orange' : 'bg-cozy-sage-green'}
                                      `}
                                    />
                                  </div>
                                  
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="opacity-60">
                                      {achievement.progress} / {achievement.maxProgress}
                                    </span>
                                    {achievement.unlocked && (
                                      <span className="text-cozy-soft-orange font-medium flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Unlocked!
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Stats Overview */}
                        <div className={`
                          p-cozy-lg rounded-cozy-lg 
                          ${theme === 'dark' ? 'bg-cozy-charcoal' : 'bg-cozy-cream-dark'}
                        `}>
                          <h4 className="font-medium mb-cozy-md flex items-center gap-2">
                            <span>📊</span>
                            Your Stats
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-cozy-md">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-cozy-soft-orange">
                                {stats.totalSearches}
                              </div>
                              <div className="text-sm opacity-75">Searches</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-cozy-soft-orange">
                                {stats.favoritesCount}
                              </div>
                              <div className="text-sm opacity-75">Favorites</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-cozy-soft-orange">
                                {stats.pairingsDiscovered}
                              </div>
                              <div className="text-sm opacity-75">Discovered</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-cozy-soft-orange">
                                {stats.daysActive}
                              </div>
                              <div className="text-sm opacity-75">Days Active</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Data & Privacy */}
                    {activeSection === 'data' && (
                      <div className="space-y-cozy-xl">
                        <div>
                          <h2 className="text-cozy-subheading mb-cozy-md">Data & Privacy</h2>
                          <p className="text-cozy-body opacity-75 mb-cozy-xl">
                            Manage your data, export preferences, or reset the app
                          </p>
                        </div>

                        <div className="space-y-cozy-lg">
                          {/* Data Export */}
                          <div className={`
                            p-cozy-lg rounded-cozy-lg border-2
                            ${theme === 'dark' ? 'border-cozy-charcoal bg-cozy-charcoal bg-opacity-30' : 'border-gray-300 bg-gray-50'}
                          `}>
                            <div className="flex items-start gap-cozy-md">
                              <div className="text-2xl">📁</div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">Export Your Data</h4>
                                <p className="text-sm opacity-75 mb-cozy-md">
                                  Download all your favorites, preferences, and settings as a JSON file
                                </p>
                                <button
                                  onClick={handleExportData}
                                  className="btn-cozy-primary inline-flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Export Data
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Data Import */}
                          <div className={`
                            p-cozy-lg rounded-cozy-lg border-2
                            ${theme === 'dark' ? 'border-cozy-charcoal bg-cozy-charcoal bg-opacity-30' : 'border-gray-300 bg-gray-50'}
                          `}>
                            <div className="flex items-start gap-cozy-md">
                              <div className="text-2xl">📂</div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">Import Data</h4>
                                <p className="text-sm opacity-75 mb-cozy-md">
                                  Restore your data from a previously exported file
                                </p>
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportData}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <button className="btn-cozy-secondary inline-flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Choose File
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Privacy Info */}
                          <div className={`
                            p-cozy-lg rounded-cozy-lg border-2
                            ${theme === 'dark' ? 'border-cozy-charcoal bg-cozy-charcoal bg-opacity-30' : 'border-gray-300 bg-gray-50'}
                          `}>
                            <div className="flex items-start gap-cozy-md">
                              <div className="text-2xl">🛡️</div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">Privacy Information</h4>
                                <div className="text-sm opacity-75 space-y-2">
                                  <p>• All your data is stored locally on your device</p>
                                  <p>• No personal information is sent to external servers</p>
                                  <p>• Your preferences and favorites remain completely private</p>
                                  <p>• You can export or delete your data at any time</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* App Reset */}
                          <div className={`
                            p-cozy-lg rounded-cozy-lg border-2 border-red-300 bg-red-50
                            ${theme === 'dark' ? 'border-red-600 bg-red-900 bg-opacity-20' : ''}
                          `}>
                            <div className="flex items-start gap-cozy-md">
                              <div className="text-2xl">⚠️</div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-2 text-red-600">Reset App</h4>
                                <p className="text-sm opacity-75 mb-cozy-md">
                                  This will permanently delete all your data, favorites, and preferences. 
                                  This action cannot be undone!
                                </p>
                                <button
                                  onClick={() => setShowResetConfirm(true)}
                                  className={`
                                    px-4 py-2 rounded-cozy-md bg-red-500 text-white hover:bg-red-600 
                                    transition-colors duration-200 inline-flex items-center gap-2
                                  `}
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  Reset App
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* App Version */}
                          <div className="text-center pt-cozy-lg border-t border-opacity-20 border-current">
                            <div className="text-sm opacity-50">
                              <p>FlavorBridge v1.0.0</p>
                              <p>Made with 💖 for culinary adventures</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-cozy-lg right-cozy-lg z-50"
          >
            <div className={`
              px-cozy-lg py-cozy-md rounded-cozy-lg shadow-cozy-xl
              ${theme === 'dark' ? 'bg-cozy-forest' : 'bg-cozy-white-chocolate'}
              border-2 border-cozy-soft-orange
            `}>
              <div className="flex items-center gap-cozy-md">
                <div className="text-2xl">✅</div>
                <span className="font-medium">{showSuccessToast}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-cozy-md"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`
                max-w-md w-full p-cozy-xl rounded-cozy-xl shadow-cozy-xl
                ${theme === 'dark' ? 'bg-cozy-forest' : 'bg-cozy-white-chocolate'}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-cozy-lg">🗑️</div>
                <h3 className="text-cozy-xl font-serif font-medium mb-cozy-md">
                  Reset FlavorBridge?
                </h3>
                <p className="text-cozy-body mb-cozy-xl opacity-80">
                  This will permanently delete:
                </p>
                <ul className="text-sm opacity-75 text-left mb-cozy-xl space-y-1">
                  <li>• All {favorites.length} favorite pairings</li>
                  <li>• Your search history</li>
                  <li>• All preferences and settings</li>
                  <li>• Achievement progress</li>
                  <li>• App statistics</li>
                </ul>
                <p className="text-sm text-red-600 mb-cozy-xl font-medium">
                  This action cannot be undone!
                </p>
                
                <div className="flex gap-cozy-md justify-center">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="btn-cozy-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetApp}
                    className="px-cozy-lg py-cozy-md rounded-cozy-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 font-medium"
                  >
                    Yes, Reset Everything
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;