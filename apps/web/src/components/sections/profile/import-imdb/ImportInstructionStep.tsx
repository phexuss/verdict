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
        <div className="flex h-44 w-full flex-col justify-between rounded-xl border border-foreground/10 bg-background/60 p-4 font-sans backdrop-blur-sm">
          <div className="flex items-center justify-between border-foreground/10 border-b pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-500 text-xs tracking-wider">
                IMDb
              </span>
              <span className="text-foreground/40 text-xs">/ Profile</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-accent px-2 py-1 text-xs">
              <UserCheckLinear className="size-3.5 text-primary" />
              <span>Your Account</span>
            </div>
          </div>
          <div className="my-auto flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 shadow-sm">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                ★
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">Your Ratings</span>
                <span className="text-foreground/50 text-xs">
                  Your rated movies & shows
                </span>
              </div>
              <span className="ml-2 rounded bg-primary/20 px-1.5 py-0.5 font-mono text-primary text-[10px]">
                CLICK
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('step2.title'),
      description: t('step2.description'),
      renderMockup: () => (
        <div className="flex h-44 w-full flex-col justify-between rounded-xl border border-foreground/10 bg-background/60 p-4 font-sans backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs">Your Ratings</span>
              <span className="rounded bg-accent px-1.5 py-0.5 text-foreground/50 text-[10px]">
                128 titles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-primary bg-primary/15 px-3 py-1 text-primary text-xs font-medium">
                <ExportLinear className="size-3.5" />
                <span>Export</span>
                <span className="ml-1 rounded bg-primary/20 px-1 text-[10px]">
                  CSV
                </span>
              </div>
            </div>
          </div>
          <div className="my-auto flex flex-col items-center justify-center gap-1 text-center">
            <div className="flex items-center gap-2 rounded-md border border-border/40 bg-accent/40 px-3 py-1.5 text-foreground/70 text-xs">
              <span>Downloaded file:</span>
              <span className="font-mono text-primary text-xs font-semibold">
                ratings.csv
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('step3.title'),
      description: t('step3.description'),
      renderMockup: () => (
        <div className="flex h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <DocumentAddLinear className="size-6" />
          </div>
          <p className="font-medium text-sm">ratings.csv → Verdict Shelf</p>
          <p className="mt-1 text-foreground/50 text-xs">
            TMDB Auto-matching & Sync
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
    <div className="flex flex-col gap-6 py-2">
      {/* Mockup Preview */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {steps[currentStep]?.renderMockup()}
      </motion.div>

      {/* Step Description */}
      <div className="flex flex-col gap-1.5 text-center sm:text-left">
        <h3 className="font-semibold text-lg leading-snug">
          {steps[currentStep]?.title}
        </h3>
        <p className="text-foreground/70 text-sm leading-relaxed">
          {steps[currentStep]?.description}
        </p>
      </div>

      {/* Dots pagination */}
      <div className="flex items-center justify-center gap-2 py-1">
        {steps.map((_, index) => (
          <button
            key={index}
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

      {/* Bottom controls */}
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
