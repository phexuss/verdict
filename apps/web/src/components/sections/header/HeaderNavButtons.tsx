'use client';

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
              'relative px-1 pb-2 text-foreground/70 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-[#F7DBA6] after:transition-transform after:duration-200 hover:text-[#F7DBA6] hover:after:scale-x-100 xl:text-xl',
              isActive && 'font-semibold text-[#F7DBA6] after:scale-x-100',
            )}
            href={item.href}
            key={item.href}
          >
            {t(item.label)}
          </Link>
        );
      })}
    </nav>
  );
}
