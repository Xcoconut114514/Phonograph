import React, { useState, useCallback } from 'react';
import { useConnect, useDisconnect, useAccount, useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { Wallet, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected, address, connector } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  if (!isOpen) return null;

  const isCorrectNetwork = chainId === baseSepolia.id;

  const handleConnect = async (connector: any) => {
    setConnectingId(connector.id);
    try {
      await connect({ connector });
    } catch (e) {
      console.error('Connection failed:', e);
    }
    setConnectingId(null);
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      // 先断开 wagmi 连接
      await disconnectAsync();
      
      // 清除 wagmi 在 localStorage 中的状态
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('wagmi') || key.startsWith('wc@') || key.includes('walletconnect'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // 关闭模态框
      onClose();
      
      // 强制刷新页面以确保状态清除
      window.location.reload();
    } catch (e) {
      console.error('Disconnect failed:', e);
      // 即使出错也尝试刷新
      window.location.reload();
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSwitchNetwork = () => {
    switchChain({ chainId: baseSepolia.id });
  };

  // 过滤出我们支持的钱包
  const supportedConnectors = connectors.filter(c => 
    c.id === 'okxWallet' || 
    c.id === 'coinbaseWalletSDK' || 
    c.id === 'injected'
  );

  // 获取钱包图标和名称
  const getWalletInfo = (connector: any) => {
    if (connector.id === 'okxWallet') {
      return {
        name: 'OKX 钱包',
        icon: '🔶',
        color: 'border-yellow-500 hover:bg-yellow-500/20',
        description: 'OKX Web3 钱包'
      };
    }
    if (connector.id === 'coinbaseWalletSDK') {
      return {
        name: 'Coinbase 钱包',
        icon: '🔵',
        color: 'border-blue-500 hover:bg-blue-500/20',
        description: 'Coinbase Wallet'
      };
    }
    return {
      name: connector.name || 'Browser Wallet',
      icon: '🦊',
      color: 'border-orange-500 hover:bg-orange-500/20',
      description: '浏览器钱包'
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-gray-900 border-2 border-neonCyan shadow-[0_0_40px_rgba(0,243,255,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Wallet size={24} className="text-neonCyan" />
            <h2 className="text-xl text-white font-header">连接钱包</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isConnected ? (
            // 已连接状态
            <div className="space-y-4">
              <div className="bg-neonGreen/10 border border-neonGreen p-4 rounded">
                <div className="flex items-center gap-2 text-neonGreen mb-2">
                  <CheckCircle2 size={18} />
                  <span className="font-header">已连接</span>
                </div>
                <p className="text-gray-300 font-mono text-sm break-all">{address}</p>
              </div>

              {/* 网络状态 */}
              <div className={`p-4 border rounded ${isCorrectNetwork ? 'bg-neonCyan/10 border-neonCyan' : 'bg-red-500/10 border-red-500'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">当前网络</p>
                    <p className={`font-mono ${isCorrectNetwork ? 'text-neonCyan' : 'text-red-400'}`}>
                      {isCorrectNetwork ? 'Base Sepolia' : '错误网络'}
                    </p>
                  </div>
                  {!isCorrectNetwork && (
                    <button
                      onClick={handleSwitchNetwork}
                      className="px-4 py-2 bg-neonCyan/20 border border-neonCyan text-neonCyan text-sm hover:bg-neonCyan/30 transition-colors"
                    >
                      切换网络
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="w-full py-3 bg-red-500/20 border-2 border-red-500 text-red-400 font-header hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    断开中...
                  </>
                ) : (
                  '断开连接'
                )}
              </button>
            </div>
          ) : (
            // 未连接状态 - 显示钱包列表
            <div className="space-y-3">
              <p className="text-gray-400 text-sm font-pixel mb-4">
                选择钱包连接到 Base Sepolia 测试网
              </p>
              
              {supportedConnectors.map((connector) => {
                const info = getWalletInfo(connector);
                const isConnecting = connectingId === connector.id;
                
                return (
                  <button
                    key={connector.id}
                    onClick={() => handleConnect(connector)}
                    disabled={isPending}
                    className={`w-full p-4 border-2 ${info.color} bg-gray-800/50 transition-all flex items-center gap-4 disabled:opacity-50`}
                  >
                    <span className="text-2xl">{info.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="text-white font-header">{info.name}</p>
                      <p className="text-gray-500 text-xs font-pixel">{info.description}</p>
                    </div>
                    {isConnecting && (
                      <Loader2 size={20} className="text-neonCyan animate-spin" />
                    )}
                  </button>
                );
              })}

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error.message}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-black/30">
          <p className="text-center text-gray-600 text-xs font-pixel">
            连接钱包即表示您同意使用 Base Sepolia 测试网
          </p>
        </div>
      </div>
    </div>
  );
};

// 简化的钱包按钮组件
export const WalletButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === baseSepolia.id;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border-2 font-mono text-sm transition-all ${
        isConnected 
          ? isCorrectNetwork
            ? 'border-neonGreen bg-neonGreen/10 text-neonGreen hover:bg-neonGreen/20'
            : 'border-yellow-500 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
          : 'border-neonCyan bg-neonCyan/10 text-neonCyan hover:bg-neonCyan/20 animate-pulse'
      }`}
    >
      <Wallet size={16} />
      {isConnected ? (
        <>
          <span>{formatAddress(address!)}</span>
          {!isCorrectNetwork && <AlertCircle size={14} className="text-yellow-400" />}
        </>
      ) : (
        <span>连接钱包</span>
      )}
    </button>
  );
};
