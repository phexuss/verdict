'use client';

import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { toast } from '@repo/ui/components/sonner';
import { InfoCircleLinear } from '@solar-icons/react-perf';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  getGetTasteProfileQueryKey,
  getGetUserMoviesQueryKey,
} from '@/api/generated/user/user';
import { type ImdbImportResultDto, useImportImdbRatings } from '@/api/import';
import { useImdbImportInstruction } from '@/hooks/useImdbImportInstruction';
import ImportFileUploader from './ImportFileUploader';
import ImportInstructionStep from './ImportInstructionStep';
import ImportResultView from './ImportResultView';

type ImportImdbModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ModalViewMode = 'instruction' | 'upload' | 'result';

export default function ImportImdbModal({
  isOpen,
  onClose,
}: ImportImdbModalProps) {
  const t = useTranslations('ProfilePage.Sections.ImdbImport');
  const queryClient = useQueryClient();
  const { hasSeenInstruction, markAsSeen } = useImdbImportInstruction();

  const [mode, setMode] = useState<ModalViewMode>(
    hasSeenInstruction ? 'upload' : 'instruction',
  );
  const [importResult, setImportResult] = useState<ImdbImportResultDto | null>(
    null,
  );

  const importMutation = useImportImdbRatings({
    mutation: {
      onSuccess: (data) => {
        setImportResult(data);
        setMode('result');
        queryClient.invalidateQueries({
          queryKey: getGetUserMoviesQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetTasteProfileQueryKey(),
        });
      },
      onError: (err) => {
        toast.error(err.message || t('errors.importFailed'));
      },
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setMode(hasSeenInstruction ? 'upload' : 'instruction');
      setImportResult(null);
      onClose();
    }
  };

  const handleCompleteInstruction = () => {
    markAsSeen();
    setMode('upload');
  };

  const handleSkipInstruction = () => {
    markAsSeen();
    setMode('upload');
  };

  const handleReopenInstruction = () => {
    setMode('instruction');
  };

  const handleUploadFile = (file: File) => {
    importMutation.mutate({ file });
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl border-foreground/10 bg-card p-6 shadow-2xl rounded-2xl">
        <DialogHeader className="border-border/40 border-b pb-4 pr-10">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="font-semibold text-xl leading-none">
              {t('modalTitle')}
            </DialogTitle>

            {mode === 'upload' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReopenInstruction}
                className="flex shrink-0 items-center gap-1.5 text-foreground/70 hover:text-foreground"
              >
                <InfoCircleLinear className="size-4 text-primary" />
                <span className="text-xs font-medium">
                  {t('reopenInstruction')}
                </span>
              </Button>
            )}
          </div>
          <DialogDescription className="sr-only">
            {t('cardDescription')}
          </DialogDescription>
        </DialogHeader>

        {mode === 'instruction' && (
          <ImportInstructionStep
            onComplete={handleCompleteInstruction}
            onSkip={handleSkipInstruction}
          />
        )}

        {mode === 'upload' && (
          <ImportFileUploader
            onUpload={handleUploadFile}
            isUploading={importMutation.isPending}
          />
        )}

        {mode === 'result' && importResult && (
          <ImportResultView result={importResult} onDone={handleDone} />
        )}
      </DialogContent>
    </Dialog>
  );
}
