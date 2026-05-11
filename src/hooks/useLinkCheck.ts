import { useState, useCallback, useRef, useEffect } from "react";
import type { LinkStatus } from "../lib/types";

const TIMEOUT_MS = 4000;
const MAX_CONCURRENT = 6;
const STORAGE_KEY = "pinmark-link-cache";

interface CachedEntry {
  status: LinkStatus;
  checkedAt: number;
}

type LinkCache = Record<string, CachedEntry>;

function now() {
  return Date.now();
}

function brokenCountFromCache(cache: LinkCache): number {
  return Object.values(cache).filter((e) => e.status === "broken").length;
}

export function useLinkCheck() {
  const [linkStatus, setLinkStatus] = useState<Map<string, LinkStatus>>(new Map());
  const [isChecking, setIsChecking] = useState(false);
  const [brokenCount, setBrokenCount] = useState(0);
  const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const abortRef = useRef(false);

  // Load cached results from storage.local on mount
  useEffect(() => {
    (async () => {
      try {
        const result = await chrome.storage.local.get(STORAGE_KEY);
        const cache: LinkCache = (result[STORAGE_KEY] as LinkCache) || {};
        const map = new Map<string, LinkStatus>();
        for (const [id, entry] of Object.entries(cache)) {
          map.set(id, entry.status);
        }
        setLinkStatus(map);
        setBrokenCount(brokenCountFromCache(cache));

        // Find most recent check time
        let latest = 0;
        for (const entry of Object.values(cache)) {
          if (entry.checkedAt > latest) latest = entry.checkedAt;
        }
        if (latest > 0) setLastCheckedAt(latest);
      } catch {
        // storage unavailable
      }
      setLoaded(true);
    })();
  }, []);

  // Persist current results to storage.local
  const persist = useCallback((map: Map<string, LinkStatus>) => {
    const cache: LinkCache = {};
    const ts = now();
    for (const [id, status] of map) {
      if (status === "unknown") continue;
      cache[id] = { status, checkedAt: ts };
    }
    try {
      chrome.storage.local.set({ [STORAGE_KEY]: cache });
    } catch {
      // ignore
    }
  }, []);

  const checkSingleLink = useCallback(async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      return response.ok;
    } catch {
      try {
        const response = await fetch(url, {
          method: "GET",
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        return response.ok;
      } catch {
        return false;
      }
    }
  }, []);

  const runCheck = useCallback(
    async (bookmarks: { id: string; url: string }[]) => {
      if (bookmarks.length === 0) return;

      abortRef.current = false;
      setIsChecking(true);

      const newStatus = new Map(linkStatus);
      let broken = 0;

      for (const bm of bookmarks) {
        newStatus.set(bm.id, "checking");
      }
      setLinkStatus(new Map(newStatus));

      const queue = [...bookmarks];

      const processNext = async () => {
        while (queue.length > 0 && !abortRef.current) {
          const item = queue.shift()!;
          const valid = await checkSingleLink(item.url);
          if (abortRef.current) return;
          newStatus.set(item.id, valid ? "valid" : "broken");
          if (!valid) broken++;
          setLinkStatus(new Map(newStatus));
          setBrokenCount(
            Object.values(Object.fromEntries(newStatus)).filter((s) => s === "broken").length
          );
        }
      };

      const workers: Promise<void>[] = [];
      const workerCount = Math.min(MAX_CONCURRENT, bookmarks.length);
      for (let i = 0; i < workerCount; i++) {
        workers.push(processNext());
      }
      await Promise.all(workers);

      if (!abortRef.current) {
        setIsChecking(false);
        setLastCheckedAt(now());
        persist(newStatus);
      }
    },
    [linkStatus, checkSingleLink, persist]
  );

  const checkLinks = useCallback(
    (bookmarks: { id: string; url: string }[]) => {
      return runCheck(bookmarks);
    },
    [runCheck]
  );

  const recheckBroken = useCallback(
    (bookmarks: { id: string; url: string }[]) => {
      const broken = bookmarks.filter((bm) => linkStatus.get(bm.id) === "broken");
      if (broken.length === 0) return;
      return runCheck(broken);
    },
    [linkStatus, runCheck]
  );

  const resetLinkStatus = useCallback(() => {
    setLinkStatus(new Map());
    setBrokenCount(0);
    setLastCheckedAt(null);
    abortRef.current = true;
    setIsChecking(false);
    try {
      chrome.storage.local.remove(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const getStatus = useCallback(
    (id: string): LinkStatus => {
      return linkStatus.get(id) || "unknown";
    },
    [linkStatus]
  );

  const getCachedBookmarkIds = useCallback((): string[] => {
    return [...linkStatus.keys()];
  }, [linkStatus]);

  return {
    linkStatus,
    isChecking,
    brokenCount,
    lastCheckedAt,
    checkLinks,
    recheckBroken,
    resetLinkStatus,
    getStatus,
    getCachedBookmarkIds,
    loaded,
  };
}
