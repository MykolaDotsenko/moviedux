import { Link } from "react-router-dom";
import type { Movie } from "../domain/movie";
import { MovieGrid } from "./MovieGrid";

type WatchlistPageProps = {
  movies: Movie[];
  watchlistIds: number[];
  isWatchlisted: (id: number) => boolean;
  onToggleWatchlist: (id: number) => void;
};

export function WatchlistPage({
  movies,
  watchlistIds,
  isWatchlisted,
  onToggleWatchlist,
}: WatchlistPageProps) {
  const savedMovies = watchlistIds
    .map((id) => movies.find((movie) => movie.id === id))
    .filter((movie): movie is Movie => movie !== undefined);

  return (
    <section className="watchlist-page" aria-labelledby="watchlist-heading">
      <div className="section-heading section-heading--watchlist">
        <div>
          <p className="eyebrow">Saved locally</p>
          <h1 id="watchlist-heading">Your watchlist</h1>
          <p className="section-copy">A short list for the movies you want to come back to.</p>
        </div>
        <p className="result-count">{savedMovies.length} saved</p>
      </div>

      {savedMovies.length > 0 ? (
        <MovieGrid
          movies={savedMovies}
          isWatchlisted={isWatchlisted}
          onToggleWatchlist={onToggleWatchlist}
        />
      ) : (
        <div className="empty-state empty-state--watchlist">
          <span className="empty-state__icon" aria-hidden="true">
            ☆
          </span>
          <h2>Your watchlist is clear</h2>
          <p>Save a movie from Discover and it will stay here on this device.</p>
          <Link to="/" className="primary-button">
            Browse movies
          </Link>
        </div>
      )}
    </section>
  );
}
