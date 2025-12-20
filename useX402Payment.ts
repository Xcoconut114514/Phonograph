/**
 * x402 支付 React Hook
 * 
 * 提供与 x402 协议交互的 React Hook，用于播客内容付费解锁
 */

import { useState, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { x402Client, wrapFetchWithPayment } from '@x402/fetch';
import { registerExactEvmScheme } from '@x402/evm/exact/client';
import { USDC_ADDRESS, CREATOR_ADDRESS, PAYMENT_CONFIG } from './x402Client';

// Base Sepolia 的 chain ID
const BASE_SEPOLIA_CHAIN_ID = 84532;

/**
 * x402 支付状态
 */
export type PaymentStatus = 'idle' | 'requesting' | 'signing' | 'confirming' | 'success' | 'error';

/**
 * x402 支付结果
 */
export interface PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

/**
 * 用于将 wagmi walletClient 转换为 x402 兼容的 signer
 */
function createX402SignerFromWagmi(walletClient: any) {
  return {
    address: walletClient.account?.address as `0x${string}`,
    signTypedData: async (params: any) => {
      return walletClient.signTypedData(params);
    },
  };
}

/**
 * x402 支付 Hook
 */
export function useX402Payment() {
  const { data: walletClient } = useWalletClient();
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  /**
   * 使用 x402 协议支付解锁内容
   * 
   * @param resourceId - 资源 ID（播客集 ID）
   * @param price - 价格（USDC，带小数）
   * @param payTo - 收款地址
   * @param description - 描述
   */
  const payForContent = useCallback(async (
    resourceId: string,
    price: number,
    payTo: string = CREATOR_ADDRESS,
    description: string = '解锁内容'
  ): Promise<PaymentResult> => {
    if (!walletClient) {
      setError('请先连接钱包');
      return { success: false, error: '请先连接钱包' };
    }

    setStatus('requesting');
    setError(null);

    try {
      // 创建 x402 客户端
      const client = new x402Client();
      const signer = createX402SignerFromWagmi(walletClient);
      registerExactEvmScheme(client, { signer });

      // 创建支持 x402 的 fetch
      const fetchWithPayment = wrapFetchWithPayment(fetch, client);

      // 构造模拟的 402 响应 URL
      // 在真实环境中，这会是真正的服务器端点
      const priceInBaseUnits = String(Math.floor(price * 1_000_000));
      
      setStatus('signing');

      // 模拟 x402 支付流程
      // 真实环境中会调用实际的付费 API
      console.log(`[x402] 发起支付请求:`, {
        resourceId,
        price: priceInBaseUnits,
        payTo,
        description,
        network: 'eip155:84532' // Base Sepolia
      });

      // 创建支付签名
      // 这会触发钱包的签名请求
      const paymentPayload = await client.createPaymentPayload({
        x402Version: 2,
        resource: {
          url: `/api/content/${resourceId}`,
          description,
          mimeType: 'application/json',
        },
        accepts: [{
          scheme: 'exact',
          network: 'eip155:84532',
          amount: priceInBaseUnits,
          asset: USDC_ADDRESS,
          payTo: payTo as `0x${string}`,
          maxTimeoutSeconds: 300,
          extra: { resourceId },
        }],
      });

      setStatus('confirming');

      console.log(`[x402] 支付签名成功:`, paymentPayload);

      // 模拟确认延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('success');
      
      return { 
        success: true, 
        txHash: `0x${Date.now().toString(16)}...` // 模拟 tx hash
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '支付失败';
      console.error('[x402] 支付错误:', err);
      setError(errorMessage);
      setStatus('error');
      return { success: false, error: errorMessage };
    }
  }, [walletClient]);

  /**
   * 重置支付状态
   */
  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return {
    payForContent,
    status,
    error,
    reset,
    isReady: !!walletClient,
  };
}

/**
 * 格式化 USDC 金额
 */
export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount).replace('$', '') + ' USDC';
}
