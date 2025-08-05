import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Comment } from '../../types';
import { addComment } from '../../services/storyService';
import { getStoryById } from '../../services/storyService';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

interface CommentSectionProps {
  storyId: string;
  onClose: () => void;
}

function CommentSection({ storyId, onClose }: CommentSectionProps): React.ReactNode {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const story = await getStoryById(storyId);
        setComments(story?.comments || []);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [storyId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const addedComment = await addComment(storyId, newComment);
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to post comment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-brand-secondary rounded-lg shadow-2xl w-full max-w-2xl h-[80vh] p-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-orbitron">Comments</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-surface">
                <ArrowLeftIcon className="w-6 h-6"/>
            </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          {loading ? <p>Loading comments...</p> : (
            comments.length > 0 ? comments.map(comment => (
                <div key={comment._id} className="bg-brand-surface p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-brand-accent">{comment.author.username}</span>
                        <span className="text-xs text-brand-text-muted">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <div 
                        className="text-brand-text"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.text) }}
                    />
                </div>
            )) : <p className="text-brand-text-muted text-center">No comments yet. Be the first!</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 bg-brand-surface border border-brand-border rounded-md text-brand-text focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all"
          />
          <button type="submit" className="px-4 py-2 bg-brand-accent text-black font-bold rounded-md hover:bg-brand-accent-hover hover:shadow-glow-accent transition-all">
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentSection;
