import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
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

type TasteProfileMovie = {
  title: string;
  genres: string[];
  status: 'WATCHED' | 'DISLIKED';
  rating?: number | null;
  runtime?: number | null;
  moodTags?: string[];
  themes?: string[];
};

type GenerateTasteProfileInput = {
  locale: 'en' | 'ru';
  movies: TasteProfileMovie[];
};

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
          title: { type: 'string' },
          description: { type: 'string' },
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

  async pickMovieTrio(input: PickMovieTrioInput): Promise<MovieTrio> {
    const language = input.locale === 'ru' ? 'Russian' : 'English';

    const candidatesJson = JSON.stringify(
      input.candidates.map((movie) => ({
        tmdbId: movie.tmdbId,
        title: movie.title,
        overview: truncateText(movie.overview, 320),
        genres: movie.genres ?? [],
        releaseDate: movie.releaseDate,
        runtime: movie.runtime,
        voteAverage: movie.voteAverage,
      })),
    );

    const response = await this.groq.chat.completions.create({
      model: this.model,
      temperature: 0.4,
      max_completion_tokens: 1200,
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

    const candidateIds = new Set(input.candidates.map((movie) => movie.tmdbId));

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
    const moviesJson = JSON.stringify(input.movies.slice(0, 80));

    const response = await this.groq.chat.completions.create({
      model: this.model,
      temperature: 0.3,
      max_completion_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: [
            'You analyze movie preferences for a cinema app.',
            'Infer a concise cinematic taste profile from user actions.',
            'WATCHED movies are positive signals unless rated poorly.',
            'DISLIKED movies are negative signals.',
            'Pacing score: 0 means slow burn, 100 means fast-paced.',
            'Emotional weight score: 0 means light, 100 means heavy.',
            `Write all user-facing text in ${language}.`,
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
