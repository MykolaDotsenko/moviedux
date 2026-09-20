# Moviedux

A deliberately small, polished React movie browser for searching a compact collection, filtering by genre and rating, and keeping a private local watchlist.

**Live:** https://moviedux-eight.vercel.app/

## Why this repository exists

Moviedux started as a 2024 React learning project. The current version keeps the original product scope intentionally small while modernizing the engineering around it: typed domain logic, safe persistence, explicit failure states, responsive UI, accessibility, automated tests, CI, and a current Vite toolchain.

The goal is not to imitate a production-scale streaming catalogue. It is to show that a small frontend can still be implemented with production-minded discipline.

## Product scope

- Search movies by title.
- Filter by dynamically derived genres.
- Filter ratings into **Great (8+)**, **Good (5–7.9)**, and **Low (<5)**.
- Add or remove movies from a device-local watchlist.
- Keep watchlist state across reloads when browser storage is available.
- Recover safely from corrupt legacy storage and migrate the original `watchlist` key.
- Show useful loading, error, empty-filter, and empty-watchlist states.
- Preserve SPA navigation for Discover and Watchlist.

## Quality decisions

- **React 19 + TypeScript + Vite** replace the deprecated Create React App setup.
- Movie JSON is treated as untrusted input and normalized before entering UI state.
- Ratings become numbers at the data boundary instead of relying on implicit JavaScript coercion.
- Filtering is pure domain logic with direct unit tests.
- Local storage reads and writes are guarded; malformed or blocked storage does not crash the UI.
- The UI uses native labels, semantic landmarks, visible focus states, `aria-pressed`, a skip link, and reduced-motion support.
- Playwright covers the critical search → save → reload flow and runs an axe accessibility scan.
- GitHub Actions gates pull requests on lint, unit tests, build, and Chromium E2E.

## Architecture

```text
src/
├── components/       UI and route-level views
├── domain/           movie normalization, filtering and genre derivation
├── hooks/            catalogue loading and watchlist state
├── lib/              versioned local-storage boundary
├── test/             shared test setup
├── App.tsx            routing + application states
└── main.tsx           React bootstrap
```

The project intentionally avoids global state libraries, a backend, and remote movie APIs because the current scope does not require them.

## Stack

- React 19.3
- TypeScript 6.0 (pinned to the current range officially supported by typescript-eslint)
- React Router 7
- Vite 8.3
- Vitest + Testing Library
- Playwright + axe
- ESLint 10
- GitHub Actions
- Vercel

## Local development

Requires Node.js 22.12+.

```bash
npm ci
npm run dev
```

## Quality commands

```bash
npm run lint
npm test
npm run build
npm run test:e2e
npm run check
```

For the first local Playwright run:

```bash
npx playwright install chromium
```

## Data and privacy

The movie catalogue is bundled as local static JSON. Moviedux does not require an account and does not send watchlist data to a server. Saved movie IDs are stored only in the browser's local storage.

## Scope boundaries

Moviedux is intentionally **not** a TMDB/IMDb clone, recommendation engine, authentication demo, or full-stack application. Those additions would change the product rather than polish it. The focus here is a compact frontend with clear behavior and a high engineering floor.
