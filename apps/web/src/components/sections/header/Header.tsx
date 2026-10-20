import { ProfileButton } from '@/components/motion/header/ProfileButton';
import { SearchButton } from '@/components/motion/header/SearchButton';
import { Link } from '@/i18n/navigation';
import HeaderNavButtons from './HeaderNavButtons';
import SettingsButton from './SettingsButton';

export default function Header() {
  return (
    <header className="glass sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center border-b border-white/5 px-5 py-4 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-linear-to-r after:from-transparent after:via-primary/40 after:to-transparent md:px-10 md:py-5 xl:px-16 xl:py-6">
      <Link
        href="/"
        aria-label="Verdict"
        className="group w-fit justify-self-start"
      >
        <h1 className="text-gold animate-text-shine uppercase text-2xl tracking-wide drop-shadow-[0_0_18px_oklch(0.76_0.13_65/0.35)] transition-[filter] duration-500 group-hover:drop-shadow-[0_0_24px_oklch(0.76_0.13_65/0.6)] md:text-3xl xl:text-5xl">
          verdict
        </h1>
      </Link>
      <HeaderNavButtons />
      <div className="col-start-3 flex flex-row items-center justify-self-end gap-1 md:gap-1.5">
        <SearchButton />
        <ProfileButton />
        <SettingsButton />
      </div>
    </header>
  );
}
