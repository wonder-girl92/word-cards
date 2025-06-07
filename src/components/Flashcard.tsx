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
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    if (!isDownloading) {
      setIsFlipped(!isFlipped);
    }
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
      setIsDownloading(true);

      const container = document.createElement('div');
      container.style.width = '400px';
      container.style.height = '500px';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      const downloadCard = document.createElement('div');
      downloadCard.style.width = '100%';
      downloadCard.style.height = '100%';
      downloadCard.style.display = 'flex';
      downloadCard.style.flexDirection = 'column';
      downloadCard.style.justifyContent = 'center';
      downloadCard.style.alignItems = 'center';
      downloadCard.style.backgroundColor = '#f5e6d3';
      downloadCard.style.borderRadius = '12px';
      downloadCard.style.padding = '40px';
      downloadCard.style.position = 'relative';
      downloadCard.style.boxSizing = 'border-box';

      // Category in top left corner with proper vertical centering
      if (card.category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.style.position = 'absolute';
        categoryDiv.style.top = '16px';
        categoryDiv.style.left = '16px';
        categoryDiv.style.background = 'rgba(255,255,255,0.8)';
        categoryDiv.style.padding = '8px 12px';
        categoryDiv.style.borderRadius = '12px';
        categoryDiv.style.fontSize = '14px';
        categoryDiv.style.color = '#4a5568';
        categoryDiv.style.fontWeight = '500';
        categoryDiv.style.display = 'flex';
        categoryDiv.style.alignItems = 'center';
        categoryDiv.style.justifyContent = 'center';
        categoryDiv.style.lineHeight = '1';
        categoryDiv.textContent = card.category;
        downloadCard.appendChild(categoryDiv);
      }

      // Image if exists
      if (card.imageUrl) {
        const imageContainer = document.createElement('div');
        imageContainer.style.width = '200px';
        imageContainer.style.height = '200px';
        imageContainer.style.marginBottom = '24px';
        imageContainer.style.borderRadius = '12px';
        imageContainer.style.overflow = 'hidden';
        imageContainer.style.display = 'flex';
        imageContainer.style.alignItems = 'center';
        imageContainer.style.justifyContent = 'center';
        
        const image = document.createElement('img');
        image.src = card.imageUrl;
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.objectFit = 'cover';
        
        imageContainer.appendChild(image);
        downloadCard.appendChild(imageContainer);
      }

      // Word
      const wordDiv = document.createElement('h2');
      wordDiv.style.fontSize = '36px';
      wordDiv.style.color = '#2d3748';
      wordDiv.style.marginBottom = '12px';
      wordDiv.style.fontWeight = 'bold';
      wordDiv.style.textAlign = 'center';
      wordDiv.style.lineHeight = '1.2';
      wordDiv.textContent = card.word;
      downloadCard.appendChild(wordDiv);

      // Transcription
      if (card.transcription) {
        const transcriptionDiv = document.createElement('p');
        transcriptionDiv.style.fontSize = '20px';
        transcriptionDiv.style.color = '#4a5568';
        transcriptionDiv.style.textAlign = 'center';
        transcriptionDiv.style.marginBottom = '16px';
        transcriptionDiv.style.lineHeight = '1.3';
        transcriptionDiv.textContent = card.transcription;
        downloadCard.appendChild(transcriptionDiv);
      }

      // Translation
      const translationDiv = document.createElement('p');
      translationDiv.style.fontSize = '24px';
      translationDiv.style.color = '#2d3748';
      translationDiv.style.fontWeight = '500';
      translationDiv.style.textAlign = 'center';
      translationDiv.style.lineHeight = '1.3';
      translationDiv.textContent = card.translation;
      downloadCard.appendChild(translationDiv);

      // Signature
      const signature = document.createElement('div');
      signature.style.position = 'absolute';
      signature.style.bottom = '16px';
      signature.style.right = '16px';
      signature.style.fontStyle = 'italic';
      signature.style.color = '#8b7355';
      signature.style.fontSize = '14px';
      signature.textContent = 'by Yusupova';
      downloadCard.appendChild(signature);

      container.appendChild(downloadCard);

      const canvas = await html2canvas(container, {
        backgroundColor: '#f5e6d3',
        scale: 2,
        width: 400,
        height: 500,
      });

      document.body.removeChild(container);

      const link = document.createElement('a');
      link.download = `flashcard-${card.word}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();

      setIsDownloading(false);
    } catch (error) {
      console.error('Error downloading card:', error);
      setIsDownloading(false);
    }
  };

  const bgColor = 'bg-[#f5e6d3]';

  return (
    <div className="relative">
      <div 
        ref={cardRef}
        className="relative w-full aspect-square perspective-1000 cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front side */}
          <div 
            className={`absolute w-full h-full backface-hidden rounded-xl shadow-md ${bgColor} p-6 flex flex-col ${
              isFlipped ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* Category and control buttons on the same level */}
            <div className="flex justify-between items-center mb-4">
              {card.category ? (
                <div className="bg-white/80 text-gray-700 text-xs py-1 px-2 rounded-full">
                  {card.category}
                </div>
              ) : (
                <div></div>
              )}
              
              {!isDeleting && !isDownloading && (
                <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
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
            </div>

            {card.imageUrl && (
              <div className="w-24 h-24 mb-4 rounded-lg overflow-hidden mx-auto">
                <img 
                  src={card.imageUrl} 
                  alt={card.word}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-col items-center justify-center text-gray-800 flex-1">
              <h3 className="text-2xl font-bold mb-2 text-center">{card.word}</h3>
              {card.transcription && (
                <p className="text-lg text-gray-600 text-center mb-6">{card.transcription}</p>
              )}
            </div>
            <div className="text-blue-600 text-sm text-center">
              Click to flip
            </div>
          </div>

          {/* Back side */}
          <div 
            className={`absolute w-full h-full backface-hidden rounded-xl shadow-md ${bgColor} p-6 flex flex-col justify-center rotate-y-180 ${
              isFlipped ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg text-gray-600 mb-2 text-center">Translation</h3>
              <p className="text-2xl font-medium text-gray-800 text-center">{card.translation}</p>
              {card.category && (
                <div className="absolute top-3 left-3 bg-white/80 text-gray-700 text-xs py-1 px-2 rounded-full">
                  {card.category}
                </div>
              )}
            </div>
            <div className="text-blue-600 text-sm absolute bottom-3 left-0 right-0 text-center">
              Click to flip back
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation - positioned outside the card container */}
      {isDeleting && (
        <div 
          className="absolute inset-0 bg-black/70 flex items-center justify-center z-30 rounded-xl"
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
  );
};

export default Flashcard;