import { useMemo, useState } from "react";
import {
  filterMovies,
  formatGenre,
  getGenres,
  type Movie,
  type RatingFilter,
} from "../domain/movie";
import { MovieGrid } from "./MovieGrid";

type DiscoverPageProps = {
  movies: Movie[];
  isWatchlisted: (id: number) => boolean;
  onToggleWatchlist: (id: number) => void;
};

export function DiscoverPage({ movies, isWatchlisted, onToggleWatchlist }: DiscoverPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("all");
  const [rating, setRating] = useState<RatingFilter>("all");

  const genres = useMemo(() => getGenres(movies), [movies]);
  const filteredMovies = useMemo(
    () => filterMovies(movies, { searchTerm, genre, rating }),
    [movies, searchTerm, genre, rating],
  );
  const hasFilters = Boolean(searchTerm || genre !== "all" || rating !== "all");

  const resetFilters = () => {
    setSearchTerm("");
    setGenre("all");
    setRating("all");
  };

  return (
    <>
      <section className="hero" aria-labelledby="discover-heading">
        <p className="eyebrow">Your next movie, minus the noise</p>
        <h1 id="discover-heading">Find something worth watching.</h1>
        <p className="hero-copy">
          Search a compact collection, filter what matters, and keep a watchlist that stays
          on this device.
        </p>
      </section>

      <section className="catalogue" aria-labelledby="catalogue-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Collection</p>
            <h2 id="catalogue-heading">Browse movies</h2>
          </div>
          <p className="result-count" aria-live="polite">
            {filteredMovies.length} {filteredMovies.length === 1 ? "movie" : "movies"}
          </p>
        </div>

        <div className="filter-panel" role="search" aria-label="Movie filters">
          <div className="field field--search">
            <label htmlFor="movie-search">Search by title</label>
            <div className="search-control">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="search-icon">
                <path d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <input
                id="movie-search"
                type="search"
                autoComplete="off"
                placeholder="Try “Dark Storm”"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="genre-filter">Genre</label>
            <select
              id="genre-filter"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            >
              <option value="all">All genres</option>
              {genres.map((item) => (
                <option key={item} value={item}>
                  {formatGenre(item)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="rating-filter">Rating</label>
            <select
              id="rating-filter"
              value={rating}
              onChange={(event) => setRating(event.target.value as RatingFilter)}
            >
              <option value="all">All ratings</option>
              <option value="good">Great · 8+</option>
              <option value="ok">Good · 5–7.9</option>
              <option value="bad">Low · below 5</option>
            </select>
          </div>

          <button
            className="reset-button"
            type="button"
            onClick={resetFilters}
            disabled={!hasFilters}
          >
            Reset
          </button>
        </div>

        {filteredMovies.length > 0 ? (
          <MovieGrid
            movies={filteredMovies}
            isWatchlisted={isWatchlisted}
            onToggleWatchlist={onToggleWatchlist}
          />
        ) : (
          <div className="empty-state" role="status">
            <span className="empty-state__icon" aria-hidden="true">
              ⌕
            </span>
            <h2>No movies match those filters</h2>
            <p>Try a broader title, another genre, or reset the filters.</p>
            <button type="button" className="primary-button" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}
