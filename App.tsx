import React, { useState, useEffect, useRef } from 'react';
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
  Hourglass
} from 'lucide-react';
import { Podcast, ViewState, PlayerState, Episode } from './types';
import { MOCK_PODCASTS } from './constants';

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

// --- Transaction Animation Modal ---

const TransactionModal: React.FC<{ 
  onComplete: () => void; 
  title: string;
}> = ({ onComplete, title }) => {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

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
      "INITIALIZING_HANDSHAKE...",
      "VERIFYING_SIGNATURE_0x89A...",
      "CONNECTING_TO_MAINNET...",
      "ALLOCATING_BLOCK_SPACE...",
      "MINING_NONCE_#8839...",
      "GENERATING_ASSET_METADATA...",
      "UPLOADING_TO_IPFS...",
      "CONFIRMING_TRANSACTION...",
      "CONTRACT_INTERACTION_OK..."
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
    const s3 = setTimeout(() => { setStep(3); setProgress(100); }, 5000); // Done
    const s4 = setTimeout(onComplete, 6500); // Close

    return () => {
      [s1, s2, s3, s4].forEach(clearTimeout);
      clearInterval(logInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md font-mono perspective-1000">
      <div className="relative w-full max-w-md bg-gray-900 border-2 border-neonGreen shadow-[0_0_100px_rgba(0,255,0,0.2)] p-1 overflow-hidden transition-all duration-500 transform hover:scale-[1.01]">
         
         {/* Background Grid Animation */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/10 to-green-900/30 pointer-events-none"></div>

         {/* Decorative Corners */}
         <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white z-20"></div>
         <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white z-20"></div>
         <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white z-20"></div>
         <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white z-20"></div>
         
         {/* Header */}
         <div className="relative z-10 bg-green-900/40 p-3 border-b border-green-700 flex justify-between items-center mb-6">
           <div className="flex items-center gap-2 text-neonGreen text-xs tracking-widest font-bold animate-pulse">
             <Terminal size={14} /> SMART_CONTRACT.EXE
           </div>
           <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           </div>
         </div>
         
         {/* Main Content */}
         <div className="relative z-10 px-8 pb-8">
            
            {/* Visual Centerpiece */}
            <div className="h-40 flex items-center justify-center mb-6 relative">
               {/* Rings */}
               <div className={`absolute w-32 h-32 border-[1px] border-green-500/30 rounded-full ${step < 3 ? 'animate-ping' : 'opacity-0'}`}></div>
               <div className={`absolute w-28 h-28 border-2 border-t-neonGreen border-r-transparent border-b-neonGreen border-l-transparent rounded-full transition-all duration-1000 ${step < 3 ? 'animate-spin' : 'scale-150 opacity-0'}`}></div>
               <div className={`absolute w-20 h-20 border border-dashed border-green-400 rounded-full transition-all duration-1000 ${step < 3 ? 'animate-spin-slow' : 'scale-0'}`}></div>
               
               {/* Center Icon Morphing */}
               <div className="relative z-10 transition-all duration-500 transform">
                  {step === 0 && <Box size={48} className="text-gray-500 animate-pulse" />}
                  {step === 1 && <Layers size={56} className="text-neonGreen animate-bounce" />}
                  {step === 2 && <Cpu size={64} className="text-white glitch-text" />}
                  {step === 3 && (
                    <div className="relative animate-pixel-jump">
                        <div className="absolute inset-0 bg-neonGreen blur-xl opacity-50"></div>
                        <BadgeCheck size={80} className="text-neonGreen relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,1)]" />
                    </div>
                  )}
               </div>
            </div>

            {/* Title & Progress */}
            <div className="mb-6 text-center">
               <h3 className="text-white font-header text-xl mb-2 tracking-wide uppercase">{step === 3 ? 'ASSET MINTED SUCCESSFULLY' : title}</h3>
               <div className="w-full h-4 bg-gray-800 border border-gray-600 relative overflow-hidden group">
                  <div 
                    className={`h-full bg-neonGreen shadow-[0_0_15px_#00ff00] transition-all duration-200 relative`} 
                    style={{ width: `${progress}%` }}
                  >
                     <div className="absolute right-0 top-0 h-full w-1 bg-white animate-pulse"></div>
                  </div>
                  {/* Progress Stripes */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.5)_25%,rgba(0,0,0,0.5)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.5)_75%,rgba(0,0,0,0.5))] bg-[length:10px_10px] opacity-30"></div>
               </div>
               <div className="flex justify-between text-[10px] font-mono text-green-400 mt-1">
                  <span>BLOCK: #182934</span>
                  <span>{Math.floor(progress)}%</span>
               </div>
            </div>

            {/* Terminal Logs */}
            <div className="bg-black/60 p-3 h-28 overflow-hidden border border-green-800/50 font-pixel text-green-400 text-sm shadow-inner relative">
               <div className="absolute top-0 right-0 p-1 opacity-50 text-[10px]">LOG_OUTPUT</div>
               <div className="space-y-1">
                 {logs.map((log, i) => (
                    <div key={i} className={`truncate ${i === 0 ? 'text-white font-bold' : 'opacity-70'}`}>
                       {log}
                    </div>
                 ))}
               </div>
            </div>

            {step === 3 && (
               <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1 bg-white absolute top-1/2 animate-ping"></div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

// --- Cool Logo Widget (Enhanced but resized) ---

const LogoWidget: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 mb-10 select-none mt-2">
       <div className="flex items-center gap-4">
          {/* Animated Icon Container */}
          <div className="relative w-16 h-16 bg-black border-2 border-neonCyan shadow-[0_0_20px_rgba(0,243,255,0.5)] flex items-center justify-center overflow-hidden group rounded-sm">
              <Disc size={40} className="text-neonCyan animate-spin-slow group-hover:animate-spin" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10"></div>
          </div>
          
          <div>
            <h1 className="text-5xl font-header text-white italic tracking-tighter drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]" style={{ textShadow: '3px 3px 0px #b026ff' }}>
              留<span className="text-neonCyan drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" style={{ textShadow: '3px 3px 0px #00f3ff' }}>声机</span>
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

// --- Podcast Card (Flip Effect) ---

const PodcastCard: React.FC<{ data: Podcast; onClick: () => void }> = ({ data, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative h-96 w-full perspective-1000 cursor-pointer mb-8"
    >
      {/* Inner Container that Flips */}
      <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
        
        {/* FRONT SIDE */}
        <div className="absolute w-full h-full backface-hidden bg-panel border-2 border-retroGray shadow-[8px_8px_0px_0px_#000] group-hover:shadow-[8px_8px_0px_0px_#00f3ff] transition-shadow">
          {/* Image Container */}
          <div className="relative h-64 w-full overflow-hidden border-b-2 border-retroGray">
            <img 
              src={data.coverUrl} 
              alt={data.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            {/* Episode Count Badge */}
            <div className="absolute top-2 right-2 bg-black/80 border border-neonCyan backdrop-blur-md px-3 py-1 flex items-center gap-1">
              <List size={12} className="text-neonCyan" />
              <span className="text-neonCyan text-xs font-bold font-mono">全 {data.episodes.length} 集</span>
            </div>

             {/* Title Overlay */}
             <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-xl font-header leading-tight drop-shadow-md">{data.title}</h3>
             </div>
          </div>
          
          <div className="p-4 bg-void relative">
            <div className="flex justify-between items-center mb-2">
               <div className="text-xs text-neonPurple font-mono">加密数字合集</div>
               <div className="flex items-center gap-1 text-gray-500">
                  <Headphones size={12} /> <span className="text-xs font-pixel">{data.listens}</span>
               </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.tags.map(t => <Tag key={t} label={t} />)}
            </div>
          </div>
        </div>

        {/* BACK SIDE (Avatar & Info) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-black border-2 border-neonCyan shadow-[0_0_20px_rgba(0,243,255,0.3)] p-6 flex flex-col items-center justify-center text-center overflow-hidden">
           {/* Grid BG */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
           
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-neonPurple mb-4 overflow-hidden bg-gray-900 shadow-[0_0_25px_#b026ff] group-hover:scale-110 transition-transform duration-500">
                 <img src={data.avatarUrl} className="w-full h-full object-contain bg-black" alt="Avatar" />
              </div>
              
              <h4 className="text-neonCyan font-header text-xl mb-1">@{data.author}</h4>
              <p className="text-gray-400 text-xs font-pixel mb-6 tracking-widest">Web3 信号源 /// ID: {data.id.padStart(4, '0')}</p>
              
              <button className="px-6 py-2 bg-neonCyan text-black font-bold font-header hover:bg-white transition-colors flex items-center gap-2 mx-auto uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_#fff]">
                 <List size={14} fill="black" /> 访问频段
              </button>
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
  const totalPrice = paidEpisodes.length * podcast.basePrice;
  const bundlePrice = (totalPrice * 0.9).toFixed(3);
  
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
                        <p className="text-neonCyan font-mono text-xs mt-2 tracking-widest">{listenProgress}% SYNCED</p>
                    </div>
                )
             ) : (
                <div className="bg-gray-800 p-4 border border-gray-700">
                   <div className="flex justify-between items-center mb-2 text-gray-300 text-xs font-mono">
                      <span>单集总价:</span>
                      <span className="line-through">{totalPrice.toFixed(2)} USDC</span>
                   </div>
                   <div className="flex justify-between items-center mb-4 text-neonCyan font-header">
                      <span>打包优惠 (9折):</span>
                      <span className="text-xl">{bundlePrice} USDC</span>
                   </div>
                   <PixelButton onClick={unlockBundle} variant="secondary" className="w-full">
                      <Package size={18} /> 购买整套合集
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
                                <span className="text-[10px] text-gray-500 border border-gray-700 px-1">{ep.duration} MIN</span>
                                {ep.isFree && <span className="text-[10px] bg-neonGreen/20 text-green-400 border border-green-900 px-1">FREE</span>}
                                {isPlayed && <span className="text-[10px] bg-green-900/40 text-green-400 border border-green-700 px-1 flex items-center gap-1"><CheckCircle2 size={8}/> PLAYED</span>}
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
  const progressRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset progress when episode changes
    setProgress(0);
    setPlayerState('playing');
  }, [episode]);

  useEffect(() => {
    if (playerState === 'playing') {
      progressRef.current = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setPlayerState('finished');
            onFinish(); // Notify completion
            return 100;
          }
          // Speed up for demo purposes: 100 / (duration * 0.5)
          // Adjust speed for demo
          return p + 0.5; 
        });
      }, 50);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [playerState, episode.duration, onFinish]);

  const togglePlay = () => {
    if (playerState === 'playing') setPlayerState('paused');
    else if (playerState === 'paused') setPlayerState('playing');
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
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
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
               <p className="text-[10px] text-gray-500 font-mono">DOLBY NR [ON]</p>
            </div>
          </div>

          {/* Controls */}
          <div className="relative z-10 space-y-4">
            <div className="relative w-full h-4 bg-gray-800 border border-gray-600 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-gradient-to-r from-neonPurple to-neonCyan transition-all duration-100 relative"
                  style={{ width: `${progress}%` }}
               >
                   <div className="absolute right-0 top-0 h-full w-1 bg-white shadow-[0_0_10px_#fff]"></div>
               </div>
            </div>

            <div className="flex justify-center gap-6">
                <div className="flex gap-4 w-full">
                  <PixelButton onClick={togglePlay} variant="primary" className="flex-1">
                    {playerState === 'playing' ? <Pause size={20} /> : playerState === 'finished' ? <CheckCircle2 size={20} /> : <Play size={20} />}
                  </PixelButton>
                  <PixelButton variant="ghost" className="flex-1">
                     <Heart size={20} /> 
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

// --- Main App Shell ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('discovery');
  
  // Navigation State
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null); // For Detail View
  const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null); // For Player Modal
  
  // Data State
  const [mintedCollections, setMintedCollections] = useState<string[]>([]); // Array of Podcast IDs
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]); // Array of Episode IDs
  const [finishedItems, setFinishedItems] = useState<string[]>([]); // Array of Episode IDs (Played)
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Transaction State
  const [pendingTx, setPendingTx] = useState<{
    title: string;
    onComplete: () => void;
  } | null>(null);

  // -- Actions --

  const handleUnlockEpisode = (epId: string, price: number) => {
    if (!isWalletConnected) {
      alert("请先连接钱包！");
      return;
    }
    setPendingTx({
      title: `UNLOCK EPISODE ${epId}`,
      onComplete: () => setUnlockedItems(prev => [...prev, epId])
    });
  };

  const handleUnlockBundle = (podcast: Podcast) => {
    if (!isWalletConnected) {
      alert("请先连接钱包！");
      return;
    }
    const paidEps = podcast.episodes.filter(e => !e.isFree);
    setPendingTx({
      title: `UNLOCK BUNDLE: ${podcast.title}`,
      onComplete: () => {
        const newIds = paidEps.map(e => e.id);
        setUnlockedItems(prev => [...new Set([...prev, ...newIds])]);
      }
    });
  };

  const handleMintNFT = (podcastId: string) => {
    if (!isWalletConnected) {
       alert("请先连接钱包！");
       return;
    }
    setPendingTx({
      title: `MINT NFT: COLLECTION #${podcastId}`,
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto border-x border-retroGray shadow-2xl bg-void bg-[size:40px_40px] bg-grid-pattern relative">
      <div className="scanlines"></div>
      
      {/* Transaction Overlay */}
      {pendingTx && (
        <TransactionModal 
          title={pendingTx.title}
          onComplete={() => {
            pendingTx.onComplete();
            setPendingTx(null);
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
        </nav>

        <div className="mt-auto pt-6 border-t border-dashed border-gray-800 relative z-20">
          {!isWalletConnected ? (
            <PixelButton onClick={() => setIsWalletConnected(true)} variant="primary" className="w-full text-sm">
               <Wallet size={16} /> 连接钱包
            </PixelButton>
          ) : (
             <div className="border border-neonCyan/50 bg-black/50 p-3 text-center backdrop-blur-md">
               <p className="text-neonCyan text-[10px] font-pixel mb-1 tracking-widest">网络: ETHEREUM</p>
               <div className="flex justify-between items-center mt-2">
                 <p className="text-white text-xs font-mono truncate">0x71C...92F</p>
                 <span className="text-green-400 text-xs font-mono">1200 USDC</span>
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
              ) : (
                '留声博物馆 /// 馆藏'
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
        ) : (
          <Museum 
            collectedIds={mintedCollections} 
            allPodcasts={MOCK_PODCASTS} 
            onViewCollection={(p) => setSelectedPodcast(p)} 
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

    </div>
  );
};

export default App;