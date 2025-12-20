/**
 * x402 协议客户端配置
 * 
 * x402 是一个基于 HTTP 402 状态码的支付协议，用于付费内容访问
 * https://x402.org
 */

import { x402Client, wrapFetchWithPayment } from '@x402/fetch';
import { registerExactEvmScheme } from '@x402/evm/exact/client';
import type { WalletClient } from 'viem';

// 定义一个简单的接口来适配 wagmi 的 walletClient
interface WagmiWalletClient {
  account?: { address: `0x${string}` };
  chain?: { id: number };
  signTypedData: (args: any) => Promise<`0x${string}`>;
}

/**
 * 将 wagmi walletClient 转换为 x402 需要的 signer 格式
 */
function wagmiToX402Signer(walletClient: WagmiWalletClient) {
  return {
    address: walletClient.account?.address as `0x${string}`,
    signTypedData: async (params: any) => {
      return walletClient.signTypedData(params);
    },
  };
}

/**
 * 创建支持 x402 支付的 fetch 函数
 * @param walletClient - wagmi 的 walletClient
 * @returns 包装后的 fetch 函数，自动处理 402 支付
 */
export function createX402Fetch(walletClient: WagmiWalletClient) {
  // 创建 x402 客户端
  const client = new x402Client();
  
  // 注册 EVM 精确支付方案（Base Sepolia）
  const signer = wagmiToX402Signer(walletClient);
  registerExactEvmScheme(client, { signer });
  
  // 返回包装后的 fetch
  return wrapFetchWithPayment(fetch, client);
}

/**
 * 付费内容的价格配置（以 USDC 为单位，6 位小数）
 */
export const PAYMENT_CONFIG = {
  // 单集解锁价格（0.01 USDC = 10000 base units）
  EPISODE_PRICE: '10000',
  // 投币最小金额
  TIP_MIN: '100000', // 0.1 USDC
  // NFT 铸造价格
  MINT_PRICE: '50000', // 0.05 USDC
} as const;

/**
 * Base Sepolia 上的 USDC 代币地址
 */
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const;

/**
 * 内容创作者收款地址（示例）
 */
export const CREATOR_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' as const;

export type { WagmiWalletClient };
