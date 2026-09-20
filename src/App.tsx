import { Navigate, Route, Routes } from "react-router-dom";
import { DiscoverPage } from "./components/DiscoverPage";
import { ErrorState } from "./components/ErrorState";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoadingState } from "./components/LoadingState";
import { WatchlistPage } from "./components/WatchlistPage";
import { useMovies } from "./hooks/useMovies";
import { useWatchlist } from "./hooks/useWatchlist";

export default function App() {
  const { movies, isLoading, error, retry } = useMovies();
  const watchlist = useWatchlist();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header watchlistCount={watchlist.ids.length} />

      {!watchlist.canPersist && (
        <div className="storage-notice" role="status">
          Watchlist changes work for this session, but your browser blocked local storage.
        </div>
      )}

      <main id="main-content" className="main-content">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={retry} />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <DiscoverPage
                  movies={movies}
                  isWatchlisted={watchlist.contains}
                  onToggleWatchlist={watchlist.toggle}
                />
              }
            />
            <Route
              path="/watchlist"
              element={
                <WatchlistPage
                  movies={movies}
                  watchlistIds={watchlist.ids}
                  isWatchlisted={watchlist.contains}
                  onToggleWatchlist={watchlist.toggle}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      <Footer />
    </div>
  );
}
