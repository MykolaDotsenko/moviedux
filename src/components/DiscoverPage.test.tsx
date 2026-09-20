import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Movie } from "../domain/movie";
import { DiscoverPage } from "./DiscoverPage";

const movies: Movie[] = [
  { id: 1, title: "Dark Storm", image: "1.jpg", genre: "drama", rating: 8.3 },
  { id: 2, title: "Whisper of Fate", image: "2.jpg", genre: "fantasy", rating: 7.7 },
  { id: 3, title: "Nightmare's Threshold", image: "3.jpg", genre: "horror", rating: 1.7 },
];

describe("DiscoverPage", () => {
  it("filters the collection from accessible controls", async () => {
    const user = userEvent.setup();
    render(
      <DiscoverPage
        movies={movies}
        isWatchlisted={() => false}
        onToggleWatchlist={vi.fn()}
      />,
    );

    await user.type(screen.getByLabelText(/search by title/i), "storm");
    expect(screen.getByRole("heading", { name: "Dark Storm" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Whisper of Fate" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));
    await user.selectOptions(screen.getByLabelText("Rating"), "bad");
    expect(screen.getByRole("heading", { name: "Nightmare's Threshold" })).toBeInTheDocument();
  });

  it("toggles a movie through the card action", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <DiscoverPage movies={movies} isWatchlisted={() => false} onToggleWatchlist={onToggle} />,
    );

    const buttons = screen.getAllByRole("button", { name: "Add to watchlist" });
    await user.click(buttons[0]!);
    expect(onToggle).toHaveBeenCalledWith(1);
  });
});
