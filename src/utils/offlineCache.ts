import localforage from "localforage";
import type { SongInfo } from "../hooks/api-hook/useSongInfo";

const SONGS_KEY = "cached-songs";
const WRITE_QUEUE_KEY = "offline-write-queue";

localforage.config({
  name: "saptha-swara",
  storeName: "offline_cache",
});

export type WriteOp =
  | { type: "set"; song: SongInfo }
  | { type: "update"; song: SongInfo }
  | { type: "remove"; id: string }
  | { type: "toggle-favorite"; id: string; isFavorite: boolean };

export const offlineCache = {
  async cacheSongs(songs: SongInfo[]): Promise<void> {
    await localforage.setItem(SONGS_KEY, songs);
  },

  async getCachedSongs(): Promise<SongInfo[] | null> {
    return localforage.getItem<SongInfo[]>(SONGS_KEY);
  },

  async setCached<T>(key: string, data: T): Promise<void> {
    await localforage.setItem(key, data);
  },

  async getCached<T>(key: string): Promise<T | null> {
    return localforage.getItem<T>(key);
  },

  async enqueueWrite(op: WriteOp): Promise<void> {
    const queue = (await localforage.getItem<WriteOp[]>(WRITE_QUEUE_KEY)) || [];
    queue.push(op);
    await localforage.setItem(WRITE_QUEUE_KEY, queue);
  },

  async getQueue(): Promise<WriteOp[]> {
    return (await localforage.getItem<WriteOp[]>(WRITE_QUEUE_KEY)) || [];
  },

  async clearQueue(): Promise<void> {
    await localforage.removeItem(WRITE_QUEUE_KEY);
  },

  isOnline(): boolean {
    return navigator.onLine;
  },
};

export function addOnlineListener(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener("online", handler);
  return () => window.removeEventListener("online", handler);
}

export function addOfflineListener(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener("offline", handler);
  return () => window.removeEventListener("offline", handler);
}
