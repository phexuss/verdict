import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import {
  type MovieDiscoveryStrategy,
  movieDiscoveryStrategySchema,
  tmdbDiscoverSortBy,
  tmdbMovieGenreIdByKey,
  tmdbMovieGenreKeys,
} from '../schemas/movie-discovery-strategy.schema.js';
import {
  type MovieTrio,
  movieTrioSchema,
} from '../schemas/movie-trio.schema.js';
import {
  type TasteProfile,
  tasteProfileSchema,
} from '../schemas/taste-profile.schema.js';

type CandidateMovie = {
  tmdbId: number;
  title: string;
  overview?: string | null;
  genres?: string[];
  releaseDate?: string | null;
  runtime?: number | null;
  voteAverage?: number | null;
  popularity?: number | null;
};

type PickMovieTrioInput = {
  locale: 'en' | 'ru';
  moods: string[];
  group: 'solo' | 'duo' | 'group';
  duration: 'short' | 'medium' | 'long';
  maxRuntimeMinutes: number;
  candidates: CandidateMovie[];
};

type BuildMovieDiscoveryStrategyInput = {
  locale: 'en' | 'ru';
  moods: string[];
  group: 'solo' | 'duo' | 'group';
  duration: 'short' | 'medium' | 'long';
  maxRuntimeMinutes: number;
};

type TasteProfileMovie = {
  title: string;
  genres: string[];
  watched: boolean;
  reaction?: 'LIKED' | 'DISLIKED' | null;
  rating?: number | null;
  runtime?: number | null;
  moodTags?: string[];
  themes?: string[];
};

type GenerateTasteProfileInput = {
  locale: 'en' | 'ru';
  movies: TasteProfileMovie[];
};

const movieDiscoveryStrategyJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    genreKeys: {
      type: 'array',
      minItems: 1,
      maxItems: 4,
      items: {
        type: 'string',
        enum: tmdbMovieGenreKeys,
      },
      description:
        'TMDB movie genre keys to search with. These are OR-combined in with_genres after backend mapping.',
    },
    withoutGenreKeys: {
      type: 'array',
      maxItems: 4,
      items: {
        type: 'string',
        enum: tmdbMovieGenreKeys,
      },
      description:
        'TMDB movie genre keys to exclude. Must not overlap genreKeys.',
    },
    sortBy: {
      type: 'string',
      enum: tmdbDiscoverSortBy,
      description: 'TMDB discover/movie sort_by value.',
    },
    minVoteAverage: {
      type: 'number',
      minimum: 0,
      maximum: 8.5,
      description: 'Use 0 to disable this filter.',
    },
    minVoteCount: {
      type: 'integer',
      minimum: 50,
      maximum: 1000,
    },
    minRuntimeMinutes: {
      type: 'integer',
      minimum: 0,
      maximum: 220,
      description: 'Use 0 to disable this filter.',
    },
    maxRuntimeMinutes: {
      type: 'integer',
      minimum: 60,
      maximum: 240,
      description: 'Must be less than or equal to the user time limit.',
    },
    releaseYearFrom: {
      type: 'integer',
      minimum: 0,
      maximum: 2100,
      description: 'Use 0 to disable this filter.',
    },
    releaseYearTo: {
      type: 'integer',
      minimum: 0,
      maximum: 2100,
      description: 'Use 0 to disable this filter.',
    },
    rationale: {
      type: 'string',
      description: 'Brief internal reason for this search strategy.',
    },
  },
  required: [
    'genreKeys',
    'withoutGenreKeys',
    'sortBy',
    'minVoteAverage',
    'minVoteCount',
    'minRuntimeMinutes',
    'maxRuntimeMinutes',
    'releaseYearFrom',
    'releaseYearTo',
    'rationale',
  ],
} as const;

const movieTrioJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: {
      type: 'string',
      description: 'Short title for this movie trio.',
    },
    description: {
      type: 'string',
      description: 'Short description of the whole recommendation.',
    },
    curationReason: {
      type: 'string',
      description: "Why these three movies fit the user's request.",
    },
    picks: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          tmdbId: {
            type: 'number',
            description: 'TMDB id of selected movie from the candidate list.',
          },
          type: {
            type: 'string',
            enum: ['safe', 'risk', 'wildcard'],
          },
          reason: {
            type: 'string',
            description: 'Short explanation for this pick.',
          },
        },
        required: ['tmdbId', 'type', 'reason'],
      },
    },
  },
  required: ['title', 'description', 'curationReason', 'picks'],
} as const;

const tasteProfileJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    highAffinity: { type: 'array', items: { type: 'string' }, maxItems: 6 },
    lowAffinity: { type: 'array', items: { type: 'string' }, maxItems: 4 },
    pacing: {
      type: 'object',
      additionalProperties: false,
      properties: {
        score: { type: 'integer', minimum: 0, maximum: 100 },
        label: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['score', 'label', 'description'],
    },
    emotionalWeight: {
      type: 'object',
      additionalProperties: false,
      properties: {
        score: { type: 'integer', minimum: 0, maximum: 100 },
        label: { type: 'string' },
      },
      required: ['score', 'label'],
    },
    identityCards: {
      type: 'array',
      minItems: 2,
      maxItems: 2,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: {
            type: 'string',
            minLength: 2,
            maxLength: 48,
            description:
              'Short user archetype label only, 2-4 words. No sentence, no explanation, no direct address.',
          },
          description: {
            type: 'string',
            minLength: 24,
            maxLength: 180,
            description:
              'One complete sentence addressed to the user. Keep it separate from the title.',
          },
        },
        required: ['title', 'description'],
      },
    },
    frequentlySeen: { type: 'array', items: { type: 'string' }, maxItems: 4 },
    runtimeRange: {
      type: 'object',
      additionalProperties: false,
      properties: {
        min: { type: 'integer' },
        max: { type: 'integer' },
      },
      required: ['min', 'max'],
    },
    usuallySkip: { type: 'array', items: { type: 'string' }, maxItems: 4 },
    summary: { type: 'string' },
  },
  required: [
    'highAffinity',
    'lowAffinity',
    'pacing',
    'emotionalWeight',
    'identityCards',
    'frequentlySeen',
    'runtimeRange',
    'usuallySkip',
    'summary',
  ],
} as const;

@Injectable()
export class GroqService {
  private readonly groq: Groq;
  private readonly model: string;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('GROQ_API_KEY');
    this.groq = new Groq({ apiKey });
    this.model =
      this.configService.get<string>('GROQ_MODEL') ?? 'openai/gpt-oss-120b';
  }

  async buildMovieDiscoveryStrategy(
    input: BuildMovieDiscoveryStrategyInput,
  ): Promise<MovieDiscoveryStrategy> {
    const genreGuide = tmdbMovieGenreKeys
      .map((key) => `${key}=${tmdbMovieGenreIdByKey[key]}`)
      .join(', ');

    const response = await this.groq.chat.completions.create({
      model: this.model,
      temperature: 0.25,
      max_completion_tokens: 2400,
      messages: [
        {
          role: 'system',
          content: [
            'You plan TMDB discover/movie searches for a movie recommendation app called Verdict.',
            'Return only TMDB discovery parameters. Do not pick movies.',
            'Use only the provided TMDB genre keys.',
            'genreKeys are OR-combined, so choose 1-4 focused genres.',
            'withoutGenreKeys must not overlap genreKeys.',
            'Keep maxRuntimeMinutes less than or equal to the user time limit.',
            'For optional numeric filters, return 0 when the filter should be disabled.',
            'Use stricter vote filters for broad moods and looser filters for niche/weird moods.',
            'Prefer popularity.desc for accessible picks, vote_average.desc for quality-heavy moods, vote_count.desc for consensus picks, and primary_release_date.desc only when freshness matters.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: [
            `Locale: ${input.locale}`,
            `Selected mood keys: ${input.moods.join(', ')}`,
            `Watching group: ${input.group}`,
            `Time commitment: ${input.duration}`,
            `User maximum runtime: ${input.maxRuntimeMinutes} minutes`,
            '',
            'Mood key hints:',
            'dark = bleak, noir, unsettling, morally complex',
            'tense = suspenseful, thriller, pressure, dread',
            'weird = surreal, strange, genre-bending, cult',
            'atmospheric = moody, immersive, visual, slow tension',
            'comfort = warm, easygoing, familiar, low-stress',
            'smart = cerebral, ideas, mystery, social themes',
            'fast = energetic, action, momentum',
            'emotional = moving, character-focused, romantic or dramatic',
            'funny = comedy, playful, absurd or light',
            '',
            `TMDB genre keys: ${genreGuide}`,
          ].join('\n'),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'movie_discovery_strategy',
          strict: true,
          schema: movieDiscoveryStrategyJsonSchema,
        },
      },
    });

    const raw = response.choices[0]?.message?.content;

    if (!raw) {
      throw new Error('No response');
    }

    const strategy = movieDiscoveryStrategySchema.parse(JSON.parse(raw));

    const maxRuntimeMinutes = Math.min(
      strategy.maxRuntimeMinutes,
      input.maxRuntimeMinutes,
    );

    return {
      ...strategy,
      genreIds: [...new Set(strategy.genreIds)],
      withoutGenreIds: [...new Set(strategy.withoutGenreIds)],
      minRuntimeMinutes:
        strategy.minRuntimeMinutes &&
        strategy.minRuntimeMinutes <= maxRuntimeMinutes
          ? strategy.minRuntimeMinutes
          : null,
      maxRuntimeMinutes,
    };
  }

  async pickMovieTrio(input: PickMovieTrioInput): Promise<MovieTrio> {
    const language = input.locale === 'ru' ? 'Russian' : 'English';
    const candidatePool = input.candidates.slice(0, 18);

    const candidatesJson = JSON.stringify(
      candidatePool.map((movie) => ({
        tmdbId: movie.tmdbId,
        title: movie.title,
        overview: truncateText(movie.overview, 180),
        genres: movie.genres ?? [],
        releaseDate: movie.releaseDate,
        voteAverage: movie.voteAverage,
      })),
    );

    const response = await this.groq.chat.completions.create({
      model: this.model,
      temperature: 0.4,
      max_completion_tokens: 2200,
      messages: [
        {
          role: 'system',
          content: [
            'You are a film curator inside a movie recommendation app called Verdict.',
            'You must choose exactly 3 movies from the provided candidate list.',
            'Never invent movies. Use only tmdbId values from the candidate list.',
            'Return one safe pick, one risk pick, and one wildcard pick.',
            "Safe pick: closest match to the user's mood.",
            'Risk pick: bolder, less obvious, but still relevant.',
            'Wildcard: unexpected but interesting discovery.',
            `Write all user-facing text in ${language}.`,
          ].join('\n'),
        },
        {
          role: 'user',
          content: [
            `Locale: ${input.locale}`,
            `Moods: ${input.moods.join(', ')}`,
            `Watching group: ${input.group}`,
            `Time commitment: ${input.duration}`,
            `Maximum runtime per movie: ${input.maxRuntimeMinutes} minutes`,
            '',
            'Candidate movies:',
            candidatesJson,
          ].join('\n'),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'movie_trio_recommendation',
          strict: true,
          schema: movieTrioJsonSchema,
        },
      },
    });
    const raw = response.choices[0]?.message?.content;

    if (!raw) {
      throw new Error('No response');
    }

    const parsed = JSON.parse(raw);

    const validated = movieTrioSchema.parse(parsed);

    const candidateIds = new Set(candidatePool.map((movie) => movie.tmdbId));

    for (const pick of validated.picks) {
      if (!candidateIds.has(pick.tmdbId)) {
        throw new Error(`Groq selected unknown tmdbId: ${pick.tmdbId}`);
      }
    }

    const pickTypes = new Set(validated.picks.map((pick) => pick.type));

    if (
      !pickTypes.has('safe') ||
      !pickTypes.has('risk') ||
      !pickTypes.has('wildcard')
    ) {
      throw new Error(
        'Groq response must include safe, risk and wildcard picks',
      );
    }
    return validated;
  }

  async generateTasteProfile(
    input: GenerateTasteProfileInput,
  ): Promise<TasteProfile> {
    const language = input.locale === 'ru' ? 'Russian' : 'English';
    const identityCardRules =
      input.locale === 'ru'
        ? [
            'For identityCards.title, write a compact Russian archetype label only, for example: "Киноман-реалист".',
            'For identityCards.description, write a separate natural Russian sentence that starts with "Вы".',
            'Never merge the title and description. Bad: title="Киноман-реалист Ценит глубоких персонажей...". Good: title="Киноман-реалист", description="Вы цените глубоких персонажей и социальные темы больше, чем поверхностный экшн."',
          ]
        : [
            'For identityCards.title, write a compact English archetype label only, for example: "Social Realist".',
            'For identityCards.description, write a separate natural English sentence that starts with "You".',
            'Never merge the title and description. Bad: title="Social Realist Values deep characters...". Good: title="Social Realist", description="You value deep characters and social themes more than surface-level action."',
          ];
    const moviesJson = JSON.stringify(input.movies.slice(0, 80));

    const response = await this.groq.chat.completions.create({
      model: this.model,
      temperature: 0.3,
      max_completion_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: [
            'You analyze movie preferences for a cinema app.',
            'Infer a concise cinematic taste profile from user actions.',
            'Watched movies are preference signals.',
            'LIKED movies and high ratings are strong positive signals.',
            'DISLIKED movies and low ratings are strong negative signals.',
            'Pacing score: 0 means slow burn, 100 means fast-paced.',
            'Emotional weight score: 0 means light, 100 means heavy.',
            'Keep the exact JSON shape from the schema. Do not rename, add, or omit fields.',
            'All labels, arrays, descriptions, and summaries are user-facing text.',
            `Write all user-facing text in ${language}.`,
            ...identityCardRules,
          ].join('\n'),
        },
        {
          role: 'user',
          content: `User movie actions:\n${moviesJson}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'user_taste_profile',
          strict: true,
          schema: tasteProfileJsonSchema,
        },
      },
    });

    const raw = response.choices[0]?.message?.content;

    if (!raw) {
      throw new Error('No response');
    }

    return tasteProfileSchema.parse(JSON.parse(raw));
  }
}

function truncateText(value: string | null | undefined, maxLength: number) {
  if (!value || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}
