const STORAGE_KEY = "moviedux.watchlist.v1";
const LEGACY_KEY = "watchlist";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const normalizeIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(
      value.filter(
        (id): id is number => typeof id === "number" && Number.isInteger(id) && id > 0,
      ),
    ),
  ];
};

const parseIds = (raw: string | null): number[] => {
  if (!raw) return [];
  return normalizeIds(JSON.parse(raw) as unknown);
};

export const readWatchlist = (storage: StorageLike): number[] => {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current !== null) return parseIds(current);

    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy === null) return [];

    const migrated = parseIds(legacy);
    storage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    storage.removeItem(LEGACY_KEY);
    return migrated;
  } catch {
    return [];
  }
};

export const writeWatchlist = (storage: StorageLike, ids: number[]): boolean => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(normalizeIds(ids)));
    return true;
  } catch {
    return false;
  }
};
