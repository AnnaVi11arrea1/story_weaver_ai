import React from 'react';
import ShareIcon from './icons/ShareIcon';

interface ShareModalProps {
  storyId: string;
  onClose: () => void;
  onShareToFeed: () => void;
}

export function ShareModal({ storyId, onClose, onShareToFeed }: ShareModalProps) {
  const shareUrl = `${window.location.origin}/story/${storyId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Shareable link copied to clipboard!");
      onClose();
    }, () => {
      alert("Failed to copy link.");
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-30 flex items-center justify-center" onClick={onClose}>
      <div className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-md p-8 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
        <div className="text-center">
            <ShareIcon className="w-12 h-12 mx-auto text-brand-accent mb-4"/>
            <h2 className="text-2xl font-bold font-orbitron text-brand-text">Share Your Story</h2>
            <p className="text-brand-text-muted mt-2">Choose how you want to share your masterpiece.</p>
        </div>

        <div className="space-y-4">
            <button
                onClick={onShareToFeed}
                className="w-full text-center px-4 py-3 bg-brand-accent text-black font-bold rounded-md hover:bg-brand-accent-hover hover:shadow-glow-accent transition-all"
            >
                Share to Public Feed
            </button>
            <button
                onClick={handleCopyLink}
                className="w-full text-center px-4 py-3 bg-brand-surface text-brand-text font-semibold rounded-md hover:bg-brand-border transition-colors"
            >
                Copy Private Link
            </button>
        </div>
      </div>
    </div>
  );
}