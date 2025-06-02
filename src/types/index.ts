export interface Flashcard {
  id: string;
  word: string;
  transcription: string;
  translation: string;
  category?: string;
  createdAt: number;
}

export type FlashcardFormData = Omit<Flashcard, 'id' | 'createdAt'>;