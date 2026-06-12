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
        className="group relative flex h-10 items-center justify-center rounded-4xl border border-white/10 bg-white/5 px-6 text-sm font-medium text-foreground transition-all duration-300 hover:bg-white/10 active:scale-95"
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
