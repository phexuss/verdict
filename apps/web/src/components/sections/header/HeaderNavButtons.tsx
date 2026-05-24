import { Button } from '@repo/ui/components/button';

export default function HeaderNavButtons() {
  return (
    <div className="hidden  flex-row items-center gap-8 md:flex md:gap-5">
      <Button className="text-lg" variant="ghost">
        Curated
      </Button>
      <Button className="text-lg" variant="ghost">
        Tonight
      </Button>
      <Button className="text-lg" variant="ghost">
        Profile
      </Button>
    </div>
  );
}
