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
        opacity: accent ? 0.65 : 0.3,
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
