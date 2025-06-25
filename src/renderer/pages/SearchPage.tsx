import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ChefHat, Loader2, Coffee } from 'lucide-react';
import { usePairingStore } from '../stores/pairingStore';
import { searchIngredients } from '../../services/searchService';
import { generatePairings } from '../../services/pairingEngine';

// Types for type safety and professional code structure
interface Ingredient {
  id: string;
  name: string;
  category: string;
  flavorProfile: string[];
  seasonality?: string[];
  image?: string; // For cute stickers!
}

interface SearchSuggestion extends Ingredient {
  matchScore: number;
}

const SearchPage: React.FC = () => {
  // === STATE MANAGEMENT ===
  // Separation of concerns: UI state vs business logic state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Global state from Zustand store
  const { 
    selectedIngredient, 
    pairings, 
    isLoadingPairings,
    setSelectedIngredient, 
    setPairings,
    appSettings 
  } = usePairingStore();
  const { theme } = appSettings;

  // === BUSINESS LOGIC ===
  // Debounced search to prevent excessive API calls (professional UX)
  const performSearch = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        // Simulate API delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 150));
        const results = await searchIngredients(query);
        // Convert Ingredient[] to SearchSuggestion[]
        const suggestions: SearchSuggestion[] = results.map((ingredient, index) => ({
          ...ingredient,
          matchScore: 1 - (index * 0.1) // Simple scoring based on position
        }));
        setSuggestions(suggestions.slice(0, 6)); // Limit suggestions for clean UI
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Debounce search input (professional performance optimization)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  // Handle ingredient selection and pairing generation
  const handleIngredientSelect = async (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setSearchQuery(ingredient.name);
    setSuggestions([]);
    setSearchFocused(false);
    setHasSearched(true);

    try {
      const generatedPairings = await generatePairings(ingredient);
      setPairings(generatedPairings);
    } catch (error) {
      console.error('Pairing generation error:', error);
      // Handle error gracefully - show user-friendly message
    }
  };

  // === COMPONENT HELPERS ===
  // Sticker/emoji system for ingredient categories
  const getIngredientSticker = (ingredient: Ingredient) => {
    // TODO: Replace with your downloaded cute stickers
    const categoryStickers: Record<string, string> = {
      'vegetable': '🥕',
      'fruit': '🍎', 
      'herb': '🌿',
      'spice': '🌶️',
      'protein': '🥩',
      'dairy': '🧀',
      'grain': '🌾',
      'nut': '🥜',
      'seafood': '🐟',
      'beverage': '☕',
      'sweet': '🍯',
      'fat': '🫒',
    };
    
    return ingredient.image || categoryStickers[ingredient.category?.toLowerCase()] || '🍽️';
  };

  // Random food stickers for general use
  const getRandomFoodSticker = () => {
    // TODO: Replace with your cute downloaded sticker collection
    const foodStickers = [
      '🍅', '🧄', '🌿', '🧀', '🍄', '🥕', '🌶️', '🍋',
      '🥑', '🍓', '🥬', '🫐', '🥒', '🍊', '🥭', '🍇'
    ];
    return foodStickers[Math.floor(Math.random() * foodStickers.length)];
  };

  // Celebration/reaction stickers
  const getCelebrationSticker = () => {
    // TODO: Replace with cute reaction stickers
    const celebrations = ['✨', '🎉', '⭐', '💫', '🌟', '🎊'];
    return celebrations[Math.floor(Math.random() * celebrations.length)];
  };

  // === RENDER LOGIC ===
  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Section with Search */}
      <section className="section-cozy">
        <div className="container-cozy max-w-4xl">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-cozy-3xl"
          >
            <div className="flex items-center justify-center gap-cozy-md mb-cozy-lg">
              {/* Main hero sticker - replace with cute chef/cooking sticker */}
              <div className={`
                w-16 h-16 rounded-cozy-xl flex items-center justify-center
                ${theme === 'dark' ? 'bg-cozy-tan' : 'bg-cozy-soft-orange'}
                shadow-cozy-lg animate-cozy-pulse text-4xl
              `}>
                👨‍🍳
              </div>
              {/* Decorative sparkle sticker */}
              <div className="text-2xl animate-cozy-bounce">✨</div>
            </div>

            <h1 className="text-cozy-heading mb-cozy-md">
              Discover Amazing Flavor Pairings
            </h1>
            <p className="text-cozy-body max-w-2xl mx-auto">
              Enter any ingredient and let FlavorBridge suggest delicious combinations 
              that will elevate your cooking. From classic pairings to surprising discoveries!
            </p>
          </motion.div>

          {/* Search Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            {/* Search Input */}
            <div className="relative">
              <div className="absolute left-cozy-lg top-1/2 transform -translate-y-1/2 z-10">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 text-cozy-rosy-brown animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-cozy-rosy-brown" />
                )}
              </div>
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  // Delay to allow suggestion clicks
                  setTimeout(() => setSearchFocused(false), 200);
                }}
                placeholder="Try 'tomatoes', 'dark chocolate', or 'fresh basil'..."
                className={`
                  input-cozy pl-14 pr-cozy-lg text-lg h-16
                  ${searchFocused 
                    ? 'ring-4 ring-cozy-soft-orange ring-opacity-20 border-cozy-soft-orange' 
                    : ''
                  }
                  transition-all duration-300
                `}
                aria-label="Search for ingredients"
                aria-describedby="search-description"
              />
            </div>

            <p id="search-description" className="sr-only">
              Type an ingredient name to see pairing suggestions
            </p>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    absolute top-full mt-2 w-full rounded-cozy-xl shadow-cozy-xl z-20
                    ${theme === 'dark' 
                      ? 'bg-cozy-forest border border-cozy-charcoal' 
                      : 'bg-cozy-white-chocolate border border-cozy-sage-green border-opacity-20'
                    }
                    overflow-hidden
                  `}
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      onClick={() => handleIngredientSelect(suggestion)}
                      className={`
                        w-full flex items-center gap-cozy-md p-cozy-md text-left
                        transition-colors duration-200 group
                        ${theme === 'dark'
                          ? 'hover:bg-cozy-charcoal text-cozy-cream'
                          : 'hover:bg-cozy-cream-dark text-cozy-sage-green'
                        }
                        ${index === 0 ? 'rounded-t-cozy-xl' : ''}
                        ${index === suggestions.length - 1 ? 'rounded-b-cozy-xl' : 'border-b border-opacity-10 border-current'}
                      `}
                    >
                      {/* Ingredient Sticker/Icon */}
                      <div className={`
                        w-10 h-10 rounded-cozy-md flex items-center justify-center text-lg
                        ${theme === 'dark' ? 'bg-cozy-tan' : 'bg-cozy-soft-orange'}
                        group-hover:scale-110 transition-transform duration-200
                      `}>
                        {getIngredientSticker(suggestion)}
                      </div>
                      
                      {/* Ingredient Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium capitalize">
                          {suggestion.name}
                        </div>
                        <div className={`text-sm opacity-75 capitalize ${
                          theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'
                        }`}>
                          {suggestion.category} • {suggestion.flavorProfile.join(', ')}
                        </div>
                      </div>

                      {/* Match Score */}
                      <div className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${theme === 'dark' ? 'bg-cozy-soft-orange text-cozy-charcoal' : 'bg-cozy-sage-green text-cozy-cream'}
                      `}>
                        {Math.round(suggestion.matchScore * 100)}% match
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {hasSearched && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="section-cozy pt-0"
          >
            <div className="container-cozy">
              {selectedIngredient && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-cozy-2xl"
                >
                  <h2 className="text-cozy-subheading mb-cozy-md">
                    Perfect Pairings for{' '}
                    <span className="text-cozy-soft-orange capitalize">
                      {selectedIngredient.name}
                    </span>
                  </h2>
                  <p className="text-cozy-body opacity-80">
                    Curated combinations that bring out the best flavors
                  </p>
                </motion.div>
              )}

              {/* Loading State with cute sticker */}
              {isLoadingPairings && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-cozy-4xl"
                >
                  {/* TODO: Replace with cute loading/cooking sticker */}
                  <div className={`
                    w-16 h-16 rounded-cozy-xl flex items-center justify-center mb-cozy-lg text-4xl
                    ${theme === 'dark' ? 'bg-cozy-tan' : 'bg-cozy-soft-orange'}
                    animate-cozy-pulse
                  `}>
                    🍳
                  </div>
                  <p className="text-cozy-body">
                    Discovering delicious combinations...
                  </p>
                  <div className="mt-cozy-sm text-lg animate-cozy-bounce">
                    {getCelebrationSticker()}
                  </div>
                </motion.div>
              )}

              {/* Pairing Results Grid */}
              {pairings.length > 0 && !isLoadingPairings && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-cozy-lg"
                >
                  {pairings.map((pairing, index) => (
                    <motion.div
                      key={pairing.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      {/* TODO: Replace with actual PairingCard component */}
                      <div className="card-cozy hover-cozy">
                        <div className="text-center">
                          {/* Ingredient sticker */}
                          <div className="text-4xl mb-cozy-md">
                            {getIngredientSticker(pairing.ingredient2)}
                          </div>
                          <h3 className="text-cozy-xl font-serif font-medium mb-cozy-sm capitalize">
                            {pairing.ingredient2.name}
                          </h3>
                          <p className="text-cozy-body text-sm">
                            {pairing.description}
                          </p>
                          <div className={`
                            mt-cozy-md px-cozy-md py-cozy-sm rounded-full text-xs font-medium inline-flex items-center gap-1
                            ${theme === 'dark' ? 'bg-cozy-soft-orange text-cozy-charcoal' : 'bg-cozy-sage-green text-cozy-cream'}
                          `}>
                            <span>{getCelebrationSticker()}</span>
                            {Math.round(pairing.compatibility * 100)}% compatibility
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Empty State with sad/confused sticker */}
              {hasSearched && pairings.length === 0 && !isLoadingPairings && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-cozy-4xl"
                >
                  {/* TODO: Replace with cute confused/sad sticker */}
                  <div className="text-6xl mb-cozy-lg">🤔</div>
                  <h3 className="text-cozy-subheading mb-cozy-md">
                    No pairings found
                  </h3>
                  <p className="text-cozy-body mb-cozy-lg max-w-md mx-auto">
                    We couldn't find any pairings for that ingredient. 
                    Try searching for something else!
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIngredient(null);
                      setHasSearched(false);
                    }}
                    className="btn-cozy-primary inline-flex items-center gap-cozy-sm"
                  >
                    <span>🔄</span>
                    Try Another Search
                  </button>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Welcome/Empty State for New Users */}
      {!hasSearched && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="section-cozy"
        >
          <div className="container-cozy text-center">
            {/* TODO: Replace with cute welcome/chef sticker */}
            <div className="text-8xl mb-cozy-lg">👩‍🍳</div>
            <h2 className="text-cozy-subheading mb-cozy-md">
              Ready to discover your next favorite combination?
            </h2>
            <p className="text-cozy-body max-w-lg mx-auto opacity-80 mb-cozy-lg">
              Start by typing any ingredient above. We'll suggest amazing pairings 
              that professional chefs and food lovers swear by!
            </p>
            {/* Decorative food stickers */}
            <div className="flex justify-center gap-cozy-md text-2xl">
              <span className="animate-cozy-bounce" style={{ animationDelay: '0s' }}>🍅</span>
              <span className="animate-cozy-bounce" style={{ animationDelay: '0.2s' }}>🧀</span>
              <span className="animate-cozy-bounce" style={{ animationDelay: '0.4s' }}>🌿</span>
              <span className="animate-cozy-bounce" style={{ animationDelay: '0.6s' }}>🥑</span>
              <span className="animate-cozy-bounce" style={{ animationDelay: '0.8s' }}>🍄</span>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default SearchPage;