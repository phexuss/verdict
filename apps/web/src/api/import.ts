import { type UseMutationOptions, useMutation } from '@tanstack/react-query';
import { customFetch, type ErrorType } from './fetcher';

export type ImdbImportSkippedItemDto = {
  imdbId: string;
  title: string;
  reason: string;
};

export type ImdbImportFailedItemDto = {
  imdbId: string;
  title: string;
  error: string;
};

export type ImdbImportDetailsDto = {
  skippedItems: ImdbImportSkippedItemDto[];
  failedItems: ImdbImportFailedItemDto[];
};

export type ImdbImportResultDto = {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  details: ImdbImportDetailsDto;
};

export const getImportImdbUrl = () => {
  return `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/import/imdb`;
};

export const importImdbRatings = async (
  file: File,
  options?: RequestInit,
): Promise<ImdbImportResultDto> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await customFetch<{ data: ImdbImportResultDto }>(
    getImportImdbUrl(),
    {
      ...options,
      method: 'POST',
      body: formData,
    },
  );
  return res.data;
};

export const useImportImdbRatings = (options?: {
  mutation?: UseMutationOptions<ImdbImportResultDto, ErrorType, { file: File }>;
}) => {
  const { mutation: mutationOptions } = options ?? {};

  return useMutation<ImdbImportResultDto, ErrorType, { file: File }>({
    mutationFn: ({ file }) => importImdbRatings(file),
    ...mutationOptions,
  });
};
