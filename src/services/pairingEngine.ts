import type { Ingredient, Pairing } from '../renderer/stores/pairingStore';
import { getIngredientsByCategory } from './searchService';

// === PAIRING RULES & COMPATIBILITY MATRIX ===
interface FlavorCompatibility {
  [key: string]: {
    [key: string]: number; // 0-1 compatibility score
  };
}

const FLAVOR_COMPATIBILITY: FlavorCompatibility = {
  // Umami pairs well with most things
  'umami': {
    'umami': 0.9,
    'acidic': 0.8,
    'sweet': 0.7,
    'savory': 0.9,
    'aromatic': 0.6,
    'creamy': 0.8,
    'bitter': 0.5,
    'spicy': 0.7,
    'fresh': 0.6,
    'rich': 0.9,
    'bright': 0.5,
    'earthy': 0.8,
    'floral': 0.4,
    'citrusy': 0.6,
    'nutty': 0.8,
    'sharp': 0.7,
    'mild': 0.8,
    'versatile': 0.8,
    'indulgent': 0.7,
    'mineral': 0.6,
    'oceanic': 0.7,
    'fatty': 0.8,
    'starchy': 0.8,
    'comforting': 0.8,
    'complex': 0.8,
    'natural': 0.6,
    'warm': 0.7,
    'enhancing': 0.9,
    'peppery': 0.6,
    'mediterranean': 0.7,
    'pungent': 0.6,
    'salty': 0.8,
    'buttery': 0.8,
    'fruity': 0.5,
    'crisp': 0.6,
    'meaty': 0.9,
    'tart': 0.5
  },
  
  // Acidic ingredients brighten and balance
  'acidic': {
    'umami': 0.8,
    'acidic': 0.3,
    'sweet': 0.9,
    'savory': 0.7,
    'aromatic': 0.6,
    'creamy': 0.8,
    'bitter': 0.4,
    'spicy': 0.6,
    'fresh': 0.8,
    'rich': 0.7,
    'bright': 0.9,
    'earthy': 0.5,
    'floral': 0.6,
    'citrusy': 0.9,
    'nutty': 0.6,
    'sharp': 0.7,
    'mild': 0.7,
    'versatile': 0.7,
    'indulgent': 0.6,
    'mineral': 0.5,
    'oceanic': 0.6,
    'fatty': 0.7,
    'starchy': 0.6,
    'comforting': 0.5,
    'complex': 0.7,
    'natural': 0.6,
    'warm': 0.5,
    'enhancing': 0.7,
    'peppery': 0.5,
    'mediterranean': 0.6,
    'pungent': 0.5,
    'salty': 0.6,
    'buttery': 0.7,
    'fruity': 0.8,
    'crisp': 0.8,
    'meaty': 0.6,
    'tart': 0.8
  },
  
  // Sweet ingredients balance and enhance
  'sweet': {
    'umami': 0.7,
    'acidic': 0.9,
    'sweet': 0.4,
    'savory': 0.6,
    'aromatic': 0.7,
    'creamy': 0.8,
    'bitter': 0.9,
    'spicy': 0.8,
    'fresh': 0.6,
    'rich': 0.7,
    'bright': 0.6,
    'earthy': 0.5,
    'floral': 0.8,
    'citrusy': 0.7,
    'nutty': 0.8,
    'sharp': 0.6,
    'mild': 0.7,
    'versatile': 0.7,
    'indulgent': 0.8,
    'mineral': 0.4,
    'oceanic': 0.5,
    'fatty': 0.7,
    'starchy': 0.6,
    'comforting': 0.8,
    'complex': 0.7,
    'natural': 0.7,
    'warm': 0.8,
    'enhancing': 0.6,
    'peppery': 0.7,
    'mediterranean': 0.6,
    'pungent': 0.6,
    'salty': 0.5,
    'buttery': 0.7,
    'fruity': 0.7,
    'crisp': 0.6,
    'meaty': 0.5,
    'tart': 0.7
  }
};

// === PAIRING GENERATION LOGIC ===
export const generatePairings = async (ingredient: Ingredient): Promise<Pairing[]> => {
  try {
    // Get all other ingredients
    const allIngredients = await getAllIngredients();
    const otherIngredients = allIngredients.filter(i => i.id !== ingredient.id);
    
    // Generate pairings with compatibility scores
    const pairings: Pairing[] = [];
    
    for (const otherIngredient of otherIngredients) {
      const compatibility = calculateCompatibility(ingredient, otherIngredient);
      
      if (compatibility > 0.3) { // Only include reasonably compatible pairings
        const pairing: Pairing = {
          id: `${ingredient.id}-${otherIngredient.id}`,
          ingredient1: ingredient,
          ingredient2: otherIngredient,
          compatibility,
          description: generatePairingDescription(ingredient, otherIngredient, compatibility),
          confidenceLevel: getConfidenceLevel(compatibility),
          cuisineOrigin: getCuisineOrigin(ingredient, otherIngredient),
          tags: generateTags(ingredient, otherIngredient),
          createdAt: new Date()
        };
        
        pairings.push(pairing);
      }
    }
    
    // Sort by compatibility score (highest first)
    return pairings
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 20); // Return top 20 pairings
      
  } catch (error) {
    console.error('Error generating pairings:', error);
    return [];
  }
};

// === HELPER FUNCTIONS ===
const getAllIngredients = async (): Promise<Ingredient[]> => {
  // In a real app, this would fetch from a database
  // For now, we'll use the mock data from searchService
  const categories = ['vegetable', 'fruit', 'protein', 'dairy', 'grain', 'spice', 'herb', 'sweet'];
  const allIngredients: Ingredient[] = [];
  
  for (const category of categories) {
    const categoryIngredients = getIngredientsByCategory(category);
    allIngredients.push(...categoryIngredients);
  }
  
  return allIngredients;
};

const calculateCompatibility = (ingredient1: Ingredient, ingredient2: Ingredient): number => {
  let totalScore = 0;
  let scoreCount = 0;
  
  // Calculate compatibility based on flavor profiles
  for (const flavor1 of ingredient1.flavorProfile) {
    for (const flavor2 of ingredient2.flavorProfile) {
      const score = FLAVOR_COMPATIBILITY[flavor1]?.[flavor2] || 0.5;
      totalScore += score;
      scoreCount++;
    }
  }
  
  // Add category compatibility bonus
  const categoryBonus = getCategoryCompatibility(ingredient1.category, ingredient2.category);
  totalScore += categoryBonus;
  scoreCount++;
  
  return scoreCount > 0 ? totalScore / scoreCount : 0.5;
};

const getCategoryCompatibility = (category1: string, category2: string): number => {
  const categoryPairs: { [key: string]: { [key: string]: number } } = {
    'vegetable': {
      'vegetable': 0.8,
      'fruit': 0.6,
      'protein': 0.9,
      'dairy': 0.7,
      'grain': 0.8,
      'spice': 0.6,
      'herb': 0.8,
      'sweet': 0.4
    },
    'fruit': {
      'vegetable': 0.6,
      'fruit': 0.5,
      'protein': 0.4,
      'dairy': 0.8,
      'grain': 0.5,
      'spice': 0.6,
      'herb': 0.5,
      'sweet': 0.8
    },
    'protein': {
      'vegetable': 0.9,
      'fruit': 0.4,
      'protein': 0.7,
      'dairy': 0.8,
      'grain': 0.9,
      'spice': 0.8,
      'herb': 0.8,
      'sweet': 0.3
    },
    'dairy': {
      'vegetable': 0.7,
      'fruit': 0.8,
      'protein': 0.8,
      'dairy': 0.6,
      'grain': 0.7,
      'spice': 0.5,
      'herb': 0.6,
      'sweet': 0.8
    }
  };
  
  return categoryPairs[category1]?.[category2] || 0.5;
};

const generatePairingDescription = (ingredient1: Ingredient, ingredient2: Ingredient, compatibility: number): string => {
  const descriptions = [
    `${ingredient1.name} and ${ingredient2.name} create a harmonious balance of flavors.`,
    `The ${ingredient1.name} enhances the natural ${ingredient2.name} flavors beautifully.`,
    `${ingredient1.name} pairs wonderfully with ${ingredient2.name} for a delicious combination.`,
    `Try combining ${ingredient1.name} with ${ingredient2.name} for an amazing taste experience.`,
    `${ingredient1.name} and ${ingredient2.name} work together to create depth and complexity.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const getConfidenceLevel = (compatibility: number): 'low' | 'medium' | 'high' => {
  if (compatibility >= 0.8) return 'high';
  if (compatibility >= 0.6) return 'medium';
  return 'low';
};

const getCuisineOrigin = (ingredient1: Ingredient, ingredient2: Ingredient): string[] => {
  // Simple cuisine detection based on ingredients
  const cuisines: string[] = [];
  
  if (['basil', 'oregano', 'tomato', 'mozzarella'].includes(ingredient1.name) ||
      ['basil', 'oregano', 'tomato', 'mozzarella'].includes(ingredient2.name)) {
    cuisines.push('Italian');
  }
  
  if (['rice', 'soy sauce', 'ginger', 'garlic'].includes(ingredient1.name) ||
      ['rice', 'soy sauce', 'ginger', 'garlic'].includes(ingredient2.name)) {
    cuisines.push('Asian');
  }
  
  if (['lime', 'cilantro', 'chili', 'avocado'].includes(ingredient1.name) ||
      ['lime', 'cilantro', 'chili', 'avocado'].includes(ingredient2.name)) {
    cuisines.push('Mexican');
  }
  
  return cuisines.length > 0 ? cuisines : ['International'];
};

const generateTags = (ingredient1: Ingredient, ingredient2: Ingredient): string[] => {
  const tags: string[] = [];
  
  // Add category tags
  tags.push(ingredient1.category, ingredient2.category);
  
  // Add flavor profile tags
  tags.push(...ingredient1.flavorProfile, ...ingredient2.flavorProfile);
  
  // Add seasonal tags if applicable
  if (ingredient1.seasonality) tags.push(...ingredient1.seasonality);
  if (ingredient2.seasonality) tags.push(...ingredient2.seasonality);
  
  // Remove duplicates and return
  return [...new Set(tags)];
}; 