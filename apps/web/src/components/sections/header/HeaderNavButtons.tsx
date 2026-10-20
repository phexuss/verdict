'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/curated', label: 'curated' },
  { href: '/tonight', label: 'tonight' },
  { href: '/profile', label: 'profile' },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function HeaderNavButtons() {
  const pathname = usePathname();
  const t = useTranslations('Header.navigation');

  return (
    <nav className="hidden flex-row items-center gap-8 md:flex xl:gap-16">
      {navItems.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative px-1 pb-2 text-foreground/70 transition-[color,text-shadow] duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-gold-soft/50 after:transition-transform after:duration-300 hover:text-gold-soft hover:after:scale-x-100 xl:text-xl',
              isActive && 'font-semibold text-gold-soft text-glow after:hidden',
            )}
            href={item.href}
            key={item.href}
          >
            {t(item.label)}
            {isActive ? (
              <motion.span
                aria-hidden
                layoutId="header-nav-indicator"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                className="absolute inset-x-0 bottom-0 h-px bg-gold-soft shadow-[0_0_10px_2px_oklch(0.76_0.13_65/0.55)]"
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
