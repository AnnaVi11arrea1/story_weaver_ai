import React, { useState } from 'react';
import TagIcon from './icons/TagIcon';
import XMarkIcon from './icons/XMarkIcon';

interface TagManagerProps {
  tags: string[];
  onUpdateTags: (tags: string[]) => void;
}

const suggestedTags = [
  'dark fantasy', 'ethereal sci-fi', 'nordic lands', 'ice temple', 'desert storm', 
  'cyberpunk', 'steampunk', 'victorian', 'gothic', 'horror', 'fairy tale', 
  'children\'s book', 'illustrative', 'realistic', 'adventure', 'thriller'
];

function TagManager({ tags, onUpdateTags }: TagManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customTag, setCustomTag] = useState('');

  const addTag = (tag: string) => {
    const newTag = tag.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      onUpdateTags([...tags, newTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdateTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleCustomTagSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addTag(customTag);
      setCustomTag('');
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all"
      >
        <div className="flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-brand-accent" />
            <span className="font-semibold">Art Style Tags ({tags.length})</span>
        </div>
        <span className="text-xs text-brand-text-muted">{isOpen ? 'Close' : 'Edit'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-brand-secondary border border-brand-border rounded-lg shadow-xl z-10 p-4">
          <div className="space-y-4">
            {/* Active Tags */}
            <div>
                <h4 className="text-sm font-semibold text-brand-text-muted mb-2">ACTIVE TAGS</h4>
                {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <div key={tag} className="flex items-center gap-1.5 bg-brand-accent/20 text-brand-accent text-sm font-medium pl-2 pr-1 py-0.5 rounded-full">
                                <span>{tag}</span>
                                <button onClick={() => removeTag(tag)} className="text-brand-accent hover:text-white hover:bg-brand-accent/50 rounded-full">
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-brand-text-muted">No active tags. Add some to guide the AI!</p>
                )}
            </div>

            {/* Custom Tag Input */}
             <form onSubmit={handleCustomTagSubmit} className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={e => setCustomTag(e.target.value)}
                placeholder="Add a custom tag..."
                className="w-full text-sm p-2 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all"
              />
              <button type="submit" className="px-3 text-sm bg-brand-accent text-black font-bold rounded-md hover:bg-brand-accent-hover transition-colors">Add</button>
            </form>

            {/* Suggested Tags */}
            <div>
                <h4 className="text-sm font-semibold text-brand-text-muted mb-2">SUGGESTIONS</h4>
                <div className="flex flex-wrap gap-2">
                    {suggestedTags.filter(t => !tags.includes(t)).map(tag => (
                        <button 
                            key={tag}
                            onClick={() => addTag(tag)}
                            className="text-xs bg-brand-surface hover:bg-brand-border text-brand-text-muted hover:text-brand-text font-medium px-2 py-1 rounded-md transition-colors"
                        >
                           + {tag}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TagManager;
