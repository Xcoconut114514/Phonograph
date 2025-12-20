import React, { useState, useEffect, useRef } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { 
  Play, 
  Pause, 
  Lock, 
  Disc, 
  Radio, 
  Headphones, 
  X, 
  Zap, 
  Heart,
  Wallet,
  Landmark,
  Activity,
  List,
  CheckCircle2,
  Package,
  BadgeCheck,
  Cpu,
  Terminal,
  Box,
  Layers,
  Hourglass,
  MessageCircle,
  Send,
  Coins,
  User,
  Settings
} from 'lucide-react';
import { Podcast, ViewState, PlayerState, Episode, TipMessage, CreatorReply } from './types';
import { MOCK_PODCASTS } from './constants';
import { WalletModal, WalletButton } from './WalletConnect';

// --- Shared Components ---

const PixelButton: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = "relative px-4 py-2 font-header text-sm tracking-wider uppercase transition-all active:translate-y-1 active:translate-x-1 border-2 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const variants = {
    primary: "bg-neonPurple text-white border-white shadow-[4px_4px_0px_0px_#fff] hover:bg-white hover:text-neonPurple hover:shadow-[4px_4px_0px_0px_#b026ff]",
    secondary: "bg-neonCyan text-black border-white shadow-[4px_4px_0px_0px_#fff] hover:bg-white hover:text-neonCyan",
    danger: "bg-neonPink text-white border-white shadow-[4px_4px_0px_0px_#fff] hover:bg-pink-600",
    ghost: "bg-transparent text-gray-300 border-gray-600 hover:border-neonCyan hover:text-neonCyan hover:shadow-[0_0_10px_#00f3ff]",
    gold: "bg-yellow-500 text-black border-yellow-200 shadow-[4px_4px_0px_0px_#fef08a] hover:bg-yellow-400"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
};

const Tag: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-block px-2 py-0.5 text-[10px] border border-neonCyan text-neonCyan bg-black font-mono mr-2 mb-2 shadow-[2px_2px_0_0_#002020]">
    #{label}
  </span>
);

// --- Quick Payment Toast (X402 即时支付反馈) ---

const PaymentToast: React.FC<{ 
  message: string; 
  onComplete: () => void;
}> = ({ message, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top duration-300">
      <div className="bg-gradient-to-r from-neonGreen/90 to-neonCyan/90 text-black px-6 py-3 rounded-sm border-2 border-white shadow-[0_0_30px_rgba(0,255,0,0.5)] flex items-center gap-3 font-header">
        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
          <CheckCircle2 size={14} className="text-green-600" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-wide">✓ 支付成功</div>
          <div className="text-[10px] opacity-80 font-mono">{message}</div>
        </div>
        <Zap size={16} className="text-yellow-400 animate-pulse ml-2" />
      </div>
    </div>
  );
};

// --- Transaction Animation Modal (铸造NFT专用) ---

// Particle component for digital asset generation effect
const Particle: React.FC<{ delay: number; index: number }> = ({ delay, index }) => {
  const angle = (index * 360) / 20;
  const radius = 80 + Math.random() * 40;
  return (
    <div
      className="absolute w-2 h-2 bg-neonGreen rounded-full animate-particle"
      style={{
        animationDelay: `${delay}ms`,
        left: '50%',
        top: '50%',
        transform: `rotate(${angle}deg) translateX(${radius}px)`,
        boxShadow: '0 0 10px #00ff00, 0 0 20px #00ff00'
      }}
    />
  );
};

// Digital code rain effect
const CodeRain: React.FC = () => {
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const columns = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    chars: Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]),
    delay: Math.random() * 2,
    speed: 1 + Math.random() * 2
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
      {columns.map(col => (
        <div
          key={col.id}
          className="absolute text-neonGreen font-mono text-xs animate-code-rain"
          style={{
            left: `${(col.id / 15) * 100}%`,
            animationDuration: `${col.speed}s`,
            animationDelay: `${col.delay}s`
          }}
        >
          {col.chars.map((char, i) => (
            <div key={i} style={{ opacity: 1 - i * 0.1 }}>{char}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

const TransactionModal: React.FC<{ 
  onComplete: () => void; 
  title: string;
}> = ({ onComplete, title }) => {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [hexGrid, setHexGrid] = useState<string[]>([]);

  // Generate hex grid animation
  useEffect(() => {
    const interval = setInterval(() => {
      setHexGrid(Array.from({ length: 16 }, () => 
        Math.random().toString(16).substr(2, 2).toUpperCase()
      ));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Progress Bar Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (step >= 3) return 100;
        const next = prev + Math.random() * 2;
        return next > 95 ? 95 : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [step]);

  // Log Simulation
  useEffect(() => {
    const codeLines = [
      "初始化链接中...",
      "验证签名 0x89A...",
      "连接主网...",
      "分配区块空间...",
      "挖掘随机数 #8839...",
      "生成资产元数据...",
      "上传至 IPFS...",
      "确认交易中...",
      "智能合约交互成功...",
      "铸造数字资产...",
      "写入区块链...",
      "完成 TOKEN URI..."
    ];
    
    let lineIndex = 0;
    const logInterval = setInterval(() => {
      if (lineIndex < codeLines.length && step < 3) {
        const hex = Math.random().toString(16).substr(2, 6).toUpperCase();
        setLogs(prev => [`> [${hex}] ${codeLines[lineIndex]}`, ...prev].slice(0, 7));
        lineIndex++;
      }
    }, 350);

    const s1 = setTimeout(() => setStep(1), 1500); // Init
    const s2 = setTimeout(() => setStep(2), 3500); // Building
    const s3 = setTimeout(() => { 
      setStep(3); 
      setProgress(100); 
      setShowParticles(true);
    }, 5000); // Done
    const s4 = setTimeout(onComplete, 7000); // Close (extended for effect)

    return () => {
      [s1, s2, s3, s4].forEach(clearTimeout);
      clearInterval(logInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md font-mono perspective-1000">
      {/* Code Rain Background */}
      <CodeRain />
      
      <div className="relative w-full max-w-lg bg-gray-900 border-2 border-neonGreen shadow-[0_0_100px_rgba(0,255,0,0.3)] p-1 overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
         
         {/* Animated Background Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none animate-pulse"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/20 to-green-900/40 pointer-events-none"></div>
         
         {/* Scanning Line Effect */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-neonGreen to-transparent animate-scan-line"></div>
         </div>

         {/* Decorative Corners */}
         <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-neonGreen z-20 animate-pulse"></div>
         <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-neonGreen z-20 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-neonGreen z-20 animate-pulse"></div>
         <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-neonGreen z-20 animate-pulse"></div>
         
         {/* Header */}
         <div className="relative z-10 bg-green-900/50 p-3 border-b border-green-500 flex justify-between items-center mb-4">
           <div className="flex items-center gap-2 text-neonGreen text-xs tracking-widest font-bold">
             <Terminal size={14} className="animate-pulse" /> 
             <span className="animate-pulse">智能合约执行中</span>
           </div>
           <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
           </div>
         </div>
         
         {/* Main Content */}
         <div className="relative z-10 px-8 pb-8">
            
            {/* Visual Centerpiece */}
            <div className="h-48 flex items-center justify-center mb-6 relative">
               {/* Particle Effects */}
               {showParticles && Array.from({ length: 20 }, (_, i) => (
                 <Particle key={i} delay={i * 50} index={i} />
               ))}
               
               {/* Outer glow ring */}
               <div className={`absolute w-40 h-40 rounded-full border border-neonGreen/20 ${step < 3 ? 'animate-ping' : 'opacity-0'}`}></div>
               
               {/* Spinning rings */}
               <div className={`absolute w-36 h-36 border-2 border-t-neonGreen border-r-transparent border-b-neonCyan border-l-transparent rounded-full transition-all duration-1000 ${step < 3 ? 'animate-spin' : 'scale-[2] opacity-0'}`}></div>
               <div className={`absolute w-28 h-28 border-2 border-t-transparent border-r-neonPurple border-b-transparent border-l-neonPink rounded-full transition-all duration-1000 ${step < 3 ? 'animate-spin-slow' : 'scale-[2] opacity-0'}`} style={{ animationDirection: 'reverse' }}></div>
               <div className={`absolute w-20 h-20 border border-dashed border-green-400/50 rounded-full transition-all duration-1000 ${step < 3 ? 'animate-spin' : 'scale-0'}`} style={{ animationDuration: '4s' }}></div>
               
               {/* Hex data floating around */}
               {step >= 1 && step < 3 && (
                 <div className="absolute inset-0 pointer-events-none">
                   {hexGrid.map((hex, i) => (
                     <span
                       key={i}
                       className="absolute text-[8px] text-neonGreen/60 font-mono animate-float"
                       style={{
                         left: `${10 + (i % 4) * 25}%`,
                         top: `${10 + Math.floor(i / 4) * 25}%`,
                         animationDelay: `${i * 0.1}s`
                       }}
                     >
                       0x{hex}
                     </span>
                   ))}
                 </div>
               )}
               
               {/* Center Icon Morphing */}
               <div className="relative z-10 transition-all duration-500 transform">
                  {step === 0 && (
                    <div className="relative">
                      <Box size={56} className="text-gray-500 animate-pulse" />
                      <div className="absolute inset-0 bg-gray-500/20 blur-xl"></div>
                    </div>
                  )}
                  {step === 1 && (
                    <div className="relative">
                      <Layers size={64} className="text-neonGreen animate-bounce" />
                      <div className="absolute inset-0 bg-neonGreen/30 blur-xl animate-pulse"></div>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="relative">
                      <Cpu size={72} className="text-white glitch-text" />
                      <div className="absolute inset-0 bg-white/20 blur-xl animate-pulse"></div>
                      {/* Digital circuit lines */}
                      <div className="absolute -inset-4 border border-neonGreen/30 animate-pulse"></div>
                      <div className="absolute -inset-8 border border-neonCyan/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="relative animate-pixel-jump">
                        <div className="absolute -inset-8 bg-neonGreen blur-2xl opacity-60 animate-pulse"></div>
                        <div className="absolute -inset-4 bg-white blur-xl opacity-40 animate-ping"></div>
                        <BadgeCheck size={96} className="text-neonGreen relative z-10 drop-shadow-[0_0_30px_rgba(0,255,0,1)]" />
                        {/* Success sparkles */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-ping"></div>
                        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-neonCyan rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                        <div className="absolute top-0 -left-4 w-2 h-2 bg-neonPurple rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                    </div>
                  )}
               </div>
            </div>

            {/* Title & Progress */}
            <div className="mb-6 text-center">
               <h3 className={`font-header text-xl mb-3 tracking-wide uppercase transition-all duration-500 ${step === 3 ? 'text-neonGreen text-2xl animate-pulse' : 'text-white'}`}>
                 {step === 3 ? '✓ 数字资产铸造成功' : title}
               </h3>
               <div className="w-full h-5 bg-gray-800 border border-gray-600 relative overflow-hidden rounded-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-neonGreen via-neonCyan to-neonGreen shadow-[0_0_20px_#00ff00] transition-all duration-200 relative"
                    style={{ width: `${progress}%` }}
                  >
                     <div className="absolute right-0 top-0 h-full w-2 bg-white animate-pulse"></div>
                     {/* Shimmer effect */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                  {/* Progress Stripes */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.4)_25%,rgba(0,0,0,0.4)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.4)_75%,rgba(0,0,0,0.4))] bg-[length:10px_10px] opacity-40"></div>
               </div>
               <div className="flex justify-between text-[10px] font-mono text-green-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Activity size={10} className="animate-pulse" />
                    区块: #{Math.floor(182934 + progress * 10)}
                  </span>
                  <span className="text-neonCyan font-bold">{Math.floor(progress)}%</span>
               </div>
            </div>

            {/* Terminal Logs */}
            <div className="bg-black/80 p-4 h-32 overflow-hidden border border-green-700 font-pixel text-green-400 text-sm shadow-inner relative rounded-sm">
               <div className="absolute top-1 right-2 opacity-60 text-[10px] text-neonCyan">区块链日志</div>
               <div className="space-y-1">
                 {logs.map((log, i) => (
                    <div 
                      key={i} 
                      className={`truncate transition-all duration-300 ${i === 0 ? 'text-neonGreen font-bold text-shadow-glow' : 'opacity-60'}`}
                      style={{ transform: `translateX(${i === 0 ? 0 : -5}px)` }}
                    >
                       {log}
                    </div>
                 ))}
               </div>
               {/* Cursor blink */}
               <div className="mt-2 flex items-center gap-1 text-white">
                 <span>{'>'}</span>
                 <span className="w-2 h-4 bg-neonGreen animate-blink"></span>
               </div>
            </div>

            {/* Success flash effect */}
            {step === 3 && (
               <>
                 <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-neonGreen/20 animate-flash"></div>
                    <div className="w-full h-0.5 bg-white absolute top-1/2 animate-expand-line"></div>
                 </div>
               </>
            )}
         </div>
      </div>
    </div>
  );
};

// --- Cool Logo Widget (Enhanced but resized) ---

const LogoWidget: React.FC = () => {
  // 项目Logo - 赛博朋克风格磁带图标
  const logoUrl = "https://image.pollinations.ai/prompt/retro%20cassette%20tape%20pixel%20art%20cyberpunk%20neon%20purple%20cyan%20pink%20glitch%20effect%20with%20golden%20C%20coin%20logo%20on%20top%20dark%20background%20grid?width=128&height=128&nologo=true&seed=42";
  
  return (
    <div className="flex flex-col gap-2 mb-10 select-none mt-2">
       <div className="flex items-center gap-4">
          {/* Logo Image Container */}
          <div className="relative w-16 h-16 bg-black border-2 border-neonCyan shadow-[0_0_20px_rgba(0,243,255,0.5)] flex items-center justify-center overflow-hidden group rounded-sm">
              <img 
                src={logoUrl} 
                alt="留声机 Logo" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 pointer-events-none"></div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-neonCyan/20"></div>
          </div>
          
          <div>
            <h1 className="text-5xl font-header text-white italic tracking-tighter drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]" style={{ textShadow: '3px 3px 0px #b026ff' }}>
              留声机
            </h1>
            <div className="flex items-center gap-2 mt-1 ml-1">
               <div className="text-[10px] text-gray-400 font-pixel tracking-[0.2em] uppercase border border-gray-800 px-2 py-0.5">去中心化音频协议</div>
               {/* Equalizer Animation */}
               <div className="flex items-end gap-[2px] h-4 ml-1">
                  <div className="bar bg-neonPurple w-1"></div>
                  <div className="bar bg-neonCyan w-1"></div>
                  <div className="bar bg-neonPink w-1"></div>
                  <div className="bar bg-white w-1"></div>
               </div>
            </div>
          </div>
       </div>
    </div>
  );
};

// --- Podcast Card (Flip Effect with Avatar Hover) ---

const PodcastCard: React.FC<{ data: Podcast; onClick: () => void }> = ({ data, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate AI avatar URL based on author name
  const getAIAvatar = (author: string) => 
    `https://image.pollinations.ai/prompt/${encodeURIComponent(`portrait of ${author} as a cyberpunk futuristic avatar, neon glow, digital art style, high quality face, mysterious`)}?width=300&height=300&nologo=true`;
  
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-96 w-full perspective-1000 cursor-pointer mb-8"
    >
      {/* Card Container */}
      <div className="relative w-full h-full transition-all duration-500">
        
        {/* Main Card */}
        <div className="absolute w-full h-full bg-panel border-2 border-retroGray shadow-[8px_8px_0px_0px_#000] group-hover:shadow-[0_0_30px_rgba(176,38,255,0.4),8px_8px_0px_0px_#b026ff] transition-all duration-500">
          {/* Image Container */}
          <div className="relative h-64 w-full overflow-hidden border-b-2 border-retroGray">
            {/* Cover Image - fades out on hover */}
            <img 
              src={data.coverUrl} 
              alt={data.title}
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
            />
            
            {/* Avatar Image - fades in on hover */}
            <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(176,38,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(176,38,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse"></div>
              
              {/* Glowing rings */}
              <div className="absolute w-44 h-44 rounded-full border border-neonPurple/30 animate-ping"></div>
              <div className="absolute w-36 h-36 rounded-full border-2 border-neonCyan/20 animate-spin-slow"></div>
              
              {/* Avatar Container */}
              <div className="relative z-10 w-32 h-32 rounded-full overflow-hidden border-4 border-neonPurple shadow-[0_0_40px_rgba(176,38,255,0.6)] transform transition-all duration-500 group-hover:scale-110">
                <img 
                  src={data.avatarUrl || getAIAvatar(data.author)} 
                  alt={data.author}
                  className="w-full h-full object-cover bg-gray-900"
                />
                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-neonPurple/20 via-transparent to-neonCyan/20 animate-pulse"></div>
              </div>
              
              {/* Author name floating below avatar */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <span className="text-neonCyan font-header text-lg tracking-wider animate-pulse">@{data.author}</span>
                <div className="text-[10px] text-gray-400 font-mono mt-1">/// CREATOR ID: {data.id.padStart(4, '0')} ///</div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
            
            {/* Episode Count Badge */}
            <div className="absolute top-2 right-2 bg-black/80 border border-neonCyan backdrop-blur-md px-3 py-1 flex items-center gap-1 z-10">
              <List size={12} className="text-neonCyan" />
              <span className="text-neonCyan text-xs font-bold font-mono">全 {data.episodes.length} 集</span>
            </div>

            {/* Title Overlay - slides up on hover */}
            <div className={`absolute bottom-4 left-4 right-4 transition-all duration-500 ${isHovered ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
               <h3 className="text-white text-xl font-header leading-tight drop-shadow-md">{data.title}</h3>
            </div>
            
            {/* Hover indicator */}
            {isHovered && (
              <div className="absolute top-2 left-2 bg-neonPurple/80 px-2 py-1 text-[10px] text-white font-mono tracking-wider animate-pulse z-10">
                CREATOR PROFILE
              </div>
            )}
          </div>
          
          <div className="p-4 bg-void relative">
            <div className="flex justify-between items-center mb-2">
               <div className={`text-xs font-mono transition-colors duration-300 ${isHovered ? 'text-neonCyan' : 'text-neonPurple'}`}>
                 {isHovered ? `@${data.author}` : '加密数字合集'}
               </div>
               <div className="flex items-center gap-1 text-gray-500">
                  <Headphones size={12} className={isHovered ? 'text-neonPurple' : ''} /> 
                  <span className="text-xs font-pixel">{data.listens}</span>
               </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.tags.map(t => <Tag key={t} label={t} />)}
            </div>
            
            {/* Scan line effect on hover */}
            {isHovered && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-full h-0.5 bg-neonPurple/50 animate-scan-vertical"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Collection Detail Modal (Episode List) ---

interface DetailProps {
  podcast: Podcast;
  onClose: () => void;
  onPlayEpisode: (episode: Episode) => void;
  unlockedEpisodeIds: string[];
  finishedEpisodeIds: string[]; // Added: Track played episodes
  unlockEpisode: (id: string, price: number) => void;
  unlockBundle: () => void;
  mintNFT: () => void;
  isMinted: boolean;
}

const CollectionDetail: React.FC<DetailProps> = ({ 
  podcast, 
  onClose, 
  onPlayEpisode, 
  unlockedEpisodeIds, 
  finishedEpisodeIds,
  unlockEpisode,
  unlockBundle,
  mintNFT,
  isMinted
}) => {
  const paidEpisodes = podcast.episodes.filter(ep => !ep.isFree);
  const unlockedPaidEpisodes = paidEpisodes.filter(ep => unlockedEpisodeIds.includes(ep.id));
  const remainingPaidEpisodes = paidEpisodes.filter(ep => !unlockedEpisodeIds.includes(ep.id));
  const totalPrice = paidEpisodes.length * podcast.basePrice;
  const remainingPrice = remainingPaidEpisodes.length * podcast.basePrice;
  const bundlePrice = (remainingPrice * 0.9).toFixed(3);
  
  // Check unlock status (payment)
  const isFullyUnlocked = paidEpisodes.every(ep => unlockedEpisodeIds.includes(ep.id));
  
  // Check listening status (engagement) - all episodes including free ones must be heard
  const isFullyListened = podcast.episodes.every(ep => finishedEpisodeIds.includes(ep.id));
  const listenProgress = Math.round((podcast.episodes.filter(ep => finishedEpisodeIds.includes(ep.id)).length / podcast.episodes.length) * 100);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-panel border-2 border-neonCyan shadow-[0_0_30px_rgba(0,243,255,0.2)] flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
        <button onClick={onClose} className="absolute top-2 right-2 z-50 text-gray-500 hover:text-white bg-black/50 p-1 rounded-full">
            <X size={24} />
        </button>

        {/* Left: Info Side */}
        <div className="w-full md:w-1/3 bg-gray-900/50 p-6 flex flex-col border-b md:border-b-0 md:border-r border-gray-800 overflow-y-auto">
           <img src={podcast.coverUrl} className="w-full aspect-square object-cover border border-gray-700 mb-6 shadow-[0_0_15px_rgba(0,0,0,0.8)]" />
           <h2 className="text-2xl text-white font-header mb-2">{podcast.title}</h2>
           <div className="flex items-center gap-2 text-neonCyan mb-4 font-mono text-xs">
              <span>@{podcast.author}</span>
              <span>•</span>
              <span>{podcast.episodes.length} 集</span>
           </div>
           <p className="text-gray-400 font-pixel leading-relaxed mb-6">{podcast.description}</p>
           
           <div className="mt-auto space-y-3">
             {isMinted ? (
                <div className="bg-yellow-500/20 border border-yellow-500 p-4 text-center">
                    <BadgeCheck size={32} className="mx-auto text-yellow-500 mb-2" />
                    <p className="text-yellow-500 font-header text-sm">已铸造数字藏品</p>
                    <p className="text-xs text-yellow-200/70 font-mono mt-1">TOKEN ID: #88392</p>
                </div>
             ) : isFullyUnlocked ? (
                isFullyListened ? (
                    <PixelButton onClick={mintNFT} variant="gold" className="w-full py-4 animate-pulse">
                       <Disc size={20} /> 铸造纪念 NFT (Mint)
                    </PixelButton>
                ) : (
                    <div className="bg-gray-800 p-4 border border-gray-700 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-400 font-pixel text-sm mb-2">
                           <Hourglass size={14} className="animate-spin-slow" /> 完成所有收听以铸造
                        </div>
                        <div className="w-full bg-black h-3 rounded-full overflow-hidden border border-gray-600 relative">
                           <div className="h-full bg-gradient-to-r from-neonPurple to-neonCyan transition-all duration-500" style={{width: `${listenProgress}%`}}></div>
                           {/* Striped pattern for progress bar */}
                           <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.2)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
                        </div>
                        <p className="text-neonCyan font-mono text-xs mt-2 tracking-widest">{listenProgress}% 已同步</p>
                    </div>
                )
             ) : (
                <div className="bg-gray-800 p-4 border border-gray-700">
                   {unlockedPaidEpisodes.length > 0 && (
                     <div className="flex justify-between items-center mb-2 text-neonGreen text-xs font-mono">
                        <span>已解锁:</span>
                        <span>{unlockedPaidEpisodes.length}/{paidEpisodes.length} 集</span>
                     </div>
                   )}
                   <div className="flex justify-between items-center mb-2 text-gray-300 text-xs font-mono">
                      <span>剩余单集总价:</span>
                      <span className="line-through">{remainingPrice.toFixed(2)} USDC</span>
                   </div>
                   <div className="flex justify-between items-center mb-4 text-neonCyan font-header">
                      <span>优惠:</span>
                      <span className="text-xl">{bundlePrice} USDC</span>
                   </div>
                   <PixelButton onClick={unlockBundle} variant="secondary" className="w-full">
                      <Package size={18} /> {unlockedPaidEpisodes.length > 0 ? '解锁剩余合集' : '购买整套合集'}
                   </PixelButton>
                </div>
             )}
           </div>
        </div>

        {/* Right: Episode List */}
        <div className="w-full md:w-2/3 bg-void flex flex-col">
           <div className="p-4 border-b border-gray-800 bg-black/50">
              <h3 className="text-white font-header flex items-center gap-2"><List size={18} className="text-neonPurple"/> 剧集列表</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {podcast.episodes.map((ep, idx) => {
                 const isUnlocked = ep.isFree || unlockedEpisodeIds.includes(ep.id);
                 const isPlayed = finishedEpisodeIds.includes(ep.id);
                 return (
                    <div key={ep.id} className={`flex items-center justify-between p-3 border ${isUnlocked ? 'border-gray-700 bg-gray-900/30' : 'border-gray-800 bg-black opacity-70'} hover:bg-gray-800 transition-colors group relative overflow-hidden`}>
                       {/* Played Indicator Background (subtle) */}
                       {isPlayed && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_10px_#00ff00]"></div>}
                       
                       <div className="flex items-center gap-4 flex-1">
                          <div className={`text-xs w-6 font-mono ${isPlayed ? 'text-green-500' : 'text-gray-600'}`}>{(idx + 1).toString().padStart(2, '0')}</div>
                          <div className="flex-1">
                             <h4 className={`font-pixel text-lg ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{ep.title}</h4>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-gray-500 border border-gray-700 px-1">{ep.duration} 分钟</span>
                                {ep.isFree && <span className="text-[10px] bg-neonGreen/20 text-green-400 border border-green-900 px-1">免费</span>}
                                {isPlayed && <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-700 px-1 flex items-center gap-1"><CheckCircle2 size={8}/> 已听</span>}
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          {isUnlocked ? (
                             <button onClick={() => onPlayEpisode(ep)} className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform ${isPlayed ? 'bg-gray-800 text-green-400 border border-green-500' : 'bg-neonPurple text-white shadow-[0_0_10px_#b026ff]'}`}>
                                {isPlayed ? <Play size={18} fill="currentColor" className="ml-1" /> : <Play size={18} fill="white" className="ml-1" />}
                             </button>
                          ) : (
                             <PixelButton onClick={() => unlockEpisode(ep.id, podcast.basePrice)} variant="ghost" className="text-xs py-1">
                                <Lock size={12} /> {podcast.basePrice} USDC
                             </PixelButton>
                          )}
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Cassette Player Modal ---

interface PlayerProps {
  episode: Episode;
  podcast: Podcast;
  onClose: () => void;
  onFinish: () => void;
}

const PlayerModal: React.FC<PlayerProps> = ({ episode, podcast, onClose, onFinish }) => {
  const [playerState, setPlayerState] = useState<PlayerState>('playing');
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressRef = useRef<number | null>(null);
  const hasAudio = !!episode.audioText;

  // Initialize and control speech synthesis
  useEffect(() => {
    if (!hasAudio) return;
    
    // Cancel any existing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(episode.audioText);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Try to find a Chinese voice
    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(v => v.lang.includes('zh')) || voices[0];
    if (chineseVoice) utterance.voice = chineseVoice;
    
    // Progress tracking based on speech
    utterance.onstart = () => {
      setPlayerState('playing');
    };
    
    utterance.onend = () => {
      setPlayerState('finished');
      setProgress(100);
      onFinish();
    };
    
    utterance.onerror = () => {
      console.log('Speech error, falling back to timer');
    };
    
    speechRef.current = utterance;
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [episode.audioText, hasAudio]);
  
  // Handle voices loading (they load async)
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Progress simulation for visual feedback
  useEffect(() => {
    if (playerState === 'playing') {
      const totalDuration = hasAudio ? episode.duration * 60 * 1000 : 10000; // Real duration or 10s demo
      const interval = totalDuration / 100;
      
      progressRef.current = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            if (!hasAudio) {
              setPlayerState('finished');
              onFinish();
            }
            return 100;
          }
          return p + 1;
        });
      }, interval);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [playerState, episode.duration, hasAudio, onFinish]);
  
  // Display current text being spoken (typewriter effect)
  useEffect(() => {
    if (!hasAudio || !episode.audioText) return;
    
    const words = episode.audioText.split('');
    let index = 0;
    const textInterval = setInterval(() => {
      if (playerState === 'playing' && index < words.length) {
        setCurrentText(episode.audioText!.slice(0, index + 1));
        index++;
      }
    }, 80);
    
    return () => clearInterval(textInterval);
  }, [episode.audioText, hasAudio, playerState]);

  const togglePlay = () => {
    if (playerState === 'playing') {
      setPlayerState('paused');
      if (hasAudio) window.speechSynthesis.pause();
    } else if (playerState === 'paused') {
      setPlayerState('playing');
      if (hasAudio) window.speechSynthesis.resume();
    } else if (playerState === 'finished') {
      // 已完成状态下点击直接关闭播放器
      handleClose();
    }
  };
  
  const handleClose = () => {
    window.speechSynthesis.cancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-lg bg-panel border-2 border-neonPurple shadow-[0_0_40px_rgba(176,38,255,0.4)] p-1">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center bg-black p-3 mb-1 border-b border-neonPurple/30">
          <div className="flex items-center gap-2">
             <Activity className="text-neonPurple animate-pulse" size={16} />
             <span className="text-neonPurple font-pixel tracking-widest text-sm">正在播放协议 /// {episode.id}</span>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-void relative overflow-hidden">
          {/* Background blurred cover */}
          <div className="absolute inset-0 opacity-20 bg-center bg-cover filter blur-xl" style={{ backgroundImage: `url(${podcast.coverUrl})` }}></div>

          {/* Cassette Visual */}
          <div className="relative bg-[#1a1a1a] border-2 border-gray-600 rounded-lg p-4 shadow-2xl mb-8 transform hover:scale-[1.02] transition-transform duration-500">
             {/* Screws */}
             <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-500 flex items-center justify-center"><div className="w-1 h-[1px] bg-gray-800 transform rotate-45"></div></div>
             <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-500 flex items-center justify-center"><div className="w-1 h-[1px] bg-gray-800 transform rotate-45"></div></div>
             <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-500 flex items-center justify-center"><div className="w-1 h-[1px] bg-gray-800 transform rotate-45"></div></div>
             <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-500 flex items-center justify-center"><div className="w-1 h-[1px] bg-gray-800 transform rotate-45"></div></div>

            <div className="bg-gray-300 h-32 rounded flex items-center justify-center overflow-hidden border border-black relative">
               {/* Label Art */}
               <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{ backgroundImage: `url(${podcast.coverUrl})`, backgroundSize: 'cover' }}></div>
               
               <div className="z-10 w-full px-6 flex justify-between items-center">
                  {/* Left Reel */}
                  <div className={`w-12 h-12 rounded-full border-4 border-white bg-black flex items-center justify-center ${playerState === 'playing' ? 'animate-spin' : ''}`}>
                     <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                  </div>
                  
                  {/* Window */}
                  <div className="bg-black/80 border border-gray-500 w-24 h-8 rounded-sm flex items-center justify-center px-1">
                     <div className="w-full flex gap-[2px]">
                         <div className={`h-full w-full bg-white/20 ${playerState === 'playing' ? 'animate-pulse' : ''}`}></div>
                     </div>
                  </div>

                  {/* Right Reel */}
                  <div className={`w-12 h-12 rounded-full border-4 border-white bg-black flex items-center justify-center ${playerState === 'playing' ? 'animate-spin' : ''}`}>
                     <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                  </div>
               </div>
            </div>
            <div className="mt-2 text-center">
               <h3 className="text-white font-header text-sm tracking-wide truncate px-4">{episode.title}</h3>
               <p className="text-[10px] text-gray-500 font-mono">{hasAudio ? '语音播放中' : '演示模式'}</p>
            </div>
          </div>

          {/* Text Display Area for Speech */}
          {hasAudio && (
            <div className="relative bg-black/60 border border-gray-700 rounded p-4 mb-6 h-32 overflow-y-auto">
              <div className="absolute top-2 right-2 text-[10px] text-neonCyan font-mono opacity-60">实时字幕</div>
              <p className="text-gray-300 font-pixel text-sm leading-relaxed">
                {currentText}
                <span className="inline-block w-2 h-4 bg-neonCyan ml-1 animate-blink"></span>
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="relative z-10 space-y-4">
            {/* Draggable Progress Bar */}
            <div 
              className="relative w-full h-6 bg-gray-800 border border-gray-600 rounded-full overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newProgress = Math.max(0, Math.min(100, (x / rect.width) * 100));
                setProgress(newProgress);
                
                // If dragged to end (>= 95%), mark as finished
                if (newProgress >= 95) {
                  setProgress(100);
                  setPlayerState('finished');
                  window.speechSynthesis.cancel();
                  onFinish();
                }
              }}
              onMouseDown={(e) => {
                const progressBar = e.currentTarget;
                const updateProgress = (clientX: number) => {
                  const rect = progressBar.getBoundingClientRect();
                  const x = clientX - rect.left;
                  const newProgress = Math.max(0, Math.min(100, (x / rect.width) * 100));
                  setProgress(newProgress);
                };
                
                const onMouseMove = (moveEvent: MouseEvent) => {
                  updateProgress(moveEvent.clientX);
                };
                
                const onMouseUp = (upEvent: MouseEvent) => {
                  const rect = progressBar.getBoundingClientRect();
                  const x = upEvent.clientX - rect.left;
                  const finalProgress = Math.max(0, Math.min(100, (x / rect.width) * 100));
                  
                  // If dragged to end (>= 95%), mark as finished
                  if (finalProgress >= 95) {
                    setProgress(100);
                    setPlayerState('finished');
                    window.speechSynthesis.cancel();
                    onFinish();
                  }
                  
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
                };
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
              }}
            >
               {/* Progress fill */}
               <div 
                  className="h-full bg-gradient-to-r from-neonPurple to-neonCyan transition-all duration-75 relative"
                  style={{ width: `${progress}%` }}
               >
                   {/* Glowing end indicator */}
                   <div className="absolute right-0 top-0 h-full w-1 bg-white shadow-[0_0_10px_#fff]"></div>
               </div>
               
               {/* Draggable handle */}
               <div 
                 className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#b026ff] border-2 border-neonPurple opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                 style={{ left: `calc(${progress}% - 8px)` }}
               ></div>
               
               {/* Hover hint */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <span className="text-[10px] text-white/60 font-mono">拖动调整进度</span>
               </div>
            </div>
            
            {/* Progress percentage display */}
            <div className="flex justify-between text-[10px] text-gray-500 font-mono px-1">
              <span>{Math.floor(progress)}%</span>
              <span>{progress >= 100 ? '已完成' : '拖动至终点可快速完成'}</span>
            </div>

            <div className="flex justify-center gap-6">
                <div className="flex gap-4 w-full">
                  <PixelButton onClick={togglePlay} variant="primary" className="flex-1">
                    {playerState === 'playing' ? <Pause size={20} /> : playerState === 'finished' ? <CheckCircle2 size={20} /> : <Play size={20} />}
                    <span className="ml-2 text-xs">
                      {playerState === 'playing' ? '暂停' : playerState === 'finished' ? '完成并关闭' : '播放'}
                    </span>
                  </PixelButton>
                  <PixelButton variant="ghost" className="flex-1">
                     <Heart size={20} /> 
                     <span className="ml-2 text-xs">收藏</span>
                  </PixelButton>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Collection View (Museum) ---

const Museum: React.FC<{ collectedIds: string[]; allPodcasts: Podcast[]; onViewCollection: (p: Podcast) => void }> = ({ collectedIds, allPodcasts, onViewCollection }) => {
  const myArtifacts = allPodcasts.filter(p => collectedIds.includes(p.id));

  if (myArtifacts.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden rounded border border-gray-800 bg-black/50">
         <div className="relative z-10 text-center p-8">
             <div className="mb-8 relative inline-block">
                 <h1 className="text-7xl md:text-8xl font-pixel font-bold tracking-widest relative select-none">
                    <span className="inline-block text-neonPurple drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-[neon-flicker_4s_infinite]">留</span>
                    <span className="inline-block text-neonCyan drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] animate-[neon-flicker_5s_infinite_0.5s] mx-4">声</span>
                    <span className="inline-block text-neonPink drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] animate-[neon-flicker_3s_infinite_1s]">机</span>
                 </h1>
             </div>
             <p className="text-gray-500 font-pixel">完成整个合集收听以铸造您的第一枚 NFT 藏品</p>
         </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {myArtifacts.map(tape => (
        <div 
          key={tape.id} 
          onClick={() => onViewCollection(tape)}
          className="relative bg-white text-black p-1 rounded-sm border-l-4 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] cursor-pointer hover:-translate-y-2 transition-transform duration-300"
        >
           <div className="h-48 border border-gray-300 p-2 flex flex-col justify-between bg-cover bg-center relative" style={{ backgroundImage: `url(${tape.coverUrl})` }}>
              <div className="absolute inset-0 bg-yellow-400/90 mix-blend-multiply"></div>
              {/* NFT Holo Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-50 pointer-events-none"></div>
              
              <div className="relative z-10 flex justify-between">
                  <div className="bg-black text-yellow-500 px-2 py-0.5 text-[10px] font-bold border border-yellow-500">MINTED</div>
                  <BadgeCheck size={16} className="text-black drop-shadow-md" />
              </div>
              
              <h3 className="relative z-10 font-pixel font-bold text-lg uppercase leading-none bg-white/80 p-1 mt-auto">
                {tape.title}
              </h3>
              <div className="relative z-10 flex justify-between items-end font-mono text-[10px] font-bold mt-1">
                 <span>NFT #88392</span>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
};

// --- Tipping / Private Message Board ---

interface TippingBoardProps {
  podcasts: Podcast[];
  isWalletConnected: boolean;
  onSendTip: (podcastId: string, amount: number, message: string) => void;
  sentMessages: TipMessage[];
  creatorReplies: CreatorReply[];
}

const TippingBoard: React.FC<TippingBoardProps> = ({ podcasts, isWalletConnected, onSendTip, sentMessages, creatorReplies }) => {
  const [selectedCreator, setSelectedCreator] = useState<Podcast | null>(null);
  const [tipAmount, setTipAmount] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [justSent, setJustSent] = useState<string | null>(null); // 刚发送成功的消息ID
  
  // Only show podcasts with tipping enabled
  const tippablePodcasts = podcasts.filter(p => p.tipEnabled);
  
  const handleSendTip = () => {
    if (!selectedCreator || !isWalletConnected) return;
    
    const amount = parseFloat(tipAmount);
    if (isNaN(amount) || amount < (selectedCreator.minTipAmount || 0)) {
      alert(`最低投币金额: ${selectedCreator.minTipAmount} USDC`);
      return;
    }
    
    if (!messageText.trim()) {
      alert('请输入留言内容');
      return;
    }
    
    onSendTip(selectedCreator.id, amount, messageText);
    setTipAmount('');
    setMessageText('');
    // 显示发送成功提示
    const msgId = Date.now().toString();
    setJustSent(msgId);
    setTimeout(() => setJustSent(null), 3000);
  };
  
  return (
    <div className="space-y-8">
      {/* Creator Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tippablePodcasts.map(podcast => (
          <div 
            key={podcast.id}
            onClick={() => setSelectedCreator(podcast)}
            className={`relative p-6 border-2 cursor-pointer transition-all duration-300 ${
              selectedCreator?.id === podcast.id 
                ? 'border-neonCyan bg-neonCyan/10 shadow-[0_0_30px_rgba(0,243,255,0.3)]' 
                : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
            }`}
          >
            {/* Selected indicator */}
            {selectedCreator?.id === podcast.id && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-neonCyan rounded-full animate-pulse"></div>
            )}
            
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full border-2 border-neonPurple overflow-hidden bg-black shadow-[0_0_15px_rgba(176,38,255,0.4)]">
                <img src={podcast.avatarUrl} alt={podcast.author} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-header text-lg mb-1">@{podcast.author}</h3>
                <p className="text-gray-400 text-sm font-pixel mb-2">{podcast.title}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-600 px-2 py-0.5 flex items-center gap-1">
                    <Coins size={10} /> 最低 {podcast.minTipAmount} USDC
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <MessageCircle size={10} /> 接受私信
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Tip Form */}
      {selectedCreator && (
        <div className="bg-gray-900/80 border-2 border-neonPurple p-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(176,38,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(176,38,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
              <MessageCircle size={24} className="text-neonPurple" />
              <h3 className="text-white font-header text-xl">向 @{selectedCreator.author} 投币私信</h3>
            </div>
            
            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-pixel mb-2">
                投币金额 (最低 {selectedCreator.minTipAmount} USDC)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder={`${selectedCreator.minTipAmount}`}
                    min={selectedCreator.minTipAmount}
                    step="0.01"
                    className="w-full bg-black border-2 border-gray-700 focus:border-neonCyan px-4 py-3 text-white font-mono text-lg outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neonCyan font-mono">USDC</span>
                </div>
                {/* Quick amount buttons */}
                <div className="flex gap-2">
                  {[0.1, 0.5, 1].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTipAmount(amt.toString())}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 text-gray-300 hover:border-neonCyan hover:text-neonCyan transition-colors font-mono text-sm"
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-pixel mb-2">
                留言内容
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="写下你想对博主说的话..."
                rows={4}
                maxLength={500}
                className="w-full bg-black border-2 border-gray-700 focus:border-neonCyan px-4 py-3 text-white font-pixel outline-none transition-colors resize-none"
              />
              <div className="text-right text-[10px] text-gray-500 mt-1">{messageText.length}/500</div>
            </div>
            
            {/* Send Button */}
            <PixelButton 
              onClick={handleSendTip} 
              variant="primary" 
              className="w-full py-4"
              disabled={!isWalletConnected}
            >
              <Send size={18} />
              {isWalletConnected ? `发送 ${tipAmount || '0'} USDC 并留言` : '请先连接钱包'}
            </PixelButton>
            
            {/* 发送成功提示 */}
            {justSent && (
              <div className="mt-4 p-4 bg-neonGreen/20 border-2 border-neonGreen text-neonGreen font-pixel text-center animate-pulse">
                <CheckCircle2 size={24} className="inline-block mr-2" />
                私信发送成功！博主会尽快回复您~
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Messages Section - Two Column Layout */}
      {(sentMessages.length > 0 || creatorReplies.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Left: Sent Messages History */}
          <div className="bg-gray-900/50 border-2 border-gray-700 p-6">
            <h3 className="text-white font-header text-lg mb-4 flex items-center gap-2 pb-3 border-b border-gray-700">
              <Send size={18} className="text-neonCyan" /> 已发送的私信
              <span className="ml-auto text-xs bg-neonCyan/20 text-neonCyan px-2 py-0.5 rounded-full">{sentMessages.length}</span>
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {sentMessages.length === 0 ? (
                <p className="text-gray-500 text-center py-8 font-pixel text-sm">暂无发送记录</p>
              ) : sentMessages.map(msg => {
                const podcast = podcasts.find(p => p.id === msg.podcastId);
                const hasReply = creatorReplies.some(r => r.tipMessageId === msg.id);
                return (
                  <div 
                    key={msg.id} 
                    className={`bg-black/50 border p-4 transition-all ${hasReply ? 'border-neonGreen' : 'border-gray-700'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-500" />
                        <span className="text-neonCyan font-mono text-sm">→ @{podcast?.author}</span>
                      </div>
                      <span className="text-yellow-400 font-mono text-xs bg-yellow-500/20 px-2 py-0.5">{msg.amount} USDC</span>
                    </div>
                    <p className="text-gray-300 font-pixel text-sm mb-2">{msg.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-600">{msg.timestamp.toLocaleString('zh-CN')}</span>
                      {hasReply && (
                        <span className="text-[10px] text-neonGreen flex items-center gap-1">
                          <CheckCircle2 size={10} /> 已回复
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right: Creator Replies */}
          <div className="bg-gray-900/50 border-2 border-neonPurple p-6">
            <h3 className="text-white font-header text-lg mb-4 flex items-center gap-2 pb-3 border-b border-gray-700">
              <MessageCircle size={18} className="text-neonPurple" /> 博主回复
              <span className="ml-auto text-xs bg-neonPurple/20 text-neonPurple px-2 py-0.5 rounded-full">{creatorReplies.length}</span>
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {creatorReplies.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle size={32} className="mx-auto mb-3 text-gray-600 animate-pulse" />
                  <p className="text-gray-500 font-pixel text-sm">等待博主回复中...</p>
                  <p className="text-gray-600 font-pixel text-xs mt-1">博主通常会在几分钟内回复</p>
                </div>
              ) : creatorReplies.map(reply => {
                const podcast = podcasts.find(p => p.id === reply.podcastId);
                const originalMsg = sentMessages.find(m => m.id === reply.tipMessageId);
                return (
                  <div key={reply.id} className="bg-neonPurple/10 border border-neonPurple/50 p-4 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-neonPurple/10 rounded-full blur-xl"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full border border-neonPurple overflow-hidden">
                          <img src={podcast?.avatarUrl} alt={reply.author} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-neonPurple font-header">@{reply.author}</span>
                        <span className="text-[10px] text-gray-500 ml-auto">{reply.timestamp.toLocaleString('zh-CN')}</span>
                      </div>
                      
                      <p className="text-white font-pixel text-sm mb-3 leading-relaxed">{reply.message}</p>
                      
                      {originalMsg && (
                        <div className="bg-black/30 border-l-2 border-gray-600 pl-3 py-2 text-xs text-gray-500">
                          <span className="text-gray-400">回复你的留言：</span>
                          <p className="truncate mt-1">"{originalMsg.message}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!selectedCreator && sentMessages.length === 0 && (
        <div className="text-center py-12 text-gray-500 font-pixel">
          <Coins size={48} className="mx-auto mb-4 opacity-30" />
          <p>选择一位博主开始投币私信</p>
          <p className="text-xs mt-2 text-gray-600">通过 X402 协议即时支付，直达创作者</p>
        </div>
      )}
    </div>
  );
};

// --- Profile Page Component ---

interface ProfilePageProps {
  isWalletConnected: boolean;
  walletAddress: string;
  finishedEpisodes: string[];
  unlockedEpisodes: string[];
  mintedCollections: string[];
  allPodcasts: Podcast[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  isWalletConnected, 
  walletAddress, 
  finishedEpisodes, 
  unlockedEpisodes, 
  mintedCollections,
  allPodcasts 
}) => {
  const [userName, setUserName] = useState('匿名用户');
  const [userBio, setUserBio] = useState('这个人很懒，什么都没写...');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editBio, setEditBio] = useState(userBio);
  
  // 生成基于钱包地址的头像
  const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${walletAddress || 'default'}&backgroundColor=0d1117`;
  
  // 收听记录统计
  const totalListened = finishedEpisodes.length;
  const totalUnlocked = unlockedEpisodes.length;
  const totalMinted = mintedCollections.length;
  
  // 获取收听过的播客详情
  const listenedPodcasts = allPodcasts.filter(podcast => 
    podcast.episodes.some(ep => finishedEpisodes.includes(ep.id))
  );
  
  const handleSaveProfile = () => {
    setUserName(editName);
    setUserBio(editBio);
    setIsEditing(false);
  };
  
  if (!isWalletConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center mb-6">
          <Wallet size={48} className="text-gray-600" />
        </div>
        <h3 className="text-2xl text-white font-header mb-3">请连接钱包</h3>
        <p className="text-gray-500 font-pixel text-sm mb-6">连接钱包后即可查看个人主页</p>
        <div className="flex items-center gap-2 text-neonCyan font-mono text-sm border border-neonCyan/50 px-4 py-2 bg-neonCyan/10">
          <Lock size={16} />
          使用钱包签名登录
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gray-900/80 border-2 border-neonGreen p-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-4 border-neonGreen shadow-[0_0_30px_rgba(57,255,20,0.4)] overflow-hidden bg-black">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] bg-neonGreen/20 text-neonGreen border border-neonGreen px-3 py-1">
              <Activity size={12} /> 已验证钱包
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm font-pixel mb-2">用户名</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={20}
                    className="w-full bg-black border-2 border-gray-700 focus:border-neonGreen px-4 py-2 text-white font-pixel outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-pixel mb-2">个人简介</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    maxLength={100}
                    rows={3}
                    className="w-full bg-black border-2 border-gray-700 focus:border-neonGreen px-4 py-2 text-white font-pixel outline-none transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <PixelButton onClick={handleSaveProfile} variant="primary" className="px-6">
                    <CheckCircle2 size={16} /> 保存
                  </PixelButton>
                  <PixelButton onClick={() => setIsEditing(false)} variant="secondary" className="px-6">
                    取消
                  </PixelButton>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-3">
                  <h2 className="text-3xl text-white font-header">{userName}</h2>
                  <button 
                    onClick={() => { setEditName(userName); setEditBio(userBio); setIsEditing(true); }}
                    className="text-gray-500 hover:text-neonGreen transition-colors"
                  >
                    <Settings size={18} />
                  </button>
                </div>
                
                <p className="text-gray-400 font-pixel mb-4">{userBio}</p>
                
                <div className="flex items-center gap-2 text-neonCyan font-mono text-sm mb-4">
                  <Wallet size={14} />
                  <span>{walletAddress}</span>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-black/50 border border-gray-700 p-4 text-center">
                    <div className="text-2xl text-neonCyan font-header">{totalListened}</div>
                    <div className="text-[10px] text-gray-500 font-pixel mt-1">已收听</div>
                  </div>
                  <div className="bg-black/50 border border-gray-700 p-4 text-center">
                    <div className="text-2xl text-yellow-400 font-header">{totalUnlocked}</div>
                    <div className="text-[10px] text-gray-500 font-pixel mt-1">已解锁</div>
                  </div>
                  <div className="bg-black/50 border border-gray-700 p-4 text-center">
                    <div className="text-2xl text-neonPink font-header">{totalMinted}</div>
                    <div className="text-[10px] text-gray-500 font-pixel mt-1">NFT馆藏</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Listening History */}
      <div className="bg-gray-900/50 border-2 border-gray-700 p-6">
        <h3 className="text-white font-header text-xl mb-6 flex items-center gap-3 pb-4 border-b border-gray-700">
          <Headphones size={22} className="text-neonCyan" /> 收听记录
          <span className="ml-auto text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full font-mono">
            {totalListened} 集
          </span>
        </h3>
        
        {listenedPodcasts.length === 0 ? (
          <div className="text-center py-12">
            <Disc size={48} className="mx-auto mb-4 text-gray-700 animate-spin" style={{ animationDuration: '8s' }} />
            <p className="text-gray-500 font-pixel">暂无收听记录</p>
            <p className="text-gray-600 font-pixel text-xs mt-2">开始探索电台，发现好内容~</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listenedPodcasts.map(podcast => {
              const listenedEps = podcast.episodes.filter(ep => finishedEpisodes.includes(ep.id));
              const progress = (listenedEps.length / podcast.episodes.length) * 100;
              const isMinted = mintedCollections.includes(podcast.id);
              
              return (
                <div key={podcast.id} className="bg-black/50 border border-gray-800 p-4 flex gap-4 hover:border-gray-600 transition-colors">
                  {/* Cover */}
                  <div className="w-20 h-20 bg-gray-800 overflow-hidden flex-shrink-0">
                    <img src={podcast.coverUrl} alt={podcast.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-white font-header truncate">{podcast.title}</h4>
                      {isMinted && (
                        <span className="text-[10px] bg-neonPink/20 text-neonPink border border-neonPink px-2 py-0.5 flex-shrink-0">
                          NFT
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs font-pixel mb-3">@{podcast.author}</p>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-neonCyan to-neonGreen transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {listenedEps.length}/{podcast.episodes.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Wallet Activity */}
      <div className="bg-gray-900/50 border-2 border-gray-700 p-6">
        <h3 className="text-white font-header text-xl mb-6 flex items-center gap-3 pb-4 border-b border-gray-700">
          <Activity size={22} className="text-neonPurple" /> 链上活动
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/50 border border-neonCyan/30 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neonCyan/20 border border-neonCyan flex items-center justify-center">
              <Zap size={20} className="text-neonCyan" />
            </div>
            <div>
              <div className="text-white font-pixel text-sm">X402 支付协议</div>
              <div className="text-[10px] text-gray-500 mt-1">即时微支付 · 低Gas费</div>
            </div>
            <div className="ml-auto text-neonGreen text-xs font-mono">已启用</div>
          </div>
          
          <div className="bg-black/50 border border-neonPurple/30 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neonPurple/20 border border-neonPurple flex items-center justify-center">
              <Landmark size={20} className="text-neonPurple" />
            </div>
            <div>
              <div className="text-white font-pixel text-sm">NFT 铸造</div>
              <div className="text-[10px] text-gray-500 mt-1">收藏证明 · 永久存证</div>
            </div>
            <div className="ml-auto text-yellow-400 text-xs font-mono">{totalMinted} 个</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Shell ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('discovery');
  
  // 使用 wagmi 钱包连接状态
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const isCorrectNetwork = chainId === baseSepolia.id;
  const isWalletConnected = isConnected && isCorrectNetwork;
  
  // 钱包弹窗状态
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // Navigation State
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null); // For Detail View
  const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null); // For Player Modal
  
  // Data State
  const [mintedCollections, setMintedCollections] = useState<string[]>([]); // Array of Podcast IDs
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]); // Array of Episode IDs
  const [finishedItems, setFinishedItems] = useState<string[]>([]); // Array of Episode IDs (Played)
  const [sentTipMessages, setSentTipMessages] = useState<TipMessage[]>([]); // Tip messages sent
  const [creatorReplies, setCreatorReplies] = useState<CreatorReply[]>([]); // Creator replies

  // Transaction State - 铸造NFT用长动画
  const [pendingMint, setPendingMint] = useState<{
    title: string;
    onComplete: () => void;
  } | null>(null);
  
  // Quick Payment State - X402即时支付用快速反馈
  const [quickPayment, setQuickPayment] = useState<{
    message: string;
    onComplete: () => void;
  } | null>(null);

  // -- Actions --

  const handleUnlockEpisode = (epId: string, price: number) => {
    if (!isWalletConnected) {
      setShowWalletModal(true);
      return;
    }
    // X402 即时支付 - 快速反馈
    setQuickPayment({
      message: `已解锁单集 · ${price} USDC`,
      onComplete: () => setUnlockedItems(prev => [...prev, epId])
    });
  };

  const handleUnlockBundle = (podcast: Podcast) => {
    if (!isWalletConnected) {
      setShowWalletModal(true);
      return;
    }
    const paidEps = podcast.episodes.filter(e => !e.isFree);
    const remainingPaidEps = paidEps.filter(e => !unlockedItems.includes(e.id));
    const bundlePrice = (remainingPaidEps.length * podcast.basePrice * 0.9).toFixed(3);
    // X402 即时支付 - 快速反馈
    setQuickPayment({
      message: `已解锁『${podcast.title}』${remainingPaidEps.length === paidEps.length ? '全集' : `剩余${remainingPaidEps.length}集`} · ${bundlePrice} USDC`,
      onComplete: () => {
        const newIds = remainingPaidEps.map(e => e.id);
        setUnlockedItems(prev => [...new Set([...prev, ...newIds])]);
      }
    });
  };

  const handleMintNFT = (podcastId: string) => {
    if (!isWalletConnected) {
       setShowWalletModal(true);
       return;
    }
    // 铸造NFT - 使用炫酷长动画
    setPendingMint({
      title: `铸造收藏品 #${podcastId}`,
      onComplete: () => setMintedCollections(prev => [...prev, podcastId])
    });
  };

  const handleEpisodeFinish = () => {
     if (playingEpisode) {
        setFinishedItems(prev => {
            if (prev.includes(playingEpisode.id)) return prev;
            return [...prev, playingEpisode.id];
        });
     }
  };

  // 投币私信处理
  const handleSendTip = (podcastId: string, amount: number, message: string) => {
    if (!isWalletConnected) {
      setShowWalletModal(true);
      return;
    }
    
    const podcast = MOCK_PODCASTS.find(p => p.id === podcastId);
    const messageId = `tip-${Date.now()}`;
    
    // X402 即时支付
    setQuickPayment({
      message: `已向 @${podcast?.author} 投币 ${amount} USDC`,
      onComplete: () => {
        const newMessage: TipMessage = {
          id: messageId,
          podcastId,
          author: '0x71C...92F',
          amount,
          message,
          timestamp: new Date()
        };
        setSentTipMessages(prev => [newMessage, ...prev]);
        
        // 模拟博主回复 (3-5秒后)
        setTimeout(() => {
          const replies = [
            "感谢你的支持！🎉 会继续努力更新的~",
            "收到！你的留言我会认真看的 ❤️",
            "太感动了！谢谢你的投币 🙏",
            "哇，收到你的私信了！感谢支持！",
            "谢谢！有什么想听的内容可以告诉我~"
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          
          const newReply: CreatorReply = {
            id: `reply-${Date.now()}`,
            tipMessageId: messageId,
            podcastId,
            author: podcast?.author || '未知博主',
            message: randomReply,
            timestamp: new Date()
          };
          setCreatorReplies(prev => [newReply, ...prev]);
        }, 3000 + Math.random() * 2000);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto border-x border-retroGray shadow-2xl bg-void bg-[size:40px_40px] bg-grid-pattern relative">
      <div className="scanlines"></div>
      
      {/* Quick Payment Toast - X402 即时支付 */}
      {quickPayment && (
        <PaymentToast 
          message={quickPayment.message}
          onComplete={() => {
            quickPayment.onComplete();
            setQuickPayment(null);
          }} 
        />
      )}
      
      {/* Mint NFT Animation - 铸造动画 */}
      {pendingMint && (
        <TransactionModal 
          title={pendingMint.title}
          onComplete={() => {
            pendingMint.onComplete();
            setPendingMint(null);
          }} 
        />
      )}
      
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-void/95 border-b md:border-b-0 md:border-r border-retroGray p-6 flex flex-col sticky top-0 z-40 h-auto md:h-screen backdrop-blur-sm">
        <LogoWidget />

        <nav className="flex-1 space-y-6 relative z-20 mt-4">
          <button 
            onClick={() => { setView('discovery'); setSelectedPodcast(null); }}
            className={`group w-full text-left px-5 py-4 font-header text-lg tracking-wider border-2 transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${view === 'discovery' ? 'bg-neonCyan/20 border-neonCyan text-neonCyan shadow-[0_0_25px_rgba(0,243,255,0.3)]' : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 hover:bg-gray-800'}`}
          >
            <div className={`absolute inset-0 bg-neonCyan/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${view === 'discovery' ? 'animate-pulse' : ''}`}></div>
            <Radio size={24} className={`relative z-10 transition-transform ${view === 'discovery' ? 'animate-bounce' : 'group-hover:scale-110'}`} /> 
            <span className="relative z-10">发现信号</span>
          </button>
          
          <button 
            onClick={() => { setView('collection'); setSelectedPodcast(null); }}
            className={`group w-full text-left px-5 py-4 font-header text-lg tracking-wider border-2 transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${view === 'collection' ? 'bg-neonPink/20 border-neonPink text-neonPink shadow-[0_0_25px_rgba(255,0,60,0.3)]' : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 hover:bg-gray-800'}`}
          >
            <div className={`absolute inset-0 bg-neonPink/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${view === 'collection' ? 'animate-pulse' : ''}`}></div>
            <Landmark size={24} className={`relative z-10 transition-transform ${view === 'collection' ? 'animate-bounce' : 'group-hover:scale-110'}`} /> 
            <span className="relative z-10">留声博物馆</span>
          </button>
          
          <button 
            onClick={() => { setView('tipping'); setSelectedPodcast(null); }}
            className={`group w-full text-left px-5 py-4 font-header text-lg tracking-wider border-2 transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${view === 'tipping' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.3)]' : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 hover:bg-gray-800'}`}
          >
            <div className={`absolute inset-0 bg-yellow-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${view === 'tipping' ? 'animate-pulse' : ''}`}></div>
            <Coins size={24} className={`relative z-10 transition-transform ${view === 'tipping' ? 'animate-bounce' : 'group-hover:scale-110'}`} /> 
            <span className="relative z-10">投币私信</span>
          </button>
          
          <button 
            onClick={() => { setView('profile'); setSelectedPodcast(null); }}
            className={`group w-full text-left px-5 py-4 font-header text-lg tracking-wider border-2 transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${view === 'profile' ? 'bg-neonGreen/20 border-neonGreen text-neonGreen shadow-[0_0_25px_rgba(57,255,20,0.3)]' : 'bg-gray-900/40 border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 hover:bg-gray-800'}`}
          >
            <div className={`absolute inset-0 bg-neonGreen/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ${view === 'profile' ? 'animate-pulse' : ''}`}></div>
            <User size={24} className={`relative z-10 transition-transform ${view === 'profile' ? 'animate-bounce' : 'group-hover:scale-110'}`} /> 
            <span className="relative z-10">个人主页</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-dashed border-gray-800 relative z-20">
          {!isConnected ? (
            <PixelButton onClick={() => setShowWalletModal(true)} variant="primary" className="w-full text-sm">
               <Wallet size={16} /> 连接钱包
            </PixelButton>
          ) : (
             <div className={`border ${isCorrectNetwork ? 'border-neonCyan/50' : 'border-yellow-500/50'} bg-black/50 p-3 text-center backdrop-blur-md cursor-pointer hover:bg-black/70 transition-colors`} onClick={() => setShowWalletModal(true)}>
               <p className={`text-[10px] font-pixel mb-1 tracking-widest ${isCorrectNetwork ? 'text-neonCyan' : 'text-yellow-400'}`}>
                 {isCorrectNetwork ? '网络: BASE SEPOLIA' : '⚠ 请切换网络'}
               </p>
               <div className="flex justify-between items-center mt-2">
                 <p className="text-white text-xs font-mono truncate">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                 <span className="text-green-400 text-xs font-mono">已连接</span>
               </div>
             </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-10">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-12 border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-4xl text-white font-header mb-2 glitch-text uppercase">
              {view === 'discovery' ? (
                <>最新电台 /// <span className="text-neonCyan animate-pulse">X402</span></>
              ) : view === 'collection' ? (
                <>留声博物馆 /// <span className="text-red-500 animate-pulse-slow drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">NFT馆藏</span></>
              ) : view === 'tipping' ? (
                <>投币私信 /// <span className="text-yellow-400 animate-pulse drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">直达创作者</span></>
              ) : (
                <>个人主页 /// <span className="text-neonGreen animate-pulse drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">钱包身份</span></>
              )}
            </h2>
            <div className="h-1 w-20 bg-neonPurple"></div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-500 font-mono border border-gray-800 px-3 py-1 rounded-full">
             <div className="w-2 h-2 rounded-full bg-neonGreen animate-pulse bg-green-500"></div>
             <span>系统运行正常</span>
          </div>
        </header>

        {/* Content Grid */}
        {view === 'discovery' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PODCASTS.map(podcast => (
              <PodcastCard 
                key={podcast.id} 
                data={podcast} 
                onClick={() => setSelectedPodcast(podcast)} 
              />
            ))}
          </div>
        ) : view === 'collection' ? (
          <Museum 
            collectedIds={mintedCollections} 
            allPodcasts={MOCK_PODCASTS} 
            onViewCollection={(p) => setSelectedPodcast(p)} 
          />
        ) : view === 'tipping' ? (
          <TippingBoard 
            podcasts={MOCK_PODCASTS.filter(p => p.tipEnabled)}
            isWalletConnected={isWalletConnected}
            onSendTip={handleSendTip}
            sentMessages={sentTipMessages}
            creatorReplies={creatorReplies}
          />
        ) : (
          <ProfilePage 
            isWalletConnected={isWalletConnected}
            walletAddress={address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
            finishedEpisodes={finishedItems}
            unlockedEpisodes={unlockedItems}
            mintedCollections={mintedCollections}
            allPodcasts={MOCK_PODCASTS}
          />
        )}
      </main>

      {/* Detail Overlay */}
      {selectedPodcast && (
        <CollectionDetail 
           podcast={selectedPodcast}
           onClose={() => setSelectedPodcast(null)}
           onPlayEpisode={(ep) => setPlayingEpisode(ep)}
           unlockedEpisodeIds={unlockedItems}
           finishedEpisodeIds={finishedItems}
           unlockEpisode={handleUnlockEpisode}
           unlockBundle={() => handleUnlockBundle(selectedPodcast)}
           mintNFT={() => handleMintNFT(selectedPodcast.id)}
           isMinted={mintedCollections.includes(selectedPodcast.id)}
        />
      )}

      {/* Player Overlay (on top of detail) */}
      {selectedPodcast && playingEpisode && (
        <PlayerModal 
          episode={playingEpisode}
          podcast={selectedPodcast}
          onClose={() => setPlayingEpisode(null)}
          onFinish={handleEpisodeFinish}
        />
      )}

      {/* Wallet Connect Modal */}
      <WalletModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
      />

    </div>
  );
};

export default App;