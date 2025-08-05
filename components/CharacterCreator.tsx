import React, { useState } from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface CharacterCreatorProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

function CharacterCreator({ onGenerate, isGenerating }: CharacterCreatorProps): React.ReactNode {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-brand-text">Create a Character</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A brave knight with a dragon shield"
          className="w-full h-24 p-2 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all resize-none"
          disabled={isGenerating}
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-black font-bold rounded-md hover:bg-brand-accent-hover hover:shadow-glow-accent transition-all disabled:bg-brand-disabled disabled:text-brand-text-muted disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 text-black" />
              Generate
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default CharacterCreator;