import React, { useState, useEffect, useCallback } from 'react';
import { Story, TitlePage, StorySlide } from '../types';

interface PresentationViewProps {
  story: Story;
  onExit: () => void;
  isPublicView?: boolean;
}

const TitlePageComponent = ({ titlePage }: { titlePage: TitlePage }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-16">
        {titlePage.coverImageUrl && (
            <img src={titlePage.coverImageUrl} alt={titlePage.coverImagePrompt || 'Cover'} className="max-w-md max-h-[40vh] mb-8 rounded-lg shadow-2xl object-contain"/>
        )}
        <h1 className="text-6xl font-bold mb-4 font-orbitron">{titlePage.title}</h1>
        <p className="text-2xl italic text-brand-text-muted mb-8">{`by ${titlePage.authors}`}</p>
        <p className="text-xl max-w-3xl">{titlePage.description}</p>
    </div>
);

const SlideComponent = ({ slide }: { slide: StorySlide }) => (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 p-16">
        {slide.imageUrl && (
            <div className="w-full md:w-1/2 flex justify-center">
                <img src={slide.imageUrl} alt={slide.imagePrompt || 'Slide image'} className="w-full max-w-lg aspect-square object-cover rounded-lg shadow-2xl"/>
            </div>
        )}
        <p className="text-xl md:text-2xl leading-relaxed w-full md:w-1/2 max-w-prose">{slide.storyText}</p>
    </div>
);


export function PresentationView({ story, onExit, isPublicView = false }: PresentationViewProps): React.ReactNode {
  const { titlePage, slides } = story;
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalPages = slides.length + 1;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onExit();
    } else if (e.key === 'ArrowRight') {
      setCurrentIndex(prev => Math.min(totalPages - 1, prev + 1));
    } else if (e.key === 'ArrowLeft') {
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  }, [totalPages, onExit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const isTitlePage = currentIndex === 0;
  const currentSlide = isTitlePage ? null : slides[currentIndex - 1];
  
  return (
    <div className="fixed inset-0 bg-brand-primary z-20 text-brand-text font-sans flex flex-col">
       {isPublicView ? (
           <a href="/" className="absolute top-4 right-4 text-xs bg-black/30 text-white px-3 py-1 rounded-full hover:bg-black/50 no-underline">Back to Editor</a>
       ) : (
          <button onClick={onExit} className="absolute top-4 right-4 text-xs bg-black/30 text-white px-3 py-1 rounded-full hover:bg-black/50">ESC to exit</button>
       )}
        <div className="flex-grow">
            {isTitlePage ? <TitlePageComponent titlePage={titlePage} /> : (currentSlide && <SlideComponent slide={currentSlide} />)}
        </div>
       <div className="text-center p-4 text-sm text-brand-text-muted">{currentIndex + 1} / {totalPages}</div>
    </div>
  );
}