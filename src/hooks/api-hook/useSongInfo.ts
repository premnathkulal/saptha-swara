import { onValue, ref, remove, set } from "firebase/database";
import { db } from "../../firebase";
import { useDispatch } from "react-redux";
import { showToastMessage } from "../../store/slices/app-slice";
import { setSongInfo } from "../../store/slices/song-info-slice";

export interface SongInfo {
  id?: string;
  name: string;
  type: string;
  raga: string;
  tala: string;
  refLink: string;
}

const useSongInfo = () => {
  const dispatch = useDispatch();

  const generateUUID = () => {
    var d = new Date().getTime();
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  };

  const setSongDetails = (songInfo: SongInfo) => {
    const id = generateUUID();
    const newData = { ...songInfo, id };
    set(ref(db, `songs/${id}`), newData);
    dispatch(showToastMessage("New song added!"));
  };

  const updateSongDetails = (songInfo: SongInfo) => {
    set(ref(db, `songs/${songInfo.id}`), songInfo);
    dispatch(showToastMessage("Song info updated!"));
  };

  const removeSongDetails = (id: string) => {
    remove(ref(db, `songs/${id}`));
    dispatch(showToastMessage("Song info removed!"));
  };

  const readSongDetails = async () => {
    const starCountRef = await ref(db, `songs`);
    await onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newIfo = Object.keys(data).reduce(
          (acc: SongInfo[], curr: string) => {
            return [...acc, { ...data[curr] }];
          },
          []
        );
        dispatch(setSongInfo(newIfo));
      } else {
        dispatch(setSongInfo([]));
      }
    });
  };

  return {
    setSongDetails,
    readSongDetails,
    updateSongDetails,
    removeSongDetails,
  };
};

export { useSongInfo };
