'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/lib/context/AppContext';
import { backgroundSettings } from '@/lib/data';
import { BackgroundType } from '@/lib/types';

export function Background() {
  const { backgroundType } = useAppContext();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

  // Generate stars for animation background
  useEffect(() => {
    if (backgroundType === 'animation') {
      const newStars = Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3
      }));
      setStars(newStars);
    }
  }, [backgroundType]);

  // Render different background based on type
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Video Background */}
      {backgroundType === 'video' && (
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`} 
            style={{ backgroundImage: `url('${backgroundSettings.video.fallbackImage}')` }} 
          />
          <video 
            className="w-full h-full object-cover"
            src={backgroundSettings.video.src}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
          />
          <div className="absolute inset-0 bg-black opacity-30" />
        </div>
      )}

      {/* Image Background */}
      {backgroundType === 'image' && (
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url('${backgroundSettings.image.src}')` }} 
          />
          <div className="absolute inset-0 bg-black opacity-40" />
        </div>
      )}

      {/* Animation Background */}
      {backgroundType === 'animation' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1b] to-[#262b44]">
          {/* Stars */}
          {stars.map((star, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 3,
                delay: star.delay,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
          
          {/* Pixel grid overlay */}
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'linear-gradient(rgba(30, 30, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 30, 60, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      )}

      {/* Scan lines overlay for all background types */}
      <div className="absolute inset-0 pointer-events-none bg-scan-lines opacity-10"></div>
    </div>
  );
}

export function BackgroundSwitcher() {
  const { backgroundType, setBackgroundType } = useAppContext();

  return (
    <div className="fixed bottom-4 right-4 z-40 flex space-x-2">
      <SwitcherButton 
        active={backgroundType === 'video'}
        onClick={() => setBackgroundType('video')}
        emoji="🎬"
        label="Video"
      />
      <SwitcherButton 
        active={backgroundType === 'image'}
        onClick={() => setBackgroundType('image')}
        emoji="🖼️"
        label="Image"
      />
      <SwitcherButton 
        active={backgroundType === 'animation'}
        onClick={() => setBackgroundType('animation')}
        emoji="✨"
        label="Pixel"
      />
    </div>
  );
}

interface SwitcherButtonProps {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
}

function SwitcherButton({ active, onClick, emoji, label }: SwitcherButtonProps) {
  return (
    <motion.button
      className={`px-2 py-1 text-xs flex items-center ${
        active ? 'bg-pixel-red text-white' : 'bg-[#3a4466] text-pixel-gray'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="mr-1">{emoji}</span>
      {label}
    </motion.button>
  );
} 