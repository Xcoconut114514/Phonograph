export interface Episode {
  id: string;
  title: string;
  duration: number; // minutes
  isFree: boolean;
  audioText?: string; // Text content for TTS playback
  audioUrl?: string; // Direct audio URL (MP3/etc) - takes priority over TTS
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
  minTipAmount?: number; // Minimum tip amount for private message (USDC)
  tipEnabled?: boolean; // Whether tipping/messaging is enabled
  creatorAddress: `0x${string}`; // x402 payment recipient address
}

// Message sent via tipping
export interface TipMessage {
  id: string;
  podcastId: string;
  author: string;
  amount: number;
  message: string;
  timestamp: Date;
}

// Reply from creator
export interface CreatorReply {
  id: string;
  tipMessageId: string;
  podcastId: string;
  author: string;
  message: string;
  timestamp: Date;
}

export type ViewState = 'discovery' | 'collection' | 'tipping' | 'profile';
export type PlayerState = 'locked' | 'playing' | 'paused' | 'finished';