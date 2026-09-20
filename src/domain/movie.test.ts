import { describe, expect, it } from "vitest";
import { filterMovies, getGenres, normalizeMovies, type Movie } from "./movie";

const movies: Movie[] = [
  { id: 1, title: "Dark Storm", image: "1.jpg", genre: "drama", rating: 8.3 },
  { id: 2, title: "Whisper of Fate", image: "2.jpg", genre: "fantasy", rating: 7.7 },
  { id: 3, title: "Nightmare's Threshold", image: "3.jpg", genre: "horror", rating: 1.7 },
];

describe("movie domain", () => {
  it("normalizes string ratings and rejects malformed records", () => {
    expect(
      normalizeMovies([
        { id: 1, title: " Dark Storm ", image: "1.jpg", genre: "Drama", rating: "8.3" },
        { id: 1, title: "Duplicate", image: "x.jpg", genre: "Drama", rating: 7 },
        { id: 2, title: "", image: "2.jpg", genre: "Drama", rating: 7 },
      ]),
    ).toEqual([{ id: 1, title: "Dark Storm", image: "1.jpg", genre: "drama", rating: 8.3 }]);
  });

  it("combines title, genre and rating filters", () => {
    expect(filterMovies(movies, { searchTerm: "storm", genre: "drama", rating: "good" })).toEqual([
      movies[0],
    ]);
    expect(filterMovies(movies, { searchTerm: "", genre: "all", rating: "bad" })).toEqual([
      movies[2],
    ]);
  });

  it("derives sorted unique genres", () => {
    expect(getGenres(movies)).toEqual(["drama", "fantasy", "horror"]);
  });
});
