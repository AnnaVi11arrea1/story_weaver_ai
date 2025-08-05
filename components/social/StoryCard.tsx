import React, { useState } from 'react';
import { PublicStory, SocialUser } from '../../types';
import { likeStory } from '../../services/storyService';
import HeartIcon from '../icons/HeartIcon';
import ChatBubbleLeftRightIcon from '../icons/ChatBubbleLeftRightIcon';
import CommentSection from './CommentSection';

interface StoryCardProps {
  story: PublicStory;
  currentUser: SocialUser | null;
}

function StoryCard({ story, currentUser }: StoryCardProps): React.ReactNode {
  const [showComments, setShowComments] = useState(false);
  
  const initialLikes = story.likes?.length || 0;
  const initialIsLiked = currentUser ? story.likes?.includes(currentUser._id) ?? false : false;

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      alert("Please log in to like a story.");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);

    // Optimistic update
    const originalLikedState = isLiked;
    const originalLikesCount = likes;
    setIsLiked(!originalLikedState);
    setLikes(prev => (originalLikedState ? prev - 1 : prev + 1));

    try {
      const updatedLikes = await likeStory(story._id);
      // Sync with server response
      setLikes(updatedLikes.length);
      setIsLiked(updatedLikes.includes(currentUser._id));
    } catch (error) {
      console.error("Failed to like story:", error);
      // Revert optimistic update on error
      setIsLiked(originalLikedState);
      setLikes(originalLikesCount);
      alert(error instanceof Error ? error.message : 'Failed to update like status.');
    } finally {
      setIsLiking(false);
    }
  };
  
  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const viewStory = () => {
     window.open(`/story/${story._id}`, '_blank');
  };

  return (
    <>
      <div 
        className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden flex flex-col border border-brand-border hover:border-brand-accent transition-all cursor-pointer"
        onClick={viewStory}
      >
        <div className="aspect-video bg-brand-surface">
            {story.titlePage.coverImageUrl && (
                <img src={story.titlePage.coverImageUrl} alt={story.titlePage.title} className="w-full h-full object-cover"/>
            )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-lg text-brand-text font-orbitron">{story.titlePage.title}</h3>
          <p className="text-sm text-brand-text-muted">by {story.owner.username}</p>
          <div className="mt-4 pt-4 border-t border-brand-border flex items-center gap-4 text-sm">
            <button
              onClick={handleLike}
              disabled={isLiking || !currentUser}
              className={`flex items-center gap-1.5 ${isLiked ? 'text-brand-accent' : 'text-brand-text-muted'} hover:text-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Like story"
            >
              <HeartIcon className="w-5 h-5" />
              <span>{likes}</span>
            </button>
            <button onClick={handleCommentClick} className="flex items-center gap-1.5 text-brand-text-muted hover:text-brand-accent transition-colors">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span>{story.comments?.length || 0} Comments</span>
            </button>
          </div>
        </div>
      </div>
      {showComments && (
        <CommentSection storyId={story._id} onClose={() => setShowComments(false)} />
      )}
    </>
  );
}

export default StoryCard;