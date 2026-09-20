import { useCallback, useEffect, useMemo, useState } from "react";
import { readWatchlist, writeWatchlist } from "../lib/watchlistStorage";

const getStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage;
};

export const useWatchlist = () => {
  const storage = useMemo(getStorage, []);
  const [ids, setIds] = useState<number[]>(() => (storage ? readWatchlist(storage) : []));
  const [canPersist, setCanPersist] = useState(true);

  useEffect(() => {
    if (!storage) return;
    setCanPersist(writeWatchlist(storage, ids));
  }, [ids, storage]);

  const toggle = useCallback((id: number) => {
    setIds((current) =>
      current.includes(id) ? current.filter((movieId) => movieId !== id) : [...current, id],
    );
  }, []);

  const contains = useCallback((id: number) => ids.includes(id), [ids]);

  return { ids, toggle, contains, canPersist };
};
