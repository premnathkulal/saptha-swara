import { useEffect, useRef, useCallback } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";
import { offlineCache } from "../../utils/offlineCache";
import { getRagaInfo as getLocalRagaInfo } from "../../data/ragas";
import type { RagaInfo } from "../../data/ragas";

const RAGAS_CACHE_KEY = "cached-ragas";

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

const useRagaInfo = () => {
  const ragasRef = useRef<Record<string, RagaInfo>>({});

  useEffect(() => {
    let cancelled = false;
    let unsub: (() => void) | undefined;

    const load = async () => {
      const cached = await offlineCache.getCached<RagaInfo[]>(RAGAS_CACHE_KEY);
      if (cached && Array.isArray(cached) && !cancelled) {
        const map: Record<string, RagaInfo> = {};
        cached.forEach((r) => { map[normalize(r.name)] = r; });
        ragasRef.current = map;
      }

      if (!offlineCache.isOnline()) return;

      const dbRef = ref(db, "saptha-swara/ragas");
      unsub = onValue(dbRef, async (snapshot) => {
        if (cancelled) return;
        const data = snapshot.val();
        if (data) {
          ragasRef.current = data;
          const list = Object.values(data) as RagaInfo[];
          await offlineCache.setCached(RAGAS_CACHE_KEY, list);
        }
      });
    };

    load();
    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, []);

  const getRagaInfoFromDb = useCallback((name: string): RagaInfo | null => {
    const key = normalize(name);
    return ragasRef.current[key] ?? getLocalRagaInfo(name);
  }, []);

  const searchRagasInDb = useCallback((query: string): RagaInfo[] => {
    const q = query.toUpperCase();
    const fromDb = Object.values(ragasRef.current).filter((r) =>
      r.name.toUpperCase().includes(q),
    );
    return fromDb;
  }, []);

  return { getRagaInfoFromDb, searchRagasInDb };
};

export { useRagaInfo };
