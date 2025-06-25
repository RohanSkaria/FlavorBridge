import Fuse from 'fuse.js';
import type { Ingredient } from '../renderer/stores/pairingStore';

// === MOCK INGREDIENT DATABASE ===
// TODO: Replace with actual database or API calls
const INGREDIENTS_DATABASE: Ingredient[] = [
  // Vegetables 🥕
  {
    id: 'tomato',
    name: 'tomatoes',
    category: 'vegetable',
    flavorProfile: ['umami', 'acidic', 'sweet'],
    seasonality: ['summer'],
    image: '🍅',
    description: 'Juicy, versatile fruit commonly used as a vegetable',
    nutritionalInfo: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 }
  },
  {
    id: 'basil',
    name: 'fresh basil',
    category: 'herb',
    flavorProfile: ['aromatic', 'sweet', 'peppery'],
    seasonality: ['summer'],
    image: '🌿',
    description: 'Fragrant herb perfect for Mediterranean dishes'
  },
  {
    id: 'garlic',
    name: 'garlic',
    category: 'vegetable',
    flavorProfile: ['pungent', 'savory', 'sharp'],
    seasonality: ['year-round'],
    image: '🧄',
    description: 'Essential aromatic ingredient for countless cuisines'
  },
  {
    id: 'onion',
    name: 'onions',
    category: 'vegetable',
    flavorProfile: ['sweet', 'sharp', 'savory'],
    seasonality: ['year-round'],
    image: '🧅',
    description: 'Fundamental base ingredient for most savory dishes'
  },
  {
    id: 'mushroom',
    name: 'mushrooms',
    category: 'vegetable',
    flavorProfile: ['umami', 'earthy', 'meaty'],
    seasonality: ['fall', 'winter'],
    image: '🍄',
    description: 'Earthy fungi that add depth and umami to dishes'
  },
  {
    id: 'carrot',
    name: 'carrots',
    category: 'vegetable',
    flavorProfile: ['sweet', 'earthy', 'crisp'],
    seasonality: ['fall', 'winter'],
    image: '🥕',
    description: 'Sweet root vegetable perfect for roasting or raw preparation'
  },
  {
    id: 'bell-pepper',
    name: 'bell peppers',
    category: 'vegetable',
    flavorProfile: ['sweet', 'crisp', 'fresh'],
    seasonality: ['summer', 'fall'],
    image: '🫑',
    description: 'Colorful, sweet peppers that add crunch and vitamins'
  },
  {
    id: 'spinach',
    name: 'spinach',
    category: 'vegetable',
    flavorProfile: ['mild', 'earthy', 'mineral'],
    seasonality: ['spring', 'fall'],
    image: '🥬',
    description: 'Nutrient-dense leafy green with mild flavor'
  },

  // Fruits 🍎
  {
    id: 'apple',
    name: 'apples',
    category: 'fruit',
    flavorProfile: ['sweet', 'tart', 'crisp'],
    seasonality: ['fall'],
    image: '🍎',
    description: 'Classic fruit perfect for both sweet and savory applications'
  },
  {
    id: 'lemon',
    name: 'lemons',
    category: 'fruit',
    flavorProfile: ['acidic', 'bright', 'citrusy'],
    seasonality: ['winter', 'spring'],
    image: '🍋',
    description: 'Bright citrus that enhances and balances flavors'
  },
  {
    id: 'strawberry',
    name: 'strawberries',
    category: 'fruit',
    flavorProfile: ['sweet', 'fruity', 'floral'],
    seasonality: ['spring', 'summer'],
    image: '🍓',
    description: 'Sweet, aromatic berries perfect for desserts and salads'
  },
  {
    id: 'avocado',
    name: 'avocado',
    category: 'fruit',
    flavorProfile: ['creamy', 'buttery', 'mild'],
    seasonality: ['year-round'],
    image: '🥑',
    description: 'Creamy fruit rich in healthy fats'
  },
  {
    id: 'orange',
    name: 'oranges',
    category: 'fruit',
    flavorProfile: ['sweet', 'citrusy', 'bright'],
    seasonality: ['winter'],
    image: '🍊',
    description: 'Sweet citrus fruit full of vitamin C'
  },

  // Proteins 🥩
  {
    id: 'chicken',
    name: 'chicken',
    category: 'protein',
    flavorProfile: ['mild', 'savory', 'versatile'],
    seasonality: ['year-round'],
    image: '🐔',
    description: 'Lean, versatile protein that pairs with countless flavors'
  },
  {
    id: 'salmon',
    name: 'salmon',
    category: 'seafood',
    flavorProfile: ['rich', 'fatty', 'oceanic'],
    seasonality: ['summer', 'fall'],
    image: '🐟',
    description: 'Rich, omega-3 packed fish with delicate flavor'
  },
  {
    id: 'beef',
    name: 'beef',
    category: 'protein',
    flavorProfile: ['rich', 'savory', 'umami'],
    seasonality: ['year-round'],
    image: '🥩',
    description: 'Rich red meat perfect for hearty dishes'
  },

  // Dairy 🧀
  {
    id: 'mozzarella',
    name: 'mozzarella',
    category: 'dairy',
    flavorProfile: ['mild', 'creamy', 'fresh'],
    seasonality: ['year-round'],
    image: '🧀',
    description: 'Mild, melty cheese perfect for Italian dishes'
  },
  {
    id: 'parmesan',
    name: 'parmesan',
    category: 'dairy',
    flavorProfile: ['sharp', 'nutty', 'umami'],
    seasonality: ['year-round'],
    image: '🧀',
    description: 'Aged hard cheese with complex, nutty flavor'
  },
  {
    id: 'butter',
    name: 'butter',
    category: 'dairy',
    flavorProfile: ['rich', 'creamy', 'indulgent'],
    seasonality: ['year-round'],
    image: '🧈',
    description: 'Rich dairy fat that enhances almost everything'
  },

  // Grains & Starches 🌾
  {
    id: 'rice',
    name: 'rice',
    category: 'grain',
    flavorProfile: ['neutral', 'starchy', 'comforting'],
    seasonality: ['year-round'],
    image: '🍚',
    description: 'Versatile grain that absorbs flavors beautifully'
  },
  {
    id: 'pasta',
    name: 'pasta',
    category: 'grain',
    flavorProfile: ['neutral', 'starchy', 'versatile'],
    seasonality: ['year-round'],
    image: '🍝',
    description: 'Versatile carbohydrate that pairs with countless sauces'
  },

  // Spices & Herbs 🌶️
  {
    id: 'black-pepper',
    name: 'black pepper',
    category: 'spice',
    flavorProfile: ['pungent', 'warm', 'sharp'],
    seasonality: ['year-round'],
    image: '🌶️',
    description: 'Essential seasoning that enhances almost any dish'
  },
  {
    id: 'salt',
    name: 'salt',
    category: 'spice',
    flavorProfile: ['salty', 'mineral', 'enhancing'],
    seasonality: ['year-round'],
    image: '🧂',
    description: 'Fundamental seasoning that brings out natural flavors'
  },
  {
    id: 'oregano',
    name: 'oregano',
    category: 'herb',
    flavorProfile: ['aromatic', 'warm', 'mediterranean'],
    seasonality: ['summer'],
    image: '🌿',
    description: 'Mediterranean herb perfect for Italian and Greek dishes'
  },

  // Sweet Ingredients 🍯
  {
    id: 'honey',
    name: 'honey',
    category: 'sweet',
    flavorProfile: ['sweet', 'floral', 'natural'],
    seasonality: ['year-round'],
    image: '🍯',
    description: 'Natural sweetener with complex floral notes'
  },
  {
    id: 'dark-chocolate',
    name: 'dark chocolate',
    category: 'sweet',
    flavorProfile: ['bitter', 'rich', 'complex'],
    seasonality: ['year-round'],
    image: '🍫',
    description: 'Rich, complex chocolate perfect for desserts and savory dishes'
  },
  {
    id: 'vanilla',
    name: 'vanilla',
    category: 'sweet',
    flavorProfile: ['sweet', 'aromatic', 'warm'],
    seasonality: ['year-round'],
    image: '🌱',
    description: 'Aromatic spice that enhances sweet and savory dishes'
  }
];

// === SEARCH CONFIGURATION ===
const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'category', weight: 0.2 },
    { name: 'description', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
};

const fuse = new Fuse(INGREDIENTS_DATABASE, fuseOptions);

// === SEARCH FUNCTIONS ===
export const searchIngredients = async (query: string): Promise<Ingredient[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const results = fuse.search(query.trim());
    return results
      .slice(0, 10)
      .map(result => result.item)
      .filter(Boolean);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const getPopularIngredients = (): Ingredient[] => {
  const popularIds = ['tomato', 'garlic', 'onion', 'basil', 'lemon', 'chicken', 'rice'];
  return INGREDIENTS_DATABASE.filter(ingredient => 
    popularIds.includes(ingredient.id)
  );
};

export const getIngredientsByCategory = (category: string): Ingredient[] => {
  return INGREDIENTS_DATABASE.filter(ingredient => 
    ingredient.category.toLowerCase() === category.toLowerCase()
  );
};

export const getIngredientById = (id: string): Ingredient | undefined => {
  return INGREDIENTS_DATABASE.find(ingredient => ingredient.id === id);
}; 