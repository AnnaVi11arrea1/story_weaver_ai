import React, { useState, useEffect } from 'react';
import { TitlePage } from '../types';
import PlusIcon from './icons/PlusIcon';
import CameraIcon from './icons/CameraIcon';

interface TitlePageEditorProps {
    titlePage: TitlePage;
    onUpdate: (updates: Partial<TitlePage>) => void;
    onGenerateCover: (prompt: string) => void;
    isGenerating: boolean;
}

const EditableField = ({ label, value, onSave, multiline = false, isTitle = false }: { label: string, value: string, onSave: (newValue: string) => void, multiline?: boolean, isTitle?: boolean }) => {
    const [text, setText] = useState(value);
    
    useEffect(() => { setText(value) }, [value]);

    const commonClasses = "w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-accent rounded-md p-2";
    const titleClasses = "text-brand-text text-4xl font-bold font-orbitron";
    const defaultClasses = "text-brand-text text-lg";

    return (
        <div>
            <label className="text-sm font-semibold text-brand-text-muted">{label}</label>
            {multiline ? (
                <textarea 
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onBlur={() => onSave(text)}
                    className={`${commonClasses} ${defaultClasses} leading-relaxed resize-none h-24 bg-brand-surface border border-brand-border`}
                    rows={3}
                />
            ) : (
                 <input 
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onBlur={() => onSave(text)}
                    className={`${commonClasses} ${isTitle ? titleClasses : defaultClasses} ${isTitle ? 'border-b border-brand-border' : 'bg-brand-surface border border-brand-border'}`}
                />
            )}
        </div>
    );
};


function TitlePageEditor({ titlePage, onUpdate, onGenerateCover, isGenerating }: TitlePageEditorProps): React.ReactNode {
  const [prompt, setPrompt] = useState(titlePage.coverImagePrompt || '');

  const handleGenerateClick = () => {
    if(prompt.trim() && !isGenerating) {
        onGenerateCover(prompt);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Left Column: Image and Image Generation */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="bg-brand-primary rounded-lg aspect-square flex flex-col items-center justify-center relative overflow-hidden border border-brand-border">
          {titlePage.coverImageUrl ? (
            <img src={titlePage.coverImageUrl} alt={titlePage.coverImagePrompt || 'Story cover'} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-brand-text-muted p-4">
              <PlusIcon className="w-12 h-12 mx-auto text-brand-accent" />
              <p>Add a cover image or generate one</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
            <label className="text-sm font-semibold text-brand-text-muted">GENERATE COVER IMAGE</label>
            <div className="flex gap-2">
              <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A mystical forest at twilight"
                  className="w-full p-2 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all"
                  disabled={isGenerating}
              />
              <button
                  onClick={handleGenerateClick}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-black font-bold rounded-md hover:bg-brand-accent-hover hover:shadow-glow-accent transition-all disabled:bg-brand-disabled disabled:text-brand-text-muted disabled:cursor-not-allowed disabled:shadow-none"
              >
                  {isGenerating ? (
                      <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                  ) : (
                      <CameraIcon className="w-5 h-5 text-black" />
                  )}
              </button>
            </div>
        </div>
      </div>

      {/* Right Column: Story Details */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        <EditableField label="TITLE" value={titlePage.title} onSave={(val) => onUpdate({ title: val })} isTitle />
        <EditableField label="AUTHORS" value={titlePage.authors} onSave={(val) => onUpdate({ authors: val })} />
        <EditableField label="SHORT DESCRIPTION" value={titlePage.description} onSave={(val) => onUpdate({ description: val })} multiline />
      </div>
    </div>
  );
}

export default TitlePageEditor;