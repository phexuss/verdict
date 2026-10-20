type MoodChipProps = {
  label: string;
  accent: boolean;
  size?: 'sm' | 'md';
};

export function MoodChip({ label, accent, size = 'md' }: MoodChipProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 whitespace-nowrap rounded-full border font-medium"
      style={{
        padding: size === 'sm' ? '0.25rem 0.75rem' : '0.35rem 0.9rem',
        fontSize: size === 'sm' ? '0.75rem' : '0.85rem',
        opacity: accent ? 0.75 : 0.35,
        background: accent
          ? 'color-mix(in oklch, var(--primary) 8%, transparent)'
          : 'color-mix(in oklch, var(--foreground) 3%, transparent)',
        boxShadow: accent
          ? '0 0 18px -6px oklch(0.76 0.13 65 / 0.6)'
          : undefined,
        borderColor: accent
          ? 'var(--primary)'
          : 'color-mix(in oklch, var(--foreground) 20%, transparent)',
        color: accent ? 'var(--primary)' : 'var(--muted-foreground)',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  );
}
