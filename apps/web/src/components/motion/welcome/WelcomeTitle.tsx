'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function WelcomeTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.h1
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.25 },
        },
      }}
      className={className}
    >
      <span className="flex flex-wrap gap-x-3 gap-y-2">{children}</span>
    </motion.h1>
  );
}

export function AnimatedChunk({ children }: { children: ReactNode }) {
  return (
    <span className="overflow-hidden pr-3 pb-1 flex items-center">
      <motion.span
        variants={{
          hidden: { y: '100%', opacity: 0 },
          show: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

export function AnimatedDescription({
  translations,
  className,
}: {
  translations: string;
  className?: string;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 1.2,
      }}
      className={className}
    >
      {translations}
    </motion.p>
  );
}
