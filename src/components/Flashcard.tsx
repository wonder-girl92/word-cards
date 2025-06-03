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
      container.style.height = '800px';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);

      const downloadCard = document.createElement('div');
      downloadCard.style.width = '100%';
      downloadCard.style.height = '100%';
      downloadCard.style.display = 'flex';
      downloadCard.style.flexDirection = 'column';
      downloadCard.style.backgroundColor = '#f5e6d3';
      downloadCard.style.position = 'relative';

      // Back side (translation) - now on top
      const backSide = document.createElement('div');
      backSide.style.flex = '1';
      backSide.style.display = 'flex';
      backSide.style.flexDirection = 'column';
      backSide.style.justifyContent = 'center';
      backSide.style.alignItems = 'center';
      backSide.style.backgroundColor = '#f5e6d3';
      backSide.style.borderRadius = '12px';
      backSide.style.padding = '20px';
      backSide.style.borderBottom = '2px dashed #8b7355';
      backSide.innerHTML = `
        <h3 style="font-size: 24px; color: #4a5568; text-align: center; margin-bottom: 16px;">Translation</h3>
        <p style="font-size: 32px; color: #2d3748; font-weight: 500; text-align: center;">${card.translation}</p>
      `;

      // Front side (word) - now on bottom
      const frontSide = document.createElement('div');
      frontSide.style.flex = '1';
      frontSide.style.display = 'flex';
      frontSide.style.flexDirection = 'column';
      frontSide.style.justifyContent = 'center';
      frontSide.style.alignItems = 'center';
      frontSide.style.backgroundColor = '#f5e6d3';
      frontSide.style.borderRadius = '12px';
      frontSide.style.padding = '20px';
      frontSide.style.borderTop = '2px dashed #8b7355';
      frontSide.style.position = 'relative';

      if (card.imageUrl) {
        const imageContainer = document.createElement('div');
        imageContainer.style.width = '150px';
        imageContainer.style.height = '150px';
        imageContainer.style.marginBottom = '16px';
        imageContainer.style.borderRadius = '8px';
        imageContainer.style.overflow = 'hidden';
        
        const image = document.createElement('img');
        image.src = card.imageUrl;
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.objectFit = 'cover';
        
        imageContainer.appendChild(image);
        frontSide.appendChild(imageContainer);
      }

      frontSide.innerHTML += `
        <h2 style="font-size: 32px; color: #2d3748; margin-bottom: 16px; font-weight: bold; text-align: center;">${card.word}</h2>
        ${card.transcription ? `<p style="font-size: 24px; color: #4a5568; text-align: center;">${card.transcription}</p>` : ''}
      `;

      if (card.category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.style.position = 'absolute';
        categoryDiv.style.bottom = '12px';
        categoryDiv.style.left = '50%';
        categoryDiv.style.transform = 'translateX(-50%)';
        categoryDiv.style.background = 'rgba(255,255,255,0.8)';
        categoryDiv.style.padding = '4px 8px';
        categoryDiv.style.borderRadius = '12px';
        categoryDiv.style.fontSize = '14px';
        categoryDiv.style.color = '#4a5568';
        categoryDiv.style.textAlign = 'center';
        categoryDiv.style.lineHeight = '1.5';
        categoryDiv.textContent = card.category;
        frontSide.appendChild(categoryDiv);
      }

      downloadCard.appendChild(backSide);
      downloadCard.appendChild(frontSide);
      container.appendChild(downloadCard);

      const canvas = await html2canvas(container, {
        backgroundColor: '#f5e6d3',
        scale: 2,
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
          className={`absolute w-full h-full backface-hidden rounded-xl shadow-md ${bgColor} p-6 flex flex-col items-center justify-center ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {card.imageUrl && (
            <div className="w-24 h-24 mb-4 rounded-lg overflow-hidden">
              <img 
                src={card.imageUrl} 
                alt={card.word}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col items-center justify-center text-gray-800">
            <h3 className="text-2xl font-bold mb-2 text-center">{card.word}</h3>
            {card.transcription && (
              <p className="text-lg text-gray-600 text-center">{card.transcription}</p>
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
          <div className="text-gray-600 text-sm absolute bottom-3 left-0 right-0 text-center">
            Click to flip back
          </div>
        </div>

        {/* Control buttons */}
        {!isDeleting && !isDownloading && (
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