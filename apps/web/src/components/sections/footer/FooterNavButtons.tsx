'use client';

import {
  PlayCircleLinear,
  StarLinear,
  UserLinear,
} from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/curated', label: 'curated', icon: StarLinear },
  { href: '/tonight', label: 'tonight', icon: PlayCircleLinear },
  { href: '/profile', label: 'profile', icon: UserLinear },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function FooterNavButtons() {
  const pathname = usePathname();
  const t = useTranslations('Footer.navigation');

  return (
    <nav
      data-slot="bottom-nav"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      <div className="glass relative mx-auto grid max-w-md grid-cols-3 gap-1 rounded-[1.75rem] border border-white/10 p-1.5 shadow-[inset_0_1px_0_oklch(1_0_0/0.06),0_18px_40px_-12px_oklch(0_0_0/0.9),0_0_40px_-20px_oklch(0.76_0.13_65/0.35)]">
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-[1.35rem] px-3 py-2 text-muted-foreground transition-[color,transform] duration-200',
                'hover:text-foreground active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive && 'text-primary',
              )}
            >
              {isActive ? (
                <motion.span
                  aria-hidden
                  layoutId="footer-nav-indicator"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="absolute inset-0 -z-10 rounded-[1.35rem] border border-primary/20 bg-primary/10 shadow-[inset_0_1px_0_oklch(1_0_0/0.06),0_0_24px_-8px_oklch(0.76_0.13_65/0.6)]"
                >
                  <span className="absolute top-0 left-1/2 h-px w-8 -translate-x-1/2 bg-linear-to-r from-transparent via-primary to-transparent" />
                </motion.span>
              ) : null}

              <Icon
                size={26}
                className={cn(
                  'transition-transform duration-200 group-hover:-translate-y-0.5',
                  isActive &&
                    'scale-105 drop-shadow-[0_0_8px_oklch(0.76_0.13_65/0.6)]',
                )}
              />

              <span
                className={cn(
                  'font-medium text-[12px] leading-none tracking-tight capitalize',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
