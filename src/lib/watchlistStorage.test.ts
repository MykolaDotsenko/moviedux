import { beforeEach, describe, expect, it } from "vitest";
import { readWatchlist, writeWatchlist } from "./watchlistStorage";

describe("watchlist storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("migrates the legacy key and removes invalid IDs", () => {
    window.localStorage.setItem("watchlist", JSON.stringify([1, 2, 2, -1, "3"]));

    expect(readWatchlist(window.localStorage)).toEqual([1, 2]);
    expect(window.localStorage.getItem("watchlist")).toBeNull();
    expect(window.localStorage.getItem("moviedux.watchlist.v1")).toBe("[1,2]");
  });

  it("fails safely on corrupt JSON", () => {
    window.localStorage.setItem("moviedux.watchlist.v1", "{broken");
    expect(readWatchlist(window.localStorage)).toEqual([]);
  });

  it("persists normalized IDs", () => {
    expect(writeWatchlist(window.localStorage, [3, 3, 2])).toBe(true);
    expect(window.localStorage.getItem("moviedux.watchlist.v1")).toBe("[3,2]");
  });
});
