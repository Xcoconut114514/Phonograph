import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Lock, 
  Disc, 
  Radio, 
  Headphones, 
  Library, 
  X, 
  Zap, 
  Heart,
  Share2,
  Wallet,
  Landmark,
  Activity
} from 'lucide-react';
import { Podcast, ViewState, PlayerState } from './types';
import { MOCK_PODCASTS } from './constants';

// --- Shared Components ---

const PixelButton: React.FC<{ 
  onClick?: () => void; 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = "relative px-4 py-2 font-header text-sm tracking-wider uppercase transition-all active:translate-y-1 active:translate-x-1 border-2 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const variants = {
    primary: "bg-neonPurple text-white border-white shadow-[4px_4px_0px_0px_#fff] hover:bg-white hover:text-neonPurple hover:shadow-[4px_4px_0px_0px_#b026ff]",
    secondary: "bg-neonCyan text-black border-white shadow-[4px_4px_0px_0px_#fff] hover:bg-white hover:text-neonCyan",
    danger: "bg-neonPink text-white border-white shadow-[4px_4px_0px_0px_#fff] hover:bg-pink-600",
    ghost: "bg-transparent text-gray-300 border-gray-600 hover:border-neonCyan hover:text-neonCyan hover:shadow-[0_0_10px_#00f3ff]"
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

// --- Cool Logo Widget ---

const LogoWidget: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 mb-10 select-none">
       <div className="flex items-center gap-4">
          {/* Animated Icon Container */}
          <div className="relative w-14 h-14 bg-black border-2 border-neonCyan shadow-[0_0_15px_rgba(0,243,255,0.4)] flex items-center justify-center overflow-hidden group">
              <Disc size={32} className="text-neonCyan animate-spin-slow group-hover:animate-spin" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10"></div>
          </div>
          
          <div>
            <h1 className="text-3xl font-header text-white italic tracking-tighter" style={{ textShadow: '2px 2px #b026ff' }}>
              PHONO<span className="text-neonCyan">GRAPH</span>
            </h1>
            <div className="flex items-center gap-1 mt-1">
               <div className="text-[10px] text-gray-400 font-pixel">AUDIO PROTOCOL</div>
               {/* Equalizer Animation */}
               <div className="flex items-end gap-[2px] h-4 ml-2">
                  <div className="bar bg-neonPurple"></div>
                  <div className="bar bg-neonCyan"></div>
                  <div className="bar bg-neonPink"></div>
                  <div className="bar bg-white"></div>
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
            
            {/* Price Badge */}
            <div className="absolute top-2 right-2 bg-black/80 border border-neonCyan backdrop-blur-md px-3 py-1 flex items-center gap-1">
              <Lock size={12} className="text-neonCyan" />
              <span className="text-neonCyan text-xs font-bold font-mono">{data.price} ETH</span>
            </div>

             {/* Title Overlay */}
             <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-xl font-header leading-tight drop-shadow-md">{data.title}</h3>
             </div>
          </div>
          
          <div className="p-4 bg-void relative">
            <div className="flex justify-between items-center mb-2">
               <div className="text-xs text-neonPurple font-mono">ENCRYPTED TAPE</div>
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
           
           <div className="relative z-10">
              <div className="w-24 h-24 rounded-full border-4 border-neonPurple mx-auto mb-4 overflow-hidden bg-gray-900 shadow-[0_0_15px_#b026ff]">
                 <img src={data.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
              </div>
              
              <h4 className="text-neonCyan font-header text-lg mb-1">@{data.author}</h4>
              <p className="text-gray-400 text-xs font-pixel mb-6">Web3 Content Creator</p>
              
              <button className="px-6 py-2 bg-neonCyan text-black font-bold font-header hover:bg-white transition-colors flex items-center gap-2 mx-auto">
                 <Play size={16} fill="black" /> LISTEN NOW
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Cassette Player Modal ---

interface PlayerProps {
  podcast: Podcast;
  onClose: () => void;
  addToCollection: (id: string) => void;
  isCollected: boolean;
}

const PlayerModal: React.FC<PlayerProps> = ({ podcast, onClose, addToCollection, isCollected }) => {
  const [playerState, setPlayerState] = useState<PlayerState>(isCollected ? 'paused' : 'locked');
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number | null>(null);

  useEffect(() => {
    if (playerState === 'playing') {
      progressRef.current = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            setPlayerState('finished');
            return 100;
          }
          return p + (100 / (podcast.duration * 10)); 
        });
      }, 100);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [playerState, podcast.duration]);

  const handleUnlock = () => {
    setTimeout(() => {
      setPlayerState('playing');
    }, 800);
  };

  const handleMint = () => {
    addToCollection(podcast.id);
    onClose();
  };

  const togglePlay = () => {
    if (playerState === 'playing') setPlayerState('paused');
    else if (playerState === 'paused') setPlayerState('playing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-panel border-2 border-neonPurple shadow-[0_0_40px_rgba(176,38,255,0.4)] p-1">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center bg-black p-3 mb-1 border-b border-neonPurple/30">
          <div className="flex items-center gap-2">
             <Activity className="text-neonPurple animate-pulse" size={16} />
             <span className="text-neonPurple font-pixel tracking-widest text-sm">NOW PLAYING PROTOCOL</span>
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
                      {playerState === 'locked' ? (
                          <span className="text-neonPink font-pixel text-[10px] animate-pulse">LOCKED</span>
                      ) : (
                          <div className="w-full flex gap-[2px]">
                              <div className={`h-full w-full bg-white/20 ${playerState === 'playing' ? 'animate-pulse' : ''}`}></div>
                          </div>
                      )}
                  </div>

                  {/* Right Reel */}
                  <div className={`w-12 h-12 rounded-full border-4 border-white bg-black flex items-center justify-center ${playerState === 'playing' ? 'animate-spin' : ''}`}>
                     <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                  </div>
               </div>
            </div>
            <div className="mt-2 text-center">
               <h3 className="text-white font-header text-sm tracking-wide">{podcast.title}</h3>
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
              {playerState === 'locked' ? (
                <PixelButton onClick={handleUnlock} variant="secondary" className="w-full">
                   <Zap size={16} /> UNLOCK ({podcast.price} ETH)
                </PixelButton>
              ) : playerState === 'finished' ? (
                <PixelButton onClick={handleMint} variant="primary" className="w-full">
                   <Disc size={16} /> COLLECT TO MUSEUM
                </PixelButton>
              ) : (
                <div className="flex gap-4 w-full">
                  <PixelButton onClick={togglePlay} variant="primary" className="flex-1">
                    {playerState === 'playing' ? <Pause size={20} /> : <Play size={20} />}
                  </PixelButton>
                  <PixelButton variant="ghost" className="flex-1">
                     <Heart size={20} /> 
                  </PixelButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Collection View (Museum) ---

const Museum: React.FC<{ collectedIds: string[]; allPodcasts: Podcast[]; onPlay: (p: Podcast) => void }> = ({ collectedIds, allPodcasts, onPlay }) => {
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
                 <div className="absolute -top-4 left-0 w-full h-full flex justify-center items-start gap-12 pointer-events-none opacity-80">
                    <div className="w-2 h-2 bg-white animate-[pixel-jump_1.2s_ease-in-out_infinite]"></div>
                    <div className="w-2 h-2 bg-white animate-[pixel-jump_1.5s_ease-in-out_infinite_0.5s]"></div>
                    <div className="w-2 h-2 bg-white animate-[pixel-jump_1s_ease-in-out_infinite_0.8s]"></div>
                 </div>
             </div>
             <p className="text-gray-500 font-pixel">GO DISCOVER AND COLLECT SOME TAPES</p>
         </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {myArtifacts.map(tape => (
        <div 
          key={tape.id} 
          onClick={() => onPlay(tape)}
          className="relative bg-white text-black p-1 rounded-sm border-l-4 border-black shadow-[5px_5px_10px_rgba(0,0,0,0.5)] cursor-pointer hover:-translate-y-2 transition-transform duration-300"
        >
           <div className="h-48 border border-gray-300 p-2 flex flex-col justify-between bg-cover bg-center relative" style={{ backgroundImage: `url(${tape.coverUrl})` }}>
              <div className="absolute inset-0 bg-yellow-400/90 mix-blend-multiply"></div>
              <div className="relative z-10">
                  <div className="w-full h-2 bg-black mb-1"></div>
                  <div className="w-full h-2 bg-black"></div>
              </div>
              <h3 className="relative z-10 font-pixel font-bold text-lg uppercase leading-none bg-white/80 p-1">
                {tape.title}
              </h3>
              <div className="relative z-10 flex justify-between items-end font-mono text-[10px] font-bold">
                <span className="bg-black text-white px-1">SIDE A</span>
                <span>{tape.duration} MIN</span>
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
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [collection, setCollection] = useState<string[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const addToCollection = (id: string) => {
    if (!collection.includes(id)) {
      setCollection([...collection, id]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto border-x border-retroGray shadow-2xl bg-void bg-[size:40px_40px] bg-grid-pattern relative">
      <div className="scanlines"></div>
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-void/95 border-b md:border-b-0 md:border-r border-retroGray p-6 flex flex-col sticky top-0 z-40 h-auto md:h-screen backdrop-blur-sm">
        <LogoWidget />

        <nav className="flex-1 space-y-4 relative z-20">
          <button 
            onClick={() => setView('discovery')}
            className={`group w-full text-left px-4 py-4 font-header text-sm tracking-wider border transition-all flex items-center gap-4 ${view === 'discovery' ? 'bg-neonCyan/10 border-neonCyan text-neonCyan shadow-[0_0_15px_rgba(0,243,255,0.2)]' : 'border-transparent text-gray-500 hover:text-white hover:border-gray-700'}`}
          >
            <Radio size={20} className="group-hover:animate-bounce" /> 
            <span>DISCOVERY</span>
          </button>
          
          <button 
            onClick={() => setView('collection')}
            className={`group w-full text-left px-4 py-4 font-header text-sm tracking-wider border transition-all flex items-center gap-4 ${view === 'collection' ? 'bg-neonPink/10 border-neonPink text-neonPink shadow-[0_0_15px_rgba(255,0,60,0.2)]' : 'border-transparent text-gray-500 hover:text-white hover:border-gray-700'}`}
          >
            <Landmark size={20} className="group-hover:animate-bounce" /> 
            <span>MUSEUM</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-dashed border-gray-800 relative z-20">
          {!isWalletConnected ? (
            <PixelButton onClick={() => setIsWalletConnected(true)} variant="primary" className="w-full text-sm">
               <Wallet size={16} /> CONNECT WALLET
            </PixelButton>
          ) : (
             <div className="border border-neonCyan/50 bg-black/50 p-3 text-center backdrop-blur-md">
               <p className="text-neonCyan text-[10px] font-pixel mb-1 tracking-widest">NET: ETHEREUM</p>
               <p className="text-white text-xs font-mono truncate">0x71C...92F</p>
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
                '留声博物馆 /// MUSEUM'
              )}
            </h2>
            <div className="h-1 w-20 bg-neonPurple"></div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-500 font-mono border border-gray-800 px-3 py-1 rounded-full">
             <div className="w-2 h-2 rounded-full bg-neonGreen animate-pulse bg-green-500"></div>
             <span>SYSTEM OPTIMAL</span>
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
            collectedIds={collection} 
            allPodcasts={MOCK_PODCASTS} 
            onPlay={(p) => setSelectedPodcast(p)} 
          />
        )}
      </main>

      {/* Player Overlay */}
      {selectedPodcast && (
        <PlayerModal 
          podcast={selectedPodcast} 
          onClose={() => setSelectedPodcast(null)} 
          addToCollection={addToCollection}
          isCollected={collection.includes(selectedPodcast.id)}
        />
      )}

    </div>
  );
};

export default App;