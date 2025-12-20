/**
 * x402 模拟服务器
 * 
 * 在真实环境中，这些端点会是真正的后端服务器。
 * 这里我们创建一个模拟层来展示 x402 协议的工作流程。
 */

import { USDC_ADDRESS, CREATOR_ADDRESS, PAYMENT_CONFIG } from './x402Client';

/**
 * 付费内容资源类型
 */
export interface PaidResource {
  id: string;
  type: 'episode' | 'bundle' | 'tip' | 'mint';
  title: string;
  price: string; // USDC base units (6 decimals)
  payTo: `0x${string}`;
  description: string;
}

/**
 * x402 Payment Required 响应结构
 */
export interface PaymentRequiredResponse {
  x402Version: 2;
  resource: {
    url: string;
    description: string;
    mimeType: string;
  };
  accepts: Array<{
    scheme: 'exact';
    network: 'eip155:84532'; // Base Sepolia
    amount: string;
    asset: `0x${string}`;
    payTo: `0x${string}`;
    maxTimeoutSeconds: number;
    extra: Record<string, unknown>;
  }>;
}

/**
 * 创建 x402 Payment Required 响应
 */
export function createPaymentRequired(resource: PaidResource): PaymentRequiredResponse {
  return {
    x402Version: 2,
    resource: {
      url: `/api/content/${resource.id}`,
      description: resource.description,
      mimeType: 'application/json',
    },
    accepts: [
      {
        scheme: 'exact',
        network: 'eip155:84532', // Base Sepolia
        amount: resource.price,
        asset: USDC_ADDRESS,
        payTo: resource.payTo,
        maxTimeoutSeconds: 300,
        extra: {
          resourceId: resource.id,
          resourceType: resource.type,
        },
      },
    ],
  };
}

/**
 * 模拟 x402 资源服务器
 * 
 * 在真实场景中，这会是一个真正的 HTTP 服务器，返回 402 状态码。
 * 这里我们创建一个模拟层来处理支付流程。
 */
export class MockX402Server {
  private paidResources: Map<string, PaidResource> = new Map();
  private unlockedResources: Set<string> = new Set();
  
  /**
   * 注册一个付费资源
   */
  registerResource(resource: PaidResource) {
    this.paidResources.set(resource.id, resource);
  }
  
  /**
   * 检查资源是否需要付费
   */
  checkPaymentRequired(resourceId: string): PaymentRequiredResponse | null {
    if (this.unlockedResources.has(resourceId)) {
      return null; // 已解锁
    }
    
    const resource = this.paidResources.get(resourceId);
    if (!resource) {
      return null; // 免费资源
    }
    
    return createPaymentRequired(resource);
  }
  
  /**
   * 标记资源为已解锁（支付成功后调用）
   */
  unlockResource(resourceId: string) {
    this.unlockedResources.add(resourceId);
  }
  
  /**
   * 验证支付签名（简化版）
   * 在真实环境中，这会通过 facilitator 服务器验证
   */
  async verifyPayment(paymentSignature: string, resourceId: string): Promise<boolean> {
    // 简化验证：只要有签名就认为支付成功
    // 真实环境中需要通过 facilitator 验证签名
    if (paymentSignature && paymentSignature.length > 10) {
      this.unlockResource(resourceId);
      return true;
    }
    return false;
  }
}

/**
 * 全局模拟服务器实例
 */
export const mockServer = new MockX402Server();

/**
 * 初始化付费内容资源
 */
export function initPaidContent(episodes: Array<{ id: string; title: string; price: number; creatorAddress: string }>) {
  episodes.forEach(ep => {
    mockServer.registerResource({
      id: ep.id,
      type: 'episode',
      title: ep.title,
      price: String(Math.floor(ep.price * 1_000_000)), // 转换为 USDC base units
      payTo: ep.creatorAddress as `0x${string}`,
      description: `解锁播客单集: ${ep.title}`,
    });
  });
}

/**
 * 模拟 x402 请求流程的 Hook
 */
export function useX402Payment() {
  return {
    /**
     * 发起付费请求
     * @returns 如果需要付费返回支付要求，否则返回 null
     */
    requestContent: async (resourceId: string): Promise<PaymentRequiredResponse | null> => {
      return mockServer.checkPaymentRequired(resourceId);
    },
    
    /**
     * 提交支付并获取内容
     */
    submitPaymentAndUnlock: async (resourceId: string, paymentSignature: string): Promise<boolean> => {
      return mockServer.verifyPayment(paymentSignature, resourceId);
    },
  };
}
