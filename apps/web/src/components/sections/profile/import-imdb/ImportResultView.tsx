'use client';

import { Button } from '@repo/ui/components/button';
import {
  CheckCircleLinear,
  DangerCircleLinear,
  InfoCircleLinear,
} from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { ImdbImportResultDto } from '@/api/import';

type ImportResultViewProps = {
  result: ImdbImportResultDto;
  onDone: () => void;
};

export default function ImportResultView({
  result,
  onDone,
}: ImportResultViewProps) {
  const t = useTranslations('ProfilePage.Sections.ImdbImport.result');
  const [showSkippedDetails, setShowSkippedDetails] = useState(false);
  const [showFailedDetails, setShowFailedDetails] = useState(false);

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
          <CheckCircleLinear className="size-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-base">{t('title')}</h3>
          <p className="text-foreground/70 text-xs">
            {t('imported')}: {result.imported} / {result.total}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-accent/40 p-3 text-center">
          <span className="text-foreground/60 text-xs">{t('total')}</span>
          <span className="font-bold text-lg">{result.total}</span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-primary/30 bg-primary/15 p-3 text-center text-primary">
          <span className="text-xs font-medium">{t('imported')}</span>
          <span className="font-bold text-lg">{result.imported}</span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-accent/40 p-3 text-center">
          <span className="text-foreground/60 text-xs">{t('skipped')}</span>
          <span className="font-bold text-lg text-foreground/80">
            {result.skipped}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-red-400">
          <span className="text-xs font-medium">{t('failed')}</span>
          <span className="font-bold text-lg">{result.failed}</span>
        </div>
      </div>

      {result.details.skippedItems.length > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-accent/20 p-3">
          <button
            type="button"
            onClick={() => setShowSkippedDetails((prev) => !prev)}
            className="flex items-center justify-between text-left text-xs font-medium text-foreground/70 hover:text-foreground"
          >
            <span className="flex items-center gap-1.5">
              <InfoCircleLinear className="size-4 text-amber-500" />
              {t('skippedReasonTitle')} ({result.details.skippedItems.length})
            </span>
            <span>{showSkippedDetails ? '▲' : '▼'}</span>
          </button>

          {showSkippedDetails && (
            <div className="mt-2 flex max-h-36 flex-col gap-1.5 overflow-y-auto pr-1 text-xs">
              {result.details.skippedItems.map((item) => (
                <div
                  key={`${item.imdbId}-${item.title}`}
                  className="flex items-center justify-between gap-2 border-border/30 border-b pb-1 text-foreground/60"
                >
                  <span className="truncate font-medium">{item.title}</span>
                  <span className="shrink-0 text-[10px] text-foreground/40 font-mono">
                    {item.reason}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {result.details.failedItems.length > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <button
            type="button"
            onClick={() => setShowFailedDetails((prev) => !prev)}
            className="flex items-center justify-between text-left text-xs font-medium text-red-400 hover:text-red-300"
          >
            <span className="flex items-center gap-1.5">
              <DangerCircleLinear className="size-4 text-red-400" />
              {t('failedReasonTitle')} ({result.details.failedItems.length})
            </span>
            <span>{showFailedDetails ? '▲' : '▼'}</span>
          </button>

          {showFailedDetails && (
            <div className="mt-2 flex max-h-36 flex-col gap-1.5 overflow-y-auto pr-1 text-xs">
              {result.details.failedItems.map((item) => (
                <div
                  key={`${item.imdbId}-${item.title}`}
                  className="flex items-center justify-between gap-2 border-red-500/20 border-b pb-1 text-red-300/80"
                >
                  <span className="truncate font-medium">{item.title}</span>
                  <span className="shrink-0 text-[10px] text-red-400/60 font-mono">
                    {item.error}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Button
        type="button"
        onClick={onDone}
        className="w-full py-5 text-sm font-semibold"
      >
        {t('doneButton')}
      </Button>
    </div>
  );
}
