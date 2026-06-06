import { useTranslations } from 'next-intl';

interface VibeCardProps {
  description: string;
}

export default function StorylineCard({ description }: VibeCardProps) {
  const t = useTranslations('CuratedPage.SlugPage');
  return (
    <section className="flex flex-col gap-3 rounded-md border border-sidebar-ring/8 bg-accent p-4">
      <h2 className="font-medium text-xl">{t('title')}</h2>
      <p className="text-foreground/70 text-sm leading-relaxed">
        {description}
      </p>
    </section>
  );
}
