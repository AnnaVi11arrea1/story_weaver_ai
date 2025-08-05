import React from 'react';
import { Character } from '../types';
import CharacterCreator from './CharacterCreator';
import CharacterGallery from './CharacterGallery';
import TagManager from './TagManager';

interface AssetLibraryProps {
  characters: Character[];
  onCreateCharacter: (prompt: string) => void;
  onSelectCharacter: (imageUrl: string, prompt: string) => void;
  onEditCharacter: (characterId: string) => void;
  isGeneratingImage: boolean;
  tags: string[];
  onUpdateTags: (tags: string[]) => void;
}

function AssetLibrary({ characters, onCreateCharacter, onSelectCharacter, onEditCharacter, isGeneratingImage, tags, onUpdateTags }: AssetLibraryProps): React.ReactNode {
  return (
    <div className="bg-brand-secondary rounded-lg shadow-lg flex flex-col h-full overflow-hidden border border-brand-border">
      <div className="p-4 border-b border-brand-border space-y-4">
        <TagManager tags={tags} onUpdateTags={onUpdateTags} />
        <CharacterCreator onGenerate={onCreateCharacter} isGenerating={isGeneratingImage} />
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <CharacterGallery 
          characters={characters} 
          onSelect={onSelectCharacter} 
          onEdit={onEditCharacter}
        />
      </div>
    </div>
  );
}

export default AssetLibrary;