import { z } from 'zod';

export const movieAiReviewSchema = z.object({
  en: z.object({
    summary: z.string().min(1).max(600),
    analysis: z.string().min(1).max(800),
    verdict: z.string().min(1).max(400),
    reason: z.string().min(1).max(400),
  }),
  ru: z.object({
    summary: z.string().min(1).max(600),
    analysis: z.string().min(1).max(800),
    verdict: z.string().min(1).max(400),
    reason: z.string().min(1).max(400),
  }),
  moodTags: z.array(z.string().min(1).max(32)).min(3).max(5),
  themes: z.array(z.string().min(1).max(48)).min(2).max(4),
  genres: z.array(z.string().min(1).max(32)).min(2).max(3),
  score: z.number().int().min(0).max(100),
});

export type MovieAiReview = z.infer<typeof movieAiReviewSchema>;

export const movieAiReviewJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    en: {
      type: 'object',
      additionalProperties: false,
      properties: {
        summary: {
          type: 'string',
          description:
            '1-2 sentences: who this movie is for, what kind of viewer will enjoy it.',
        },
        analysis: {
          type: 'string',
          description:
            '2-3 sentences: atmosphere, pacing, emotional weight, visual style.',
        },
        verdict: {
          type: 'string',
          description:
            '1 sentence: final verdict — would you recommend it and to whom.',
        },
        reason: {
          type: 'string',
          description: '1 sentence: the single strongest reason to watch.',
        },
      },
      required: ['summary', 'analysis', 'verdict', 'reason'],
    },
    ru: {
      type: 'object',
      additionalProperties: false,
      properties: {
        summary: {
          type: 'string',
          description:
            '1-2 предложения: для кого этот фильм, какому зрителю понравится.',
        },
        analysis: {
          type: 'string',
          description:
            '2-3 предложения: атмосфера, темп, эмоциональная нагрузка, визуальный стиль.',
        },
        verdict: {
          type: 'string',
          description:
            '1 предложение: итоговый вердикт — рекомендуете ли и кому.',
        },
        reason: {
          type: 'string',
          description:
            '1 предложение: главная причина посмотреть.',
        },
      },
      required: ['summary', 'analysis', 'verdict', 'reason'],
    },
    moodTags: {
      type: 'array',
      minItems: 3,
      maxItems: 5,
      items: { type: 'string', minLength: 1, maxLength: 32 },
      description:
        'English mood/atmosphere tags (e.g. "dark", "atmospheric", "tense", "melancholic"). Lowercase.',
    },
    themes: {
      type: 'array',
      minItems: 2,
      maxItems: 4,
      items: { type: 'string', minLength: 1, maxLength: 48 },
      description:
        'English thematic tags (e.g. "identity crisis", "moral ambiguity", "class struggle"). Lowercase.',
    },
    genres: {
      type: 'array',
      minItems: 2,
      maxItems: 3,
      items: { type: 'string', minLength: 1, maxLength: 32 },
      description:
        'AI-perceived genre tags that may differ from TMDB genres (e.g. "psychological thriller", "noir"). Lowercase.',
    },
    score: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      description:
        'Overall quality score from 0 to 100 based on critical analysis of story, direction, acting, and cultural impact.',
    },
  },
  required: ['en', 'ru', 'moodTags', 'themes', 'genres', 'score'],
} as const;
