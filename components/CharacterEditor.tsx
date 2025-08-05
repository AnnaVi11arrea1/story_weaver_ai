import React, { useState, useCallback } from 'react';
import { Character, Rendition } from '../types';
import { generateImageRenditions } from '../services/geminiService';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CheckIcon from './icons/CheckIcon';
import PlusIcon from './icons/PlusIcon';
import SparklesIcon from './icons/SparklesIcon';

interface CharacterEditorProps {
  character: Character;
  onUpdateCharacter: (characterId: string, updates: Partial<Omit<Character, 'id'>>) => void;
  onSaveNewCharacter: (rendition: Rendition) => void;
  onExit: () => void;
  tags: string[];
}

export function CharacterEditor({ character, onUpdateCharacter, onSaveNewCharacter, onExit, tags }: CharacterEditorProps): React.ReactNode {
  const [renditions, setRenditions] = useState<Rendition[]>([]);
  const [modification, setModification] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedRenditions, setSavedRenditions] = useState<Set<string>>(new Set());

  const handleGenerateRenditions = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modification.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setRenditions([]); // Clear previous renditions
    const fullPrompt = `${character.prompt}, ${modification}`;

    try {
      const newRenditions = await generateImageRenditions(fullPrompt, 2, tags);
      setRenditions(newRenditions);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsGenerating(false);
      setModification('');
    }
  }, [modification, isGenerating, character.prompt, tags]);
  
  const handleUseRendition = (rendition: Rendition) => {
    onUpdateCharacter(character.id, rendition);
  };
  
  const handleSaveRendition = (rendition: Rendition) => {
    onSaveNewCharacter(rendition);
    setSavedRenditions(prev => new Set(prev).add(rendition.imageUrl));
  };

  const AccentButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      {...props}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-black font-bold rounded-md hover:bg-brand-accent-hover hover:shadow-glow-accent transition-all disabled:bg-brand-disabled disabled:text-brand-text-muted disabled:cursor-not-allowed disabled:shadow-none"
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-brand-primary font-sans flex flex-col z-10">
      <header className="flex items-center justify-between p-4 bg-brand-secondary shadow-md shrink-0 border-b border-brand-border">
        <button onClick={onExit} className="flex items-center gap-2 px-4 py-2 bg-brand-surface text-brand-text font-bold rounded-md hover:bg-brand-border transition-colors">
            <ArrowLeftIcon className="w-5 h-5"/>
            Back to Story
        </button>
        <h1 className="text-2xl font-bold text-brand-text tracking-tight font-orbitron">Character Editor</h1>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
        {/* Left Panel: Main Character */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-y-auto pr-2">
          <h2 className="text-xl font-semibold text-brand-accent shrink-0">Current Character</h2>
          <div className="bg-brand-secondary rounded-lg shadow-lg aspect-square flex items-center justify-center overflow-hidden shrink-0">
            <img src={character.imageUrl} alt={character.prompt} className="w-full h-full object-cover"/>
          </div>
          <div className="bg-brand-secondary rounded-lg shadow-lg p-4">
            <p className="text-sm font-semibold text-brand-text-muted mb-1">PROMPT</p>
            <p className="text-brand-text">{character.prompt}</p>
          </div>
        </div>

        {/* Right Panel: Chat & Renditions */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-hidden">
           <h2 className="text-xl font-semibold text-brand-accent shrink-0">Refine with AI</h2>
           <div className="bg-brand-secondary rounded-lg shadow-lg p-4 flex-grow flex flex-col gap-4 overflow-y-auto">
              <form onSubmit={handleGenerateRenditions} className="space-y-3 shrink-0">
                <textarea
                  value={modification}
                  onChange={(e) => setModification(e.target.value)}
                  placeholder="e.g., give them a magic staff, in a cyberpunk style"
                  className="w-full h-20 p-2 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all resize-none"
                  disabled={isGenerating}
                />
                <AccentButton type="submit" disabled={isGenerating || !modification.trim()}>
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 text-black" />
                      Generate Renditions
                    </>
                  )}
                </AccentButton>
              </form>

              <div className="border-t border-brand-border my-2 shrink-0"></div>

              <div className="flex-grow flex flex-col min-h-0">
                 <h3 className="text-lg font-semibold text-brand-text mb-3 shrink-0">Generated Renditions</h3>
                 {isGenerating && renditions.length === 0 && (
                     <p className="text-brand-text-muted text-center py-4">Generating new ideas...</p>
                 )}
                 {!isGenerating && renditions.length === 0 && (
                     <p className="text-brand-text-muted text-center py-4">Your generated renditions will appear here.</p>
                 )}
                 <div className="grid grid-cols-2 gap-3">
                    {renditions.map((rendition) => (
                        <div key={rendition.imageUrl} className="relative group aspect-square rounded-lg overflow-hidden bg-brand-surface">
                            <img src={rendition.imageUrl} alt={rendition.prompt} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                <button onClick={() => handleUseRendition(rendition)} className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-brand-accent text-black text-sm font-bold rounded-md hover:bg-brand-accent-hover">
                                    <CheckIcon className="w-4 h-4 text-black" />
                                    Use This
                                </button>
                                <button
                                  onClick={() => handleSaveRendition(rendition)}
                                  disabled={savedRenditions.has(rendition.imageUrl)}
                                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-brand-surface text-brand-text text-sm font-bold rounded-md hover:bg-brand-border transition-colors disabled:bg-emerald-600 disabled:text-white disabled:cursor-not-allowed"
                                >
                                  {savedRenditions.has(rendition.imageUrl) ? (
                                      <>
                                          <CheckIcon className="w-4 h-4" />
                                          Saved
                                      </>
                                  ) : (
                                      <>
                                          <PlusIcon className="w-4 h-4" />
                                          Save New
                                      </>
                                  )}
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}