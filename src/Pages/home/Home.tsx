import "./Home.scss";
import ListCard from "../../components/list-card/ListCard";
import SearchBar from "../../components/search-bar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import { openAddEditOption } from "../../store/slices/app-slice";
import { useEffect, useMemo, useState } from "react";
import AddEditForm from "../../components/add-edit-form/AddEditForm";
import OfflineBanner from "../../components/offline-banner/OfflineBanner";
import { SongInfo, useSongInfo } from "../../hooks/api-hook/useSongInfo";
import { addOnlineListener } from "../../utils/offlineCache";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faPlusCircle, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

type SortField = "name" | "raga" | "tala" | "type";

const Home = () => {
  const dispatch = useDispatch();
  const songInformation = useSelector(
    (store: MyStore) => store.songInfo.songInformation,
  );
  const searchKey = useSelector((store: MyStore) => store.search.searchKey);
  const filterOptions = useSelector(
    (store: MyStore) => store.search.filterOptions,
  );
  const showAddEditOption = useSelector(
    (store: MyStore) => store.app.isAddEditOptionEnabled,
  );
  const { readSongDetails, syncQueue } = useSongInfo();
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    readSongDetails();
    const unsub = addOnlineListener(() => {
      syncQueue();
      readSongDetails();
    });
    return unsub;
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light-mode");
    } else if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.remove("light-mode");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      if (!prefersDark) document.documentElement.classList.add("light-mode");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    const html = document.documentElement;
    html.classList.add("theming");
    setIsDark(next);
    html.classList.toggle("light-mode", !next);
    localStorage.setItem("theme", next ? "dark" : "light");
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove("theming")));
  };

  const handleHalfSheet = () => {
    dispatch(openAddEditOption(false));
  };

  const handleSortChange = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortValue = (song: SongInfo, field: SortField): string => {
    switch (field) {
      case "name":
        return song.name;
      case "raga":
        return song.raga;
      case "tala":
        return song.tala || "";
      case "type":
        return song.type;
    }
  };

  const songsList = useMemo(() => {
    let list = [...songInformation];

    if (filterOptions.length) {
      list = list.filter(
        ({ type }) => type && filterOptions.includes(type.toUpperCase()),
      );
    }

    if (searchKey) {
      const key = searchKey.toUpperCase();
      list = list.filter(
        (song) =>
          song.name.toUpperCase().includes(key) ||
          song.raga.toUpperCase().includes(key) ||
          (song.tala || "").toUpperCase().includes(key) ||
          song.type.toUpperCase().includes(key),
      );
    }

    if (showFavoritesOnly) {
      list = list.filter((song) => song.isFavorite);
    }

    list.sort((a, b) => {
      const aVal = getSortValue(a, sortBy).toUpperCase();
      const bVal = getSortValue(b, sortBy).toUpperCase();
      const cmp = aVal.localeCompare(bVal);
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return list;
  }, [
    songInformation,
    searchKey,
    filterOptions,
    sortBy,
    sortOrder,
    showFavoritesOnly,
  ]);

  return (
    <div className="home">
      <div className="header-bar">
        <h1 className="app-title">Saptha Swara</h1>
        <div className="header-actions">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
          </button>
          {/* <button className="add-btn" onClick={handleHalfSheet}>
            <FontAwesomeIcon icon={faPlusCircle} />
          </button> */}
        </div>
      </div>
      <OfflineBanner />
      <SearchBar />
      <div className="song-controls-bar">
        <div className="sort-controls">
          {(["name", "raga", "tala", "type"] as SortField[]).map((field) => (
            <button
              key={field}
              className={`sort-btn ${sortBy === field ? "active" : ""}`}
              onClick={() => handleSortChange(field)}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {sortBy === field && (sortOrder === "asc" ? " ↑" : " ↓")}
            </button>
          ))}
        </div>
        <button
          className={`favorites-toggle ${showFavoritesOnly ? "active" : ""}`}
          onClick={() => setShowFavoritesOnly((v) => !v)}
        >
          <FontAwesomeIcon icon={faHeartRegular} /> Favorites
        </button>
      </div>
      {!songsList.length ? (
        <div className="no-item">Sorry... No Song Found!</div>
      ) : (
        songsList.map((songInfo, index) => (
          <ListCard
            songInfo={songInfo}
            key={songInfo.id || index}
            index={index}
            isMenuOpen={activeMenuId === songInfo.id}
            onToggleMenu={() =>
              setActiveMenuId((prev) =>
                prev === songInfo.id ? null : songInfo.id ?? null,
              )
            }
          />
        ))
      )}
      {showAddEditOption && <AddEditForm />}
    </div>
  );
};

export default Home;
