import React, { useState, useRef } from 'react';
import { Flashcard as FlashcardType } from '../types';
import { Trash2, Edit, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface FlashcardProps {
  card: FlashcardType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(card.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  const confirmDelete = (e: React.MouseEvent, confirm: boolean) => {
    e.stopPropagation();
    if (confirm && onDelete) {
      onDelete(card.id);
    }
    setIsDeleting(false);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardRef.current) return;

    try {
      // Force flip to show translation
      setIsFlipped(true);
      
      // Wait for the flip animation to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
      });

      const link = document.createElement('a');
      link.download = `flashcard-${card.word}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();

      // Reset card state after download
      setIsFlipped(false);
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  return (
    <div 
      ref={cardRef}
      className="relative w-full h-56 perspective-1000 cursor-pointer"
      onClick={handleFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front side */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl shadow-md bg-[url('https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg')] bg-cover p-6 flex flex-col justify-center ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col items-center justify-center text-gray-800">
            <h3 className="text-2xl font-bold mb-2">{card.word}</h3>
            {card.transcription && (
              <p className="text-lg text-gray-600">{card.transcription}</p>
            )}
            {card.category && (
              <div className="absolute top-3 left-3 bg-white/80 text-gray-700 text-xs py-1 px-2 rounded-full">
                {card.category}
              </div>
            )}
          </div>
          <div className="text-gray-600 text-sm absolute bottom-3 left-0 right-0 text-center">
            Click to flip
          </div>
        </div>

        {/* Back side */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-xl shadow-md bg-[url('https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg')] bg-cover p-6 flex flex-col justify-center rotate-y-180 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg text-gray-600 mb-2">Translation</h3>
            <p className="text-2xl font-medium text-gray-800">{card.translation}</p>
            {card.category && (
              <div className="absolute top-3 left-3 bg-white/80 text-gray-700 text-xs py-1 px-2 rounded-full">
                {card.category}
              </div>
            )}
          </div>
          <div className="text-gray-600 text-sm absolute bottom-3 left-0 right-0 text-center">
            Click to flip back
          </div>
        </div>

        {/* Control buttons */}
        {!isDeleting && (
          <div className="absolute top-3 right-3 flex space-x-2 z-10" onClick={e => e.stopPropagation()}>
            <button 
              onClick={handleDownload}
              className="p-1.5 bg-white/80 hover:bg-white/90 text-gray-700 rounded-full transition-colors"
            >
              <Download size={16} />
            </button>
            {onEdit && (
              <button 
                onClick={handleEdit}
                className="p-1.5 bg-white/80 hover:bg-white/90 text-gray-700 rounded-full transition-colors"
              >
                <Edit size={16} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={handleDelete}
                className="p-1.5 bg-white/80 hover:bg-red-400 text-gray-700 rounded-full transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}

        {/* Delete confirmation */}
        {isDeleting && (
          <div 
            className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 rounded-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white p-4 rounded-lg text-center">
              <p className="mb-3 text-gray-800">Are you sure you want to delete this card?</p>
              <div className="flex justify-center space-x-3">
                <button 
                  onClick={e => confirmDelete(e, true)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button 
                  onClick={e => confirmDelete(e, false)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;