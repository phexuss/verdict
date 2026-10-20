import Image from 'next/image';

type AmbienceProps = {
  src: string;
};

// Blurred, full-bleed copy of the artwork that tints the top of the page.
export function AmbientBackdrop({ src }: AmbienceProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[75svh] w-screen -translate-x-1/2 overflow-hidden opacity-35 mask-[linear-gradient(to_bottom,black,transparent)]"
    >
      <Image
        alt=""
        className="scale-110 object-cover blur-3xl saturate-150"
        fill
        priority={false}
        sizes="40vw"
        src={src}
      />
    </div>
  );
}

// Soft glow behind a poster, sampled from the poster itself.
export function PosterGlow({ src }: AmbienceProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-2 -z-10 translate-y-4 opacity-60 blur-2xl saturate-150"
    >
      <Image alt="" className="object-cover" fill sizes="10rem" src={src} />
    </div>
  );
}
