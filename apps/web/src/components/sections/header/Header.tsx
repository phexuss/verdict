import { Button } from '@repo/ui/components/button';
import { UserLinear } from '@solar-icons/react-perf';
import { Link } from '@/i18n/navigation';
import HeaderNavButtons from './HeaderNavButtons';
import SettingsButton from './SettingsButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center border-b border-white/5 bg-background/75 px-5 py-4 backdrop-blur-md md:px-10 md:py-5.5 xl:px-16 xl:py-8">
      <Link href="/" aria-label="Profile">
        <h1 className="justify-self-start uppercase text-2xl text-[#F7DBA6] md:text-3xl xl:text-5xl">
          verdict
        </h1>
      </Link>

      <HeaderNavButtons />
      <div className="col-start-3  flex flex-row justify-self-end md:gap-1.5">
        <Button asChild variant="ghost" size="icon" className="hidden md:flex">
          <Link href="/profile" aria-label="Profile" className="">
            <UserLinear className="size-4 text-foreground md:size-5 " />
          </Link>
        </Button>

        <SettingsButton />
      </div>
    </header>
  );
}
