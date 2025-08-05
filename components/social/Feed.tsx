import React, { useState, useEffect } from 'react';
import { PublicStory, SocialUser } from '../../types';
import { getPublicFeed } from '../../services/storyService';
import StoryCard from './StoryCard';

interface FeedProps {
  currentUser: SocialUser | null;
}

function Feed({ currentUser }: FeedProps): React.ReactNode {
  const [stories, setStories] = useState<PublicStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const feedStories = await getPublicFeed();
        setStories(feedStories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load feed.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return <div className="text-center text-brand-text-muted">Loading feed...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold font-orbitron text-brand-text">Public Feed</h1>
        {stories.length === 0 ? (
            <p className="text-brand-text-muted">The public feed is empty. Be the first to share a story!</p>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {stories.map(story => (
                    <StoryCard key={story._id} story={story} currentUser={currentUser} />
                ))}
            </div>
        )}
    </div>
  );
}

export default Feed;