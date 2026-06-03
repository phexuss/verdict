import { useTranslations } from 'next-intl';

interface VibeCardProps {
  description: string;
}

export default function StorylineCard({ description }: VibeCardProps) {
  const t = useTranslations('CuratedPage.SlugPage');
  return (
    <div className="flex flex-col  border border-accent-foreground/10 rounded-lg p-5 gap-2">
      <h2 className="text-2xl">{t('title')}</h2>
      <p className="text-secondary-foreground/75">{description}</p>
    </div>
  );
}
