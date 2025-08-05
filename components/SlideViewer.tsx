import React, { useState, useEffect } from 'react';
import { StorySlide } from '../types';
import PlusIcon from './icons/PlusIcon';

interface SlideViewerProps {
  slide: StorySlide;
  onUpdate: (slideId: string, updates: Partial<StorySlide>) => void;
}

const StoryText = ({ text, isGenerating, onTextChange }: { text: string; isGenerating: boolean; onTextChange: (newText: string) => void }) => {
  const [editedText, setEditedText] = useState(text);

  useEffect(() => {
    setEditedText(text);
  }, [text]);

  if (isGenerating) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-t-transparent border-brand-accent rounded-full animate-spin"></div>
        <span className="text-brand-text-muted">Weaving a tale...</span>
      </div>
    );
  }

  return (
    <textarea
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        onBlur={() => onTextChange(editedText)}
        className="w-full h-full text-lg bg-transparent text-brand-text leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-accent rounded-md p-2 resize-none"
        placeholder="Your story begins here..."
    />
  );
};

function SlideViewer({ slide, onUpdate }: SlideViewerProps): React.ReactNode {
  const handleTextChange = (newText: string) => {
    if (newText !== slide.storyText) {
      onUpdate(slide.id, { storyText: newText });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Image Column */}
      <div className="w-full lg:w-1/2 h-80 lg:h-full shrink-0">
        <div className="bg-brand-primary rounded-lg w-full h-full flex items-center justify-center relative overflow-hidden border border-brand-border">
          {slide.imageUrl ? (
            <img src={slide.imageUrl} alt={slide.imagePrompt || 'Story image'} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-brand-text-muted">
              <PlusIcon className="w-12 h-12 mx-auto text-brand-accent" />
              <p>Add an image from the library</p>
            </div>
          )}
        </div>
      </div>
      {/* Text Column */}
      <div className="w-full lg:w-1/2 flex-grow flex flex-col">
        <StoryText 
            text={slide.storyText} 
            isGenerating={slide.isGeneratingStory}
            onTextChange={handleTextChange}
        />
      </div>
    </div>
  );
}

export default SlideViewer;