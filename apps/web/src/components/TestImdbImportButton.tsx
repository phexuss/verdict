'use client';

import { Button } from '@repo/ui/components/button';
import { ExportLinear } from '@solar-icons/react-perf';
import { useState } from 'react';
import ImportImdbModal from '@/components/sections/profile/import-imdb/ImportImdbModal';

export default function TestImdbImportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="border-amber-500/40 bg-amber-500/10 text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/20"
      >
        <ExportLinear className="size-4" />
        <span>[DEV TEST] IMDb Import</span>
      </Button>

      <ImportImdbModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
