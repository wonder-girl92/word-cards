import { Flashcard } from '../types';

const STORAGE_KEY = 'flashcards';

export const getFlashcards = (): Flashcard[] => {
  const storedCards = localStorage.getItem(STORAGE_KEY);
  return storedCards ? JSON.parse(storedCards) : [];
};

export const saveFlashcards = (flashcards: Flashcard[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
};

export const addFlashcard = (flashcard: Omit<Flashcard, 'id' | 'createdAt'>): Flashcard => {
  const flashcards = getFlashcards();
  const newCard: Flashcard = {
    ...flashcard,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  
  saveFlashcards([...flashcards, newCard]);
  return newCard;
};

export const updateFlashcard = (id: string, data: Partial<Omit<Flashcard, 'id' | 'createdAt'>>): Flashcard | null => {
  const flashcards = getFlashcards();
  const index = flashcards.findIndex(card => card.id === id);
  
  if (index === -1) return null;
  
  const updatedCard = { ...flashcards[index], ...data };
  flashcards[index] = updatedCard;
  saveFlashcards(flashcards);
  
  return updatedCard;
};

export const deleteFlashcard = (id: string): boolean => {
  const flashcards = getFlashcards();
  const filteredCards = flashcards.filter(card => card.id !== id);
  
  if (filteredCards.length === flashcards.length) return false;
  
  saveFlashcards(filteredCards);
  return true;
};