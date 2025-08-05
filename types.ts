// --- Core Creative Types ---

export interface Character {
  id: string;
  prompt: string;
  imageUrl: string;
}

export interface Rendition extends Omit<Character, 'id'> {
  // Renditions are temporary and don't have a persistent ID until saved as a new character.
}

export interface StorySlide {
  id: string;
  imageUrl: string | null;
  imagePrompt: string | null;
  storyText: string;
  isGeneratingStory: boolean;
}

export interface TitlePage {
  title: string;
  authors: string;
  description: string;
  coverImageUrl: string | null;
  coverImagePrompt: string | null;
}

export interface Story {
  _id?: string; // From MongoDB
  owner?: string | SocialUser;
  titlePage: TitlePage;
  slides: StorySlide[];
  tags?: string[];
  isPublic?: boolean;
  likes?: string[]; // Array of user IDs
  comments?: Comment[];
  createdAt?: string;
}


// --- Social & User Types ---

export interface SocialUser {
  _id: string;
  email: string;
  username: string; // Add username for display
  followers?: string[];
  following?: string[];
  groups?: string[];
}

export interface Comment {
  _id: string;
  author: SocialUser;
  text: string;
  createdAt: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  owner: SocialUser;
  members: string[]; // Array of user IDs
  stories: string[]; // Array of story IDs
}

// Type for the public feed
export interface PublicStory extends Story {
  _id: string;
  owner: SocialUser;
}