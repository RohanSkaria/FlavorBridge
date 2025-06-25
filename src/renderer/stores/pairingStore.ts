import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// === TYPE DEFINITIONS ===
// Professional type safety for all data structures

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  flavorProfile: string[];
  seasonality?: string[];
  image?: string; // For cute stickers! 🎨
  description?: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface Pairing {
  id: string;
  ingredient1: Ingredient;
  ingredient2: Ingredient;
  compatibility: number; // 0-1 score
  description: string;
  confidenceLevel: 'low' | 'medium' | 'high';
  cuisineOrigin?: string[];
  recipes?: Recipe[];
  tags?: string[];
  createdAt: Date;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cookingTime: number; // minutes
  servings: number;
  instructions?: string[];
  image?: string; // Cute recipe stickers! 👨‍🍳
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  favoriteCategories: string[];
  dislikedIngredients: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredCuisines: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  autoSave: boolean;
  showTooltips: boolean;
  animationsEnabled: boolean;
}

// === STORE INTERFACE ===
interface PairingStore {
  // === CORE DATA STATE ===
  selectedIngredient: Ingredient | null;
  pairings: Pairing[];
  favorites: Pairing[];
  searchHistory: Ingredient[];
  recentPairings: Pairing[];
  
  // === UI STATE ===
  isLoadingPairings: boolean;
  isLoadingSearch: boolean;
  currentView: 'search' | 'favorites' | 'settings' | 'history';
  
  // === USER DATA ===
  userPreferences: UserPreferences;
  appSettings: AppSettings;
  
  // === STATISTICS (for cute achievements!) ===
  stats: {
    totalSearches: number;
    favoritesCount: number;
    pairingsDiscovered: number;
    daysActive: number;
    favoriteCategory: string;
  };

  // === CORE ACTIONS ===
  // Ingredient Management
  setSelectedIngredient: (ingredient: Ingredient | null) => void;
  addToSearchHistory: (ingredient: Ingredient) => void;
  clearSearchHistory: () => void;

  // Pairing Management
  setPairings: (pairings: Pairing[]) => void;
  addPairing: (pairing: Pairing) => void;
  setLoadingPairings: (loading: boolean) => void;

  // Favorites Management (with cute celebratory actions! ⭐)
  addToFavorites: (pairing: Pairing) => void;
  removeFromFavorites: (pairingId: string) => void;
  isFavorite: (pairingId: string) => boolean;
  clearFavorites: () => void;

  // Settings Management
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  toggleTheme: () => void;

  // Statistics & Achievements
  incrementSearchCount: () => void;
  updateStats: (stats: Partial<PairingStore['stats']>) => void;
  getAchievements: () => Achievement[];

  // App Lifecycle
  initializeApp: () => void;
  resetApp: () => void;
}

// Achievement system for gamification! 🏆
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // Cute achievement stickers!
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

// === STORE IMPLEMENTATION ===
export const usePairingStore = create<PairingStore>()(
  persist(
    (set, get) => ({
      // === INITIAL STATE ===
      selectedIngredient: null,
      pairings: [],
      favorites: [],
      searchHistory: [],
      recentPairings: [],
      
      isLoadingPairings: false,
      isLoadingSearch: false,
      currentView: 'search',
      
      // Default user preferences
      userPreferences: {
        dietaryRestrictions: [],
        favoriteCategories: [],
        dislikedIngredients: [],
        experienceLevel: 'beginner',
        preferredCuisines: [],
      },

      // Default app settings
      appSettings: {
        theme: 'light',
        language: 'en',
        notifications: true,
        autoSave: true,
        showTooltips: true,
        animationsEnabled: true,
      },

      // Initial statistics
      stats: {
        totalSearches: 0,
        favoritesCount: 0,
        pairingsDiscovered: 0,
        daysActive: 1,
        favoriteCategory: '',
      },

      // === CORE ACTIONS IMPLEMENTATION ===
      
      // Ingredient Management
      setSelectedIngredient: (ingredient) => {
        set({ selectedIngredient: ingredient });
        if (ingredient) {
          get().addToSearchHistory(ingredient);
          get().incrementSearchCount();
        }
      },

      addToSearchHistory: (ingredient) => {
        set((state) => {
          const existingIndex = state.searchHistory.findIndex(
            item => item.id === ingredient.id
          );
          
          let newHistory = [...state.searchHistory];
          
          if (existingIndex !== -1) {
            // Move to front if already exists
            newHistory.splice(existingIndex, 1);
          }
          
          newHistory.unshift(ingredient);
          
          // Keep only last 20 searches
          if (newHistory.length > 20) {
            newHistory = newHistory.slice(0, 20);
          }
          
          return { searchHistory: newHistory };
        });
      },

      clearSearchHistory: () => set({ searchHistory: [] }),

      // Pairing Management
      setPairings: (pairings) => {
        set({ pairings });
        // Update recent pairings
        set((state) => ({
          recentPairings: [...pairings.slice(0, 5), ...state.recentPairings]
            .slice(0, 10) // Keep last 10
        }));
        
        // Update discovery stats
        get().updateStats({ 
          pairingsDiscovered: get().stats.pairingsDiscovered + pairings.length 
        });
      },

      addPairing: (pairing) => {
        set((state) => ({
          pairings: [pairing, ...state.pairings]
        }));
      },

      setLoadingPairings: (loading) => set({ isLoadingPairings: loading }),

      // Favorites Management with celebrations! 🎉
      addToFavorites: (pairing) => {
        set((state) => {
          // Check if already favorited
          const isAlreadyFavorite = state.favorites.some(
            fav => fav.id === pairing.id
          );
          
          if (isAlreadyFavorite) return state;
          
          const newFavorites = [...state.favorites, pairing];
          
          // Update stats
          const newStats = {
            ...state.stats,
            favoritesCount: newFavorites.length
          };
          
          return { 
            favorites: newFavorites,
            stats: newStats
          };
        });
        
        // TODO: Show cute celebration animation! ✨
        console.log(`🎉 Added ${pairing.ingredient2.name} to favorites!`);
      },

      removeFromFavorites: (pairingId) => {
        set((state) => {
          const newFavorites = state.favorites.filter(
            fav => fav.id !== pairingId
          );
          
          const newStats = {
            ...state.stats,
            favoritesCount: newFavorites.length
          };
          
          return { 
            favorites: newFavorites,
            stats: newStats
          };
        });
      },

      isFavorite: (pairingId) => {
        return get().favorites.some(fav => fav.id === pairingId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
        get().updateStats({ favoritesCount: 0 });
      },

      // Settings Management
      updateUserPreferences: (preferences) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences }
        }));
      },

      updateAppSettings: (settings) => {
        set((state) => ({
          appSettings: { ...state.appSettings, ...settings }
        }));
      },

      toggleTheme: () => {
        set((state) => ({
          appSettings: {
            ...state.appSettings,
            theme: state.appSettings.theme === 'light' ? 'dark' : 'light'
          }
        }));
      },

      // Statistics & Achievements
      incrementSearchCount: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            totalSearches: state.stats.totalSearches + 1
          }
        }));
      },

      updateStats: (statsUpdate) => {
        set((state) => ({
          stats: { ...state.stats, ...statsUpdate }
        }));
      },

      // Achievement system for gamification! 🏆
      getAchievements: (): Achievement[] => {
        const { stats, favorites } = get();
        
        return [
          {
            id: 'first_search',
            name: 'Culinary Explorer',
            description: 'Perform your first ingredient search',
            icon: '🔍', // TODO: Replace with cute explorer sticker
            unlocked: stats.totalSearches >= 1,
            progress: Math.min(stats.totalSearches, 1),
            maxProgress: 1,
          },
          {
            id: 'favorite_collector',
            name: 'Flavor Collector',
            description: 'Save 5 favorite pairings',
            icon: '⭐', // TODO: Replace with cute star sticker
            unlocked: stats.favoritesCount >= 5,
            progress: Math.min(stats.favoritesCount, 5),
            maxProgress: 5,
          },
          {
            id: 'discovery_master',
            name: 'Pairing Master',
            description: 'Discover 50 unique pairings',
            icon: '👨‍🍳', // TODO: Replace with cute master chef sticker
            unlocked: stats.pairingsDiscovered >= 50,
            progress: Math.min(stats.pairingsDiscovered, 50),
            maxProgress: 50,
          },
          {
            id: 'daily_user',
            name: 'Daily Foodie',
            description: 'Use FlavorBridge for 7 days',
            icon: '📅', // TODO: Replace with cute calendar sticker
            unlocked: stats.daysActive >= 7,
            progress: Math.min(stats.daysActive, 7),
            maxProgress: 7,
          },
          {
            id: 'adventurous_palate',
            name: 'Adventurous Palate',
            description: 'Try ingredients from 10 different categories',
            icon: '🌍', // TODO: Replace with cute globe/adventure sticker
            unlocked: false, // Complex logic would go here
            progress: 3, // Placeholder
            maxProgress: 10,
          }
        ];
      },

      // App Lifecycle
      initializeApp: () => {
        // Initialize app on startup
        console.log('🍳 FlavorBridge initialized!');
        
        // Update daily active status
        const lastActive = localStorage.getItem('flavorbridge_last_active');
        const today = new Date().toDateString();
        
        if (lastActive !== today) {
          localStorage.setItem('flavorbridge_last_active', today);
          set((state) => ({
            stats: {
              ...state.stats,
              daysActive: state.stats.daysActive + 1
            }
          }));
        }
      },

      resetApp: () => {
        // Reset to initial state (useful for testing)
        set({
          selectedIngredient: null,
          pairings: [],
          favorites: [],
          searchHistory: [],
          recentPairings: [],
          isLoadingPairings: false,
          isLoadingSearch: false,
          currentView: 'search',
          stats: {
            totalSearches: 0,
            favoritesCount: 0,
            pairingsDiscovered: 0,
            daysActive: 1,
            favoriteCategory: '',
          }
        });
      },
    }),
    {
      name: 'flavorbridge-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      
      // Only persist certain parts of the state
      partialize: (state) => ({
        favorites: state.favorites,
        searchHistory: state.searchHistory,
        userPreferences: state.userPreferences,
        appSettings: state.appSettings,
        stats: state.stats,
        recentPairings: state.recentPairings,
      }),
      
      // Version for migration handling
      version: 1,
      
      // Migration function for future updates
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Handle migration from version 0 to 1
          return {
            ...persistedState,
            stats: {
              totalSearches: 0,
              favoritesCount: persistedState.favorites?.length || 0,
              pairingsDiscovered: 0,
              daysActive: 1,
              favoriteCategory: '',
            }
          };
        }
        return persistedState;
      },
    }
  )
);

// === UTILITY HOOKS ===
// Custom hooks for common operations

export const useTheme = () => {
  const theme = usePairingStore(state => state.appSettings.theme);
  const toggleTheme = usePairingStore(state => state.toggleTheme);
  return { theme, toggleTheme };
};

export const useFavorites = () => {
  const favorites = usePairingStore(state => state.favorites);
  const addToFavorites = usePairingStore(state => state.addToFavorites);
  const removeFromFavorites = usePairingStore(state => state.removeFromFavorites);
  const clearFavorites = usePairingStore(state => state.clearFavorites);
  const isFavorite = usePairingStore(state => state.isFavorite);
  
  return { favorites, addToFavorites, removeFromFavorites, clearFavorites, isFavorite };
};

export const useAchievements = () => {
  const getAchievements = usePairingStore(state => state.getAchievements);
  const achievements = getAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return { achievements, unlockedCount };
};