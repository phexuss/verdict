import type {
  TmdbCastCredit,
  TmdbCrewCredit,
  TmdbMovieCredits,
} from '@/api/generated/models';
import { SearchMoviesLocale } from '@/api/generated/models';

export function getSearchLocale(locale: string): SearchMoviesLocale {
  if (locale in SearchMoviesLocale) {
    return SearchMoviesLocale[locale as keyof typeof SearchMoviesLocale];
  }
  return SearchMoviesLocale.en;
}

export function detectQueryLocale(
  query: string,
  appLocale: string,
): SearchMoviesLocale {
  const hasCyrillic = /[а-яА-ЯёЁ]/.test(query);
  if (hasCyrillic) return SearchMoviesLocale.ru;

  const hasLatin = /[a-zA-Z]/.test(query);
  if (hasLatin) return SearchMoviesLocale.en;

  return getSearchLocale(appLocale);
}

const movieGenres: Record<'en' | 'ru', Record<number, string>> = {
  en: {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
  },
  ru: {
    28: 'Боевик',
    12: 'Приключения',
    16: 'Мультфильм',
    35: 'Комедия',
    80: 'Криминал',
    99: 'Документальный',
    18: 'Драма',
    10751: 'Семейный',
    14: 'Фэнтези',
    36: 'История',
    27: 'Ужасы',
    10402: 'Музыка',
    9648: 'Детектив',
    10749: 'Мелодрама',
    878: 'Фантастика',
    10770: 'Телевизионный фильм',
    53: 'Триллер',
    10752: 'Военный',
    37: 'Вестерн',
  },
} satisfies Record<'en' | 'ru', Record<number, string>>;

const CINEMATOGRAPHY_JOBS = [
  'Director of Photography',
  'Cinematography',
  'Cinematographer',
];

interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  size: number;
  iso_639_1: string;
}

interface TMDBVideosResponse {
  id: number;
  results: TMDBVideo[];
}

export function getMovieGenreNames(ids: number[], locale: string) {
  const dictionary = locale === 'ru' ? movieGenres.ru : movieGenres.en;

  return ids
    .map((id) => dictionary[id])
    .filter((name): name is string => Boolean(name));
}

export function getShortOverview(overview: string, maxLength = 50) {
  const trimmedOverview = overview.trim();

  if (trimmedOverview.length <= maxLength) return trimmedOverview;

  const sentenceEnd = trimmedOverview.search(/[.!?]/);

  if (sentenceEnd !== -1 && sentenceEnd < maxLength) {
    return trimmedOverview.slice(0, sentenceEnd + 1);
  }

  const clippedOverview = trimmedOverview.slice(0, maxLength);
  const lastSpace = clippedOverview.lastIndexOf(' ');
  const cutIndex = lastSpace > maxLength * 0.6 ? lastSpace : maxLength;

  return `${clippedOverview.slice(0, cutIndex).trimEnd()}...`;
}

export function getHumanReadableRuntime(runtime: number, locale: string) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  const units = locale === 'ru' ? { h: 'ч', m: 'м' } : { h: 'h', m: 'm' };

  return [hours && `${hours}${units.h}`, minutes && `${minutes}${units.m}`]
    .filter(Boolean)
    .join(' ');
}

export function getCrewByJob(
  movieCredits: TmdbMovieCredits,
  jobs: string[],
  department?: string,
): TmdbCrewCredit[] {
  return movieCredits.crew.filter((person) => {
    const hasJob = jobs.some((job) => isSameCreditValue(person.job, job));
    const hasDepartment = department
      ? isSameCreditValue(person.department, department)
      : true;

    return hasJob && hasDepartment;
  });
}

export function getCrewNamesByJob(
  movieCredits: TmdbMovieCredits,
  jobs: string[],
  department?: string,
): string {
  return getCrewByJob(movieCredits, jobs, department)
    .map((person) => person.name)
    .join(', ');
}

export function getDirectorName(movieCredits: TmdbMovieCredits): string | null {
  return getPrimaryCrewName(movieCredits, ['Director'], ['Directing']);
}

export function getCinematographyName(
  movieCredits: TmdbMovieCredits,
): string | null {
  return getPrimaryCrewName(movieCredits, CINEMATOGRAPHY_JOBS, ['Camera']);
}

export function getTopCast(
  movieCredits: TmdbMovieCredits,
  limit = 6,
): TmdbCastCredit[] {
  return [...movieCredits.cast]
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

function getPrimaryCrewName(
  movieCredits: TmdbMovieCredits,
  jobs: string[],
  departments: string[] = [],
): string | null {
  return getPrimaryCrewMember(movieCredits, jobs, departments)?.name ?? null;
}

function getPrimaryCrewMember(
  movieCredits: TmdbMovieCredits,
  jobs: string[],
  departments: string[] = [],
): TmdbCrewCredit | null {
  for (const job of jobs) {
    const strictMatch = movieCredits.crew.find(
      (person) =>
        isSameCreditValue(person.job, job) &&
        (departments.length === 0 ||
          departments.some((department) =>
            isSameCreditValue(person.department, department),
          )),
    );

    if (strictMatch) {
      return strictMatch;
    }
  }

  for (const job of jobs) {
    const fallbackMatch = movieCredits.crew.find((person) =>
      isSameCreditValue(person.job, job),
    );

    if (fallbackMatch) {
      return fallbackMatch;
    }
  }

  return null;
}

function isSameCreditValue(first: string, second: string) {
  return first.trim().toLowerCase() === second.trim().toLowerCase();
}

export async function getMovieTrailer(
  movieId: number,
  locale: string,
): Promise<string | null> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?language=${locale}&include_video_language=${locale},en`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        accept: 'application/json',
      },
      next: { revalidate: 86400 },
    },
  );

  if (!res.ok) return null;

  const data: TMDBVideosResponse = await res.json();

  const youtubeVideos = data.results.filter((v) => v.site === 'YouTube');

  const trailer =
    youtubeVideos.find(
      (v) => v.iso_639_1 === locale && v.type === 'Trailer' && v.official,
    ) ??
    youtubeVideos.find((v) => v.iso_639_1 === locale && v.type === 'Trailer') ??
    youtubeVideos.find(
      (v) => v.iso_639_1 === 'en' && v.type === 'Trailer' && v.official,
    ) ??
    youtubeVideos.find((v) => v.iso_639_1 === 'en' && v.type === 'Trailer');

  return trailer
    ? `https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1&autoplay=1&iv_load_policy=3`
    : null;
}
