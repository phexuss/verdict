'use client';

import {
  PlayCircleLinear,
  StarLinear,
  UserLinear,
} from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/curated', label: 'curated', icon: StarLinear },
  { href: '/', label: 'tonight', icon: PlayCircleLinear },
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
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-white/10 border-t bg-background/80 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] ">
      <div className="grid grid-cols-3 gap-1">
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              href={item.href}
              key={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-muted-foreground transition-all duration-200',
                'hover:bg-white/5 hover:text-foreground active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive && 'bg-primary/10 text-primary ',
              )}
            >
              <span
                className={cn(
                  'absolute top-1 h-1 w-1 rounded-full bg-primary opacity-0 transition-opacity',
                  isActive && 'opacity-100',
                )}
              />

              <Icon
                size={26}
                className={cn(
                  'transition-transform duration-200 group-hover:-translate-y-0.5',
                  isActive && 'scale-105',
                )}
              />

              <span
                className={cn(
                  'font-medium text-[11px] leading-none tracking-tight capitalize',
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
