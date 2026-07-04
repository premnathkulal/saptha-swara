import { onValue, ref, remove, set, update } from "firebase/database";
import { db } from "../../firebase";
import { useDispatch } from "react-redux";
import { showToastMessage } from "../../store/slices/app-slice";
import { setSongInfo } from "../../store/slices/song-info-slice";
import { offlineCache } from "../../utils/offlineCache";

export interface SongInfo {
  id?: string;
  name: string;
  type: string;
  raga: string;
  tala: string;
  refLink: string;
  isFavorite?: boolean;
}

const useSongInfo = () => {
  const dispatch = useDispatch();

  const generateUUID = () => {
    let d = new Date().getTime();
    let d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
          r = ((d + r) % 16) | 0;
          d = Math.floor(d / 16);
        } else {
          r = ((d2 + r) % 16) | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
  };

  const setSongDetails = async (songInfo: SongInfo) => {
    const id = generateUUID();
    const newData = { ...songInfo, id };
    if (!offlineCache.isOnline()) {
      await offlineCache.enqueueWrite({ type: "set", song: newData });
      dispatch(showToastMessage("Queued — will sync when online"));
      const cached = (await offlineCache.getCachedSongs()) || [];
      cached.push(newData);
      await offlineCache.cacheSongs(cached);
      dispatch(setSongInfo(cached));
      return;
    }
    await set(ref(db, `saptha-swara/songs/${id}`), newData);
    dispatch(showToastMessage("New song added!"));
  };

  const updateSongDetails = async (songInfo: SongInfo) => {
    if (!offlineCache.isOnline()) {
      await offlineCache.enqueueWrite({ type: "update", song: songInfo });
      dispatch(showToastMessage("Queued — will sync when online"));
      const cached = (await offlineCache.getCachedSongs()) || [];
      const idx = cached.findIndex((s) => s.id === songInfo.id);
      if (idx !== -1) cached[idx] = songInfo;
      await offlineCache.cacheSongs(cached);
      dispatch(setSongInfo(cached));
      return;
    }
    await set(ref(db, `saptha-swara/songs/${songInfo.id}`), songInfo);
    dispatch(showToastMessage("Song info updated!"));
  };

  const removeSongDetails = async (id: string) => {
    if (!offlineCache.isOnline()) {
      await offlineCache.enqueueWrite({ type: "remove", id });
      dispatch(showToastMessage("Queued — will sync when online"));
      const cached = (await offlineCache.getCachedSongs()) || [];
      await offlineCache.cacheSongs(cached.filter((s) => s.id !== id));
      dispatch(setSongInfo(cached.filter((s) => s.id !== id)));
      return;
    }
    await remove(ref(db, `saptha-swara/songs/${id}`));
    dispatch(showToastMessage("Song info removed!"));
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    if (!offlineCache.isOnline()) {
      await offlineCache.enqueueWrite({
        type: "toggle-favorite",
        id,
        isFavorite: !isFavorite,
      });
      const cached = (await offlineCache.getCachedSongs()) || [];
      const song = cached.find((s) => s.id === id);
      if (song) song.isFavorite = !isFavorite;
      await offlineCache.cacheSongs(cached);
      dispatch(setSongInfo(cached));
      return;
    }
    await update(ref(db, `saptha-swara/songs/${id}`), {
      isFavorite: !isFavorite,
    });
  };

  const syncQueue = async () => {
    const queue = await offlineCache.getQueue();
    if (!queue.length) return;
    for (const op of queue) {
      try {
        switch (op.type) {
          case "set":
            await set(ref(db, `saptha-swara/songs/${op.song.id}`), op.song);
            break;
          case "update":
            await set(ref(db, `saptha-swara/songs/${op.song.id}`), op.song);
            break;
          case "remove":
            await remove(ref(db, `saptha-swara/songs/${op.id}`));
            break;
          case "toggle-favorite":
            await update(ref(db, `saptha-swara/songs/${op.id}`), {
              isFavorite: op.isFavorite,
            });
            break;
        }
      } catch {
        break;
      }
    }
    await offlineCache.clearQueue();
    dispatch(showToastMessage("Offline changes synced!"));
  };

  const readSongDetails = async () => {
    const cached = await offlineCache.getCachedSongs();
    if (cached && cached.length) {
      const sorted = [...cached].sort((a, b) => a.name.localeCompare(b.name));
      dispatch(setSongInfo(sorted));
    }

    if (!offlineCache.isOnline()) return;

    const starCountRef = ref(db, `saptha-swara/songs`);
    onValue(starCountRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).reduce(
          (acc: SongInfo[], curr: string) => [...acc, { ...data[curr] }],
          [],
        );
        list.sort((a, b) => a.name.localeCompare(b.name));
        await offlineCache.cacheSongs(list);
        dispatch(setSongInfo(list));
      } else {
        await offlineCache.cacheSongs([]);
        dispatch(setSongInfo([]));
      }
    });
  };

  return {
    setSongDetails,
    readSongDetails,
    updateSongDetails,
    removeSongDetails,
    toggleFavorite,
    syncQueue,
  };
};

export { useSongInfo };
