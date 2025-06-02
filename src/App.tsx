import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FlashcardForm from './components/FlashcardForm';
import FlashcardList from './components/FlashcardList';
import { Flashcard, FlashcardFormData } from './types';
import { getFlashcards, addFlashcard, updateFlashcard, deleteFlashcard } from './utils/storage';
import './index.css';

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  // Load flashcards from localStorage on initial render
  useEffect(() => {
    setFlashcards(getFlashcards());
  }, []);

  const handleCreateCard = () => {
    setEditingCard(null);
    setShowForm(true);
  };

  const handleEditCard = (id: string) => {
    const card = flashcards.find(card => card.id === id);
    if (card) {
      setEditingCard(card);
      setShowForm(true);
    }
  };

  const handleDeleteCard = (id: string) => {
    deleteFlashcard(id);
    setFlashcards(getFlashcards());
  };

  const handleFormSubmit = (data: FlashcardFormData) => {
    if (editingCard) {
      updateFlashcard(editingCard.id, data);
    } else {
      addFlashcard(data);
    }
    
    setFlashcards(getFlashcards());
    setShowForm(false);
    setEditingCard(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateCard={handleCreateCard} />
      
      <main className="container mx-auto px-4 pb-12">
        {showForm ? (
          <div className="max-w-2xl mx-auto mb-8">
            <FlashcardForm 
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              initialData={editingCard || undefined}
            />
          </div>
        ) : (
          <>
            {flashcards.length === 0 && (
              <div className="text-center py-12 mb-8 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to English Flashcards!</h2>
                <p className="text-gray-600 mb-6">Create your first flashcard to start learning.</p>
                <button
                  onClick={handleCreateCard}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create First Card
                </button>
              </div>
            )}
            
            <FlashcardList 
              cards={flashcards}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;