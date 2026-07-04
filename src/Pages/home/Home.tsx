import "./Home.scss";
// AUTH GATE: uncomment FloatingButton when Phase 4.2 auth is done
// import FloatingButton from "../../components/floating-button/FloatingButton";
import ListCard from "../../components/list-card/ListCard";
import SearchBar from "../../components/search-bar/SearchBar";
import { useSelector } from "react-redux";
import { MyStore } from "../../store/store";
// AUTH GATE: uncomment when Phase 4.2 auth is done
// import { openAddEditOption } from "../../store/slices/app-slice";
import { useEffect, useMemo, useState } from "react";
// AUTH GATE: uncomment AddEditForm when Phase 4.2 auth is done  
// import AddEditForm from "../../components/add-edit-form/AddEditForm";
import { SongInfo, useSongInfo } from "../../hooks/api-hook/useSongInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

type SortField = "name" | "raga" | "tala" | "type";

const Home = () => {
  const songInformation = useSelector(
    (store: MyStore) => store.songInfo.songInformation,
  );
  const searchKey = useSelector((store: MyStore) => store.search.searchKey);
  const filterOptions = useSelector(
    (store: MyStore) => store.search.filterOptions,
  );
  // AUTH GATE: uncomment when Phase 4.2 auth is done
  // const showAddEditOption = useSelector(
  //   (store: MyStore) => store.app.isAddEditOptionEnabled,
  // );
  const { readSongDetails } = useSongInfo();
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    readSongDetails();
  }, []);

  // AUTH GATE: uncomment when Phase 4.2 auth is done
  // const handleHalfSheet = () => {
  //   dispatch(openAddEditOption(false));
  // };

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
      list = list.filter(
        (song) =>
          song.name.toUpperCase().includes(searchKey) ||
          song.raga.toUpperCase().includes(searchKey) ||
          (song.tala || "").toUpperCase().includes(searchKey) ||
          song.type.toUpperCase().includes(searchKey),
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
          <ListCard songInfo={songInfo} key={songInfo.id || index} />
        ))
      )}
      {/* AUTH GATE: uncomment when Phase 4.2 auth is done */}
      {/* {showAddEditOption && <AddEditForm />} */}
      {/* <FloatingButton openHalfSheet={handleHalfSheet} /> */}
    </div>
  );
};

export default Home;
