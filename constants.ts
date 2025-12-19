import { Podcast, Episode } from './types';

// Helper to generate AI image URLs based on content
const getCover = (prompt: string) => `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " cyberpunk futuristic digital art high quality")}?width=400&height=400&nologo=true`;

// Use Robohash set 1 (robots) with transparent background for better UI integration
const getAvatar = (seed: string) => `https://robohash.org/${seed}.png?set=set1&size=300x300`;

// Helper to generate mock episodes
const generateEpisodes = (count: number, topic: string): Episode[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ep-${i + 1}`,
    title: `${topic} - 第 ${i + 1} 章: ${['觉醒', '起源', '共识', '崩塌', '重构', '未来', '奇点', '永生'][i % 8]}`,
    duration: Math.floor(Math.random() * 30) + 15,
    isFree: i < 3 // First 3 episodes are free
  }));
};

export const MOCK_PODCASTS: Podcast[] = [
  { 
    id: '1', 
    title: 'Web3 商业思维', 
    description: '探索去中心化世界的商业逻辑与组织形式变革。',
    author: 'DAO_Explorer', 
    listens: 1205, 
    likes: 340, 
    basePrice: 0.01,
    coverUrl: getCover('abstract geometric nodes network blue gold'), 
    avatarUrl: getAvatar('dao_explorer_v2'),
    tags: ['DeFi', '商业'],
    episodes: generateEpisodes(8, '商业思维')
  },
  { 
    id: '2', 
    title: '赛博朋克 2077 沉思录', 
    description: '当高科技遇上低生活，我们在数字雨中寻找灵魂的栖息地。',
    author: 'NightCity_Ghost', 
    listens: 890, 
    likes: 210, 
    basePrice: 0.01,
    coverUrl: getCover('neon city rainy night street cyber'), 
    avatarUrl: getAvatar('night_city_ghost_v2'),
    tags: ['科幻', '杂谈'],
    episodes: generateEpisodes(6, '夜之城')
  },
  { 
    id: '3', 
    title: 'NFT 的泡沫与未来', 
    description: '从加密朋克到数字确权，一场关于所有权的革命。',
    author: 'Crypto_Punk_OG', 
    listens: 5600, 
    likes: 1200, 
    basePrice: 0.01,
    coverUrl: getCover('colorful 3d pixel art glitched monkey'), 
    avatarUrl: getAvatar('crypto_punk_og_v2'),
    tags: ['NFT', '趋势'],
    episodes: generateEpisodes(10, '数字资产')
  },
  { 
    id: '4', 
    title: '以太坊扩容之路', 
    description: 'Layer2 战争已经打响，谁能成为最终的扩容之王？',
    author: 'Vitalik_Fan', 
    listens: 3400, 
    likes: 800, 
    basePrice: 0.01,
    coverUrl: getCover('ethereum crystal diamond futuristic technology glowing'), 
    avatarUrl: getAvatar('vitalik_fan_v2'),
    tags: ['技术', 'L2'],
    episodes: generateEpisodes(5, '扩容方案')
  },
  { 
    id: '5', 
    title: '元宇宙建筑师日记', 
    description: '我在虚拟世界盖房子的那些年，关于空间与代码的思考。',
    author: 'Voxel_Builder', 
    listens: 450, 
    likes: 120, 
    basePrice: 0.01,
    coverUrl: getCover('virtual reality digital architecture grid neon purple'), 
    avatarUrl: getAvatar('voxel_builder_v2'),
    tags: ['元宇宙', '设计'],
    episodes: generateEpisodes(7, '虚拟建筑')
  },
  { 
    id: '6', 
    title: 'Solana 生态大爆发', 
    description: '高性能公链的崛起与挑战，Rust 语言的魅力。',
    author: 'Rust_Geek', 
    listens: 2300, 
    likes: 670, 
    basePrice: 0.01,
    coverUrl: getCover('fast speed light streak green purple cyber'), 
    avatarUrl: getAvatar('rust_geek_v2'),
    tags: ['公链', '代码'],
    episodes: generateEpisodes(12, '高性能链')
  },
];