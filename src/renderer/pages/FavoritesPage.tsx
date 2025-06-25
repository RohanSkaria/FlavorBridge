import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Search, 
  Filter, 
  SortAsc, 
  Grid3X3, 
  List,
  Trash2,
  Share2,
  Download,
  Star,
  Calendar,
  Coffee,
  Sparkles,
  Clock,
  Users
} from 'lucide-react';
import PairingCard from '../components/PairingCard';
import { useFavorites, useTheme } from '../stores/pairingStore';
import type { Recipe, Pairing } from '../stores/pairingStore';

// === TYPES ===
type SortOption = 'date' | 'name' | 'compatibility' | 'category';
type ViewMode = 'grid' | 'list';
type FilterOption = 'all' | 'vegetable' | 'fruit' | 'protein' | 'dairy' | 'herb' | 'spice';

const FavoritesPage: React.FC = () => {
  // === HOOKS ===
  const { theme } = useTheme();
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  
  // === STATE ===
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // === COMPUTED VALUES ===
  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favorites;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pairing => 
        pairing.ingredient1.name.toLowerCase().includes(query) ||
        pairing.ingredient2.name.toLowerCase().includes(query) ||
        pairing.description.toLowerCase().includes(query) ||
        pairing.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(pairing => 
        pairing.ingredient1.category.toLowerCase() === filterBy ||
        pairing.ingredient2.category.toLowerCase() === filterBy
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.ingredient1.name.localeCompare(b.ingredient1.name);
        case 'compatibility':
          return b.compatibility - a.compatibility;
        case 'category':
          return a.ingredient1.category.localeCompare(b.ingredient1.category);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [favorites, searchQuery, sortBy, filterBy]);

  // === ACTIONS ===
  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleClearFavorites = () => {
    clearFavorites();
    setShowClearConfirm(false);
  };

  const handleShareFavorites = () => {
    // TODO: Implement sharing functionality
    const shareText = `Check out my ${favorites.length} favorite flavor pairings from FlavorBridge! 🍽️✨`;
    if (navigator.share) {
      navigator.share({
        title: 'My FlavorBridge Favorites',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // TODO: Show cute "copied!" toast notification
    }
  };

  const handleExportFavorites = () => {
    // TODO: Implement export functionality
    const exportData = {
      favorites,
      exportedAt: new Date().toISOString(),
      totalCount: favorites.length
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flavorbridge-favorites.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // === STICKER HELPERS ===
  const getEmptyStateSticker = () => {
    // TODO: Replace with cute empty/sad sticker
    return '🥺';
  };

  const getCelebrationSticker = () => {
    // TODO: Replace with cute celebration sticker
    return '🎉';
  };

  const getCategorySticker = (category: FilterOption) => {
    // TODO: Replace with cute category stickers
    const stickers = {
      'all': '🍽️',
      'vegetable': '🥕',
      'fruit': '🍎',
      'protein': '🥩',
      'dairy': '🧀',
      'herb': '🌿',
      'spice': '🌶️'
    };
    return stickers[category];
  };

  // === RENDER ===
  return (
    <div className="h-full overflow-y-auto">
      {/* Header Section */}
      <section className="section-cozy pb-cozy-xl">
        <div className="container-cozy">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-cozy-3xl"
          >
            <div className="flex items-center justify-center gap-cozy-md mb-cozy-lg">
              {/* Heart sticker with animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl"
              >
                💖
              </motion.div>
              <Sparkles className="text-cozy-soft-orange w-8 h-8 animate-cozy-pulse" />
            </div>
            
            <h1 className="text-cozy-heading mb-cozy-md">
              My Favorite Pairings
            </h1>
            <p className="text-cozy-body">
              Your curated collection of delicious flavor combinations
            </p>
            
            {/* Stats */}
            {favorites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className={`
                  inline-flex items-center gap-cozy-md mt-cozy-lg px-cozy-lg py-cozy-md rounded-cozy-xl
                  ${theme === 'dark' ? 'bg-cozy-forest' : 'bg-cozy-warm-pink bg-opacity-30'}
                  shadow-cozy-md
                `}
              >
                <span className="text-2xl">{getCelebrationSticker()}</span>
                <span className="text-cozy-lg font-medium">
                  {favorites.length} saved pairing{favorites.length !== 1 ? 's' : ''}
                </span>
                <Star className="w-5 h-5 text-cozy-soft-orange fill-current" />
              </motion.div>
            )}
          </motion.div>

          {/* Controls Bar */}
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`
                flex flex-col lg:flex-row gap-cozy-md items-center justify-between p-cozy-lg rounded-cozy-xl
                ${theme === 'dark' ? 'bg-cozy-forest' : 'bg-cozy-white-chocolate'}
                shadow-cozy-md mb-cozy-2xl
              `}
            >
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cozy-rosy-brown" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your favorites..."
                  className={`
                    w-full pl-10 pr-4 py-2 rounded-cozy-md border-2 border-opacity-30 transition-all duration-200
                    ${theme === 'dark' 
                      ? 'bg-cozy-charcoal border-cozy-cream text-cozy-cream' 
                      : 'bg-cozy-cream border-cozy-sage-green text-cozy-sage-green'
                    }
                    focus:border-cozy-soft-orange focus:ring-2 focus:ring-cozy-soft-orange focus:ring-opacity-20
                  `}
                />
              </div>

              {/* Filter & Sort Controls */}
              <div className="flex gap-cozy-sm">
                {/* Category Filter */}
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className={`
                    px-3 py-2 rounded-cozy-md border-2 border-opacity-30 transition-all duration-200 text-sm
                    ${theme === 'dark' 
                      ? 'bg-cozy-charcoal border-cozy-cream text-cozy-cream' 
                      : 'bg-cozy-cream border-cozy-sage-green text-cozy-sage-green'
                    }
                  `}
                >
                  <option value="all">{getCategorySticker('all')} All Categories</option>
                  <option value="vegetable">{getCategorySticker('vegetable')} Vegetables</option>
                  <option value="fruit">{getCategorySticker('fruit')} Fruits</option>
                  <option value="protein">{getCategorySticker('protein')} Proteins</option>
                  <option value="dairy">{getCategorySticker('dairy')} Dairy</option>
                  <option value="herb">{getCategorySticker('herb')} Herbs</option>
                  <option value="spice">{getCategorySticker('spice')} Spices</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={`
                    px-3 py-2 rounded-cozy-md border-2 border-opacity-30 transition-all duration-200 text-sm
                    ${theme === 'dark' 
                      ? 'bg-cozy-charcoal border-cozy-cream text-cozy-cream' 
                      : 'bg-cozy-cream border-cozy-sage-green text-cozy-sage-green'
                    }
                  `}
                >
                  <option value="date">📅 Newest First</option>
                  <option value="name">🔤 Name</option>
                  <option value="compatibility">⭐ Compatibility</option>
                  <option value="category">📂 Category</option>
                </select>

                {/* View Mode Toggle */}
                <div className={`
                  flex rounded-cozy-md border-2 border-opacity-30 overflow-hidden
                  ${theme === 'dark' ? 'border-cozy-cream' : 'border-cozy-sage-green'}
                `}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`
                      p-2 transition-all duration-200
                      ${viewMode === 'grid'
                        ? theme === 'dark' ? 'bg-cozy-tan text-cozy-cream' : 'bg-cozy-sage-green text-cozy-cream'
                        : theme === 'dark' ? 'bg-cozy-charcoal text-cozy-cream' : 'bg-cozy-cream text-cozy-sage-green'
                      }
                    `}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`
                      p-2 transition-all duration-200
                      ${viewMode === 'list'
                        ? theme === 'dark' ? 'bg-cozy-tan text-cozy-cream' : 'bg-cozy-sage-green text-cozy-cream'
                        : theme === 'dark' ? 'bg-cozy-charcoal text-cozy-cream' : 'bg-cozy-cream text-cozy-sage-green'
                      }
                    `}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-cozy-sm">
                <button
                  onClick={handleShareFavorites}
                  className={`
                    p-2 rounded-cozy-md transition-all duration-200 hover-cozy-subtle
                    ${theme === 'dark' 
                      ? 'bg-cozy-charcoal text-cozy-cream hover:bg-cozy-tan' 
                      : 'bg-cozy-cream text-cozy-sage-green hover:bg-cozy-sage-green hover:text-cozy-cream'
                    }
                  `}
                  title="Share favorites"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleExportFavorites}
                  className={`
                    p-2 rounded-cozy-md transition-all duration-200 hover-cozy-subtle
                    ${theme === 'dark' 
                      ? 'bg-cozy-charcoal text-cozy-cream hover:bg-cozy-tan' 
                      : 'bg-cozy-cream text-cozy-sage-green hover:bg-cozy-sage-green hover:text-cozy-cream'
                    }
                  `}
                  title="Export favorites"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowClearConfirm(true)}
                  className={`
                    p-2 rounded-cozy-md transition-all duration-200 hover-cozy-subtle
                    ${theme === 'dark' 
                      ? 'bg-cozy-charcoal text-cozy-cream hover:bg-red-600' 
                      : 'bg-cozy-cream text-cozy-sage-green hover:bg-red-500 hover:text-white'
                    }
                  `}
                  title="Clear all favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="section-cozy pt-0">
        <div className="container-cozy">
          {/* Empty State */}
          {favorites.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-cozy-4xl"
            >
              <div className="text-8xl mb-cozy-lg">
                {getEmptyStateSticker()}
              </div>
              <h2 className="text-cozy-subheading mb-cozy-md">
                No favorites yet
              </h2>
              <p className="text-cozy-body mb-cozy-xl max-w-lg mx-auto opacity-80">
                Start exploring ingredients to discover amazing pairings! 
                When you find something you love, tap the heart to save it here.
              </p>
              
              {/* Cute encouragement */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl mb-cozy-lg"
              >
                ✨
              </motion.div>
              
              <button
                onClick={() => window.location.href = '/search'}
                className="btn-cozy-primary inline-flex items-center gap-cozy-sm"
              >
                <Coffee className="w-5 h-5" />
                Start Discovering Pairings
              </button>
            </motion.div>
          )}

          {/* No Results State */}
          {favorites.length > 0 && filteredAndSortedFavorites.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-cozy-4xl"
            >
              <div className="text-6xl mb-cozy-lg">🔍</div>
              <h3 className="text-cozy-subheading mb-cozy-md">
                No matching favorites
              </h3>
              <p className="text-cozy-body mb-cozy-lg max-w-md mx-auto">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterBy('all');
                }}
                className="btn-cozy-secondary"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* Favorites Grid/List */}
          {filteredAndSortedFavorites.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${sortBy}-${filterBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-cozy-lg'
                    : 'space-y-cozy-md'
                }
              >
                {filteredAndSortedFavorites.map((pairing, index) => (
                  <PairingCard
                    key={pairing.id}
                    pairing={pairing}
                    onRecipeClick={handleRecipeClick}
                    animationDelay={index * 0.1}
                    showFullDetails={viewMode === 'list'}
                    className={viewMode === 'list' ? 'max-w-none' : ''}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Load More Button (for future pagination) */}
          {filteredAndSortedFavorites.length > 12 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-cozy-2xl"
            >
              <button className="btn-cozy-secondary">
                Load More Favorites
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-cozy-md"
            onClick={() => setShowClearConfirm(false)}
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
                <div className="text-6xl mb-cozy-lg">😱</div>
                <h3 className="text-cozy-xl font-serif font-medium mb-cozy-md">
                  Clear All Favorites?
                </h3>
                <p className="text-cozy-body mb-cozy-xl opacity-80">
                  This will permanently remove all {favorites.length} of your saved pairings. 
                  This action cannot be undone!
                </p>
                
                <div className="flex gap-cozy-md justify-center">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="btn-cozy-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearFavorites}
                    className="px-cozy-lg py-cozy-md rounded-cozy-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 font-medium"
                  >
                    Yes, Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-cozy-md"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`
                max-w-lg w-full max-h-[80vh] overflow-y-auto p-cozy-xl rounded-cozy-xl shadow-cozy-xl
                ${theme === 'dark' ? 'bg-cozy-forest' : 'bg-cozy-white-chocolate'}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-cozy-lg">
                <div className="text-4xl mb-cozy-md">
                  {selectedRecipe.image || '👨‍🍳'}
                </div>
                <h3 className="text-cozy-xl font-serif font-medium">
                  {selectedRecipe.name}
                </h3>
              </div>
              
              <div className="space-y-cozy-md">
                <p className="text-cozy-body">
                  {selectedRecipe.description}
                </p>
                
                <div className="flex justify-center gap-cozy-lg text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedRecipe.cookingTime} minutes
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedRecipe.servings} servings
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {selectedRecipe.difficulty}
                  </span>
                </div>

                {selectedRecipe.instructions && (
                  <div>
                    <h4 className="font-medium mb-cozy-sm">Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm opacity-80">
                      {selectedRecipe.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
              
              <div className="mt-cozy-xl text-center">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="btn-cozy-primary"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesPage;