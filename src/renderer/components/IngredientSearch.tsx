import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { usePairingStore } from '../stores/pairingStore';
import { searchIngredients } from '../../services/searchService';
import type { Ingredient } from '../stores/pairingStore';

const IngredientSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const { setSelectedIngredient } = usePairingStore();

  useEffect(() => {
    const performSearch = async () => {
      if (query.length > 2) {
        const results = await searchIngredients(query);
        setSuggestions(results.slice(0, 8));
      } else {
        setSuggestions([]);
      }
    };
    
    performSearch();
  }, [query]);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="search-container"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter an ingredient (e.g., tomatoes, chocolate, basil...)"
          className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 
                     dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     shadow-lg focus:shadow-xl transition-all duration-200"
        />
        
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 
                       rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 z-10"
          >
            {suggestions.map((ingredient, index) => (
              <motion.div
                key={ingredient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedIngredient(ingredient);
                  setQuery(ingredient.name);
                  setSuggestions([]);
                }}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 
                           cursor-pointer border-b border-gray-100 dark:border-gray-600 
                           last:border-b-0 first:rounded-t-xl last:rounded-b-xl
                           transition-colors duration-150"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {ingredient.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {ingredient.category}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default IngredientSearch;