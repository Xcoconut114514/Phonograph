// NFT 合约配置 - Base Sepolia 测试网
// 这是一个简化的 ERC721 合约 ABI，用于铸造留声机收藏品 NFT

export const PHONOGRAPH_NFT_ADDRESS = '0x' as `0x${string}`; // 待部署后填入

// 简化的 ERC721 ABI - 只包含我们需要的函数
export const PHONOGRAPH_NFT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenURI', type: 'string' }
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }]
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }]
  },
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true }
    ]
  }
] as const;

// 生成 NFT 元数据 URI（使用 IPFS 或 data URI）
export function generateTokenURI(podcast: {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
}): string {
  const metadata = {
    name: `留声机收藏 - ${podcast.title}`,
    description: `${podcast.description}\n\n创作者: ${podcast.author}\n\n这是留声机(Phonograph)平台的收藏品NFT，证明持有者已完成收听并支持该创作者。`,
    image: podcast.coverUrl,
    attributes: [
      { trait_type: '创作者', value: podcast.author },
      { trait_type: '系列', value: podcast.title },
      { trait_type: '平台', value: '留声机 Phonograph' },
      { trait_type: '网络', value: 'Base Sepolia' },
      { trait_type: '铸造时间', value: new Date().toISOString() }
    ],
    external_url: `https://phonograph.app/podcast/${podcast.id}`
  };
  
  // 使用 data URI 编码元数据（简单方案，无需 IPFS）
  const jsonString = JSON.stringify(metadata);
  const base64 = btoa(unescape(encodeURIComponent(jsonString)));
  return `data:application/json;base64,${base64}`;
}

// Base Sepolia 测试网配置
export const BASE_SEPOLIA_CONFIG = {
  chainId: 84532,
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  }
};

// NFT 铸造价格 (in ETH)
export const MINT_PRICE = '0.0001'; // 0.0001 ETH ≈ $0.30
