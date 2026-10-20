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
        className="sheen group relative inline-flex h-11 min-w-35 shrink-0 items-center justify-center rounded-4xl border border-transparent bg-primary bg-[linear-gradient(180deg,oklch(0.83_0.12_72),var(--primary)_60%,oklch(0.7_0.13_60))] bg-clip-padding px-7 text-sm font-medium whitespace-nowrap text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.35),0_8px_28px_-8px_oklch(0.76_0.13_65/0.7)] transition-all duration-300 outline-none select-none hover:shadow-[inset_0_1px_0_oklch(1_0_0/0.4),0_0_0_1px_oklch(0.76_0.13_65/0.4),0_12px_40px_-6px_oklch(0.76_0.13_65/0.85)] hover:brightness-110 focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-95"
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
