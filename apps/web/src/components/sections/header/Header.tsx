import { Button } from '@repo/ui/components/button';
import { SettingsLinear, UserLinear } from '@solar-icons/react-perf';
import { Link } from '@/i18n/navigation';
import HeaderNavButtons from './HeaderNavButtons';

export default function Header() {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center px-5 py-4 md:px-10 xl:px-16 md:py-5.5 xl:py-8">
      <Link href="/" aria-label="Profile">
        <h1 className="justify-self-start uppercase text-2xl text-[#F7DBA6] md:text-3xl xl:text-5xl">
          verdict
        </h1>
      </Link>

      <HeaderNavButtons />
      <div className="col-start-3 flex flex-row justify-self-end md:gap-1.5">
        <Button asChild variant="ghost" size="icon">
          <Link href="/profile" aria-label="Profile">
            <UserLinear className="size-4 text-foreground md:size-5" />
          </Link>
        </Button>

        <Button variant="ghost" size="icon">
          <SettingsLinear className="size-4 text-foreground md:size-5" />
        </Button>
      </div>
    </header>
  );
}
