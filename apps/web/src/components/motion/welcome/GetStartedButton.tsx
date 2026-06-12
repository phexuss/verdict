'use client';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

interface GetStartedButtonProps {
  translations: string;
  href: string;
}

export default function GetStartedButton({
  translations,
  href,
}: GetStartedButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: 1.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="inline-block"
    >
      <Link
        href={href}
        className="group relative inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 active:scale-95 bg-primary text-primary-foreground hover:bg-primary/80 h-10 px-6 min-w-35"
      >
        <span className="transition-transform duration-300 ease-out group-hover:-translate-x-2.5">
          {translations}
        </span>
        <span className="absolute right-4 opacity-0 transition-all duration-300 ease-out -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100">
          →
        </span>
      </Link>
    </motion.div>
  );
}
