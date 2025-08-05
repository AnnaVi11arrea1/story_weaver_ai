import React from 'react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface NavigationProps {
  onAddSlide: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRemove: () => void;
  onReorder: (direction: 'left' | 'right') => void;
  currentIndex: number;
  totalItems: number;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
  isSlide: boolean;
}

function Navigation({
  onAddSlide,
  onPrev,
  onNext,
  onRemove,
  onReorder,
  currentIndex,
  totalItems,
  canNavigatePrev,
  canNavigateNext,
  isSlide,
}: NavigationProps): React.ReactNode {
  const pageLabel = isSlide ? `Slide ${currentIndex}` : 'Title Page';

  return (
    <div className="flex justify-between items-center p-4 mt-auto border-t border-brand-border shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onReorder('left')}
          disabled={!isSlide || currentIndex <= 1}
          className="p-2 rounded-full bg-brand-surface hover:bg-brand-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Move slide left"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
            onClick={onRemove}
            disabled={!isSlide}
            className="p-2 rounded-full bg-red-900/50 text-red-300 hover:bg-red-900/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Delete page"
        >
            <TrashIcon className="w-5 h-5"/>
        </button>
        <button
          onClick={() => onReorder('right')}
          disabled={!isSlide || currentIndex >= totalItems -1}
          className="p-2 rounded-full bg-brand-surface hover:bg-brand-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Move slide right"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={!canNavigatePrev}
          className="p-2 rounded-full bg-brand-surface hover:bg-brand-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <span className="font-medium text-sm w-28 text-center text-brand-text-muted">
          {pageLabel} ({currentIndex + 1} / {totalItems})
        </span>
        <button
          onClick={onNext}
          disabled={!canNavigateNext}
          className="p-2 rounded-full bg-brand-surface hover:bg-brand-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      <button
        onClick={onAddSlide}
        className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-black font-bold rounded-md hover:bg-brand-accent-hover hover:shadow-glow-accent transition-all"
      >
        <PlusIcon className="w-5 h-5 text-black" />
        Add New Slide
      </button>
    </div>
  );
}

export default Navigation;