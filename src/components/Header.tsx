import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  onCreateCard: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateCard }) => {
  return (
    <header className="bg-white py-4 border-b border-gray-200 mb-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-800">English Flashcards</h1>
        </div>
        
        <button
          onClick={onCreateCard}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create New Card
        </button>
      </div>
    </header>
  );
};

export default Header;