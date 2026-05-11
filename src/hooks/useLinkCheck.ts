import { useState, useCallback, useRef } from "react";
import type { LinkStatus } from "../lib/types";

const TIMEOUT_MS = 4000;
const MAX_CONCURRENT = 6;

export function useLinkCheck() {
  const [linkStatus, setLinkStatus] = useState<Map<string, LinkStatus>>(new Map());
  const [isChecking, setIsChecking] = useState(false);
  const [brokenCount, setBrokenCount] = useState(0);
  const abortRef = useRef(false);

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

  const checkLinks = useCallback(
    async (bookmarks: { id: string; url: string }[]) => {
      if (bookmarks.length === 0) return;

      abortRef.current = false;
      setIsChecking(true);
      setBrokenCount(0);

      const newStatus = new Map(linkStatus);
      let broken = 0;

      // Set all to checking
      for (const bm of bookmarks) {
        newStatus.set(bm.id, "checking");
      }
      setLinkStatus(new Map(newStatus));

      const queue = [...bookmarks];
      let running = 0;

      const processNext = async () => {
        while (queue.length > 0 && !abortRef.current) {
          const item = queue.shift()!;
          const valid = await checkSingleLink(item.url);
          if (abortRef.current) return;
          newStatus.set(item.id, valid ? "valid" : "broken");
          if (!valid) broken++;
          // Batch update every few results
          setLinkStatus(new Map(newStatus));
          setBrokenCount(broken);
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
      }
    },
    [linkStatus, checkSingleLink]
  );

  const resetLinkStatus = useCallback(() => {
    setLinkStatus(new Map());
    setBrokenCount(0);
    abortRef.current = true;
    setIsChecking(false);
  }, []);

  const getStatus = useCallback(
    (id: string): LinkStatus => {
      return linkStatus.get(id) || "unknown";
    },
    [linkStatus]
  );

  return {
    linkStatus,
    isChecking,
    brokenCount,
    checkLinks,
    resetLinkStatus,
    getStatus,
  };
}
