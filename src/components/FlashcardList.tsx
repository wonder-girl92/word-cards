import React, { useState } from 'react';
import { Flashcard as FlashcardType } from '../types';
import Flashcard from './Flashcard';
import { ListFilter, Search } from 'lucide-react';

interface FlashcardListProps {
  cards: FlashcardType[];
  onEditCard: (id: string) => void;
  onDeleteCard: (id: string) => void;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ 
  cards, 
  onEditCard, 
  onDeleteCard 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Get unique categories from cards
  const categories = ['', ...Array.from(new Set(cards.map(card => card.category).filter(Boolean)))];

  // Filter cards based on search query and selected category
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          card.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort cards by creation date (newest first)
  const sortedCards = [...filteredCards].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="w-full">
      <div className="mb-6 space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        
        {categories.length > 1 && (
          <div className="flex items-center space-x-2">
            <ListFilter size={16} className="text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none text-sm"
            >
              <option value="">All Categories</option>
              {categories.filter(Boolean).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {sortedCards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {cards.length === 0 
              ? 'No flashcards yet. Create your first one!' 
              : 'No flashcards match your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCards.map((card) => (
            <Flashcard
              key={card.id}
              card={card}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardList;