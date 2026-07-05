import { MoodChip } from './MoodChip';

const ACCENT_INDEXES = new Set([1, 4, 7]);

type MoodMarqueeProps = {
  moods: string[];
};

export function MoodMarquee({ moods }: MoodMarqueeProps) {
  const rowA = [...moods, ...moods];
  const rowB = [...moods.slice().reverse(), ...moods.slice().reverse()];

  return (
    <div
      className="pointer-events-none z-10 flex flex-col gap-3 overflow-hidden py-5 pb-6 lg:hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .marquee-left { animation: marquee-left 38s linear infinite; }
        .marquee-right { animation: marquee-right 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-left, .marquee-right { animation: none; }
        }
      `}</style>

      <div className="marquee-left flex w-max gap-3">
        {rowA.map((mood, i) => (
          <MoodChip
            key={`rowA-${mood}-${Math.floor(i / moods.length)}`}
            label={mood}
            accent={ACCENT_INDEXES.has(i % moods.length)}
            size="sm"
          />
        ))}
      </div>
      <div className="marquee-right flex w-max gap-3">
        {rowB.map((mood, i) => (
          <MoodChip
            key={`rowB-${mood}-${Math.floor(i / moods.length)}`}
            label={mood}
            accent={ACCENT_INDEXES.has(i % moods.length)}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}
