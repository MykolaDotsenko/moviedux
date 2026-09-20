import type { Movie } from "../domain/movie";
import { MovieCard } from "./MovieCard";

type MovieGridProps = {
  movies: Movie[];
  isWatchlisted: (id: number) => boolean;
  onToggleWatchlist: (id: number) => void;
};

export function MovieGrid({ movies, isWatchlisted, onToggleWatchlist }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isWatchlisted={isWatchlisted(movie.id)}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </div>
  );
}
