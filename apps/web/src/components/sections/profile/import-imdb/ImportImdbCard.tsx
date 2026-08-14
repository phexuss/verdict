'use client';

import { Button } from '@repo/ui/components/button';
import { ExportLinear } from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ImportImdbModal from './ImportImdbModal';

export default function ImportImdbCard() {
  const t = useTranslations('ProfilePage.Sections.ImdbImport');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative flex min-h-36 flex-col justify-between overflow-hidden rounded-xl border border-foreground/8 bg-accent p-4 transition-all hover:border-foreground/15">
        {/* Top Header Row with Title & NEW Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/15 font-bold text-amber-500 text-xs tracking-wider">
              IMDb
            </div>
            <h3 className="font-medium text-xl leading-snug">
              {t('cardTitle')}
            </h3>
          </div>

          <span className="inline-flex shrink-0 animate-pulse items-center rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 font-bold text-[10px] text-primary uppercase tracking-wider">
            {t('newBadge')}
          </span>
        </div>

        {/* Description */}
        <p className="my-3 text-foreground/70 text-sm leading-relaxed">
          {t('cardDescription')}
        </p>

        {/* Button */}
        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full border-primary/25 bg-primary/10 text-foreground hover:border-primary/40 hover:bg-primary/15"
          variant="outline"
        >
          <ExportLinear className="size-4 text-primary" />
          {t('cardButton')}
        </Button>
      </section>

      <ImportImdbModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
