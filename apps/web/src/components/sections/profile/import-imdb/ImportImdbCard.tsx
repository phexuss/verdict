'use client';

import { Button } from '@repo/ui/components/button';
import { ExportLinear } from '@solar-icons/react-perf';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ImportImdbModal from './ImportImdbModal';

export default function ImportImdbCard() {
  const t = useTranslations('ProfilePage.Sections.ImdbImport');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="relative flex flex-col justify-between rounded-2xl border border-foreground/8 bg-accent p-5 transition-all hover:border-foreground/15">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/socials/imdb.svg"
              alt="IMDb"
              width={28}
              height={28}
              className="size-7 rounded-md object-contain"
            />
            <h3 className="font-semibold text-xl leading-snug">
              {t('cardTitle')}
            </h3>
          </div>

          <span className="shrink-0 rounded-full border border-foreground/20 px-2.5 py-0.5 font-bold text-[10px] text-foreground/70 uppercase tracking-wider">
            {t('newBadge')}
          </span>
        </div>

        <p className="my-4 text-foreground/70 text-sm leading-relaxed">
          {t('cardDescription')}
        </p>

        <Button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full rounded-full border border-foreground/20 bg-background/40 py-5 text-sm font-medium hover:border-foreground/30 hover:bg-background/60"
          variant="outline"
        >
          <ExportLinear className="size-4 text-primary" />
          <span>{t('cardButton')}</span>
        </Button>
      </section>

      <ImportImdbModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
