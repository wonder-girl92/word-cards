export interface Flashcard {
  id: string;
  word: string;
  transcription: string;
  translation: string;
  category?: string;
  imageUrl?: string;
  createdAt: number;
}

export type FlashcardFormData = Omit<Flashcard, 'id' | 'createdAt'>;