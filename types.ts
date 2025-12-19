export interface Episode {
  id: string;
  title: string;
  duration: number; // minutes
  isFree: boolean;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  author: string;
  listens: number;
  likes: number;
  coverUrl: string; // Dynamic AI generated image
  avatarUrl: string; // Robot avatar
  tags: string[];
  episodes: Episode[]; // List of episodes
  basePrice: number; // Per paid episode price (0.01 USDC)
}

export type ViewState = 'discovery' | 'collection';
export type PlayerState = 'locked' | 'playing' | 'paused' | 'finished';