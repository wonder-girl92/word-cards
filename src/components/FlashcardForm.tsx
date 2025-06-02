import React, { useState } from 'react';
import { FlashcardFormData } from '../types';
import { Plus, X } from 'lucide-react';

interface FlashcardFormProps {
  onSubmit: (data: FlashcardFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<FlashcardFormData>;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData = {} 
}) => {
  const [formData, setFormData] = useState<FlashcardFormData>({
    word: initialData.word || '',
    transcription: initialData.transcription || '',
    translation: initialData.translation || '',
    category: initialData.category || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FlashcardFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof FlashcardFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FlashcardFormData, string>> = {};
    
    if (!formData.word.trim()) {
      newErrors.word = 'Word is required';
    }
    
    if (!formData.translation.trim()) {
      newErrors.translation = 'Translation is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData.word ? 'Edit Flashcard' : 'Create New Flashcard'}
        </h2>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">
            English Word
          </label>
          <input
            type="text"
            id="word"
            name="word"
            value={formData.word}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.word ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
            placeholder="Enter English word"
          />
          {errors.word && (
            <p className="mt-1 text-sm text-red-600">{errors.word}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="transcription" className="block text-sm font-medium text-gray-700 mb-1">
            Transcription
          </label>
          <input
            type="text"
            id="transcription"
            name="transcription"
            value={formData.transcription}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
            placeholder="e.g., /ˈtrænskrɪpʃən/"
          />
        </div>
        
        <div>
          <label htmlFor="translation" className="block text-sm font-medium text-gray-700 mb-1">
            Translation
          </label>
          <input
            type="text"
            id="translation"
            name="translation"
            value={formData.translation}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:outline-none ${
              errors.translation ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-indigo-100 focus:border-indigo-500'
            }`}
            placeholder="Enter translation"
          />
          {errors.translation && (
            <p className="mt-1 text-sm text-red-600">{errors.translation}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category (optional)
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none"
            placeholder="e.g., Verbs, Food, Business"
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-3"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
        >
          <Plus size={16} className="mr-1" />
          {initialData.word ? 'Update Flashcard' : 'Create Flashcard'}
        </button>
      </div>
    </form>
  );
};

export default FlashcardForm;