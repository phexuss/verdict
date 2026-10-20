'use client';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

interface BrowseButtonProps {
  translations: string;
  href: string;
}

export default function BrowseButton({
  translations,
  href,
}: BrowseButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: 1.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={href}
        className="group relative flex h-11 items-center justify-center rounded-4xl border border-white/10 bg-white/[0.04] px-7 text-sm font-medium text-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.06)] backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.08] hover:shadow-[inset_0_1px_0_oklch(1_0_0/0.08),0_0_28px_-10px_oklch(0.76_0.13_65/0.5)] active:scale-95"
      >
        <span className="transition-transform duration-300 ease-out group-hover:-translate-x-2.5">
          {translations}
        </span>

        <span className="absolute right-3.5 opacity-0 transition-all duration-300 ease-out -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100">
          →
        </span>
      </Link>
    </motion.div>
  );
}
