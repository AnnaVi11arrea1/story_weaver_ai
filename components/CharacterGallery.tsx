import React from 'react';
import { Character } from '../types';
import PencilIcon from './icons/PencilIcon';

interface CharacterGalleryProps {
  characters: Character[];
  onSelect: (imageUrl: string, prompt: string) => void;
  onEdit: (characterId: string) => void;
}

function CharacterGallery({ characters, onSelect, onEdit }: CharacterGalleryProps): React.ReactNode {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-brand-text">Character Library</h3>
      {characters.length === 0 ? (
        <p className="text-brand-text-muted text-sm text-center py-4">Your generated characters will appear here.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {characters.map(character => (
            <div
              key={character.id}
              className="group relative aspect-square rounded-lg overflow-hidden"
            >
              <img 
                src={character.imageUrl} 
                alt={character.prompt} 
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onSelect(character.imageUrl, character.prompt)}
              />
              <div 
                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 cursor-pointer"
                onClick={() => onSelect(character.imageUrl, character.prompt)}
              >
                <p className="text-white text-xs text-center select-none">{character.prompt}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(character.id)
                }}
                className="absolute top-2 right-2 p-1.5 bg-brand-surface/80 text-brand-accent rounded-full opacity-0 group-hover:opacity-100 hover:bg-brand-surface transition-all"
                aria-label="Edit character"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CharacterGallery;