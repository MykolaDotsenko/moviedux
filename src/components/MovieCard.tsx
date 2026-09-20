import { useState } from "react";
import { formatGenre, type Movie } from "../domain/movie";

type MovieCardProps = {
  movie: Movie;
  isWatchlisted: boolean;
  onToggleWatchlist: (id: number) => void;
};

const ratingTone = (rating: number) => {
  if (rating >= 8) return "rating-badge--good";
  if (rating >= 5) return "rating-badge--ok";
  return "rating-badge--low";
};

export function MovieCard({ movie, isWatchlisted, onToggleWatchlist }: MovieCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = imageFailed ? "default.jpg" : movie.image;

  return (
    <article className="movie-card">
      <div className="poster-frame">
        <img
          className="movie-poster"
          src={`${import.meta.env.BASE_URL}images/${image}`}
          alt={`${movie.title} poster`}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
        <span
          className={`rating-badge ${ratingTone(movie.rating)}`}
          aria-label={`Rating ${movie.rating} out of 10`}
        >
          {movie.rating.toFixed(1)}
        </span>
      </div>

      <div className="movie-card__body">
        <div>
          <p className="movie-genre">{formatGenre(movie.genre)}</p>
          <h2 className="movie-title">{movie.title}</h2>
        </div>

        <button
          type="button"
          className={
            isWatchlisted ? "watchlist-button watchlist-button--saved" : "watchlist-button"
          }
          aria-pressed={isWatchlisted}
          onClick={() => onToggleWatchlist(movie.id)}
        >
          <span aria-hidden="true">{isWatchlisted ? "✓" : "+"}</span>
          {isWatchlisted ? "Saved" : "Add to watchlist"}
        </button>
      </div>
    </article>
  );
}
