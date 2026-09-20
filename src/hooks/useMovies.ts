import { useCallback, useEffect, useState } from "react";
import { normalizeMovies, type Movie } from "../domain/movie";

type MoviesState = {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
};

const initialState: MoviesState = {
  movies: [],
  isLoading: true,
  error: null,
};

export const useMovies = () => {
  const [state, setState] = useState<MoviesState>(initialState);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const response = await fetch(`${import.meta.env.BASE_URL}movies.json`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Movie catalogue request failed with ${response.status}`);
        }

        const payload: unknown = await response.json();
        const movies = normalizeMovies(payload);

        if (movies.length === 0) {
          throw new Error("Movie catalogue did not contain any valid movies");
        }

        setState({ movies, isLoading: false, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Unable to load Moviedux catalogue", error);
        setState({
          movies: [],
          isLoading: false,
          error: "We couldn't load the movie collection. Please try again.",
        });
      }
    };

    void load();
    return () => controller.abort();
  }, [requestVersion]);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);

  return { ...state, retry };
};
