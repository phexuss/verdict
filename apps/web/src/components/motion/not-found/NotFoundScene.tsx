'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PARTICLES = [
  { id: 'p-tl', size: 4, left: '12%', top: '18%', duration: 20, delay: 0 },
  { id: 'p-tr', size: 6, left: '85%', top: '22%', duration: 24, delay: 1.5 },
  { id: 'p-br', size: 3, left: '75%', top: '78%', duration: 18, delay: 0.8 },
  { id: 'p-bl', size: 5, left: '20%', top: '75%', duration: 22, delay: 2.2 },
  { id: 'p-mr', size: 3, left: '92%', top: '50%', duration: 19, delay: 1 },
  { id: 'p-ml', size: 4, left: '8%', top: '55%', duration: 21, delay: 3 },
  { id: 'p-tc', size: 5, left: '55%', top: '8%', duration: 23, delay: 0.5 },
  { id: 'p-bc', size: 3, left: '45%', top: '90%', duration: 17, delay: 2.8 },
];

const DIGITS = [
  { id: 'd-4l', char: '4', accent: false, delay: 0 },
  { id: 'd-0', char: '0', accent: true, delay: 0.12 },
  { id: 'd-4r', char: '4', accent: false, delay: 0.24 },
] as const;

type NotFoundSceneProps = {
  title: string;
  description: string;
  ctaLabel: string;
};

export default function NotFoundScene({
  title,
  description,
  ctaLabel,
}: NotFoundSceneProps) {
  return (
    <main className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] md:h-150 md:w-150"
        style={{ background: 'var(--primary)', opacity: 0.05 }}
      />

      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            background: 'var(--primary)',
          }}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -20, 5, -15, 0],
            x: [0, 8, -5, 10, 0],
            opacity: [0.08, 0.22, 0.12, 0.18, 0.08],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative z-10 mb-6 flex select-none items-baseline">
        {DIGITS.map((digit) => (
          <motion.span
            key={digit.id}
            className="relative text-[7rem] font-bold leading-none tracking-tighter sm:text-[9rem] md:text-[11rem]"
            style={{
              color: digit.accent ? 'var(--primary)' : 'var(--foreground)',
            }}
            initial={{ y: 60, opacity: 0, filter: 'blur(12px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: digit.delay, ease: EASE }}
          >
            {digit.accent && (
              <motion.div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div
                  className="h-20 w-20 rounded-full blur-[50px] sm:h-28 sm:w-28 md:h-36 md:w-36 md:blur-[70px]"
                  style={{ background: 'var(--primary)' }}
                />
              </motion.div>
            )}
            {digit.char}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="mb-6 h-px w-20 md:w-28"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--primary), transparent)',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.5 }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
      />

      <motion.h1
        className="mb-3 text-lg font-semibold text-foreground md:text-xl"
        initial={{ y: 20, opacity: 0, filter: 'blur(6px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="mb-10 max-w-sm text-center text-sm leading-relaxed text-muted-foreground md:text-base"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
      >
        {description}
      </motion.p>

      <motion.div
        initial={{ scale: 0.85, opacity: 0, filter: 'blur(5px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
      >
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20"
          >
            {ctaLabel}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              role="img"
              aria-label="Arrow right"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <title>Arrow right</title>
              <path
                d="M3.33 8h9.34M8.67 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
