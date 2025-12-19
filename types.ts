export interface Podcast {
  id: string;
  title: string;
  author: string;
  price: number;
  listens: number;
  likes: number;
  duration: number; // minutes
  coverUrl: string; // Dynamic AI generated image
  avatarUrl: string; // Robot avatar
  tags: string[];
}

export type ViewState = 'discovery' | 'collection';
export type PlayerState = 'locked' | 'playing' | 'paused' | 'finished';