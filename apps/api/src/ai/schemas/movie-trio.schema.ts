import { z } from 'zod';

export const moviePickTypeSchema = z.enum(['safe', 'risk', 'wildcard']);

export const movieTrioSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  curationReason: z.string().min(1).max(1200),

  picks: z
    .array(
      z.object({
        tmdbId: z.number().int(),
        type: moviePickTypeSchema,
        reason: z.string().min(1).max(800),
      }),
    )
    .length(3),
});

export type MovieTrio = z.infer<typeof movieTrioSchema>;
