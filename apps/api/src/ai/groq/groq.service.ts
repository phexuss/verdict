import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import {
  type MovieTrio,
  movieTrioSchema,
} from '../schemas/movie-trio.schema.js';

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
        overview: movie.overview,
        genres: movie.genres ?? [],
        releaseDate: movie.releaseDate,
        runtime: movie.runtime,
        voteAverage: movie.voteAverage,
        popularity: movie.popularity,
      })),
      null,
      2,
    );

    const response = await this.groq.chat.completions.create({
      model: this.model,
      temperature: 0.4,
      max_completion_tokens: 5000,
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
}
