export type Movie = {
  id: number;
  title: string;
  image: string;
  genre: string;
  rating: number;
};

export type RatingFilter = "all" | "good" | "ok" | "bad";

export type MovieFilters = {
  searchTerm: string;
  genre: string;
  rating: RatingFilter;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeMovie = (value: unknown): Movie | null => {
  if (!isRecord(value)) return null;

  const id = value.id;
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const image = typeof value.image === "string" ? value.image.trim() : "";
  const genre = typeof value.genre === "string" ? value.genre.trim().toLowerCase() : "";
  const rating = typeof value.rating === "number" ? value.rating : Number(value.rating);

  if (
    typeof id !== "number" ||
    !Number.isInteger(id) ||
    id <= 0 ||
    !title ||
    !image ||
    !genre ||
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 10
  ) {
    return null;
  }

  return { id, title, image, genre, rating };
};

export const normalizeMovies = (value: unknown): Movie[] => {
  if (!Array.isArray(value)) return [];

  const seenIds = new Set<number>();
  const movies: Movie[] = [];

  for (const item of value) {
    const movie = normalizeMovie(item);
    if (!movie || seenIds.has(movie.id)) continue;
    seenIds.add(movie.id);
    movies.push(movie);
  }

  return movies;
};

const matchesRating = (rating: number, filter: RatingFilter) => {
  switch (filter) {
    case "good":
      return rating >= 8;
    case "ok":
      return rating >= 5 && rating < 8;
    case "bad":
      return rating < 5;
    case "all":
      return true;
  }
};

export const filterMovies = (movies: Movie[], filters: MovieFilters): Movie[] => {
  const search = filters.searchTerm.trim().toLocaleLowerCase();

  return movies.filter((movie) => {
    const matchesSearch = !search || movie.title.toLocaleLowerCase().includes(search);
    const matchesGenre = filters.genre === "all" || movie.genre === filters.genre;

    return matchesSearch && matchesGenre && matchesRating(movie.rating, filters.rating);
  });
};

export const getGenres = (movies: Movie[]): string[] =>
  [...new Set(movies.map((movie) => movie.genre))].sort((a, b) => a.localeCompare(b));

export const formatGenre = (genre: string): string =>
  genre ? `${genre[0]?.toUpperCase() ?? ""}${genre.slice(1)}` : genre;
