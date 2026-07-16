'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type ErrorSceneProps = {
  title: string;
  description: string;
  retryLabel: string;
  homeLabel: string;
  onRetry: () => void;
};

export default function ErrorScene({
  title,
  description,
  retryLabel,
  homeLabel,
  onRetry,
}: ErrorSceneProps) {
  return (
    <main className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] md:h-150 md:w-150"
        style={{ background: 'var(--destructive)', opacity: 0.04 }}
      />

      <motion.div
        className="relative z-10 mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          role="img"
          aria-label="Error"
          className="md:h-16 md:w-16"
        >
          <title>Error</title>
          <motion.circle
            cx="28"
            cy="28"
            r="26"
            stroke="var(--destructive)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
            strokeDasharray="163.4"
            initial={{ strokeDashoffset: 163.4 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          />
          <motion.line
            x1="28"
            y1="17"
            x2="28"
            y2="32"
            stroke="var(--destructive)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 0.4, delay: 0.7, ease: EASE }}
          />
          <motion.circle
            cx="28"
            cy="38"
            r="2"
            fill="var(--destructive)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.3, delay: 0.9, ease: EASE }}
          />
        </svg>
      </motion.div>

      <motion.h1
        className="mb-2 text-xl font-semibold text-foreground md:text-2xl"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      >
        {title}
      </motion.h1>

      <motion.p
        className="mb-10 max-w-xs text-center text-sm leading-relaxed text-muted-foreground md:max-w-sm md:text-base"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
      >
        {description}
      </motion.p>

      <motion.div
        className="flex items-center gap-3"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
      >
        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            role="img"
            aria-label="Retry"
          >
            <title>Retry</title>
            <path
              d="M13.65 8A5.65 5.65 0 1 1 8 2.35c1.97 0 3.7 1 4.72 2.53"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10 5h3V2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {retryLabel}
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-6 py-2.5 text-sm font-medium text-foreground transition-colors duration-300 hover:bg-white/10"
          >
            {homeLabel}
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
