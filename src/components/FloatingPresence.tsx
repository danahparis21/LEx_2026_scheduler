import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AVATAR_COLORS, AVATAR_EMOJIS } from '@/lib/constants';

interface FloatingAvatar {
  id: number;
  emoji: string;
  color: string;
  x: number;
  delay: number;
}

export default function FloatingPresence() {
  const [count] = useState(() => Math.floor(Math.random() * 3) + 2);

  const avatars = useMemo<FloatingAvatar[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
      color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      x: 10 + Math.random() * 80,
      delay: Math.random() * 2,
    }));
  }, [count]);

  return (
    <div className="fixed bottom-20 left-0 right-0 pointer-events-none z-40">
      <div className="relative max-w-lg mx-auto">
        {avatars.map((av) => (
          <motion.div
            key={av.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: av.delay, duration: 0.5 }}
            className="absolute animate-float"
            style={{ left: `${av.x}%`, bottom: 0, animationDelay: `${av.delay}s` }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg text-base"
              style={{ backgroundColor: av.color }}
            >
              {av.emoji}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
        <span className="text-[10px] text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
          {count + 1} people viewing ✨
        </span>
      </div>
    </div>
  );
}
