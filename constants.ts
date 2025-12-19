import { Podcast } from './types';

// Helper to generate AI image URLs based on content
// Using pollinations.ai for covers (it generates images from text prompts)
// Using robohash.org for avatars
const getCover = (prompt: string) => `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " cyberpunk futuristic digital art high quality")}?width=400&height=400&nologo=true`;
const getAvatar = (seed: string) => `https://robohash.org/${seed}.png?set=set1&bgset=bg1&size=200x200`;

export const MOCK_PODCASTS: Podcast[] = [
  { 
    id: '1', 
    title: 'Web3 商业思维', 
    author: 'DAO_Explorer', 
    price: 0.01, 
    listens: 1205, 
    likes: 340, 
    duration: 45, 
    coverUrl: getCover('abstract geometric nodes network blue gold'), 
    avatarUrl: getAvatar('dao_explorer'),
    tags: ['DeFi', '商业'] 
  },
  { 
    id: '2', 
    title: '赛博朋克 2077 沉思录', 
    author: 'NightCity_Ghost', 
    price: 0.01, 
    listens: 890, 
    likes: 210, 
    duration: 32, 
    coverUrl: getCover('neon city rainy night street cyber'), 
    avatarUrl: getAvatar('night_city'),
    tags: ['科幻', '杂谈'] 
  },
  { 
    id: '3', 
    title: 'NFT 的泡沫与未来', 
    author: 'Crypto_Punk_OG', 
    price: 0.02, 
    listens: 5600, 
    likes: 1200, 
    duration: 58, 
    coverUrl: getCover('colorful 3d pixel art glitched monkey'), 
    avatarUrl: getAvatar('crypto_punk'),
    tags: ['NFT', '趋势'] 
  },
  { 
    id: '4', 
    title: '以太坊扩容之路', 
    author: 'Vitalik_Fan', 
    price: 0.01, 
    listens: 3400, 
    likes: 800, 
    duration: 65, 
    coverUrl: getCover('ethereum crystal diamond futuristic technology glowing'), 
    avatarUrl: getAvatar('vitalik_fan'),
    tags: ['技术', 'L2'] 
  },
  { 
    id: '5', 
    title: '元宇宙建筑师日记', 
    author: 'Voxel_Builder', 
    price: 0.05, 
    listens: 450, 
    likes: 120, 
    duration: 25, 
    coverUrl: getCover('virtual reality digital architecture grid neon purple'), 
    avatarUrl: getAvatar('voxel_builder'),
    tags: ['元宇宙', '设计'] 
  },
  { 
    id: '6', 
    title: 'Solana 生态大爆发', 
    author: 'Rust_Geek', 
    price: 0.01, 
    listens: 2300, 
    likes: 670, 
    duration: 40, 
    coverUrl: getCover('fast speed light streak green purple cyber'), 
    avatarUrl: getAvatar('rust_geek'),
    tags: ['公链', '代码'] 
  },
];