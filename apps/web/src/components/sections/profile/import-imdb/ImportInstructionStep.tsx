'use client';

import { Button } from '@repo/ui/components/button';
import {
  AltArrowLeftLinear,
  AltArrowRightLinear,
  CheckCircleLinear,
  DocumentAddLinear,
  ExportLinear,
  UserCheckLinear,
} from '@solar-icons/react-perf';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type ImportInstructionStepProps = {
  onComplete: () => void;
  onSkip: () => void;
};

export default function ImportInstructionStep({
  onComplete,
  onSkip,
}: ImportInstructionStepProps) {
  const t = useTranslations('ProfilePage.Sections.ImdbImport.steps');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: t('step1.title'),
      description: t('step1.description'),
      renderMockup: () => (
        <div className="flex h-48 w-full flex-col justify-between rounded-xl border border-foreground/10 bg-background/80 p-4 font-sans backdrop-blur-sm shadow-inner">
          <div className="flex items-center justify-between border-foreground/10 border-b pb-2.5">
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-bold text-amber-500 text-xs tracking-wider">
                IMDb
              </span>
              <span className="text-foreground/40 text-xs">/ Nav</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-accent px-2 py-0.5 text-foreground/60 text-xs">
                Watchlist 84
              </span>
              <div className="flex items-center gap-1.5 rounded-md bg-primary/15 px-2.5 py-1 text-primary text-xs font-semibold">
                <UserCheckLinear className="size-3.5" />
                <span>Profile ▾</span>
              </div>
            </div>
          </div>

          <div className="my-auto flex items-center justify-center">
            <div className="flex w-64 flex-col rounded-lg border border-primary/40 bg-card p-1.5 shadow-xl">
              <div className="px-3 py-1 text-foreground/40 text-[11px]">
                Your profile
              </div>
              <div className="flex items-center justify-between rounded-md bg-primary/15 px-3 py-2 text-primary font-semibold text-xs shadow-sm">
                <div className="flex items-center gap-2">
                  <span>★</span>
                  <span>Your ratings</span>
                </div>
                <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[10px]">
                  CLICK
                </span>
              </div>
              <div className="px-3 py-1 text-foreground/40 text-[11px]">
                Your Watchlist
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('step2.title'),
      description: t('step2.description'),
      renderMockup: () => (
        <div className="flex h-48 w-full flex-col justify-between rounded-xl border border-foreground/10 bg-background/80 p-4 font-sans backdrop-blur-sm shadow-inner">
          <div className="flex items-center justify-between border-foreground/10 border-b pb-2.5">
            <div>
              <span className="font-semibold text-sm">
                Your ratings history
              </span>
              <span className="ml-2 text-foreground/40 text-xs">
                172 titles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground/40 text-xs">⋮ Actions</span>
            </div>
          </div>

          <div className="my-auto flex items-center justify-end pr-4">
            <div className="flex w-52 flex-col rounded-lg border border-primary/40 bg-card p-1.5 shadow-xl">
              <div className="flex items-center justify-between rounded-md bg-primary/15 px-3 py-2 text-primary font-semibold text-xs shadow-sm">
                <div className="flex items-center gap-2">
                  <ExportLinear className="size-3.5" />
                  <span>Export</span>
                </div>
                <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[10px]">
                  CSV
                </span>
              </div>
              <div className="px-3 py-1.5 text-foreground/40 text-xs">
                + Create a new list
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('step3.title'),
      description: t('step3.description'),
      renderMockup: () => (
        <div className="flex h-48 w-full flex-col items-center justify-center rounded-xl border border-foreground/10 bg-background/80 p-4 font-sans backdrop-blur-sm shadow-inner">
          <div className="flex w-full max-w-sm flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">
                Exporting Your ratings
              </span>
              <span className="text-foreground/40 text-xs">✕</span>
            </div>
            <p className="text-foreground/60 text-xs leading-relaxed">
              Export processing may take time. Track status on your exports
              page.
            </p>
            <div className="flex items-center justify-center rounded-lg border border-primary/50 bg-primary/20 py-2 font-medium text-primary text-xs shadow-sm">
              <span>Open exports page 🔗</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('step4.title'),
      description: t('step4.description'),
      renderMockup: () => (
        <div className="flex h-48 w-full flex-col justify-between rounded-xl border border-foreground/10 bg-background/80 p-4 font-sans backdrop-blur-sm shadow-inner">
          <div className="border-foreground/10 border-b pb-2">
            <span className="font-semibold text-sm">Your exports</span>
          </div>

          <div className="my-auto flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-lg border border-primary/40 bg-card p-3 shadow-md">
              <div className="flex flex-col">
                <span className="font-medium text-xs">Your ratings</span>
                <span className="text-foreground/50 text-[11px]">
                  172 titles • Ready
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-primary-foreground font-semibold text-xs shadow-sm">
                <span>Download .CSV</span>
                <span>📥</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('step5.title'),
      description: t('step5.description'),
      renderMockup: () => (
        <div className="flex h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
            <DocumentAddLinear className="size-5" />
          </div>
          <p className="font-semibold text-sm">ratings.csv (172 titles)</p>
          <p className="mt-1 text-foreground/60 text-xs">
            Ready to import into Verdict Shelf
          </p>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-1">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {steps[currentStep]?.renderMockup()}
      </motion.div>

      <div className="flex flex-col gap-1.5 text-center sm:text-left">
        <h3 className="font-semibold text-lg leading-snug">
          {steps[currentStep]?.title}
        </h3>
        <p className="text-foreground/70 text-sm leading-relaxed">
          {steps[currentStep]?.description}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 py-1">
        {steps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            onClick={() => setCurrentStep(index)}
            aria-label={`Go to step ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'w-6 bg-primary'
                : 'w-2 bg-foreground/20 hover:bg-foreground/40'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 border-border/40 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="text-foreground/60 hover:text-foreground"
        >
          {t('skipInstruction')}
        </Button>

        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={prevStep}
            >
              <AltArrowLeftLinear className="size-4" />
              {t('prev')}
            </Button>
          )}

          <Button type="button" size="sm" onClick={nextStep}>
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircleLinear className="size-4" />
                {t('startUpload')}
              </>
            ) : (
              <>
                {t('next')}
                <AltArrowRightLinear className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
