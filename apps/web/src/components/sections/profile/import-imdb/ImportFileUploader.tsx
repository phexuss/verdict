'use client';

import { Button } from '@repo/ui/components/button';
import { toast } from '@repo/ui/components/sonner';
import {
  DocumentAddLinear,
  FileCheckLinear,
  RefreshLinear,
} from '@solar-icons/react-perf';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

type ImportFileUploaderProps = {
  onUpload: (file: File) => void;
  isUploading: boolean;
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export default function ImportFileUploader({
  onUpload,
  isUploading,
}: ImportFileUploaderProps) {
  const t = useTranslations('ProfilePage.Sections.ImdbImport.upload');
  const errT = useTranslations('ProfilePage.Sections.ImdbImport.errors');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateAndSetFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error(errT('invalidFileType'));
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(errT('fileTooLarge'));
      return;
    }
    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
          isDragOver
            ? 'border-primary bg-primary/10 scale-[0.99]'
            : selectedFile
              ? 'border-primary/40 bg-accent/60'
              : 'border-foreground/15 bg-accent/30 hover:border-primary/50 hover:bg-accent/60'
        }`}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
              <FileCheckLinear className="size-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold text-sm">{selectedFile.name}</p>
              <p className="text-foreground/50 text-xs font-mono">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="mt-1"
            >
              {t('changeFile')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-primary">
              <DocumentAddLinear className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">{t('dropzoneTitle')}</p>
              <p className="text-foreground/50 text-xs">{t('dropzoneHint')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button & Status */}
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          disabled={!selectedFile || isUploading}
          onClick={handleSubmit}
          className="w-full py-5 text-sm font-semibold"
        >
          {isUploading ? (
            <>
              <RefreshLinear className="size-4 animate-spin" />
              <span>{t('uploading')}</span>
            </>
          ) : (
            t('uploadButton')
          )}
        </Button>
      </div>
    </div>
  );
}
