import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

// Base Sepolia 测试网配置
export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    // OKX 钱包通过 injected 连接器支持（EIP-1193 兼容）
    injected({
      target: {
        id: 'okxWallet',
        name: 'OKX Wallet',
        provider: (window: any) => window.okxwallet,
      },
    }),
    // Coinbase 钱包
    coinbaseWallet({
      appName: '留声机 Phonograph',
      appLogoUrl: 'https://image.pollinations.ai/prompt/retro%20cassette%20tape%20pixel%20art%20cyberpunk%20neon%20purple%20cyan%20pink%20glitch%20effect%20with%20golden%20C%20coin%20logo%20on%20top%20dark%20background%20grid?width=128&height=128&nologo=true&seed=42',
    }),
    // 通用 injected 连接器（支持 MetaMask 等）
    injected(),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

// 导出链信息
export { baseSepolia };
