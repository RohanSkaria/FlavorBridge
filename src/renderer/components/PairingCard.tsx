import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChefHat, Clock, Users, Star, Sparkles, Plus } from 'lucide-react';
import type { Pairing, Recipe } from '../stores/pairingStore';
import { useFavorites, useTheme } from '../stores/pairingStore';

// === COMPONENT PROPS ===
interface PairingCardProps {
  pairing: Pairing;
  showFullDetails?: boolean;
  onRecipeClick?: (recipe: Recipe) => void;
  className?: string;
  animationDelay?: number;
}

// === STICKER HELPER FUNCTIONS ===
const getIngredientSticker = (category: string, name: string) => {
  // TODO: Replace with your cute downloaded stickers
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
  
  return categoryStickers[category?.toLowerCase()] || '🍽️';
};

const getCompatibilitySticker = (compatibility: number) => {
  // TODO: Replace with cute reaction stickers
  if (compatibility >= 0.9) return '🤩'; // Amazing
  if (compatibility >= 0.8) return '😍'; // Great
  if (compatibility >= 0.7) return '😊'; // Good
  if (compatibility >= 0.6) return '🙂'; // Okay
  return '🤔'; // Uncertain
};

const getConfidenceSticker = (level: 'low' | 'medium' | 'high') => {
  // TODO: Replace with cute confidence level stickers
  const stickers = {
    'low': '🤞',    // Fingers crossed
    'medium': '👍', // Thumbs up
    'high': '⭐'    // Star quality
  };
  return stickers[level];
};

const PairingCard: React.FC<PairingCardProps> = ({
  pairing,
  showFullDetails = false,
  onRecipeClick,
  className = '',
  animationDelay = 0
}) => {
  // === HOOKS ===
  const { theme } = useTheme();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // === STATE ===
  const isCardFavorited = isFavorite(pairing.id);
  const compatibilityPercentage = Math.round(pairing.compatibility * 100);

  // === ACTIONS ===
  const handleFavoriteToggle = () => {
    if (isCardFavorited) {
      removeFromFavorites(pairing.id);
    } else {
      addToFavorites(pairing);
      // Show cute celebration! 🎉
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // === COMPONENT HELPERS ===
  const getCuisineFlag = (cuisine: string) => {
    // TODO: Replace with cute cuisine flag stickers
    const cuisineFlags: Record<string, string> = {
      'italian': '🇮🇹',
      'french': '🇫🇷',
      'mexican': '🇲🇽',
      'japanese': '🇯🇵',
      'indian': '🇮🇳',
      'chinese': '🇨🇳',
      'thai': '🇹🇭',
      'mediterranean': '🏛️',
      'american': '🇺🇸',
      'korean': '🇰🇷'
    };
    return cuisineFlags[cuisine?.toLowerCase()] || '🌍';
  };

  // === RENDER ===
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: animationDelay,
        ease: "easeOut"
      }}
      className={`relative ${className}`}
    >
      {/* Celebration Animation Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 0.6,
                repeat: 2
              }}
              className="text-6xl"
            >
              ✨
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <motion.div
        className="card-cozy hover-cozy relative overflow-hidden cursor-pointer group"
        onClick={handleCardFlip}
        whileHover={{ y: -4 }}
        style={{ 
          perspective: '1000px',
          height: showFullDetails ? 'auto' : '320px'
        }}
      >
        {/* Card Inner (for flip animation) */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ 
            transformStyle: 'preserve-3d',
            width: '100%',
            height: '100%'
          }}
        >
          {/* Front Side */}
          <div
            style={{ 
              backfaceVisibility: 'hidden',
              position: isFlipped ? 'absolute' : 'relative',
              width: '100%',
              height: '100%'
            }}
          >
            {/* Favorite Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteToggle();
              }}
              className={`
                absolute top-cozy-md right-cozy-md z-10 w-10 h-10 rounded-full
                flex items-center justify-center transition-all duration-200
                ${isCardFavorited 
                  ? 'bg-red-500 text-white shadow-cozy-md' 
                  : theme === 'dark'
                    ? 'bg-cozy-charcoal bg-opacity-50 text-cozy-cream hover:bg-red-500'
                    : 'bg-white bg-opacity-80 text-cozy-sage-green hover:bg-red-500 hover:text-white'
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                className={`w-5 h-5 ${isCardFavorited ? 'fill-current' : ''}`} 
              />
            </motion.button>

            {/* Main Content */}
            <div className="text-center">
              {/* Ingredient Pairing Display */}
              <div className="flex items-center justify-center gap-cozy-md mb-cozy-lg">
                {/* First Ingredient */}
                <div className="flex flex-col items-center">
                  <div className={`
                    w-16 h-16 rounded-cozy-lg flex items-center justify-center text-3xl mb-2
                    ${theme === 'dark' ? 'bg-cozy-tan' : 'bg-cozy-soft-orange'}
                    shadow-cozy-md
                  `}>
                    {pairing.ingredient1.image || getIngredientSticker(pairing.ingredient1.category, pairing.ingredient1.name)}
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {pairing.ingredient1.name}
                  </span>
                </div>

                {/* Plus Symbol with sparkles */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-cozy-soft-orange text-2xl mb-2"
                  >
                    ✨
                  </motion.div>
                  <Plus className="w-4 h-4 text-cozy-rosy-brown" />
                </div>

                {/* Second Ingredient */}
                <div className="flex flex-col items-center">
                  <div className={`
                    w-16 h-16 rounded-cozy-lg flex items-center justify-center text-3xl mb-2
                    ${theme === 'dark' ? 'bg-cozy-tan' : 'bg-cozy-soft-orange'}
                    shadow-cozy-md
                  `}>
                    {pairing.ingredient2.image || getIngredientSticker(pairing.ingredient2.category, pairing.ingredient2.name)}
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {pairing.ingredient2.name}
                  </span>
                </div>
              </div>

              {/* Pairing Name/Title */}
              <h3 className="text-cozy-xl font-serif font-medium mb-cozy-sm">
                {pairing.ingredient1.name} & {pairing.ingredient2.name}
              </h3>

              {/* Description */}
              <p className="text-cozy-body text-sm mb-cozy-md opacity-80">
                {pairing.description}
              </p>

              {/* Compatibility Score */}
              <div className={`
                inline-flex items-center gap-2 px-cozy-md py-cozy-sm rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-cozy-soft-orange text-cozy-charcoal' : 'bg-cozy-sage-green text-cozy-cream'}
                shadow-cozy-sm
              `}>
                <span>{getCompatibilitySticker(pairing.compatibility)}</span>
                <span>{compatibilityPercentage}% compatible</span>
                <span>{getConfidenceSticker(pairing.confidenceLevel)}</span>
              </div>

              {/* Cuisine Origins */}
              {pairing.cuisineOrigin && pairing.cuisineOrigin.length > 0 && (
                <div className="mt-cozy-md flex justify-center gap-1">
                  {pairing.cuisineOrigin.slice(0, 3).map((cuisine, index) => (
                    <span key={index} className="text-lg">
                      {getCuisineFlag(cuisine)}
                    </span>
                  ))}
                </div>
              )}

              {/* Flip Hint */}
              <div className={`
                mt-cozy-md text-xs opacity-50 flex items-center justify-center gap-1
                ${theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'}
              `}>
                <span>🔄</span>
                <span>Tap to see recipes</span>
              </div>
            </div>
          </div>

          {/* Back Side - Recipe Details */}
          <div
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: isFlipped ? 'relative' : 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
            <div className="p-cozy-md">
              {/* Header */}
              <div className="text-center mb-cozy-lg">
                <div className="text-2xl mb-2">👨‍🍳</div>
                <h4 className="text-cozy-lg font-serif font-medium">
                  Recipe Ideas
                </h4>
              </div>

              {/* Recipes List */}
              {pairing.recipes && pairing.recipes.length > 0 ? (
                <div className="space-y-cozy-md">
                  {pairing.recipes.slice(0, 3).map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecipeClick?.(recipe);
                      }}
                      className={`
                        p-cozy-md rounded-cozy-md cursor-pointer transition-colors duration-200
                        ${theme === 'dark' 
                          ? 'bg-cozy-charcoal hover:bg-cozy-forest' 
                          : 'bg-cozy-cream-dark hover:bg-cozy-warm-pink'
                        }
                      `}
                    >
                      <div className="flex items-start gap-cozy-sm">
                        <div className="text-lg">
                          {recipe.image || '🍳'}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium mb-1">
                            {recipe.name}
                          </h5>
                          <p className="text-xs opacity-75 mb-2">
                            {recipe.description}
                          </p>
                          <div className="flex items-center gap-cozy-md text-xs opacity-60">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {recipe.cookingTime}m
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {recipe.servings}
                            </span>
                            <span className="flex items-center gap-1">
                              <ChefHat className="w-3 h-3" />
                              {recipe.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-cozy-lg">
                  <div className="text-4xl mb-cozy-md">🤷‍♀️</div>
                  <p className="text-sm opacity-75">
                    No recipes available yet
                  </p>
                  <p className="text-xs opacity-50 mt-2">
                    But this pairing is still delicious!
                  </p>
                </div>
              )}

              {/* Tags */}
              {pairing.tags && pairing.tags.length > 0 && (
                <div className="mt-cozy-lg">
                  <div className="flex flex-wrap gap-cozy-xs justify-center">
                    {pairing.tags.slice(0, 4).map((tag, index) => (
                      <span
                        key={index}
                        className={`
                          px-2 py-1 rounded-full text-xs
                          ${theme === 'dark' 
                            ? 'bg-cozy-tan text-cozy-cream' 
                            : 'bg-cozy-soft-orange text-cozy-sage-green'
                          }
                        `}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Front Hint */}
              <div className={`
                mt-cozy-lg text-center text-xs opacity-50 flex items-center justify-center gap-1
                ${theme === 'dark' ? 'text-cozy-cream' : 'text-cozy-rosy-brown'}
              `}>
                <span>🔄</span>
                <span>Tap to flip back</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hover Glow Effect */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none
          bg-gradient-to-br from-cozy-soft-orange to-cozy-warm-pink rounded-cozy-xl
        `} />
      </motion.div>
    </motion.div>
  );
};

export default PairingCard;