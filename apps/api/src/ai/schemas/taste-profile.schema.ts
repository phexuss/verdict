import { z } from 'zod';

export const tasteProfileSchema = z.object({
  highAffinity: z.array(z.string()).max(6),
  lowAffinity: z.array(z.string()).max(4),
  pacing: z.object({
    score: z.number().int().min(0).max(100),
    label: z.string(),
    description: z.string(),
  }),
  emotionalWeight: z.object({
    score: z.number().int().min(0).max(100),
    label: z.string(),
  }),
  identityCards: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .length(2),
  frequentlySeen: z.array(z.string()).max(4),
  runtimeRange: z.object({
    min: z.number().int(),
    max: z.number().int(),
  }),
  usuallySkip: z.array(z.string()).max(4),
  summary: z.string(),
});

export type TasteProfile = z.infer<typeof tasteProfileSchema>;
