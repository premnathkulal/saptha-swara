import "./Home.scss";
import ListCard from "../../components/list-card/ListCard";
import SearchBar from "../../components/search-bar/SearchBar";
import { useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AddEditForm from "../../components/add-edit-form/AddEditForm";
import OfflineBanner from "../../components/offline-banner/OfflineBanner";
import { SongInfo } from "../../hooks/api-hook/useSongInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

type SortField = "name" | "raga" | "tala" | "type";

const Home = () => {
  const navigate = useNavigate();
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
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeSongId, setActiveSongId] = useState<string | null>(null);
  const [songPage, setSongPage] = useState(1);
  const [isDark, setIsDark] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveSongId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
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
    requestAnimationFrame(() =>
      requestAnimationFrame(() => html.classList.remove("theming")),
    );
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

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(songsList.length / PAGE_SIZE);
  const paginatedSongs = songsList.slice(0, songPage * PAGE_SIZE);

  useEffect(() => {
    setSongPage(1);
  }, [searchKey, filterOptions, sortBy, sortOrder, showFavoritesOnly]);

  useEffect(() => {
    if (!sentinelRef.current || songPage >= totalPages) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSongPage((p) => p + 1);
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [songPage, totalPages]);

  return (
    <div className="home">
      <div className="header-bar">
        <h1 className="app-title">Saptha Swara</h1>
        <div className="header-actions">
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
          </button>
          <div
            className="profile-avatar"
            onClick={() => navigate("/profile")}
            role="button"
            tabIndex={0}
            aria-label="Profile"
          >
            SS
          </div>
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
        <>
          {paginatedSongs.map((songInfo, index) => (
            <ListCard
              songInfo={songInfo}
              key={songInfo.id || index}
              index={index}
              isActive={activeSongId === songInfo.id}
              onActivate={() =>
                setActiveSongId((prev) =>
                  prev === songInfo.id ? null : (songInfo.id ?? null),
                )
              }
            />
          ))}
          {songPage < totalPages && <div ref={sentinelRef} className="scroll-sentinel" />}
        </>
      )}
      {showAddEditOption && <AddEditForm />}
    </div>
  );
};

export default Home;
