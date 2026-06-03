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
