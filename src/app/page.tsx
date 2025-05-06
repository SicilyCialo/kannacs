'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';

// Sound effect management system
type SoundType = 'hover' | 'select' | 'click' | 'success' | 'error' | 'special';

const playSoundEffect = (type: SoundType, volume: number = 0.2) => {
  try {
    // Use Web Audio API to generate sounds instead of relying on audio files
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    
    // Create different oscillator configurations based on sound type
    let oscillator: OscillatorNode;
    
    switch (type) {
      case 'hover':
        // Higher pitched, shorter sound for hover
        oscillator = createSound(audioContext, gainNode, {
          type: 'sine',
          frequency: 880,
          duration: 0.08,
          fadeOutTime: 0.05,
          volumeMultiplier: 0.3
        });
        break;
        
      case 'click':
      case 'select':
        // Crisp, medium pitched sound for clicks/selections
        oscillator = createSound(audioContext, gainNode, {
          type: 'square',
          frequency: 660,
          duration: 0.12,
          fadeOutTime: 0.08,
          volumeMultiplier: 0.7
        });
        break;
        
      case 'success':
        // Happy, rising sound for success
        playSuccessSound(audioContext, gainNode);
        return;
        
      case 'error':
        // Descending, dissonant sound for errors
        playErrorSound(audioContext, gainNode);
        return;
        
      case 'special':
        // Complex sound for special events
        playSpecialSound(audioContext, gainNode);
        return;
        
      default:
        // Default fallback sound
        oscillator = createSound(audioContext, gainNode, {
          type: 'square',
          frequency: 440,
          duration: 0.15,
          fadeOutTime: 0.1,
          volumeMultiplier: 0.5
        });
    }
    
    // Start the oscillator
    oscillator.start();
    
    // Stop and clean up after duration
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 500);
  } catch (error) {
    console.error('Audio playback failed:', error);
  }
};

// Helper function to create a basic sound
const createSound = (
  audioContext: AudioContext, 
  gainNode: GainNode, 
  options: {
    type: OscillatorType;
    frequency: number;
    duration: number;
    fadeOutTime: number;
    volumeMultiplier: number;
  }
) => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = options.type;
  oscillator.frequency.value = options.frequency;
  
  // Set initial gain
  gainNode.gain.value = options.volumeMultiplier;
  
  // Create fade out effect
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(options.volumeMultiplier, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + options.duration);
  
  oscillator.connect(gainNode);
  
  return oscillator;
};

// More complex sound patterns
const playSuccessSound = (audioContext: AudioContext, gainNode: GainNode) => {
  const now = audioContext.currentTime;
  
  // First note
  const osc1 = audioContext.createOscillator();
  osc1.type = 'square';
  osc1.frequency.value = 440;
  osc1.connect(gainNode);
  osc1.start(now);
  osc1.stop(now + 0.1);
  
  // Second note (higher)
  const osc2 = audioContext.createOscillator();
  osc2.type = 'square';
  osc2.frequency.value = 660;
  osc2.connect(gainNode);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.2);
  
  // Third note (even higher)
  const osc3 = audioContext.createOscillator();
  osc3.type = 'square';
  osc3.frequency.value = 880;
  osc3.connect(gainNode);
  osc3.start(now + 0.2);
  osc3.stop(now + 0.4);
  
  // Clean up
  setTimeout(() => {
    audioContext.close();
  }, 500);
};

const playErrorSound = (audioContext: AudioContext, gainNode: GainNode) => {
  const now = audioContext.currentTime;
  
  // First note (higher)
  const osc1 = audioContext.createOscillator();
  osc1.type = 'square';
  osc1.frequency.value = 440;
  osc1.connect(gainNode);
  osc1.start(now);
  osc1.stop(now + 0.1);
  
  // Second note (lower)
  const osc2 = audioContext.createOscillator();
  osc2.type = 'square';
  osc2.frequency.value = 220;
  osc2.connect(gainNode);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.3);
  
  // Clean up
  setTimeout(() => {
    audioContext.close();
  }, 400);
};

const playSpecialSound = (audioContext: AudioContext, gainNode: GainNode) => {
  const now = audioContext.currentTime;
  
  // Create a sequence of rapid bleeps
  for (let i = 0; i < 5; i++) {
    const osc = audioContext.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 440 + (i * 100);
    osc.connect(gainNode);
    osc.start(now + (i * 0.05));
    osc.stop(now + (i * 0.05) + 0.04);
  }
  
  // Clean up
  setTimeout(() => {
    audioContext.close();
  }, 500);
};

// Custom hook for sound-enabled buttons
const useSoundButton = () => {
  const playHoverSound = () => playSoundEffect('hover', 0.1);
  const playClickSound = () => playSoundEffect('click', 0.2);
  
  return { playHoverSound, playClickSound };
};

type Section = 'home' | 'profile' | 'about' | 'contact' | 'privacy';
type BackgroundType = 'video' | 'image' | 'animation';

// Waifu data
type Waifu = {
  name: string;
  image: string;
  description: string;
  color: string;
  stats?: {
    charm: number;
    cuteness: number;
    shyness: number;
  };
  isFavorite?: boolean;
};

const waifuList: Waifu[] = [
  {
    name: "Chiffon",
    image: "/chiffon.jpg",
    description: "A gentle cat-girl with pink eyes and blonde hair. Known for her sweet personality and adorable cat ears.",
    color: "#f5a9b8",
    stats: {
      charm: 95,
      cuteness: 98,
      shyness: 75
    }
  },
  {
    name: "Segawa Emi",
    image: "/emisegawa.jpg",
    description: "A bright and cheerful girl with blonde hair and a signature red ribbon. Her energetic personality lights up any room.",
    color: "#ffcc55",
    stats: {
      charm: 90,
      cuteness: 85,
      shyness: 40
    }
  },
  {
    name: "Akizuki Kanna",
    image: "/kannaakizuki.jpg",
    description: "An elegant girl with silver-white hair and purple eyes. Often seen enjoying coffee with a calm, sophisticated demeanor.",
    color: "#d8bfd8",
    stats: {
      charm: 92,
      cuteness: 88,
      shyness: 82
    }
  }
];

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

type GameStats = {
  level: number;
  experience: number;
  nextLevelXp: number;
  wins: number;
  losses: number;
  timePlayed: string;
  rank: string;
};

// RPS game choices
type RPSChoice = 'rock' | 'paper' | 'scissors' | null;

export default function Home() {
  // Add loading and splash screen states
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingComplete = useRef(false);
  
  // Video background loading state
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  // Original state declarations
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const rainRef = useRef<HTMLDivElement>(null);
  const [showWaifuPopup, setShowWaifuPopup] = useState(false);
  const [selectedWaifu, setSelectedWaifu] = useState<Waifu | null>(null);
  const [popupView, setPopupView] = useState<'info' | 'stats'>('info');
  const [favoriteWaifus, setFavoriteWaifus] = useState<string[]>([]);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<{[key: string]: string[]}>({});
  const [profileView, setProfileView] = useState<'stats' | 'achievements' | 'games' | 'minigame'>('stats');
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Online and ready for gaming adventures!");
  const [isProfileFavorited, setIsProfileFavorited] = useState(false);
  // Added state variables for privacy policy interaction
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showDeathAnimation, setShowDeathAnimation] = useState(false);
  // Add about section state
  const [aboutTab, setAboutTab] = useState<'story' | 'quests' | 'inventory'>('story');
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<string | null>(null);
  const [equippedItem, setEquippedItem] = useState<string>("Pixel Brush");
  const [storyProgress, setStoryProgress] = useState<number>(0);
  const [storyChoices, setStoryChoices] = useState<string[]>([]);
  
  // Minigame states
  const [showMinigame, setShowMinigame] = useState(false);
  const [playerChoice, setPlayerChoice] = useState<RPSChoice>(null);
  const [computerChoice, setComputerChoice] = useState<RPSChoice>(null);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [gameAnimation, setGameAnimation] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [consecutiveWins, setConsecutiveWins] = useState(0);

  // Set which type of background to use: 'video', 'image', or 'animation'
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('video');
  
  // Background settings
  const backgroundSettings = {
    video: {
      src: '/walkingpixel.mp4', 
      fallbackImage: '/background-fallback.jpg',
    },
    image: {
      src: '/background.jpg',
    }
  };

  // Menu items for the pixel game menu
  const menuItems: { id: Section; label: string }[] = [
    { id: 'profile', label: 'PROFILE' },
    { id: 'about', label: 'ABOUT ME' },
    { id: 'contact', label: 'CONTACT' },
    { id: 'privacy', label: 'PRIVACY & POLICY' },
  ];

  // Game stats
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 0,
    experience: 0,
    nextLevelXp: 500,
    wins: 0,
    losses: 0,
    timePlayed: '1000+ hours',
    rank: 'VOID'
  });

  // Sample game achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'ach1',
      title: 'First Victory',
      description: 'Win your first online match',
      icon: '🏆',
      unlocked: gameStats.wins > 0
    },
    {
      id: 'ach2',
      title: 'Collector',
      description: 'Add 3 waifus to your favorites',
      icon: '❤️',
      unlocked: favoriteWaifus.length >= 3
    },
    {
      id: 'ach3',
      title: 'Social Butterfly',
      description: 'Send messages to all your waifus',
      icon: '✉️',
      unlocked: Object.keys(sentMessages).length >= 3
    },
    {
      id: 'ach4',
      title: 'Dedicated Gamer',
      description: 'Reach level 5',
      icon: '🎮',
      unlocked: gameStats.level >= 5
    },
    {
      id: 'ach5',
      title: 'Privacy Conscious',
      description: 'Agree to privacy and policy',
      icon: '🔒',
      unlocked: false
    }
  ]);

  // Track if privacy section was visited
  const [privacyVisited, setPrivacyVisited] = useState(false);

  // Update achievements based on user actions
  useEffect(() => {
    const updatedAchievements = [...achievements];
    
    // Check collector achievement
    const collectorAch = updatedAchievements.find(a => a.id === 'ach2');
    if (collectorAch) {
      collectorAch.unlocked = favoriteWaifus.length >= 3;
    }
    
    // Check social butterfly achievement
    const socialAch = updatedAchievements.find(a => a.id === 'ach3');
    if (socialAch) {
      socialAch.unlocked = Object.keys(sentMessages).length >= 3;
    }
    
    // Check privacy policy visited
    const privacyAch = updatedAchievements.find(a => a.id === 'ach5');
    if (privacyAch) {
      privacyAch.unlocked = privacyVisited;
    }
    
    // Check first victory
    const victoryAch = updatedAchievements.find(a => a.id === 'ach1');
    if (victoryAch) {
      victoryAch.unlocked = gameStats.wins > 0;
    }
    
    // Check gamer level
    const levelAch = updatedAchievements.find(a => a.id === 'ach4');
    if (levelAch) {
      levelAch.unlocked = gameStats.level >= 5;
    }
    
    setAchievements(updatedAchievements);
  }, [favoriteWaifus, sentMessages, privacyVisited, gameStats.wins, gameStats.level]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentSection === 'home') {
        switch (e.key) {
          case 'ArrowUp':
            setSelectedMenuItem(prev => (prev > 0 ? prev - 1 : menuItems.length - 1));
            playSelectSound();
            break;
          case 'ArrowDown':
            setSelectedMenuItem(prev => (prev < menuItems.length - 1 ? prev + 1 : 0));
            playSelectSound();
            break;
          case 'Enter':
          case ' ':
            setCurrentSection(menuItems[selectedMenuItem].id);
            if (menuItems[selectedMenuItem].id === 'privacy') {
              setPrivacyVisited(true);
            }
            break;
          default:
            break;
        }
      } else if (e.key === 'Escape') {
        setCurrentSection('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, selectedMenuItem, menuItems]);

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    // Skip parallax effect completely if we're in the About section
    if (currentSection === 'about') {
      return;
    }
    
    const { clientX, clientY } = e;
    setMousePosition({
      x: (clientX / window.innerWidth - 0.5) * 20,
      y: (clientY / window.innerHeight - 0.5) * 20
    });
  };

  // Handle waifu selection
  const handleWaifuClick = (waifu: Waifu) => {
    if (selectedWaifu?.name === waifu.name) {
      setShowWaifuPopup(!showWaifuPopup);
    } else {
      setSelectedWaifu(waifu);
      setShowWaifuPopup(true);
    }
    playSelectSound();
  };

  // Toggle waifu popup
  const toggleWaifuPopup = () => {
    setShowWaifuPopup(prev => !prev);
    playSelectSound();
  };

  // Close popup when escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showWaifuPopup) {
        setShowWaifuPopup(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWaifuPopup]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showWaifuPopup && !target.closest('.waifu-popup') && !target.closest('button')) {
        setShowWaifuPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWaifuPopup]);

  // Rain animation
  useEffect(() => {
    if (!rainRef?.current || backgroundType !== 'animation') return;
    
    const createRainDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'absolute w-1 h-2 bg-blue-400 opacity-70';
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.top = '-10px';
      drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
      drop.style.animationName = 'rain-fall';
      rainRef.current?.appendChild(drop);
      
      setTimeout(() => {
        drop.remove();
      }, 2000);
    };
    
    const rainInterval = setInterval(createRainDrop, 100);
    return () => clearInterval(rainInterval);
  }, [backgroundType]);
  
  // Sound effect for menu selection - Replace with our new system
  const playSelectSound = () => {
    playSoundEffect('select');
  };

  // Sound effect for success actions
  const playSuccessSound = () => {
    playSoundEffect('success', 0.3);
  };

  // Sound effect for error actions
  const playErrorSound = () => {
    playSoundEffect('error', 0.3);
  };

  // Toggle favorite status for a waifu
  const toggleFavorite = (waifuName: string) => {
    playSelectSound();
    
    setFavoriteWaifus(prev => {
      if (prev.includes(waifuName)) {
        return prev.filter(name => name !== waifuName);
      } else {
        return [...prev, waifuName];
      }
    });
    
    // Visual feedback animation
    const hearts = document.createElement('div');
    hearts.setAttribute('class', 'absolute inset-0 flex items-center justify-center pointer-events-none');
    
    for (let i = 0; i < 5; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '♥';
      heart.setAttribute('class', 'text-[#ff004d] absolute');
      heart.style.left = `${50 + (Math.random() * 40 - 20)}%`;
      heart.style.top = `${50 + (Math.random() * 40 - 20)}%`;
      heart.style.opacity = '0';
      heart.style.fontSize = `${Math.random() * 10 + 10}px`;
      heart.style.animation = `float-up 1s ease-out ${Math.random() * 0.5}s forwards`;
      hearts.appendChild(heart);
    }
    
    const popup = document.querySelector('.waifu-popup');
    if (popup) {
      popup.appendChild(hearts);
      setTimeout(() => hearts.remove(), 2000);
    }
  };
  
  // Send a message to a waifu
  const sendMessage = () => {
    if (!selectedWaifu || !message.trim()) return;
    
    playSelectSound();
    
    // Add message to sent messages
    setSentMessages(prev => {
      const waifuMessages = prev[selectedWaifu.name] || [];
      return {
        ...prev,
        [selectedWaifu.name]: [...waifuMessages, message.trim()]
      };
    });
    
    // Clear input and hide message box
    setMessage('');
    setShowMessageInput(false);
    
    // Show success animation
    const notification = document.createElement('div');
    notification.setAttribute('class', 'absolute bottom-2 right-2 bg-[#00e756] text-white px-2 py-1 text-xs rounded');
    notification.innerText = 'Message sent!';
    notification.style.animation = 'fade-out 2s forwards';
    
    const popup = document.querySelector('.waifu-popup');
    if (popup) {
      popup.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    }
  };

  // Handle Rock Paper Scissors game
  const playRPS = (choice: RPSChoice) => {
    if (gameAnimation) return;
    
    setPlayerChoice(choice);
    setGameAnimation(true);
    playSelectSound();
    
    // Simulate computer thinking
    setTimeout(() => {
      const choices: RPSChoice[] = ['rock', 'paper', 'scissors'];
      const computerPick = choices[Math.floor(Math.random() * choices.length)];
      setComputerChoice(computerPick);
      
      // Determine winner
      let result: 'win' | 'lose' | 'draw' | null = null;
      
      if (choice === computerPick) {
        result = 'draw';
      } else if (
        (choice === 'rock' && computerPick === 'scissors') ||
        (choice === 'paper' && computerPick === 'rock') ||
        (choice === 'scissors' && computerPick === 'paper')
      ) {
        result = 'win';
        // Update stats for win
        setGameStats(prev => ({
          ...prev,
          wins: prev.wins + 1,
          experience: Math.min(prev.experience + 50, prev.nextLevelXp)
        }));
        setConsecutiveWins(prev => prev + 1);
        
        // Award extra XP for consecutive wins
        if (consecutiveWins >= 2) {
          setGameStats(prev => ({
            ...prev,
            experience: Math.min(prev.experience + 25 * (consecutiveWins), prev.nextLevelXp)
          }));
        }
      } else {
        result = 'lose';
        // Update stats for loss
        setGameStats(prev => ({
          ...prev,
          losses: prev.losses + 1,
          experience: Math.min(prev.experience + 15, prev.nextLevelXp)
        }));
        setConsecutiveWins(0);
      }
      
      setGameResult(result);
      setShowResult(true);
      
      // Check for level up
      if (gameStats.experience >= gameStats.nextLevelXp) {
        levelUp();
      }
      
      // Reset after showing result
      setTimeout(() => {
        setShowResult(false);
        setGameAnimation(false);
      }, 2000);
    }, 1000);
  };
  
  const levelUp = () => {
    setGameStats(prev => ({
      ...prev,
      level: prev.level + 1,
      experience: 0,
      nextLevelXp: prev.nextLevelXp + 500
    }));
    
    // Show level up animation
    const levelUpEl = document.createElement('div');
    levelUpEl.setAttribute('class', 'absolute inset-0 flex items-center justify-center pointer-events-none');
    levelUpEl.innerHTML = `
      <div class="bg-[#ffec27] text-black px-4 py-2 text-xl font-bold animate-bounce">
        LEVEL UP!
      </div>
    `;
    
    const gameContainer = document.querySelector('.profile-container');
    if (gameContainer) {
      gameContainer.appendChild(levelUpEl);
      setTimeout(() => levelUpEl.remove(), 3000);
    }
  };

  // Reset game
  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setGameResult(null);
    setShowResult(false);
    setGameAnimation(false);
  };

  // Render the appropriate background based on type
  const renderBackground = () => {
    if (backgroundType === 'video') {
      return (
        <div className="fixed inset-0 z-0 overflow-hidden">
          {/* Fallback image that shows while video loads */}
          <div 
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
            style={{ backgroundImage: `url(${backgroundSettings.video.fallbackImage})` }}
          />
          
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute min-w-full min-h-full object-cover pixelated" 
            poster={backgroundSettings.video.fallbackImage}
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src={backgroundSettings.video.src} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 pointer-events-none bg-grid-overlay opacity-10"></div>
        </div>
      );
    } else if (backgroundType === 'image') {
      return (
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div 
            className="absolute min-w-full min-h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundSettings.image.src})` }}
          ></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>
      );
    } else {
      // Animation background (default)
      return (
        <div className="fixed inset-0 z-0">
          {/* Pixelated mountains */}
          <div className="absolute bottom-0 w-full h-40 bg-[#5d275d]" style={{ clipPath: 'polygon(0% 100%, 15% 60%, 33% 100%, 45% 40%, 60% 100%, 80% 70%, 90% 85%, 100% 70%, 100% 100%)' }}></div>
          <div className="absolute bottom-0 w-full h-24 bg-[#291d3a]" style={{ clipPath: 'polygon(0% 100%, 10% 60%, 25% 100%, 40% 50%, 50% 80%, 70% 50%, 80% 70%, 100% 60%, 100% 100%)' }}></div>
          
          {/* Animated stars */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-white"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`
                }}
              />
            ))}
          </div>
          
          {/* Animated rain layer */}
          <div 
            ref={rainRef} 
            className="absolute inset-0 overflow-hidden"
          />
        </div>
      );
    }
  };

  // Section content renderers
  const renderSectionContent = () => {
    switch(currentSection) {
      case 'profile':
        return (
          <div className="space-y-8">
            <motion.h2 
              className="text-3xl font-bold text-[#ff77a8] pixel-text"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
            >
              PROFILE
            </motion.h2>
            
            <div className="bg-[#262b44] border-4 border-[#3a4466] p-5 profile-container relative">
              {/* Profile Header with Favorite Button */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <motion.div 
                    className="w-20 h-20 mr-4 border-4 border-white overflow-hidden relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Profile avatar */}
                    <img 
                      src="/profile.jpg" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    {/* Level indicator */}
                    <div className="absolute bottom-0 w-full bg-black/70 text-center text-xs py-1">
                      LVL {gameStats.level}
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#ffec27] mb-1">KannaCS</h3>
                    <div className="relative group">
                      <p className="text-[#8595a1] group-hover:text-white transition-colors">{statusMessage}</p>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  className={`${isProfileFavorited ? 'text-[#ffec27]' : 'text-[#8595a1]'} text-xl hover:text-[#ffec27] transition-colors`}
                  onClick={() => {
                    setIsProfileFavorited(!isProfileFavorited);
                    playSelectSound();
                    
                    // Show star animation when favorited
                    if (!isProfileFavorited) {
                      const stars = document.createElement('div');
                      stars.setAttribute('class', 'absolute top-4 right-4 pointer-events-none');
                      
                      for (let i = 0; i < 5; i++) {
                        const star = document.createElement('div');
                        star.innerHTML = '⭐';
                        star.setAttribute('class', 'absolute');
                        star.style.fontSize = `${Math.random() * 8 + 10}px`;
                        star.style.left = `${Math.random() * 40 - 20}px`;
                        star.style.top = `${Math.random() * 40 - 20}px`;
                        star.style.opacity = '0';
                        star.style.animation = `float-up 1s ease-out ${Math.random() * 0.5}s forwards`;
                        stars.appendChild(star);
                      }
                      
                      const profileContainer = document.querySelector('.profile-container');
                      if (profileContainer) {
                        profileContainer.appendChild(stars);
                        setTimeout(() => stars.remove(), 2000);
                      }
                    }
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isProfileFavorited ? '★' : '☆'}
                </motion.button>
        </div>
              
              {/* Profile Navigation Tabs */}
              <div className="flex border-b border-[#3a4466] mb-4">
                <button 
                  className={`px-3 py-2 text-sm ${profileView === 'stats' ? 'bg-[#3a4466] text-white' : 'text-[#8595a1]'}`}
                  onClick={() => {
                    playSoundEffect('click');
                    setProfileView('stats');
                  }}
                  onMouseEnter={() => playSoundEffect('hover', 0.1)}
                >
                  STATS
                </button>
                <button 
                  className={`px-3 py-2 text-sm ${profileView === 'achievements' ? 'bg-[#3a4466] text-white' : 'text-[#8595a1]'}`}
                  onClick={() => {
                    playSoundEffect('click');
                    setProfileView('achievements');
                  }}
                  onMouseEnter={() => playSoundEffect('hover', 0.1)}
                >
                  ACHIEVEMENTS
                </button>
                <button 
                  className={`px-3 py-2 text-sm ${profileView === 'games' ? 'bg-[#3a4466] text-white' : 'text-[#8595a1]'}`}
                  onClick={() => {
                    playSoundEffect('click');
                    setProfileView('games');
                  }}
                  onMouseEnter={() => playSoundEffect('hover', 0.1)}
                >
                  GAMES
                </button>
                <button 
                  className={`px-3 py-2 text-sm ${profileView === 'minigame' ? 'bg-[#3a4466] text-white' : 'text-[#8595a1]'}`}
                  onClick={() => {
                    playSoundEffect('click');
                    setProfileView('minigame');
                    resetGame();
                  }}
                  onMouseEnter={() => playSoundEffect('hover', 0.1)}
                >
                  MINIGAME
                </button>
              </div>
              
              {/* View Content */}
              <AnimatePresence mode="wait">
                {/* Stats View */}
                {profileView === 'stats' && (
                  <motion.div
                    key="stats-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Level Progress */}
                    <div className="bg-[#1a1c2c] p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#8595a1] text-xs">LEVEL PROGRESS</span>
                        <span className="text-white text-xs">{gameStats.experience}/{gameStats.nextLevelXp} XP</span>
                      </div>
                      <div className="w-full bg-[#0f0f1b] h-3 mb-1">
                        <motion.div 
                          className="bg-[#ff004d] h-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(gameStats.experience / gameStats.nextLevelXp) * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#ffec27]">Lv. {gameStats.level}</span>
                        <span className="text-[#ffec27]">Lv. {gameStats.level + 1}</span>
                      </div>
                    </div>
                    
                    {/* Game Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#1a1c2c] p-3">
                        <div className="text-[#8595a1] text-xs mb-1">RANK</div>
                        <div className="text-[#ffec27] font-bold">{gameStats.rank}</div>
                      </div>
                      <div className="bg-[#1a1c2c] p-3">
                        <div className="text-[#8595a1] text-xs mb-1">TIME PLAYED</div>
                        <div className="text-white">{gameStats.timePlayed}</div>
                      </div>
                      <div className="bg-[#1a1c2c] p-3">
                        <div className="text-[#8595a1] text-xs mb-1">WIN RATE</div>
                        <div className="text-white">
                          {Math.round((gameStats.wins / (gameStats.wins + gameStats.losses)) * 100)}%
                        </div>
                      </div>
                      <div className="bg-[#1a1c2c] p-3">
                        <div className="text-[#8595a1] text-xs mb-1">W/L</div>
                        <div className="text-white">
                          <span className="text-[#00e756]">{gameStats.wins}W</span> / 
                          <span className="text-[#ff004d]">{gameStats.losses}L</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pixel Art Drawing Tool */}
                    <div className="bg-[#1a1c2c] p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-[#8595a1] text-xs">PIXEL ARTIST</div>
                        <div className="text-[#8595a1] text-xs">8x8 Canvas</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        {/* Pixel Canvas */}
                        <div 
                          className="grid grid-cols-8 gap-0.5 bg-[#0f0f1b] p-2 mb-3 w-max mx-auto" 
                          onMouseUp={() => setIsDrawing(false)} 
                          onMouseLeave={() => setIsDrawing(false)}
                        >
                          {pixelCanvas.map((row, rowIndex) => (
                            <React.Fragment key={`row-${rowIndex}`}>
                              {row.map((color: string, colIndex: number) => (
                                <div
                                  key={`pixel-${rowIndex}-${colIndex}`}
                                  className="w-5 h-5 cursor-pointer"
                                  style={{ backgroundColor: color }}
                                  onMouseDown={() => {
                                    handleMouseDown(rowIndex, colIndex);
                                    playSoundEffect('click', 0.05); // Quieter click for pixel drawing
                                  }}
                                  onMouseOver={() => {
                                    if (isDrawing) {
                                      handleMouseOver(rowIndex, colIndex);
                                      playSoundEffect('hover', 0.02); // Very quiet hover for continuous drawing
                                    }
                                  }}
                                />
                              ))}
                            </React.Fragment>
                          ))}
                        </div>
                        
                        {/* Color Palette */}
                        <div className="mb-3 w-max">
                          <div className="text-[#8595a1] text-xs mb-1 text-center">COLORS</div>
                          <div className="flex space-x-1 justify-center">
                            {pixelColors.map((color, index) => (
                              <motion.button
                                key={`color-${index}`}
                                className={`w-5 h-5 ${color === '#1a1c2c' ? 'border border-[#8595a1]' : ''} ${color === currentColor ? 'ring-2 ring-white' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setCurrentColor(color);
                                  playSoundEffect('click');
                                }}
                                onMouseEnter={() => playSoundEffect('hover', 0.1)}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex space-x-2 w-full max-w-[180px]">
                          <motion.button
                            className="bg-[#3a4466] hover:bg-[#ff004d] text-[#8595a1] hover:text-white px-2 py-1 text-xs flex-1 transition-colors"
                            onClick={() => {
                              clearCanvas();
                              playSoundEffect('error', 0.3); // Use error sound for clearing
                            }}
                            onMouseEnter={() => playSoundEffect('hover', 0.1)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            CLEAR
                          </motion.button>
                          <motion.button
                            className="bg-[#3a4466] hover:bg-[#00e756] text-[#8595a1] hover:text-white px-2 py-1 text-xs flex-1 transition-colors"
                            onClick={() => {
                              savePixelArt();
                              playSoundEffect('success', 0.3); // Use success sound for saving
                            }}
                            onMouseEnter={() => playSoundEffect('hover', 0.1)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            SAVE
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Achievements View */}
                {profileView === 'achievements' && (
                  <motion.div
                    key="achievements-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-center p-2 bg-[#1a1c2c]">
                      <span className="text-white">Unlocked</span>
                      <span className="text-[#ffec27]">{achievements.filter(a => a.unlocked).length}/{achievements.length}</span>
                    </div>
                    
                    {achievements.map((achievement) => (
                      <motion.div 
                        key={achievement.id}
                        className={`p-3 border-l-4 ${achievement.unlocked ? 'bg-[#1a1c2c] border-[#ffec27]' : 'bg-[#1a1c2c]/50 border-[#3a4466] opacity-70'}`}
                        whileHover={{ x: achievement.unlocked ? 5 : 0, opacity: 1 }}
                        onMouseEnter={() => playSoundEffect('hover', 0.1)}
                        onClick={() => {
                          if (achievement.unlocked) {
                            playSoundEffect('success', 0.2);
                          } else {
                            playSoundEffect('click', 0.1);
                          }
                        }}
                      >
                        <div className="flex">
                          <div className="mr-3 text-2xl">{achievement.icon}</div>
                          <div>
                            <div className={`font-bold ${achievement.unlocked ? 'text-[#ffec27]' : 'text-[#8595a1]'}`}>
                              {achievement.title}
                              {achievement.unlocked && 
                                <span className="ml-2 text-xs bg-[#ffec27] text-black px-1">✓</span>
                              }
                            </div>
                            <div className="text-[#8595a1] text-xs">{achievement.description}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                {/* Games View */}
                {profileView === 'games' && (
                  <motion.div
                    key="games-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    <div className="text-[#8595a1] text-xs mb-2">FAVORITE GAMES</div>
                    
                    {profileEditMode ? (
                      <div className="space-y-2">
                        <div className="flex items-center bg-[#1a1c2c] p-2">
                          <div className="w-10 h-10 bg-[#ff004d] mr-3 flex items-center justify-center">🎮</div>
                          <input 
                            type="text" 
                            defaultValue="Pixel Dungeon" 
                            className="bg-[#262b44] text-white px-2 py-1 w-full"
                          />
                        </div>
                        <div className="flex items-center bg-[#1a1c2c] p-2">
                          <div className="w-10 h-10 bg-[#00e756] mr-3 flex items-center justify-center">🏆</div>
                          <input 
                            type="text" 
                            defaultValue="Retro Racing" 
                            className="bg-[#262b44] text-white px-2 py-1 w-full"
                          />
                        </div>
                        <div className="flex items-center bg-[#1a1c2c] p-2">
                          <div className="w-10 h-10 bg-[#29adff] mr-3 flex items-center justify-center">🚀</div>
                          <input 
                            type="text" 
                            defaultValue="Space Pixel Shooter" 
                            className="bg-[#262b44] text-white px-2 py-1 w-full"
                          />
                        </div>
                        
                        <button className="bg-[#3a4466] hover:bg-[#ff004d] text-white w-full py-1 mt-2 text-sm">
                          + ADD GAME
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <motion.div 
                          className="flex items-center bg-[#1a1c2c] p-2 game-item"
                          whileHover={{ x: 5 }}
                          onMouseEnter={() => playSoundEffect('hover', 0.1)}
                          onClick={() => playSoundEffect('click')}
                        >
                          <div className="w-10 h-10 bg-[#ff004d] mr-3 flex items-center justify-center">🎮</div>
                          <div>
                            <div className="text-white">Helldivers 2</div>
                            <div className="text-[#8595a1] text-xs">125 hours played</div>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="flex items-center bg-[#1a1c2c] p-2 game-item"
                          whileHover={{ x: 5 }}
                          onMouseEnter={() => playSoundEffect('hover', 0.1)}
                          onClick={() => playSoundEffect('click')}
                        >
                          <div className="w-10 h-10 bg-[#00e756] mr-3 flex items-center justify-center">🏆</div>
                          <div>
                            <div className="text-white">Age of Empires IV</div>
                            <div className="text-[#8595a1] text-xs">289 hours played</div>
                          </div>
                        </motion.div>
                        <motion.div 
                          className="flex items-center bg-[#1a1c2c] p-2 game-item"
                          whileHover={{ x: 5 }}
                          onMouseEnter={() => playSoundEffect('hover', 0.1)}
                          onClick={() => playSoundEffect('click')}
                        >
                          <div className="w-10 h-10 bg-[#29adff] mr-3 flex items-center justify-center">👑</div>
                          <div>
                            <div className="text-white">Knights of Honor Sovereign</div>
                            <div className="text-[#8595a1] text-xs">193 hours played</div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* Minigame View */}
                {profileView === 'minigame' && (
                  <motion.div
                    key="minigame-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-[#1a1c2c] p-3">
                      <h3 className="text-[#ffec27] font-bold mb-2">ROCK PAPER SCISSORS</h3>
                      <p className="text-[#8595a1] text-xs mb-3">Play against the computer to increase your W/L record and gain XP!</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-white mb-1">
                          <div>W/L: <span className="text-[#00e756]">{gameStats.wins}W</span> / <span className="text-[#ff004d]">{gameStats.losses}L</span></div>
                          <div>XP: +50 per win, +15 per loss</div>
                        </div>
                        <div className="h-1 w-full bg-[#0f0f1b]">
                          <div className="h-full bg-[#ffec27]" style={{ width: `${(consecutiveWins * 10)}%` }}></div>
                        </div>
                        <div className="text-[#ffec27] text-xs mt-1">Win Streak: {consecutiveWins} {consecutiveWins >= 3 && '🔥'}</div>
                      </div>
                      
                      {/* Game board */}
                      <div className="bg-[#262b44] p-4 flex flex-col items-center">
                        {/* Result display */}
                        {showResult && (
                          <motion.div 
                            className="text-center mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <div className={`text-2xl font-bold ${
                              gameResult === 'win' ? 'text-[#00e756]' : 
                              gameResult === 'lose' ? 'text-[#ff004d]' : 'text-[#ffec27]'
                            }`}>
                              {gameResult === 'win' ? 'YOU WIN!' : gameResult === 'lose' ? 'YOU LOSE!' : 'DRAW!'}
                            </div>
                            {gameResult === 'win' && consecutiveWins > 1 && (
                              <div className="text-[#ffec27] text-xs mt-1">
                                {consecutiveWins} wins in a row! +{25 * consecutiveWins} bonus XP
                              </div>
                            )}
                          </motion.div>
                        )}
                        
                        {/* Game choices */}
                        <div className="flex items-center justify-center mb-6 h-20">
                          <div className="w-20 text-center">
                            <div className="text-xs text-[#8595a1] mb-1">YOU</div>
                            <div className="text-4xl">
                              {playerChoice === 'rock' ? '👊' : 
                               playerChoice === 'paper' ? '✋' : 
                               playerChoice === 'scissors' ? '✌️' : 
                               gameAnimation ? '👊' : '?'}
                            </div>
                          </div>
                          
                          <div className="mx-4 text-xl text-[#ffec27]">VS</div>
                          
                          <div className="w-20 text-center">
                            <div className="text-xs text-[#8595a1] mb-1">CPU</div>
                            <div className="text-4xl">
                              {computerChoice === 'rock' ? '👊' : 
                               computerChoice === 'paper' ? '✋' : 
                               computerChoice === 'scissors' ? '✌️' : 
                               gameAnimation ? '👊' : '?'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Player choices */}
                        <div className="flex space-x-3 justify-center">
                          <motion.button
                            className={`w-16 h-16 bg-[#1a1c2c] flex items-center justify-center text-3xl ${gameAnimation ? 'opacity-50' : 'hover:bg-[#3a4466]'}`}
                            onClick={() => {
                              playRPS('rock');
                              playSoundEffect('click');
                            }}
                            onMouseEnter={() => playSoundEffect('hover', 0.1)}
                            disabled={gameAnimation}
                            whileHover={{ scale: gameAnimation ? 1 : 1.1 }}
                            whileTap={{ scale: gameAnimation ? 1 : 0.95 }}
                          >
                            👊
                          </motion.button>
                          <motion.button
                            className={`w-16 h-16 bg-[#1a1c2c] flex items-center justify-center text-3xl ${gameAnimation ? 'opacity-50' : 'hover:bg-[#3a4466]'}`}
                            onClick={() => {
                              playRPS('paper');
                              playSoundEffect('click');
                            }}
                            onMouseEnter={() => playSoundEffect('hover', 0.1)}
                            disabled={gameAnimation}
                            whileHover={{ scale: gameAnimation ? 1 : 1.1 }}
                            whileTap={{ scale: gameAnimation ? 1 : 0.95 }}
                          >
                            ✋
                          </motion.button>
                          <motion.button
                            className={`w-16 h-16 bg-[#1a1c2c] flex items-center justify-center text-3xl ${gameAnimation ? 'opacity-50' : 'hover:bg-[#3a4466]'}`}
                            onClick={() => {
                              playRPS('scissors');
                              playSoundEffect('click');
                            }}
                            onMouseEnter={() => playSoundEffect('hover', 0.1)}
                            disabled={gameAnimation}
                            whileHover={{ scale: gameAnimation ? 1 : 1.1 }}
                            whileTap={{ scale: gameAnimation ? 1 : 0.95 }}
                          >
                            ✌️
                          </motion.button>
                        </div>
                        
                        <div className="text-[#8595a1] text-xs mt-4">
                          {gameAnimation ? 'Waiting for result...' : 'Choose your move!'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
    </div>
  );
        
      case 'about':
        return (
          <div className="space-y-8 about-page">
            <motion.h2 
              className="text-3xl font-bold text-[#ffcc55] pixel-text"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
            >
              ABOUT ME
            </motion.h2>
            
            {/* Use a div with style instead of relying on the parent container's parallax */}
            <div className="bg-[#262b44] border-4 border-[#3a4466] p-5 relative about-section">
              {/* Interactive character selector */}
              <div className="absolute -top-4 right-10 bg-[#1a1c2c] border-2 border-[#3a4466] px-3 py-1 pixel-text text-xs text-[#8595a1]">
                SELECT APPEARANCE
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Character avatar selection */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32 border-4 border-[#3a4466] bg-[#1a1c2c] mb-2 overflow-hidden">
                    <motion.img
                      src="/profile.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover pixelated"
                      initial={{ filter: 'grayscale(0%)' }}
                      whileHover={{ 
                        filter: [
                          'grayscale(0%)', 
                          'grayscale(100%)', 
                          'hue-rotate(90deg)', 
                          'grayscale(0%)'
                        ] 
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Character customization controls */}
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 flex justify-center space-x-1 py-1">
                      <motion.button 
                        className="w-4 h-4 bg-[#ffec27] border border-white"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playSelectSound()}
                      />
                      <motion.button 
                        className="w-4 h-4 bg-[#ff004d] border border-white"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playSelectSound()}
                      />
                      <motion.button 
                        className="w-4 h-4 bg-[#29adff] border border-white"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playSelectSound()}
                      />
                    </div>
                  </div>
                  
                  {/* Level and XP display */}
                  <div className="bg-[#1a1c2c] p-2 mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#8595a1] text-xs">LVL {gameStats.level}</span>
                      <span className="text-[#8595a1] text-xs">{gameStats.experience}/{gameStats.nextLevelXp} XP</span>
                    </div>
                    <div className="w-full bg-[#0f0f1b] h-1">
                      <div 
                        className="bg-[#ffcc55] h-full" 
                        style={{ width: `${(gameStats.experience / gameStats.nextLevelXp) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Interactive attributes */}
                  <div className="bg-[#1a1c2c] p-2">
                    <div className="text-[#8595a1] text-xs mb-2">ATTRIBUTES</div>
                    <div className="space-y-2">
                      <AttributeBar 
                        label="CODING" 
                        value={92} 
                        color="#29adff" 
                        animationDelay={0}
                      />
                      <AttributeBar 
                        label="GAMING" 
                        value={85} 
                        color="#ff004d" 
                        animationDelay={0.2}
                      />
                      <AttributeBar 
                        label="PROBLEM SOLVING" 
                        value={88} 
                        color="#ffcc55" 
                        animationDelay={0.4}
                      />
                    </div>
                  </div>
                </div>
                
                {/* About content with tabs */}
                <div className="flex-1">
                  <div className="flex border-b border-[#3a4466] mb-4">
                    <AboutTabButton 
                      label="STORY" 
                      isActive={aboutTab === 'story'} 
                      onClick={() => setAboutTab('story')}
                    />
                    <AboutTabButton 
                      label="QUESTS" 
                      isActive={aboutTab === 'quests'} 
                      onClick={() => setAboutTab('quests')}
                    />
                    <AboutTabButton 
                      label="INVENTORY" 
                      isActive={aboutTab === 'inventory'} 
                      onClick={() => setAboutTab('inventory')}
                    />
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {aboutTab === 'story' && (
                      <motion.div
                        key="story-tab"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-white relative"
                      >
                        {/* Story background elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#1a1c2c] opacity-20 pixelated" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#ffcc55] opacity-10 pixelated"></div>
                        
                        {/* Story content based on progress */}
                        {storyProgress === 0 && (
                          <>
                            <TypewriterText
                              text="Greetings, fellow gamers! I'm KannaCS, a dedicated developer and gaming enthusiast."
                              delay={20}
                              className="mb-4"
                              key="intro-text-1"
                            />
                            
                            <TypewriterText
                              text="My journey began with the PS 1 back in the day, and I've been hooked on gaming ever since. Along the way, I discovered my passion for coding and creating games."
                              delay={10}
                              startDelay={1500}
                              className="mb-4"
                              key="intro-text-2"
                            />
                            
                            <TypewriterText
                              text="When I'm not playing games, I'm developing them or building cool web applications using modern technologies like React and TypeScript."
                              delay={15}
                              startDelay={3500}
                              className="mb-4"
                              key="intro-text-3"
                            />
                            
                            <motion.div
                              className="mt-6 flex justify-between"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 5.5 }}
                            >
                              <InteractiveStoryButton
                                label="ASK ABOUT GAMES"
                                onClick={() => {
                                  playSelectSound();
                                  setStoryProgress(1);
                                  setStoryChoices([...storyChoices, "Asked about games"]);
                                }}
                              />
                              
                              <InteractiveStoryButton
                                label="ASK ABOUT CODING"
                                onClick={() => {
                                  playSelectSound();
                                  setStoryProgress(2);
                                  setStoryChoices([...storyChoices, "Asked about coding"]);
                                }}
                              />
                            </motion.div>
                          </>
                        )}
                        
                        {storyProgress === 1 && (
                          <>
                            <div className="flex items-start mb-4">
                              <div className="bg-[#29adff] text-[#1a1c2c] px-2 py-1 text-xs mr-2 mt-1">YOU</div>
                              <div className="flex-1 bg-[#3a4466] p-2 text-sm relative">
                                <div className="absolute -top-2 left-2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#3a4466]"></div>
                                <TypewriterText 
                                  text="What games are you currently playing? Any recommendations?" 
                                  delay={10}
                                  key="question-games"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-start mb-8">
                              <div className="w-8 h-8 bg-[#1a1c2c] mr-2 overflow-hidden">
                                <img src="/profile.jpg" alt="KannaCS" className="w-full h-full object-cover pixelated" />
                              </div>
                              
                              <div className="flex-1 bg-[#1a1c2c] p-2 text-sm relative">
                                <div className="absolute -top-2 left-2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#1a1c2c]"></div>
                                <TypewriterText 
                                  text="I've been playing Helldivers 2 lately - the co-op chaos is absolutely addictive! Something about the mix of strategy and over-the-top action just clicks with me." 
                                  delay={15}
                                  className="mb-3"
                                  key="answer-1-games"
                                />
                                
                                <TypewriterText 
                                  text="I also love going back to classic RTS games like Age of Empires and Knights of Honor Sovereign. Strategy games have always been my comfort zone when I need to relax but still keep my brain engaged." 
                                  delay={15}
                                  startDelay={3000}
                                  key="answer-2-games"
                                />
                              </div>
                            </div>
                            
                            <motion.div
                              className="mt-6 space-y-2 p-2 bg-[#1a1c2c]"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 8 }}
                            >
                              <div className="text-[#8595a1] text-xs mb-2">GAMES MENTIONED:</div>
                              <div className="grid grid-cols-3 gap-2">
                                <GameReference name="HELLDIVERS 2" year="2024" platform="PC/PS5" />
                                <GameReference name="AGE OF EMPIRES" year="1997-2023" platform="PC" />
                                <GameReference name="KNIGHTS OF HONOR" year="2023" platform="PC" />
                              </div>
                            </motion.div>
                            
                            <motion.div
                              className="mt-6 flex justify-between"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 9 }}
                            >
                              <InteractiveStoryButton
                                label="ASK ABOUT CODING"
                                onClick={() => {
                                  playSelectSound();
                                  setStoryProgress(2);
                                  setStoryChoices([...storyChoices, "Asked about art"]);
                                }}
                              />
                              
                              <InteractiveStoryButton
                                label="JOIN PARTY"
                                onClick={() => {
                                  playSelectSound();
                                  setStoryProgress(3);
                                  setStoryChoices([...storyChoices, "Joined party"]);
                                  
                                  // Show party joined confirmation with special effect
                                  const confirmation = document.createElement('div');
                                  confirmation.setAttribute('class', 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-4 text-lg z-50 border-2 border-[#ffcc55]');
                                  confirmation.innerHTML = '<div class="text-center"><div class="text-[#ffcc55] mb-2">! PARTY JOINED !</div><div class="text-sm">You are now adventuring with KannaCS</div></div>';
                                  document.body.appendChild(confirmation);
                                  
                                  // Play special sound
                                  try {
                                    const audio = new Audio('/select.mp3');
                                    audio.volume = 0.3;
                                    audio.playbackRate = 0.8;
                                    audio.play();
                                  } catch (error) {
                                    console.log('Audio playback failed');
                                  }
                                  
                                  setTimeout(() => {
                                    confirmation.style.opacity = '0';
                                    confirmation.style.transition = 'opacity 0.5s';
                                    setTimeout(() => confirmation.remove(), 500);
                                  }, 2000);
                                }}
                              />
                            </motion.div>
                          </>
                        )}
                        
                        {storyProgress === 2 && (
                          <>
                            <div className="flex items-start mb-4">
                              <div className="bg-[#29adff] text-[#1a1c2c] px-2 py-1 text-xs mr-2 mt-1">YOU</div>
                              <div className="flex-1 bg-[#3a4466] p-2 text-sm relative">
                                <div className="absolute -top-2 left-2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#3a4466]"></div>
                                <TypewriterText 
                                  text="Tell me about your coding journey! How did you get into development?" 
                                  delay={10}
                                  key="question-coding"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-start mb-6">
                              <div className="w-8 h-8 bg-[#1a1c2c] mr-2 overflow-hidden">
                                <img src="/profile.jpg" alt="KannaCS" className="w-full h-full object-cover pixelated" />
                              </div>
                              
                              <div className="flex-1 bg-[#1a1c2c] p-2 text-sm relative">
                                <div className="absolute -top-2 left-2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#1a1c2c]"></div>
                                <TypewriterText 
                                  text="I started with HTML and later mastered Java. I'm also exploring other languages and frameworks as I continue my development journey."
                                  delay={15}
                                  className="mb-3"
                                  key="answer-1-coding"
                                />
                                
                                <TypewriterText 
                                  text="The beauty of programming is there's always something new to learn. While I'm confident in some technologies, I enjoy being a beginner in others and constantly expanding my skillset."
                                  delay={15}
                                  startDelay={3000}
                                  className="mb-3"
                                  key="answer-2-coding"
                                />
                                
                                <TypewriterText 
                                  text="Here's where I am with different languages:"
                                  delay={15}
                                  startDelay={6000}
                                  key="answer-3-coding"
                                />
                              </div>
                            </div>
                            
                            <motion.div 
                              className="grid grid-cols-3 gap-2 mb-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 7.5 }}
                            >
                              <div className="bg-[#1a1c2c] p-2">
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 flex items-center justify-center text-sm bg-[#ffcc55] text-black mr-2 font-bold">
                                    M
                                  </div>
                                  <span className="text-white">HTML</span>
                                </div>
                                <div className="w-full bg-[#0f0f1b] h-2">
                                  <div className="h-full bg-[#ffcc55]" style={{ width: '95%' }}></div>
                                </div>
                                <div className="text-xs text-right text-[#8595a1] mt-1">MASTERED</div>
                              </div>
                              
                              <div className="bg-[#1a1c2c] p-2">
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 flex items-center justify-center text-sm bg-[#ffcc55] text-black mr-2 font-bold">
                                    M
                                  </div>
                                  <span className="text-white">Java</span>
                                </div>
                                <div className="w-full bg-[#0f0f1b] h-2">
                                  <div className="h-full bg-[#ffcc55]" style={{ width: '90%' }}></div>
                                </div>
                                <div className="text-xs text-right text-[#8595a1] mt-1">MASTERED</div>
                              </div>
                              
                              <div className="bg-[#1a1c2c] p-2">
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 flex items-center justify-center text-sm bg-[#3a4466] text-[#8595a1] mr-2">
                                    B
                                  </div>
                                  <span className="text-white">JavaScript</span>
                                </div>
                                <div className="w-full bg-[#0f0f1b] h-2">
                                  <div className="h-full bg-[#3a4466]" style={{ width: '60%' }}></div>
                                </div>
                                <div className="text-xs text-right text-[#8595a1] mt-1">BEGINNER</div>
                              </div>
                            </motion.div>
                            
                            <motion.div 
                              className="grid grid-cols-3 gap-2 mb-6"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 8 }}
                            >
                              <div className="bg-[#1a1c2c] p-2">
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 flex items-center justify-center text-sm bg-[#3a4466] text-[#8595a1] mr-2">
                                    B
                                  </div>
                                  <span className="text-white">React</span>
                                </div>
                                <div className="w-full bg-[#0f0f1b] h-2">
                                  <div className="h-full bg-[#3a4466]" style={{ width: '45%' }}></div>
                                </div>
                                <div className="text-xs text-right text-[#8595a1] mt-1">BEGINNER</div>
                              </div>
                              
                              <div className="bg-[#1a1c2c] p-2">
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 flex items-center justify-center text-sm bg-[#3a4466] text-[#8595a1] mr-2">
                                    B
                                  </div>
                                  <span className="text-white">TypeScript</span>
                                </div>
                                <div className="w-full bg-[#0f0f1b] h-2">
                                  <div className="h-full bg-[#3a4466]" style={{ width: '30%' }}></div>
                                </div>
                                <div className="text-xs text-right text-[#8595a1] mt-1">BEGINNER</div>
                              </div>
                              
                              <div className="bg-[#1a1c2c] p-2">
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 flex items-center justify-center text-sm bg-[#3a4466] text-[#8595a1] mr-2">
                                    B
                                  </div>
                                  <span className="text-white">CSS</span>
                                </div>
                                <div className="w-full bg-[#0f0f1b] h-2">
                                  <div className="h-full bg-[#3a4466]" style={{ width: '50%' }}></div>
                                </div>
                                <div className="text-xs text-right text-[#8595a1] mt-1">BEGINNER</div>
                              </div>
                            </motion.div>
                            
                            <motion.div
                              className="mt-6 flex justify-between"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 9 }}
                            >
                              <InteractiveStoryButton
                                label="ASK ABOUT GAMES"
                                onClick={() => {
                                  playSelectSound();
                                  setStoryProgress(1);
                                  setStoryChoices([...storyChoices, "Asked about games"]);
                                }}
                              />
                              
                              <InteractiveStoryButton
                                label="JOIN PARTY"
                                onClick={() => {
                                  playSelectSound();
                                  setStoryProgress(3);
                                  setStoryChoices([...storyChoices, "Joined party"]);
                                  
                                  // Show party joined confirmation with special effect
                                  const confirmation = document.createElement('div');
                                  confirmation.setAttribute('class', 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-4 text-lg z-50 border-2 border-[#ffcc55]');
                                  confirmation.innerHTML = '<div class="text-center"><div class="text-[#ffcc55] mb-2">! PARTY JOINED !</div><div class="text-sm">You are now adventuring with KannaCS</div></div>';
                                  document.body.appendChild(confirmation);
                                  
                                  // Play special sound
                                  try {
                                    const audio = new Audio('/select.mp3');
                                    audio.volume = 0.3;
                                    audio.playbackRate = 0.8;
                                    audio.play();
                                  } catch (error) {
                                    console.log('Audio playback failed');
                                  }
                                  
                                  setTimeout(() => {
                                    confirmation.style.opacity = '0';
                                    confirmation.style.transition = 'opacity 0.5s';
                                    setTimeout(() => confirmation.remove(), 500);
                                  }, 2000);
                                }}
                              />
                            </motion.div>
                          </>
                        )}
                        
                        {storyProgress === 3 && (
                          <>
                            <motion.div
                              className="mx-auto bg-[#1a1c2c] p-4 border-2 border-[#ffcc55] relative"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                              <div className="text-center mb-4">
                                <div className="text-[#ffcc55] font-bold text-lg">PARTY STATUS</div>
                                <div className="w-full h-1 bg-[#ffcc55]"></div>
                              </div>
                              
                              <div className="flex mb-6">
                                <div className="w-16 h-16 bg-[#262b44] mr-4 p-1">
                                  <img src="/profile.jpg" alt="KannaCS" className="w-full h-full object-cover pixelated" />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="text-[#ffcc55] font-bold">KannaCS</div>
                                  <div className="text-xs text-[#8595a1] mb-1">LVL {gameStats.level} PIXEL ARTIST</div>
                                  <div className="w-full bg-[#0f0f1b] h-1 mb-2">
                                    <div className="bg-[#ff004d] h-full" style={{ width: `${(gameStats.experience / gameStats.nextLevelXp) * 100}%` }}></div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 text-xs">
                                    <div>
                                      <span className="text-[#8595a1]">CREATIVITY:</span> <span className="text-white">85</span>
                                    </div>
                                    <div>
                                      <span className="text-[#8595a1]">GAMING:</span> <span className="text-white">92</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-sm mb-4">
                                <TypewriterText
                                  text="Thanks for joining my party! Together, we can crush those aliens and seek democracy!"
                                  delay={20}
                                  key="party-joined-text"
                                />
                              </div>
                              
                              <div className="text-xs text-[#8595a1] mb-2">YOUR ADVENTURE LOG:</div>
                              <div className="bg-[#262b44] p-2 text-xs max-h-20 overflow-y-auto">
                                {storyChoices.map((choice, index) => (
                                  <div key={index} className="mb-1">
                                    <span className="text-[#29adff]">▶</span> {choice}
                                  </div>
                                ))}
                                <div className="text-[#00e756]">
                                  <span className="text-[#00e756]">▶</span> Joined KannaCS's party
                                </div>
                              </div>
                              
                              <div className="mt-4 text-center">
                                <InteractiveButton
                                  label="CONTINUE ADVENTURE"
                                  onClick={() => {
                                    playSelectSound();
                                    // Set to inventory tab to see your equipment
                                    setAboutTab('inventory');
                                    
                                    // Show tutorial prompt
                                    const tutorial = document.createElement('div');
                                    tutorial.setAttribute('class', 'fixed bottom-4 right-4 bg-[#262b44] text-white px-3 py-2 text-sm z-50 border border-[#3a4466]');
                                    tutorial.innerHTML = 'Check your inventory to equip items for the adventure!';
                                    document.body.appendChild(tutorial);
                                    
                                    setTimeout(() => {
                                      tutorial.style.opacity = '0';
                                      tutorial.style.transition = 'opacity 0.5s';
                                      setTimeout(() => tutorial.remove(), 500);
                                    }, 3000);
                                  }}
                                />
                              </div>
                            </motion.div>
                          </>
                        )}
                      </motion.div>
                    )}
                    
                    {aboutTab === 'quests' && (
                      <motion.div
                        key="quests-tab"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-3"
                      >
                        <QuestItem
                          title="Pixel Master"
                          description="Create 100 pixel art designs"
                          progress={63}
                          reward="Unlocks special color palette"
                        />
                        
                        <QuestItem
                          title="Game Collector"
                          description="Add 50 retro games to collection"
                          progress={84}
                          reward="+50 Nostalgia points"
                          isActive={true}
                        />
                        
                        <QuestItem
                          title="Social Butterfly"
                          description="Connect with 20 fellow gamers"
                          progress={45}
                          reward="Unlocks multiplayer mode"
                        />
                        
                        <QuestItem
                          title="Streaming Star"
                          description="Stream for 100 hours"
                          progress={27}
                          reward="Special profile badge"
                        />
                        
                        <div className="flex justify-end mt-4">
                          <InteractiveButton
                            label="TRACK QUEST"
                            onClick={() => {
                              playSelectSound();
                              
                              // Show quest tracking confirmation
                              const confirmation = document.createElement('div');
                              confirmation.setAttribute('class', 'fixed top-4 right-4 bg-[#29adff] text-white px-3 py-2 text-sm z-50');
                              confirmation.textContent = 'Quest tracking activated!';
                              confirmation.style.animation = 'fade-in-out 2s forwards';
                              document.body.appendChild(confirmation);
                              setTimeout(() => confirmation.remove(), 2000);
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                    
                    {aboutTab === 'inventory' && (
                      <motion.div
                        key="inventory-tab"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                      >
                        {/* Inventory header with sorting controls */}
                        <div className="flex justify-between items-center bg-[#1a1c2c] p-2">
                          <div className="text-[#8595a1] text-xs">INVENTORY ({inventoryItems.length})</div>
                          <div className="flex space-x-2">
                            <button 
                              className="text-xs text-[#8595a1] hover:text-white px-2 py-1 hover:bg-[#3a4466] transition-colors"
                              onClick={() => {
                                playSelectSound();
                                // Would implement sorting logic here
                              }}
                            >
                              SORT BY RARITY
                            </button>
                            <button 
                              className="text-xs text-[#8595a1] hover:text-white px-2 py-1 hover:bg-[#3a4466] transition-colors"
                              onClick={() => {
                                playSelectSound();
                                // Would implement filtering logic here
                              }}
                            >
                              FILTER
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2">
                          {inventoryItems.map(item => (
                            <InventoryItem
                              key={item.id}
                              id={item.id}
                              name={item.name}
                              icon={item.icon}
                              rarity={item.rarity}
                              color={item.color}
                              isSelected={selectedInventoryItem === item.id}
                              isEquipped={equippedItem === item.name}
                              onClick={() => {
                                playSelectSound();
                                setSelectedInventoryItem(item.id === selectedInventoryItem ? null : item.id);
                                
                                // Add selection animation
                                if (item.id !== selectedInventoryItem) {
                                  const itemElement = document.querySelector(`[data-item-id="${item.id}"]`);
                                  if (itemElement) {
                                    const glow = document.createElement('div');
                                    glow.className = 'absolute inset-0 opacity-0';
                                    glow.style.boxShadow = `0 0 10px 2px ${item.color}`;
                                    glow.style.animation = 'pulse-glow 0.6s forwards';
                                    itemElement.appendChild(glow);
                                    setTimeout(() => glow.remove(), 600);
                                  }
                                }
                              }}
                            />
                          ))}
                        </div>
                        
                        <div className="bg-[#1a1c2c] p-3 mt-4">
                          {selectedInventoryItem ? (
                            <>
                              <div className="text-[#8595a1] text-xs mb-2">SELECTED ITEM</div>
                              {(() => {
                                const selectedItem = inventoryItems.find(i => i.id === selectedInventoryItem);
                                if (!selectedItem) return null;
                                
                                return (
                                  <div className="space-y-3">
                                    <div className="flex items-center">
                                      <div className="w-12 h-12 bg-[#383880] flex items-center justify-center text-2xl mr-3 relative">
                                        {selectedItem.icon}
                                        <motion.div
                                          className="absolute inset-0 border-2 border-white opacity-0"
                                          animate={{ opacity: [0, 0.8, 0] }}
                                          transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                      </div>
                                      <div>
                                        <div className="text-white font-bold" style={{ color: selectedItem.color }}>{selectedItem.name}</div>
                                        <div className="text-white text-xs flex items-center">
                                          <span className="mr-2">{selectedItem.bonus} when equipped</span>
                                          <span className="text-[#8595a1] text-xxs px-1 py-0.5 bg-[#262b44]">{selectedItem.rarity}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="text-[#8595a1] text-xs">{selectedItem.description}</div>
                                    
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                      {equippedItem !== selectedItem.name ? (
                                        <motion.button
                                          className="bg-[#00e756] text-black px-2 py-1 text-xs flex items-center justify-center"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => {
                                            const itemToEquip = inventoryItems.find(i => i.id === selectedInventoryItem);
                                            if (!itemToEquip) return;
                                            
                                            playSelectSound();
                                            setEquippedItem(itemToEquip.name);
                                            
                                            // Show equip confirmation
                                            const confirmation = document.createElement('div');
                                            confirmation.setAttribute('class', 'fixed top-4 right-4 bg-[#00e756] text-white px-3 py-2 text-sm z-50');
                                            confirmation.textContent = `${itemToEquip.name} equipped!`;
                                            confirmation.style.animation = 'fade-in-out 2s forwards';
                                            document.body.appendChild(confirmation);
                                            setTimeout(() => confirmation.remove(), 2000);
                                            
                                            // Item equip effects
                                            const itemEffects = document.createElement('div');
                                            itemEffects.setAttribute('class', 'absolute inset-0 pointer-events-none');
                                            for (let i = 0; i < 10; i++) {
                                              const spark = document.createElement('div');
                                              spark.className = 'absolute w-1 h-1';
                                              spark.style.backgroundColor = itemToEquip.color;
                                              spark.style.left = '50%';
                                              spark.style.top = '50%';
                                              spark.style.transform = 'translate(-50%, -50%)';
                                              spark.style.animation = `float-up 1s ease-out ${Math.random() * 0.5}s forwards`;
                                              itemEffects.appendChild(spark);
                                            }
                                            
                                            const selectedItemDisplay = document.querySelector('.selected-item-display');
                                            if (selectedItemDisplay) {
                                              selectedItemDisplay.appendChild(itemEffects);
                                              setTimeout(() => itemEffects.remove(), 2000);
                                            }
                                          }}
                                        >
                                          EQUIP
                                        </motion.button>
                                      ) : (
                                        <motion.button
                                          className="bg-[#ff004d] text-white px-2 py-1 text-xs flex items-center justify-center"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => {
                                            const itemToUnequip = inventoryItems.find(i => i.id === selectedInventoryItem);
                                            if (!itemToUnequip) return;
                                            
                                            playSelectSound();
                                            setEquippedItem("");
                                            
                                            // Show unequip confirmation
                                            const confirmation = document.createElement('div');
                                            confirmation.setAttribute('class', 'fixed top-4 right-4 bg-[#ff004d] text-white px-3 py-2 text-sm z-50');
                                            confirmation.textContent = `${itemToUnequip.name} unequipped`;
                                            confirmation.style.animation = 'fade-in-out 2s forwards';
                                            document.body.appendChild(confirmation);
                                            setTimeout(() => confirmation.remove(), 2000);
                                          }}
                                        >
                                          UNEQUIP
                                        </motion.button>
                                      )}
                                      
                                      <motion.button
                                        className="bg-[#3a4466] text-[#8595a1] px-2 py-1 text-xs flex items-center justify-center"
                                        whileHover={{ scale: 1.05, color: '#ffffff' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          const itemToUse = inventoryItems.find(i => i.id === selectedInventoryItem);
                                          if (!itemToUse) return;
                                          
                                          playSelectSound();
                                          
                                          // Show item use animation
                                          const useAnimation = document.createElement('div');
                                          useAnimation.setAttribute('class', 'fixed inset-0 flex items-center justify-center pointer-events-none z-50');
                                          const icon = document.createElement('div');
                                          icon.textContent = itemToUse.icon;
                                          icon.style.fontSize = '100px';
                                          icon.style.animation = 'item-use 1s forwards';
                                          useAnimation.appendChild(icon);
                                          document.body.appendChild(useAnimation);
                                          
                                          // Custom use effect based on item
                                          let message = "";
                                          if (itemToUse.id === "pixel-brush") {
                                            message = "Created a pixel masterpiece!";
                                            // Could trigger specific actions based on item used
                                            setGameStats(prev => ({
                                              ...prev,
                                              experience: Math.min(prev.experience + 10, prev.nextLevelXp)
                                            }));
                                          } else if (itemToUse.id === "game-cartridge") {
                                            message = "Played a classic game!";
                                            setGameStats(prev => ({
                                              ...prev,
                                              experience: Math.min(prev.experience + 15, prev.nextLevelXp)
                                            }));
                                          } else if (itemToUse.id === "retro-console") {
                                            message = "Enjoyed some retro gaming!";
                                            setGameStats(prev => ({
                                              ...prev,
                                              experience: Math.min(prev.experience + 25, prev.nextLevelXp)
                                            }));
                                          } else if (itemToUse.id === "dev-manual") {
                                            message = "Learned a new coding trick!";
                                            setGameStats(prev => ({
                                              ...prev,
                                              experience: Math.min(prev.experience + 20, prev.nextLevelXp)
                                            }));
                                          }
                                          
                                          setTimeout(() => {
                                            useAnimation.remove();
                                            
                                            // Show use confirmation
                                            const confirmation = document.createElement('div');
                                            confirmation.setAttribute('class', 'fixed top-4 right-4 bg-[#29adff] text-white px-3 py-2 text-sm z-50');
                                            confirmation.textContent = message;
                                            confirmation.style.animation = 'fade-in-out 2s forwards';
                                            document.body.appendChild(confirmation);
                                            setTimeout(() => confirmation.remove(), 2000);
                                            
                                            // Check for level up
                                            if (gameStats.experience >= gameStats.nextLevelXp) {
                                              levelUp();
                                            }
                                          }, 1000);
                                        }}
                                      >
                                        USE ITEM
                                      </motion.button>
                                    </div>
                                  </div>
                                );
                              })()}
                            </>
                          ) : (
                            <div className="text-center py-4 text-[#8595a1]">
                              Select an item to view details
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-[#1a1c2c] p-3 mt-4 selected-item-display">
                          <div className="text-[#8595a1] text-xs mb-2">EQUIPPED ITEM</div>
                          {equippedItem ? (
                            (() => {
                              const equippedItemData = inventoryItems.find(i => i.name === equippedItem);
                              if (!equippedItemData) return (
                                <div className="text-center py-4 text-[#8595a1]">
                                  No item equipped
                                </div>
                              );
                              
                              return (
                                <div className="flex items-center">
                                  <div className="w-12 h-12 bg-[#383880] flex items-center justify-center text-2xl mr-3 relative">
                                    {equippedItemData.icon}
                                    {/* Pulsing equipped item effect */}
                                    <motion.div
                                      className="absolute inset-0 border-2"
                                      style={{ borderColor: equippedItemData.color }}
                                      animate={{ 
                                        boxShadow: [
                                          `0 0 0px ${equippedItemData.color}`,
                                          `0 0 8px ${equippedItemData.color}`,
                                          `0 0 0px ${equippedItemData.color}`
                                        ]
                                      }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    />
                                  </div>
                                  <div>
                                    <div className="text-white font-bold" style={{ color: equippedItemData.color }}>{equippedItemData.name}</div>
                                    <div className="text-white text-xs">{equippedItemData.bonus} active</div>
                                    <div className="h-1 w-full bg-[#262b44] mt-1">
                                      <motion.div 
                                        className="h-full" 
                                        style={{ backgroundColor: equippedItemData.color }}
                                        animate={{ width: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="text-center py-4 text-[#8595a1]">
                              No item equipped
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'contact':
        return (
          <div className="space-y-8">
            <motion.h2 
              className="text-3xl font-bold text-[#29adff] pixel-text"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
            >
              CONTACT
            </motion.h2>
            
            <div className="bg-[#262b44] border-4 border-[#3a4466] p-5">
              <motion.h3 
                className="text-xl font-bold text-[#29adff] mb-4 relative inline-block"
                whileHover={{ scale: 1.05 }}
              >
                GET IN TOUCH
                <motion.div 
                  className="absolute bottom-0 left-0 h-1 bg-[#29adff]" 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8 }}
                />
              </motion.h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Left column - Contact methods */}
                <div className="space-y-4">
                  {/* Email contact card */}
                  <ContactCard 
                    icon="📧" 
                    color="#29adff" 
                    label="EMAIL" 
                    value="Kannacsx@gmail.com" 
                    onClick={() => {
                      navigator.clipboard.writeText("Kannacsx@gmail.com");
                      playSelectSound();
                      // Show copy confirmation
                      const confirmation = document.createElement('div');
                      confirmation.setAttribute('class', 'fixed top-4 right-4 bg-[#29adff] text-white px-3 py-2 text-sm z-50');
                      confirmation.textContent = 'Email copied to clipboard!';
                      confirmation.style.animation = 'fade-in-out 2s forwards';
                      document.body.appendChild(confirmation);
                      setTimeout(() => confirmation.remove(), 2000);
                    }}
                  />
                  
                  {/* Steam contact card */}
                  <ContactCard 
                    icon="🎮" 
                    color="#1b2838" 
                    label="STEAM" 
                    value="KannaCSX" 
                    badge="ONLINE"
                    badgeColor="#00e756"
                    onClick={() => {
                      window.open('https://steamcommunity.com/id/KannaCSX', '_blank');
                      playSelectSound();
                    }}
                  />
                  
                  {/* Discord contact card */}
                  <ContactCard 
                    icon="👾" 
                    color="#5865F2" 
                    label="DISCORD" 
                    value="PenelopeEckartx" 
                    badge="ACTIVE"
                    badgeColor="#00e756"
                    onClick={() => {
                      navigator.clipboard.writeText("PenelopeEckartx");
                      playSelectSound();
                      // Show copy confirmation
                      const confirmation = document.createElement('div');
                      confirmation.setAttribute('class', 'fixed top-4 right-4 bg-[#5865F2] text-white px-3 py-2 text-sm z-50');
                      confirmation.textContent = 'Discord username copied!';
                      confirmation.style.animation = 'fade-in-out 2s forwards';
                      document.body.appendChild(confirmation);
                      setTimeout(() => confirmation.remove(), 2000);
                    }}
                  />
                  
                  {/* PlayStation Network contact card */}
                  <ContactCard 
                    icon="🎮" 
                    color="#0070d1" 
                    label="PLAYSTATION NETWORK" 
                    value="KannaCS" 
                    badge="OFFLINE"
                    badgeColor="#8595a1"
                    onClick={() => {
                      navigator.clipboard.writeText("KannaCS");
                      playSelectSound();
                      // Show copy confirmation
                      const confirmation = document.createElement('div');
                      confirmation.setAttribute('class', 'fixed top-4 right-4 bg-[#0070d1] text-white px-3 py-2 text-sm z-50');
                      confirmation.textContent = 'PSN ID copied!';
                      confirmation.style.animation = 'fade-in-out 2s forwards';
                      document.body.appendChild(confirmation);
                      setTimeout(() => confirmation.remove(), 2000);
                    }}
                  />
                  
                  {/* Xbox Live contact card */}
                  <ContactCard 
                    icon="🎮" 
                    color="#107c10" 
                    label="XBOX LIVE" 
                    value="KannaCSC" 
                    onClick={() => {
                      navigator.clipboard.writeText("KannaCSC");
                      playSelectSound();
                      // Show copy confirmation
                      const confirmation = document.createElement('div');
                      confirmation.setAttribute('class', 'fixed top-4 right-4 bg-[#107c10] text-white px-3 py-2 text-sm z-50');
                      confirmation.textContent = 'Xbox Live ID copied!';
                      confirmation.style.animation = 'fade-in-out 2s forwards';
                      document.body.appendChild(confirmation);
                      setTimeout(() => confirmation.remove(), 2000);
                    }}
                  />
                </div>
                
                {/* Right column - Interactive message form */}
                <div className="bg-[#1a1c2c] p-4">
                  <h4 className="text-[#29adff] mb-3 text-sm">SEND MESSAGE</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[#8595a1] text-xs block mb-1">YOUR NAME</label>
                      <input 
                        type="text" 
                        className="w-full bg-[#262b44] border border-[#3a4466] text-white px-2 py-1 text-sm focus:border-[#29adff] focus:outline-none"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[#8595a1] text-xs block mb-1">YOUR EMAIL</label>
                      <input 
                        type="email" 
                        className="w-full bg-[#262b44] border border-[#3a4466] text-white px-2 py-1 text-sm focus:border-[#29adff] focus:outline-none"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[#8595a1] text-xs block mb-1">MESSAGE</label>
                      <textarea 
                        className="w-full bg-[#262b44] border border-[#3a4466] text-white px-2 py-1 text-sm h-24 resize-none focus:border-[#29adff] focus:outline-none"
                        placeholder="Write your message here..."
                      />
                    </div>
                    
                    <motion.button
                      className="bg-[#29adff] text-white px-4 py-2 text-sm w-full relative overflow-hidden message-button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={() => playSoundEffect('hover', 0.1)}
                      onClick={() => {
                        playSoundEffect('click', 0.2);
                        
                        // Message sending simulation with pixel animation
                        const button = document.querySelector('.message-button');
                        if (button) {
                          // Create loading animation
                          button.textContent = 'SENDING...';
                          button.classList.add('disabled');
                          
                          // Create pixel confetti effect
                          const pixels = document.createElement('div');
                          pixels.setAttribute('class', 'absolute inset-0 pointer-events-none');
                          
                          for (let i = 0; i < 20; i++) {
                            const pixel = document.createElement('div');
                            pixel.setAttribute('class', 'absolute w-1 h-1');
                            pixel.style.backgroundColor = ['#29adff', '#ffffff', '#00e756'][Math.floor(Math.random() * 3)];
                            pixel.style.left = `${Math.random() * 100}%`;
                            pixel.style.top = `${Math.random() * 100}%`;
                            pixel.style.transform = 'scale(0)';
                            pixel.style.animation = `pixel-send 0.8s ease-out ${Math.random() * 0.5}s forwards`;
                            pixels.appendChild(pixel);
                          }
                          
                          button.appendChild(pixels);
                          
                          // Simulate message sending
                          setTimeout(() => {
                            // Show success message
                            const confirmation = document.createElement('div');
                            confirmation.setAttribute('class', 'fixed top-4 right-4 bg-[#00e756] text-white px-3 py-2 text-sm z-50');
                            confirmation.innerHTML = 'Message sent successfully!<br><span class="text-xs">I\'ll get back to you soon.</span>';
                            confirmation.style.animation = 'fade-in-out 3s forwards';
                            document.body.appendChild(confirmation);
                            
                            // Reset form
                            button.textContent = 'SEND MESSAGE';
                            button.classList.remove('disabled');
                            
                            // Clear inputs
                            const inputs = document.querySelectorAll('input, textarea');
                            inputs.forEach(input => {
                              if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                                input.value = '';
                              }
                            });
                            
                            // Remove pixels after animation
                            setTimeout(() => pixels.remove(), 1000);
                            setTimeout(() => confirmation.remove(), 3000);
                          }, 2000);
                        }
                      }}
                    >
                      SEND MESSAGE
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Social media connections */}
              <div className="mt-6">
                <h4 className="text-[#8595a1] text-sm mb-3">CONNECT WITH ME</h4>
                <div className="flex space-x-3">
                  <SocialButton icon="🌐" tooltip="Website" color="#29adff" />
                  <SocialButton icon="🐦" tooltip="Twitter" color="#1DA1F2" />
                  <SocialButton icon="📸" tooltip="Instagram" color="#E1306C" />
                  <SocialButton icon="📺" tooltip="YouTube" color="#FF0000" />
                  <SocialButton icon="🎬" tooltip="Twitch" color="#6441A4" />
                </div>
              </div>
              
              {/* Current status and availability */}
              <div className="mt-6 bg-[#1a1c2c] p-3">
                <div className="flex items-center">
                  <motion.div 
                    className="w-3 h-3 bg-[#00e756] rounded-full mr-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div>
                    <div className="text-[#8595a1] text-xs">CURRENT STATUS</div>
                    <div className="text-white text-sm">Available for web dev commission</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pixel decorations */}
            <div className="absolute bottom-6 right-6 w-4 h-4 bg-[#29adff]"></div>
            <div className="absolute bottom-6 right-12 w-4 h-4 bg-[#29adff]"></div>
            <div className="absolute bottom-12 right-6 w-4 h-4 bg-[#29adff]"></div>
          </div>
        );
        
      case 'privacy':
        return (
          <div className="space-y-8">
            <motion.h2 
              className="text-3xl font-bold text-[#00e756] pixel-text"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
            >
              PRIVACY & POLICY
            </motion.h2>
            
            <div className="bg-[#262b44] border-4 border-[#3a4466] p-5 overflow-auto max-h-[60vh] relative policy-container">
              {showDeathAnimation ? (
                <motion.div 
                  className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Pixelated TV turn off effect - covers the entire screen */}
                  <motion.div 
                    className="fixed inset-0 bg-[#1a1c2c] z-40 overflow-hidden"
                    initial={{ opacity: 1 }}
                  >
                    {/* CRT screen collapse effect */}
                    <motion.div 
                      className="absolute inset-0 bg-[#1a1c2c]"
                      initial={{ scaleY: 1 }}
                      animate={{ 
                        scaleY: [1, 0.1, 0.01],
                      }}
                      transition={{ 
                        duration: 0.5, 
                        times: [0, 0.8, 1],
                        ease: "easeIn"
                      }}
                    >
                      {/* Horizontal line blocks to create a pixelated effect */}
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-full h-4 bg-[#383880]"></div>
                        <div className="w-full h-2 bg-white"></div>
                        <div className="w-full h-4 bg-[#383880]"></div>
                      </div>
                    </motion.div>
                    
                    {/* Static noise effect */}
                    <div className="absolute inset-0">
                      {Array.from({ length: 100 }).map((_, i) => (
                        <motion.div 
                          key={i}
                          className="absolute bg-white"
                          style={{
                            width: '4px',
                            height: '4px',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [1, 1.5, 1]
                          }}
                          transition={{
                            repeat: 3,
                            duration: 0.2,
                            delay: Math.random() * 0.5
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Dark overlay with pixel content */}
                  <motion.div 
                    className="fixed inset-0 bg-black/95 z-42 flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    {/* Pixel art skull */}
                    <motion.div 
                      className="w-32 h-32 mb-8 relative"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                      }}
                      transition={{ duration: 0.5, delay: 1, times: [0, 0.7, 1] }}
                    >
                      <div className="w-12 h-12 bg-[#ffec27] absolute left-10 top-2"></div>
                      <div className="w-4 h-4 bg-white absolute left-12 top-6"></div>
                      <div className="w-4 h-4 bg-white absolute left-20 top-6"></div>
                      <div className="w-4 h-4 bg-black absolute left-12 top-6"></div>
                      <div className="w-4 h-4 bg-black absolute left-20 top-6"></div>
                      <div className="w-12 h-2 bg-[#ff004d] absolute left-10 top-14"></div>
                      <div className="w-16 h-8 bg-[#ffec27] absolute left-8 top-16"></div>
                    </motion.div>
                    
                    {/* Pixelated Game Over text */}
                    <motion.div
                      className="pixel-text-large text-4xl font-bold mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      <span className="text-[#ff004d]">G</span>
                      <span className="text-[#ff004d]">A</span>
                      <span className="text-[#ff004d]">M</span>
                      <span className="text-[#ff004d]">E</span>
                      <span className="text-white mx-2">O</span>
                      <span className="text-[#ff004d]">V</span>
                      <span className="text-[#ff004d]">E</span>
                      <span className="text-[#ff004d]">R</span>
                    </motion.div>
                    
                    <motion.div
                      className="text-[#8595a1] text-sm mb-8 pixel-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                    >
                      PRIVACY POLICY REJECTED
                    </motion.div>
                    
                    {/* Pixelated button */}
                    <motion.button
                      className="bg-transparent border-2 border-[#ff004d] text-[#ff004d] px-8 py-2 pixel-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.1 }}
                      onClick={() => setShowDeathAnimation(false)}
                      whileHover={{ 
                        backgroundColor: "#ff004d",
                        color: "#000000",
                        transition: { duration: 0.1 }
                      }}
                    >
                      RETRY
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-[#00e756] mb-4">DATA PROCESSING</h3>
                  
                  <div className="space-y-4 text-white text-sm">
                    {privacyAccepted ? (
                      <motion.div 
                        className="bg-[#005800] p-4 border border-[#00e756]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center">
                          <div className="text-[#00e756] text-xl mr-2">✓</div>
                          <div className="text-white">
                            <div className="font-bold">Privacy Policy Accepted</div>
                            <p className="text-xs opacity-80 mt-1">Thank you for accepting our privacy policy! Your agreement has been saved.</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        <p>This website collects minimal information to provide you with a personalized gaming experience:</p>
                        
                        <div className="space-y-2 ml-4 mt-4">
                          <motion.div 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="text-[#00e756] mr-2">◆</div>
                            <p>Game progression data stored locally using cookies</p>
                          </motion.div>
                          
                          <motion.div 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="text-[#00e756] mr-2">◆</div>
                            <p>Pixel art creations saved in your browser</p>
                          </motion.div>
                          
                          <motion.div 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="text-[#00e756] mr-2">◆</div>
                            <p>Waifu favorite selections and messages</p>
                          </motion.div>
                          
                          <motion.div 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="text-[#00e756] mr-2">◆</div>
                            <p>No personal data is shared with third parties</p>
                          </motion.div>
                        </div>
                        
                        <h4 className="text-[#00e756] mt-6 mb-2">DATA RETENTION</h4>
                        <p>Your data is stored only in your browser and will be retained until:</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                          <li>You clear your browser cookies</li>
                          <li>You click the "reset progress" button</li>
                          <li>Cookie expiration (30 days)</li>
                        </ul>
                        
                        <h4 className="text-[#00e756] mt-6 mb-2">YOUR RIGHTS</h4>
                        <p>You have the right to:</p>
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                          <li>Access your data (viewable in profile)</li>
                          <li>Delete your data (reset progress)</li>
                          <li>Refuse cookies (but gameplay will be limited)</li>
                        </ul>
                        
                        <div className="mt-8 bg-[#181425] p-4 border border-[#3a4466]">
                          <p className="text-[#8595a1] text-xs mb-2">LAST UPDATED: OCTOBER 15, 2023</p>
                          <p className="text-white text-xs">To continue enjoying the full experience, please accept our privacy policy:</p>
                          
                          <div className="flex space-x-4 mt-4">
                            <motion.button
                              className="bg-[#00e756] text-black px-4 py-2 flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                playSelectSound();
                                setPrivacyAccepted(true);
                                setPrivacyVisited(true);
                                
                                // Update achievement
                                const updatedAchievements = [...achievements];
                                const privacyAch = updatedAchievements.find(a => a.id === 'ach5');
                                if (privacyAch) {
                                  privacyAch.unlocked = true;
                                  setAchievements(updatedAchievements);
                                }
                                
                                // Save to cookies
                                Cookies.set('privacyAccepted', 'true', { expires: 30 });
                                
                                // Show acceptance animation
                                const confetti = document.createElement('div');
                                confetti.setAttribute('class', 'absolute inset-0 pointer-events-none');
                                
                                for (let i = 0; i < 30; i++) {
                                  const particle = document.createElement('div');
                                  particle.setAttribute('class', 'absolute w-2 h-2');
                                  particle.style.backgroundColor = ['#00e756', '#29adff', '#ffec27'][Math.floor(Math.random() * 3)];
                                  particle.style.left = `${Math.random() * 100}%`;
                                  particle.style.top = `${Math.random() * 100}%`;
                                  particle.style.opacity = '0';
                                  particle.style.animation = `confetti-fall 1s ease-out ${Math.random() * 0.5}s forwards`;
                                  confetti.appendChild(particle);
                                }
                                
                                const policyContainer = document.querySelector('.policy-container');
                                if (policyContainer) {
                                  policyContainer.appendChild(confetti);
                                  setTimeout(() => confetti.remove(), 2000);
                                }
                              }}
                            >
                              <span className="mr-2">✓</span> ACCEPT
                            </motion.button>
                            
                            <motion.button
                              className="bg-[#ff004d] text-white px-4 py-2 flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                playSelectSound();
                                setShowDeathAnimation(true);
                                
                                // Create and play TV static sound
                                try {
                                  const staticAudio = new Audio();
                                  staticAudio.volume = 0.2;
                                  
                                  // Create a static noise using the Web Audio API
                                  // @ts-ignore: webkitAudioContext for Safari support
                                  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                                  const staticNode = audioContext.createBufferSource();
                                  const gainNode = audioContext.createGain();
                                  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
                                  const data = buffer.getChannelData(0);
                                  
                                  // Fill the buffer with random noise
                                  for (let i = 0; i < buffer.length; i++) {
                                    data[i] = Math.random() * 2 - 1;
                                  }
                                  
                                  staticNode.buffer = buffer;
                                  gainNode.gain.value = 0.1; // Lower volume
                                  
                                  // Connect and play
                                  staticNode.connect(gainNode);
                                  gainNode.connect(audioContext.destination);
                                  staticNode.start();
                                  
                                  // Stop after 2 seconds
                                  setTimeout(() => {
                                    try {
                                      staticNode.stop();
                                      
                                      // Play death sound after static
                                      const deathSound = new Audio('/death.mp3');
                                      deathSound.volume = 0.3;
                                      deathSound.play();
                                    } catch (error) {
                                      console.log('Audio stop failed');
                                    }
                                  }, 1500);
                                } catch (error) {
                                  console.log('Audio playback failed');
                                  
                                  // Fallback to just playing death sound
                                  try {
                                    const audio = new Audio('/death.mp3');
                                    audio.volume = 0.3;
                                    audio.play();
                                  } catch (err) {
                                    console.log('Fallback audio failed');
                                  }
                                }
                                
                                // Make entire screen flash white briefly before death animation
                                const flash = document.createElement('div');
                                flash.setAttribute('class', 'fixed inset-0 bg-white z-50 pointer-events-none pixelated');
                                flash.style.backgroundImage = 'linear-gradient(to right, transparent 50%, rgba(255,255,255,0.05) 50%)';
                                flash.style.backgroundSize = '4px 4px';
                                document.body.appendChild(flash);
                                
                                // Animate the flash out
                                setTimeout(() => {
                                  flash.style.opacity = '0';
                                  flash.style.transition = 'opacity 0.5s';
                                  
                                  // Remove the flash element
                                  setTimeout(() => flash.remove(), 500);
                                }, 50);
                              }}
                            >
                              <span className="mr-2">✕</span> REJECT
                            </motion.button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Extra pixel decoration elements */}
            <div className="absolute bottom-10 right-10 w-4 h-4 bg-[#00e756] animate-pulse"></div>
            <div className="absolute bottom-10 right-16 w-2 h-2 bg-[#00e756] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const [gameInteractions, setGameInteractions] = useState<{[key: string]: 'like' | 'dislike' | null}>({
    "Magic Quest": null,
    "Pixel Archer": null,
    "Crystal RPG": null,
    "Dice Master": null
  });
  
  // Function to handle game interest
  const handleGameInteraction = (game: string, action: 'like' | 'dislike') => {
    playSelectSound();
    setGameInteractions(prev => ({
      ...prev,
      [game]: prev[game] === action ? null : action
    }));
    
    // Show interaction feedback
    const feedback = document.createElement('div');
    feedback.setAttribute('class', 'absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-bold animate-fade-out');
    feedback.style.color = action === 'like' ? '#00e756' : '#ff004d';
    feedback.textContent = action === 'like' ? 'Added to favorites' : 'Removed';
    
    // Find and append to the game element
    setTimeout(() => {
      const gameElements = document.querySelectorAll('.game-item');
      for (const el of gameElements) {
        if (el.textContent?.includes(game)) {
          el.appendChild(feedback);
          setTimeout(() => feedback.remove(), 1000);
          break;
        }
      }
    }, 10);
  };

  const [pixelCanvas, setPixelCanvas] = useState(Array(8).fill(Array(8).fill('#1a1c2c')));
  const [currentColor, setCurrentColor] = useState('#ff004d');
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Available colors for pixel art
  const pixelColors = [
    '#ff004d', // red
    '#ff77a8', // pink
    '#ffec27', // yellow
    '#00e756', // green
    '#29adff', // blue
    '#83769c', // purple
    '#ffffff', // white
    '#1a1c2c'  // dark blue (eraser)
  ];
  
  // Function to handle pixel drawing
  const handlePixelClick = (rowIndex: number, colIndex: number) => {
    playSelectSound();
    const newCanvas = pixelCanvas.map((row, r) => 
      r === rowIndex 
        ? [...row.slice(0, colIndex), currentColor, ...row.slice(colIndex + 1)] 
        : row
    );
    setPixelCanvas(newCanvas);
  };
  
  // Handle mouse down/up for continuous drawing
  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    handlePixelClick(rowIndex, colIndex);
  };
  
  const handleMouseOver = (rowIndex: number, colIndex: number) => {
    if (isDrawing) {
      handlePixelClick(rowIndex, colIndex);
    }
  };
  
  // Load saved data from cookies on initial load
  useEffect(() => {
    // Load saved pixel canvas data
    const savedCanvas = Cookies.get('pixelCanvas');
    if (savedCanvas) {
      try {
        setPixelCanvas(JSON.parse(savedCanvas));
      } catch (e) {
        console.error('Failed to parse saved canvas data');
      }
    }
    
    // Load saved game stats
    const savedStats = Cookies.get('gameStats');
    if (savedStats) {
      try {
        setGameStats(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse saved game stats');
      }
    }
    
    // Load saved favorites
    const savedFavorites = Cookies.get('favoriteWaifus');
    if (savedFavorites) {
      try {
        setFavoriteWaifus(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse saved favorites');
      }
    }
    
    // Load saved achievements status
    const savedAchievements = Cookies.get('achievements');
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (e) {
        console.error('Failed to parse saved achievements');
      }
    }
    
    // Load saved privacy visited status
    const privacyStatus = Cookies.get('privacyVisited');
    if (privacyStatus === 'true') {
      setPrivacyVisited(true);
    }
    
    // Load privacy acceptance status
    const acceptedStatus = Cookies.get('privacyAccepted');
    if (acceptedStatus === 'true') {
      setPrivacyAccepted(true);
    }
  }, []);
  
  // Save pixel canvas to cookies whenever it changes
  useEffect(() => {
    Cookies.set('pixelCanvas', JSON.stringify(pixelCanvas), { expires: 30 });
  }, [pixelCanvas]);
  
  // Save game stats to cookies whenever they change
  useEffect(() => {
    Cookies.set('gameStats', JSON.stringify(gameStats), { expires: 30 });
  }, [gameStats]);
  
  // Save favorite waifus to cookies whenever they change
  useEffect(() => {
    Cookies.set('favoriteWaifus', JSON.stringify(favoriteWaifus), { expires: 30 });
  }, [favoriteWaifus]);
  
  // Save achievements to cookies whenever they change
  useEffect(() => {
    Cookies.set('achievements', JSON.stringify(achievements), { expires: 30 });
  }, [achievements]);
  
  // Save privacy visited status to cookies
  useEffect(() => {
    if (privacyVisited) {
      Cookies.set('privacyVisited', 'true', { expires: 30 });
    }
  }, [privacyVisited]);
  
  // Function to clear canvas
  const clearCanvas = () => {
    playSelectSound();
    const newCanvas = Array(8).fill(Array(8).fill('#1a1c2c'));
    setPixelCanvas(newCanvas);
    // Cookie will be updated by the useEffect hook
  };
  
  // Function to save pixel art
  const savePixelArt = () => {
    playSelectSound();
    
    // Already saved to cookies, show confirmation
    const feedback = document.createElement('div');
    feedback.setAttribute('class', 'fixed top-4 right-4 bg-[#00e756] text-white px-3 py-2 text-sm z-50 animate-fade-out');
    feedback.textContent = 'Pixel art saved! 🎨';
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
  };
  
  // Function to clear all saved data (cookies)
  const clearAllData = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      // Clear all cookies
      Cookies.remove('pixelCanvas');
      Cookies.remove('gameStats');
      Cookies.remove('favoriteWaifus');
      Cookies.remove('achievements');
      Cookies.remove('privacyVisited');
      
      // Reset state
      setPixelCanvas(Array(8).fill(Array(8).fill('#1a1c2c')));
      setGameStats({
        level: 0,
        experience: 0,
        nextLevelXp: 500,
        wins: 0,
        losses: 0,
        timePlayed: '1000+ hours',
        rank: 'VOID'
      });
      setFavoriteWaifus([]);
      setAchievements(prevAchievements => 
        prevAchievements.map(ach => ({...ach, unlocked: ach.id === 'ach1' ? false : ach.unlocked}))
      );
      setPrivacyVisited(false);
      
      // Show confirmation
      const feedback = document.createElement('div');
      feedback.setAttribute('class', 'fixed top-4 right-4 bg-[#ff004d] text-white px-3 py-2 text-sm z-50 animate-fade-out');
      feedback.textContent = 'All progress has been reset!';
      document.body.appendChild(feedback);
      setTimeout(() => feedback.remove(), 2000);
    }
  };

  // Custom components for About section
  // TypewriterText component for animated text effect
  const TypewriterText: React.FC<{text: string; delay?: number; startDelay?: number; className?: string; key?: string}> = React.memo(({ 
    text, 
    delay = 30, 
    startDelay = 0,
    className = "",
    key
  }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const [lastCharCount, setLastCharCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const initialDelayRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    
    useEffect(() => {
      setDisplayedText("");
      setIsComplete(false);
      setLastCharCount(0);
      
      // Clear existing timers
      if (initialDelayRef.current) {
        clearTimeout(initialDelayRef.current);
        initialDelayRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Close existing audio context
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (error) {
          // Ignore errors on close
        }
        audioContextRef.current = null;
      }
      
      // Start the typing effect with a delay
      initialDelayRef.current = setTimeout(() => {
        let currentIndex = 0;
        
        // Start typing effect
        intervalRef.current = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.substring(0, currentIndex));
            
            // Play typing sound for each new character
            if (currentIndex > lastCharCount && currentIndex > 0 && currentIndex <= text.length) {
              try {
                // Create a new audio context if needed
                if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                  audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                }
                
                const oscillator = audioContextRef.current.createOscillator();
                const gainNode = audioContextRef.current.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.value = 1200 + Math.random() * 400; // Random pitch for variation
                
                gainNode.gain.value = 0.02; // Very quiet
                oscillator.connect(gainNode);
                gainNode.connect(audioContextRef.current.destination);
                
                oscillator.start();
                
                // Stop after a very short time
                setTimeout(() => {
                  oscillator.stop();
                }, 10);
              } catch (error) {
                // Silently fail if audio context can't be created
              }
            }
            
            setLastCharCount(currentIndex);
            currentIndex++;
          } else {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsComplete(true);
          }
        }, delay);
      }, startDelay);
      
      // Cleanup function when component unmounts or text changes
      return () => {
        if (initialDelayRef.current) {
          clearTimeout(initialDelayRef.current);
          initialDelayRef.current = null;
        }
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        if (audioContextRef.current) {
          try {
            audioContextRef.current.close();
          } catch (error) {
            // Ignore errors on close
          }
          audioContextRef.current = null;
        }
      };
    }, [text, delay, startDelay]);
    
    return (
      <p className={`${className} ${!isComplete ? "relative" : ""}`}>
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-2 h-4 bg-white ml-1 absolute animate-pulse" />
        )}
      </p>
    );
  }, (prevProps, nextProps) => {
    // Only re-render if key props change
    return prevProps.text === nextProps.text && 
           prevProps.delay === nextProps.delay && 
           prevProps.startDelay === nextProps.startDelay;
  });

  // Interactive button component
  const InteractiveButton: React.FC<{label: string; onClick: () => void}> = ({ label, onClick }) => {
    const { playHoverSound, playClickSound } = useSoundButton();
    
    return (
      <motion.button
        className="bg-[#3a4466] text-white px-4 py-1 text-sm border-b-2 border-r-2 border-black"
        onMouseEnter={playHoverSound}
        onClick={() => {
          playClickSound();
          onClick();
        }}
        whileHover={{ y: -2, backgroundColor: "#ff004d" }}
        whileTap={{ y: 1 }}
      >
        {label}
      </motion.button>
    );
  };

  // Tab button component
  const AboutTabButton: React.FC<{label: string; isActive: boolean; onClick: () => void}> = ({ 
    label, 
    isActive, 
    onClick 
  }) => {
    const { playHoverSound, playClickSound } = useSoundButton();
    
    return (
      <button 
        className={`px-3 py-2 text-sm ${isActive ? 'bg-[#3a4466] text-white' : 'text-[#8595a1]'}`}
        onMouseEnter={playHoverSound}
        onClick={() => {
          playClickSound();
          onClick();
        }}
      >
        {label}
      </button>
    );
  };

  // Attribute bar component
  const AttributeBar: React.FC<{label: string; value: number; color: string; animationDelay: number}> = ({ 
    label, 
    value, 
    color,
    animationDelay 
  }) => {
    const { playHoverSound } = useSoundButton();
    
    return (
      <div onMouseEnter={playHoverSound}>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#8595a1]">{label}</span>
          <span className="text-white">{value}/100</span>
        </div>
        <div className="w-full bg-[#0f0f1b] h-2">
          <motion.div 
            className="h-full" 
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, delay: animationDelay }}
          />
        </div>
      </div>
    );
  };

  // Quest item component
  const QuestItem: React.FC<{
    title: string;
    description: string;
    progress: number;
    reward: string;
    isActive?: boolean;
  }> = ({ title, description, progress, reward, isActive = false }) => {
    const { playHoverSound, playClickSound } = useSoundButton();
    
    return (
      <motion.div 
        className={`bg-[#1a1c2c] p-3 border-l-4 ${isActive ? 'border-[#ffcc55]' : 'border-[#3a4466]'}`}
        whileHover={{ x: 5 }}
        onMouseEnter={playHoverSound}
        onClick={playClickSound}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className={isActive ? 'text-[#ffcc55]' : 'text-white'}>
              {title} {isActive && <span className="ml-2 text-xs bg-[#ffcc55] text-black px-1">ACTIVE</span>}
            </div>
            <div className="text-[#8595a1] text-xs">{description}</div>
          </div>
          <div className="text-xs text-[#8595a1]">{progress}%</div>
        </div>
        
        <div className="w-full bg-[#0f0f1b] h-1 my-2">
          <div 
            className={isActive ? 'bg-[#ffcc55]' : 'bg-[#3a4466]'} 
            style={{ width: `${progress}%`, height: '100%' }}
          />
        </div>
        
        <div className="text-xs flex justify-between items-center">
          <div className="text-[#8595a1]">REWARD: <span className="text-[#00e756]">{reward}</span></div>
          {isActive && (
            <div className="w-2 h-2 bg-[#ffcc55] animate-pulse rounded-full"></div>
          )}
        </div>
      </motion.div>
    );
  };

  // Inventory item component
  const InventoryItem: React.FC<{
    id: string;
    name: string;
    icon: string;
    rarity: string;
    color: string;
    isSelected: boolean;
    isEquipped: boolean;
    onClick: () => void;
  }> = ({ id, name, icon, rarity, color, isSelected, isEquipped, onClick }) => {
    const { playHoverSound, playClickSound } = useSoundButton();
    
    return (
      <motion.div 
        data-item-id={id}
        className={`bg-[#1a1c2c] p-2 relative cursor-pointer ${
          isSelected ? 'border-2 border-white' : 'border-2 border-transparent'
        } ${isEquipped ? 'bg-[#3a4466]' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={playHoverSound}
        onClick={() => {
          playClickSound();
          onClick();
        }}
      >
        <div className="flex flex-col items-center">
          <div className="text-2xl mb-1 relative">
            {icon}
            {/* Shine effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
              whileHover={{ 
                opacity: 0.3, 
                x: ['-100%', '100%'],
                transition: { x: { duration: 1, repeat: Infinity, repeatType: 'loop' } }
              }}
            />
          </div>
          <div className="text-white text-xs text-center font-pixel">{name}</div>
          <div className="text-xs font-semibold mt-1" style={{ color }}>
            {rarity}
          </div>
        </div>
        
        {isEquipped && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00e756] rounded-full flex items-center justify-center text-[8px] text-black font-bold">
            E
          </div>
        )}
      </motion.div>
    );
  };

  // Inventory items data
  const inventoryItems = [
    {
      id: "mechanical-keyboard",
      name: "Mechanical Keyboard",
      icon: "⌨️",
      rarity: "RARE",
      color: "#ffcc55",
      bonus: "+10 Coding Speed",
      description: "A premium mechanical keyboard with tactile switches for efficient coding"
    },
    {
      id: "game-controller",
      name: "Pro Controller",
      icon: "🎮",
      rarity: "COMMON",
      color: "#29adff",
      bonus: "+5 Gaming",
      description: "A professional gaming controller with customizable buttons"
    },
    {
      id: "gaming-pc",
      name: "Gaming PC",
      icon: "💻",
      rarity: "EPIC",
      color: "#ff77a8",
      bonus: "+15 Performance",
      description: "A high-end gaming PC with RGB lighting and powerful specs"
    },
    {
      id: "dev-manual",
      name: "Dev Manual",
      icon: "📚",
      rarity: "UNCOMMON",
      color: "#00e756",
      bonus: "+8 Coding",
      description: "Programming guide with best practices and algorithms"
    }
  ];

  // Interactive story button component
  const InteractiveStoryButton: React.FC<{label: string; onClick: () => void}> = ({ label, onClick }) => {
    const { playHoverSound, playClickSound } = useSoundButton();
    
    return (
      <motion.button
        className="bg-[#1a1c2c] text-[#8595a1] hover:text-white px-3 py-1 text-xs border border-[#3a4466] hover:border-[#ffcc55] transition-colors"
        onClick={() => {
          playClickSound();
          onClick();
        }}
        onMouseEnter={playHoverSound}
        whileHover={{ y: -2, backgroundColor: '#3a4466' }}
        whileTap={{ y: 0 }}
      >
        {label}
      </motion.button>
    );
  };

  // Game reference component for story
  const GameReference: React.FC<{name: string; year: string; platform: string}> = ({ name, year, platform }) => {
    const { playHoverSound } = useSoundButton();
    
    return (
      <motion.div 
        className="bg-[#262b44] p-1 text-center"
        whileHover={{ y: -2, backgroundColor: '#3a4466' }}
        onMouseEnter={playHoverSound}
      >
        <div className="text-white text-xs font-pixel">{name}</div>
        <div className="text-[#8595a1] text-xxs mt-1">{year} • {platform}</div>
      </motion.div>
    );
  };

  // Sound test component
  const SoundTester: React.FC<{isVisible: boolean; onClose: () => void}> = ({ isVisible, onClose }) => {
    const soundTypes: SoundType[] = ['hover', 'select', 'click', 'success', 'error', 'special'];
    
    if (!isVisible) return null;
    
    return (
      <motion.div 
        className="fixed bottom-20 right-4 bg-[#262b44] border-2 border-[#3a4466] p-3 z-50 w-64"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="text-[#29adff] text-sm">SOUND TESTER</div>
          <button className="text-[#8595a1] hover:text-white" onClick={onClose}>×</button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {soundTypes.map(type => (
            <motion.button
              key={type}
              className="bg-[#1a1c2c] text-white px-2 py-1 text-xs uppercase"
              whileHover={{ 
                backgroundColor: type === 'hover' ? '#29adff' : 
                                type === 'select' || type === 'click' ? '#ffcc55' : 
                                type === 'success' ? '#00e756' : 
                                type === 'error' ? '#ff004d' : '#8595a1'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playSoundEffect(type, 0.3)}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  // Add sound tester toggle to the main component return
  const [showSoundTester, setShowSoundTester] = useState(false);
  
  // Handle splash screen button click
  const handleSplashClick = () => {
    playSoundEffect('special', 0.3); // Play special sound effect
    setShowSplash(false);
    setIsLoading(true);
    
    // Simulate loading progress
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          
          // Wait a moment after reaching 100% before hiding loading screen
          setTimeout(() => {
            loadingComplete.current = true;
            setIsLoading(false);
          }, 500);
          
          return 100;
        }
        // Random increments for more natural loading feel
        return Math.min(prev + Math.random() * 15, 100);
      });
    }, 150);
  };
  
  // Splash Screen Component
  const renderSplashScreen = () => (
    <div className="fixed inset-0 z-50 bg-[#0f0f1b] flex flex-col items-center justify-center">
      <motion.div
        className="text-[#ffcc55] text-4xl mb-10 font-pixel pixel-text-large"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        KANNA CS
      </motion.div>
      
      <motion.button
        className="relative w-40 h-40 bg-[#1a1c2c] border-4 border-[#3a4466] rounded-full overflow-hidden"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.5 
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 15px rgba(255,204,85,0.5)"
        }}
        whileTap={{ 
          scale: 0.95 
        }}
        onClick={handleSplashClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="text-6xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0],
              filter: ["drop-shadow(0 0 0px #ffcc55)", "drop-shadow(0 0 5px #ffcc55)", "drop-shadow(0 0 0px #ffcc55)"]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            🎮
          </motion.div>
        </div>
        
        <motion.div
          className="absolute inset-0 bg-[#ffcc55] opacity-0"
          whileHover={{ opacity: 0.1 }}
          whileTap={{ opacity: 0.2 }}
        />
      </motion.button>
      
      <motion.div
        className="text-white mt-10 text-sm pixel-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        CLICK TO START
      </motion.div>
      
      {/* Decorative pixel corners */}
      <div className="fixed top-4 left-4 w-3 h-3 bg-[#ffcc55]"></div>
      <div className="fixed top-4 right-4 w-3 h-3 bg-[#ffcc55]"></div>
      <div className="fixed bottom-4 left-4 w-3 h-3 bg-[#ffcc55]"></div>
      <div className="fixed bottom-4 right-4 w-3 h-3 bg-[#ffcc55]"></div>
    </div>
  );
  
  // Loading Screen Component
  const renderLoadingScreen = () => (
    <div className="fixed inset-0 z-50 bg-[#0f0f1b] flex flex-col items-center justify-center">
      <div className="w-full max-w-md px-8">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-[#8595a1] text-sm">LOADING PLAYER DATA</div>
          <div className="text-[#ffcc55]">{Math.floor(loadingProgress)}%</div>
        </div>
        
        <div className="w-full h-4 bg-[#1a1c2c] border-2 border-[#3a4466] mb-8 relative overflow-hidden">
          {/* Pixelated Loading Bar */}
          <motion.div 
            className="absolute top-0 left-0 bottom-0 bg-[#ffcc55]"
            style={{ width: `${loadingProgress}%` }}
          />
          
          {/* Scan line effect */}
          <motion.div 
            className="absolute top-0 bottom-0 w-4 bg-white opacity-50"
            animate={{ 
              left: ["-10%", "110%"]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        {/* Loading Messages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={Math.floor(loadingProgress / 20)}
            className="text-[#8595a1] text-sm h-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {loadingProgress < 20 && "Initializing game engine..."}
            {loadingProgress >= 20 && loadingProgress < 40 && "Loading player stats..."}
            {loadingProgress >= 40 && loadingProgress < 60 && "Checking game saves..."}
            {loadingProgress >= 60 && loadingProgress < 80 && "Connecting to servers..."}
            {loadingProgress >= 80 && "Preparing interface..."}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Decorative Pixel Elements */}
      <motion.div
        className="absolute bottom-8 left-8 flex space-x-1"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-2 h-2 bg-[#ff004d]"></div>
        <div className="w-2 h-2 bg-[#29adff]"></div>
        <div className="w-2 h-2 bg-[#00e756]"></div>
      </motion.div>
      
      <motion.div
        className="absolute top-8 right-8 flex space-x-1"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <div className="w-2 h-2 bg-[#ff004d]"></div>
        <div className="w-2 h-2 bg-[#29adff]"></div>
        <div className="w-2 h-2 bg-[#00e756]"></div>
      </motion.div>
    </div>
  );

  return (
    <main 
      className="min-h-screen bg-[#1a1c2c] text-white overflow-hidden font-pixel relative" 
      onMouseMove={handleMouseMove}
    >
      {/* Show splash screen before anything else */}
      <AnimatePresence>
        {showSplash && 
          <motion.div
            exit={{ opacity: 0 }}
            className="z-50"
          >
            {renderSplashScreen()}
          </motion.div>
        }
      </AnimatePresence>
      
      {/* Show loading screen after splash screen */}
      <AnimatePresence>
        {isLoading && 
          <motion.div
            exit={{ opacity: 0 }}
            className="z-50"
          >
            {renderLoadingScreen()}
          </motion.div>
        }
      </AnimatePresence>
      
      {/* Background Layer - Only show after loading */}
      {(!showSplash && !isLoading) && renderBackground()}
      
      {/* Background Type Switcher (hidden in corner) */}
      {(!showSplash && !isLoading) && (
        <div className="absolute bottom-2 left-2 z-20 flex space-x-1 opacity-50 hover:opacity-100 scale-75">
          <button 
            onClick={() => setBackgroundType('video')}
            className={`px-1 py-0.5 text-xs ${backgroundType === 'video' ? 'bg-blue-500' : 'bg-blue-900'}`}
          >
            V
          </button>
          <button 
            onClick={() => setBackgroundType('image')}
            className={`px-1 py-0.5 text-xs ${backgroundType === 'image' ? 'bg-blue-500' : 'bg-blue-900'}`}
          >
            I
          </button>
          <button 
            onClick={() => setBackgroundType('animation')}
            className={`px-1 py-0.5 text-xs ${backgroundType === 'animation' ? 'bg-blue-500' : 'bg-blue-900'}`}
          >
            A
          </button>
        </div>
      )}
      
      {/* Sound Test Button - Only show after loading */}
      {(!showSplash && !isLoading) && (
        <motion.button
          className="absolute bottom-2 right-2 z-20 w-5 h-5 bg-[#262b44] rounded-full flex items-center justify-center text-xs opacity-50 hover:opacity-100"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSoundTester(!showSoundTester)}
          onMouseEnter={() => playSoundEffect('hover', 0.1)}
        >
          🔊
        </motion.button>
      )}
      
      {/* Sound Tester Panel - Only show after loading */}
      <AnimatePresence>
        {(!showSplash && !isLoading) && showSoundTester && (
          <SoundTester 
            isVisible={showSoundTester} 
            onClose={() => setShowSoundTester(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Waifu Images in Upper Left - only on homepage and after loading */}
      {(!showSplash && !isLoading) && currentSection === 'home' && (
        <div className="absolute top-4 left-4 z-30 flex flex-col space-y-2">
          {waifuList.map(waifu => (
            <motion.button
              key={waifu.name}
              onClick={() => handleWaifuClick(waifu)}
              className={`relative rounded-full overflow-hidden border-2 transition-all ${
                selectedWaifu?.name === waifu.name && showWaifuPopup ? 'border-[#ff004d] scale-110' : 'border-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 relative">
                <img 
                  src={waifu.image} 
                  alt={waifu.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.button>
          ))}
        </div>
      )}
      
      
      {/* Waifu Popup - only visible on homepage and after loading */}
      <AnimatePresence>
        {(!showSplash && !isLoading) && showWaifuPopup && selectedWaifu && currentSection === 'home' && (
          <motion.div 
            className="absolute top-20 left-24 z-40 bg-[#262b44] border-4 border-[#3a4466] p-4 w-80 waifu-popup"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex justify-between items-center mb-3">
              <motion.h3 
                className="text-[#ffec27] font-bold"
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                WAIFU INFO
              </motion.h3>
              <div className="flex space-x-2">
                <button 
                  className={`px-2 py-1 text-xs ${popupView === 'info' ? 'bg-[#ff004d] text-white' : 'bg-[#3a4466] text-[#8595a1]'}`}
                  onClick={() => {
                    setPopupView('info');
                    playSelectSound();
                  }}
                >
                  INFO
                </button>
                <button 
                  className={`px-2 py-1 text-xs ${popupView === 'stats' ? 'bg-[#ff004d] text-white' : 'bg-[#3a4466] text-[#8595a1]'}`}
                  onClick={() => {
                    setPopupView('stats');
                    playSelectSound();
                  }}
                >
                  STATS
                </button>
                <button 
                  onClick={() => setShowWaifuPopup(false)}
                  className="text-[#8595a1] hover:text-white px-2"
                >
                  ×
                </button>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {popupView === 'info' ? (
                  <motion.div
                  className="bg-[#181425] p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="info-view"
                >
                  <div className="flex items-center mb-2">
                    <motion.div 
                      className="w-16 h-16 mr-3 overflow-hidden rounded border-2 border-white relative"
                      whileHover={{ scale: 1.1 }}
                    >
                      <img 
                        src={selectedWaifu.image} 
                        alt={selectedWaifu.name} 
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.3)]"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                  </motion.div>
                    <div>
                      <motion.h4 
                        className="font-bold text-lg" 
                        style={{ color: selectedWaifu.color }}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {selectedWaifu.name}
                      </motion.h4>
                  <motion.div
                        className="h-1 mt-1 mb-1" 
                        style={{ backgroundColor: selectedWaifu.color }}
                        initial={{ width: 0 }}
                        animate={{ width: '50px' }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                      />
                    </div>
                  </div>
                  <motion.p 
                    className="text-white text-xs leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedWaifu.description}
                  </motion.p>
                  
                  <div className="flex justify-center mt-4 space-x-2">
                    <motion.button
                      className={`text-xs px-2 py-1 transition-colors flex items-center ${
                        favoriteWaifus.includes(selectedWaifu.name) 
                          ? 'bg-[#ff004d] text-white' 
                          : 'bg-[#3a4466] text-[#8595a1] hover:bg-[#ff004d] hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFavorite(selectedWaifu.name)}
                    >
                      <span className="mr-1">{favoriteWaifus.includes(selectedWaifu.name) ? '♥' : '♡'}</span>
                      {favoriteWaifus.includes(selectedWaifu.name) ? 'FAVORITED' : 'FAVORITE'}
                    </motion.button>
                    <motion.button
                      className="bg-[#3a4466] text-[#8595a1] text-xs px-2 py-1 hover:bg-[#ff004d] hover:text-white transition-colors flex items-center" 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMessageInput(prev => !prev)}
                    >
                      <span className="mr-1">✉</span>
                      MESSAGE
                    </motion.button>
                  </div>
                  
                  {/* Message input area */}
                  <AnimatePresence>
                    {showMessageInput && (
                      <motion.div
                        className="mt-3 bg-[#0f0f1b] p-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <textarea
                          className="w-full bg-[#181425] border border-[#3a4466] text-white text-xs p-2 h-16 resize-none focus:outline-none focus:border-[#ff004d]"
                          placeholder={`Write a message to ${selectedWaifu.name}...`}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <div className="flex justify-between mt-2">
                          <div className="text-[#8595a1] text-xs">
                            {message.length}/100 {message.length >= 100 && '(max)'}
                          </div>
                          <button
                            className="bg-[#ff004d] text-white text-xs px-2 py-1"
                            onClick={sendMessage}
                            disabled={!message.trim()}
                          >
                            SEND
                          </button>
                        </div>
                  </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Message history */}
                  {sentMessages[selectedWaifu.name]?.length > 0 && !showMessageInput && (
                    <motion.div
                      className="mt-3 bg-[#0f0f1b] p-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-[#8595a1] text-xs">RECENT MESSAGES</div>
                        <div className="text-[#8595a1] text-xs">{sentMessages[selectedWaifu.name].length}</div>
                      </div>
                      <div className="text-white text-xs max-h-16 overflow-y-auto">
                        {sentMessages[selectedWaifu.name].slice(-1).map((msg, i) => (
                          <div key={i} className="border-l-2 border-[#ff004d] pl-2 py-1">
                            {msg}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                      <motion.div 
                  className="bg-[#181425] p-3"
                  initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="stats-view"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 mr-3 overflow-hidden rounded-full border-2" style={{ borderColor: selectedWaifu.color }}>
                      <img 
                        src={selectedWaifu.image} 
                        alt={selectedWaifu.name} 
                        className="w-full h-full object-cover"
                      />
                          </div>
                    <h4 className="font-bold" style={{ color: selectedWaifu.color }}>
                      {selectedWaifu.name} <span className="text-[#8595a1] text-xs">STATS</span>
                    </h4>
                        </div>
                  
                  {selectedWaifu.stats && (
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#8595a1]">CHARM</span>
                          <span className="text-white">{selectedWaifu.stats.charm}/100</span>
                        </div>
                        <div className="w-full bg-[#0f0f1b] h-2">
                          <motion.div 
                            className="h-full" 
                            style={{ backgroundColor: selectedWaifu.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedWaifu.stats.charm}%` }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#8595a1]">CUTENESS</span>
                          <span className="text-white">{selectedWaifu.stats.cuteness}/100</span>
                        </div>
                        <div className="w-full bg-[#0f0f1b] h-2">
                          <motion.div 
                            className="h-full" 
                            style={{ backgroundColor: selectedWaifu.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedWaifu.stats.cuteness}%` }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#8595a1]">SHYNESS</span>
                          <span className="text-white">{selectedWaifu.stats.shyness}/100</span>
                        </div>
                        <div className="w-full bg-[#0f0f1b] h-2">
                          <motion.div 
                            className="h-full" 
                            style={{ backgroundColor: selectedWaifu.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedWaifu.stats.shyness}%` }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                          </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content container with parallax effect - Only show after loading */}
      {(!showSplash && !isLoading) && (
        <div 
          className={`relative h-screen flex flex-col z-10 ${currentSection === 'about' ? '' : 'parallax-container'}`}
          style={currentSection === 'about' ? {} : {
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {currentSection === 'home' ? (
            // Pixel art styled home page with retro game menu
            <motion.div 
              className="flex flex-col h-screen justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Classic pixel game menu */}
              <div className="relative bg-[#0f0f1b] border-4 border-[#383880] p-5 w-full max-w-md shadow-[0_0_15px_rgba(56,56,128,0.5)]">
                {/* Menu header */}
                <div className="absolute -top-3 left-12 right-12 h-1 bg-[#383880]"></div>
                <div className="text-center text-[#8595a1] mb-4 text-xs">MAIN MENU</div>
                
                {/* Player level and status */}
                <div className="flex justify-between items-center mb-5 pb-2 border-b border-[#383880]">
                  <div>
                    <div className="text-[#8595a1] text-xs">PLAYER</div>
                    <div className="text-[#ffec27]">KannaCS</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[#00e756] rounded-full mr-2 animate-pulse"></div>
                    <div className="text-[#00e756] text-xs">ONLINE</div>
                  </div>
                </div>
                
                {/* Menu items */}
                <div className="space-y-3">
                  {menuItems.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      className="relative flex items-center cursor-pointer"
                      onClick={() => {
                        setSelectedMenuItem(index);
                        setCurrentSection(item.id);
                        if (item.id === 'privacy') {
                          setPrivacyVisited(true);
                        }
                        playSelectSound();
                      }}
                      onMouseEnter={() => {
                        setSelectedMenuItem(index);
                        playSoundEffect('hover', 0.1);
                      }}
                      whileHover={{ x: 10 }}
                    >
                      {/* Menu selector (cursor) */}
                      {selectedMenuItem === index && (
                        <motion.div 
                          className="absolute -left-8 text-[#ff004d] text-lg"
                          animate={{ x: [0, 2, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          ▶
                        </motion.div>
                      )}
                      
                      {/* Main button with pixelated styling */}
                      <div 
                        className={`w-full py-2 px-3 ${
                          selectedMenuItem === index 
                            ? 'bg-[#ff004d] text-white' 
                            : 'bg-[#262b44] text-[#8595a1]'
                        }`}
                      >
                        <span className="tracking-widest">{item.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Footer instructions */}
                <div className="mt-6 text-center text-[#8595a1] text-xs flex justify-between">
                  <span>↑/↓: SELECT</span>
                  <span>ENTER: START</span>
                </div>
              </div>
              
              {/* CRT scan lines overlay effect */}
              <div className="absolute inset-0 pointer-events-none bg-scan-lines opacity-10"></div>

              {/* Copyright text */}
              <div className="absolute bottom-4 text-center w-full text-[#8595a1] text-xs">
                © 2025 KannaCS. All rights reserved.
              </div>
            </motion.div>
          ) : (
            // Section content with pixel art styling
            <div className="h-full p-6">
              {/* Pixelated Back Button */}
              <motion.button
                onClick={() => {
                  playSelectSound();
                  setCurrentSection('home');
                }}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-[#ff004d] text-white mb-8 relative"
                onMouseEnter={() => playSoundEffect('hover', 0.1)}
              >
                ← RETURN
              </motion.button>

              {/* Section Content with Animations */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.4 }}
                  className="h-full"
                >
                  {renderSectionContent()}
                </motion.div>
              </AnimatePresence>
              
              {/* CRT scan lines overlay effect */}
              <div className="absolute inset-0 pointer-events-none bg-scan-lines opacity-10"></div>
            </div>
          )}
        </div>
      )}
      
      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
        
        @keyframes rain-fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes float-up {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        
        @keyframes fade-out {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes fade-in-out {
          0% { opacity: 0; right: -10px; }
          20% { opacity: 1; right: 0; }
          80% { opacity: 1; right: 0; }
          100% { opacity: 0; right: 10px; }
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100px) rotate(720deg); opacity: 0; }
        }
        
        @keyframes glitch-anim {
          0% { clip-path: inset(0 0 0 0); }
          5% { clip-path: inset(40% 0 61% 0); }
          10% { clip-path: inset(20% 0 1% 0); }
          15% { clip-path: inset(30% 0 31% 0); }
          20% { clip-path: inset(20% 0 1% 0); }
          25% { clip-path: inset(60% 0 7% 0); }
          30% { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        
        @keyframes item-use {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes pixel-send {
          0% { transform: scale(0) rotate(0deg); }
          50% { transform: scale(1.5) rotate(180deg); }
          100% { transform: scale(0) rotate(360deg); }
        }
        
        @keyframes pulse-glow {
          0% { opacity: 0; }
          50% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        
        /* New animations for splash and loading screens */
        @keyframes flicker {
          0% { opacity: 1; }
          10% { opacity: 0.8; }
          20% { opacity: 1; }
          30% { opacity: 0.8; }
          40% { opacity: 1; }
          60% { opacity: 1; }
          70% { opacity: 0.6; }
          80% { opacity: 1; }
          100% { opacity: 1; }
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes splash {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pixel-appear {
          0% { opacity: 0; transform: scale(0); }
          80% { transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes loading-bar-glitch {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          52% { opacity: 1; }
          54% { opacity: 0.7; }
          56% { opacity: 1; }
          100% { opacity: 1; }
        }
        
        .tv-static {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        
        .glitch-text {
          animation: glitch-anim 2s infinite;
          will-change: clip-path;
        }
        
        .about-section {
          /* Isolate the section from the parallax effect */
          transform: none !important;
          z-index: 20;
          isolation: isolate;
        }
        
        .about-page {
          /* Ensure the entire page is stable */
          position: relative;
          transform: none !important;
          will-change: auto;
        }
        
        .animate-fade-out {
          animation: fade-in-out 1s forwards;
        }
        
        .font-pixel {
          font-family: monospace;
          letter-spacing: 0.1em;
          image-rendering: pixelated;
        }
        
        .pixelated {
          image-rendering: pixelated;
        }
        
        .pixel-text {
          text-shadow: 2px 2px 0px #000;
        }
        
        .pixel-text-large {
          font-family: monospace;
          letter-spacing: 0.2em;
          text-shadow: 2px 2px 0px #000;
          font-size: 28px;
          image-rendering: pixelated;
        }
        
        .shadow-title {
          text-shadow: 4px 4px 0px #ff004d;
        }
        
        .bg-scan-lines {
          background-image: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px
          );
          background-size: 100% 2px;
        }
        
        .bg-grid-overlay {
          background-image: url('/grid.svg');
          background-size: 24px 24px;
          image-rendering: pixelated;
        }
        
        .disabled {
          opacity: 0.7;
          pointer-events: none;
        }
      `}</style>
    </main>
  );
}

// New ContactCard component
const ContactCard: React.FC<{
  icon: string;
  color: string;
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}> = ({ icon, color, label, value, badge, badgeColor, onClick }) => {
  const { playHoverSound, playClickSound } = useSoundButton();
  
  return (
    <motion.div 
      className="bg-[#1a1c2c] p-3 flex cursor-pointer relative overflow-hidden"
      whileHover={{ 
        backgroundColor: '#3a4466',
        transition: { duration: 0.2 }
      }}
      onMouseEnter={playHoverSound}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        playClickSound();
        if (onClick) onClick();
      }}
    >
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }}></div>
      <div className="mr-3 text-xl" style={{ color }}>{icon}</div>
      <div className="flex-1">
        <p className="text-[#8595a1] text-xs">{label}</p>
        <p className="text-white">{value}</p>
      </div>
      {badge && (
        <div className="flex items-center">
          <motion.div 
            className="w-2 h-2 rounded-full mr-1"
            style={{ backgroundColor: badgeColor }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs" style={{ color: badgeColor }}>{badge}</span>
        </div>
      )}
      
      {/* Copy/click indicator */}
      <motion.div 
        className="absolute bottom-0 right-0 text-xs text-white px-1 opacity-0"
        whileHover={{ opacity: 0.8 }}
        style={{ backgroundColor: color }}
      >
        {onClick ? (label === 'STEAM' ? 'VISIT' : 'COPY') : ''}
      </motion.div>
    </motion.div>
  );
};

// Social Media Button Component
const SocialButton: React.FC<{
  icon: string;
  tooltip: string;
  color: string;
}> = ({ icon, tooltip, color }) => {
  const { playHoverSound, playClickSound } = useSoundButton();
  
  return (
    <motion.button 
      className="w-10 h-10 bg-[#1a1c2c] flex items-center justify-center text-lg relative group"
      whileHover={{ scale: 1.1, backgroundColor: color }}
      onMouseEnter={playHoverSound}
      whileTap={{ scale: 0.95 }}
      onClick={playClickSound}
    >
      {icon}
      
      {/* Tooltip */}
      <motion.div 
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 opacity-0 pointer-events-none"
        whileHover={{ opacity: 0, y: -3 }}
        animate={{ opacity: 0 }}
        initial={{ opacity: 0, y: 0 }}
      >
        {tooltip}
      </motion.div>
      
      {/* Hover tooltip */}
      <motion.div 
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 opacity-0 pointer-events-none"
        initial={{ opacity: 0, y: 3 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tooltip}
      </motion.div>
    </motion.button>
  );
};
