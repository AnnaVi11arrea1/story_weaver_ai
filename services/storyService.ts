import { Story, PublicStory, Comment } from '../types';
import { api } from './api';

// --- Story Management ---

export const saveStory = async (story: Story): Promise<Story> => {
  if (story._id) {
    // Update existing story
    return api.put(`/stories/${story._id}`, story);
  } else {
    // Create new story
    return api.post('/stories', story);
  }
};

export const getStoryById = async (storyId: string): Promise<Story | null> => {
  try {
    const story = await api.get(`/stories/${storyId}`);
    return story;
  } catch (error) {
    console.error(`Failed to fetch story ${storyId}:`, error);
    return null;
  }
};

export const getUserStories = async (): Promise<Story[]> => {
    return api.get('/stories');
};

// --- Social Features ---

export const getPublicFeed = async (): Promise<PublicStory[]> => {
    return api.get('/stories/feed/public');
};

export const shareStoryToFeed = async (storyId: string): Promise<Story> => {
    return api.post(`/stories/${storyId}/share`, {});
};

export const likeStory = async (storyId: string): Promise<string[]> => {
    return api.post(`/stories/${storyId}/like`, {});
};

export const addComment = async (storyId: string, text: string): Promise<Comment> => {
    return api.post(`/stories/${storyId}/comment`, { text });
};