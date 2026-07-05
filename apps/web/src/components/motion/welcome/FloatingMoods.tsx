'use client';

import { motion } from 'framer-motion';

type MoodPosition = {
  top: string;
  right: string;
  accent: boolean;
  size: 'sm' | 'md';
};

const MOOD_POSITIONS: MoodPosition[] = [
  { top: '14%', right: '12%', accent: false, size: 'md' },
  { top: '22%', right: '28%', accent: true, size: 'sm' },
  { top: '31%', right: '7%', accent: false, size: 'sm' },
  { top: '40%', right: '20%', accent: false, size: 'md' },
  { top: '48%', right: '34%', accent: true, size: 'sm' },
  { top: '55%', right: '9%', accent: false, size: 'md' },
  { top: '62%', right: '23%', accent: false, size: 'sm' },
  { top: '70%', right: '15%', accent: true, size: 'md' },
  { top: '78%', right: '5%', accent: false, size: 'sm' },
];

export function FloatingMoods({ moods }: { moods: string[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
      {moods.map((mood, i) => {
        const pos = MOOD_POSITIONS[i];
        if (!pos) return null;

        return (
          <motion.span
            key={mood}
            animate={{
              y: [0, -20, 0, 10, 0],
              x: [0, 10, -10, 5, 0],
              rotate: [0, 3, -2, 1, 0],
            }}
            transition={{
              duration: 15 + (i % 4) * 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
            className="absolute rounded-full border font-medium"
            style={{
              top: pos.top,
              right: pos.right,

              fontSize:
                pos.size === 'sm'
                  ? 'clamp(0.9rem, 2.7vw, 1.05rem)'
                  : 'clamp(1.05rem, 3vw, 1.2rem)',

              padding: pos.size === 'sm' ? '0.4rem 1.2rem' : '0.5rem 1.4rem',

              opacity: pos.accent ? 0.55 : 0.25,
              borderColor: pos.accent
                ? 'var(--primary)'
                : 'color-mix(in oklch, var(--foreground) 20%, transparent)',
              color: pos.accent ? 'var(--primary)' : 'var(--muted-foreground)',
              letterSpacing: '0.02em',
            }}
          >
            {mood}
          </motion.span>
        );
      })}
    </div>
  );
}
