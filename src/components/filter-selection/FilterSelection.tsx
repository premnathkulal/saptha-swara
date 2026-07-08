import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FilterSelection.scss";
import { faChevronDown, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { hideSearchFilter } from "../../store/slices/app-slice";
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase";
import { offlineCache } from "../../utils/offlineCache";

const PAGE_SIZE = 50;
const RAGA_CACHE_KEY = "cached-ragas-list";

const talaList = ["Adi", "Ata", "Dhruva", "Eka", "Jhampa", "Matya", "Rupaka", "Triputa"];
const typeList = ["Divotional", "Folk", "Movie", "Yakshagana"];

export enum DataItem {
  Raga = "raga",
  Tala = "tala",
  Type = "type",
  Default = "default",
}

export interface FilterSelection {
  selectionType: DataItem;
  selectItem: (item: string, id: string) => void;
}

const FilterSelection = (props: FilterSelection) => {
  const { selectionType, selectItem } = props;

  const dispatch = useDispatch();
  const [itemsList, setItemsList] = useState<string[]>([]);
  const [listPage, setListPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const originalListRef = useRef<string[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let unsubRagas: (() => void) | undefined;

    if (selectionType === DataItem.Raga) {
      setLoading(true);
      (async () => {
        const cached = await offlineCache.getCached<string[]>(RAGA_CACHE_KEY);
        if (cached && cached.length && !cancelled) {
          originalListRef.current = cached;
          setItemsList(cached);
          setLoading(false);
        }

        if (cancelled) return;
        const dbRef = ref(db, "saptha-swara/ragas");
        unsubRagas = onValue(dbRef, (snapshot) => {
          if (cancelled) return;
          const data = snapshot.val();
          if (data) {
            const names = (Object.values(data) as { name: string }[])
              .map((r) => r.name)
              .sort((a, b) => a.localeCompare(b));
            originalListRef.current = names;
            setItemsList(names);
            offlineCache.setCached(RAGA_CACHE_KEY, names);
          }
          setLoading(false);
        });
      })();
    } else if (selectionType === DataItem.Tala) {
      originalListRef.current = talaList;
      setItemsList(talaList);
    } else if (selectionType === DataItem.Type) {
      originalListRef.current = typeList;
      setItemsList(typeList);
    } else {
      originalListRef.current = [];
      setItemsList([]);
    }

    return () => {
      cancelled = true;
      if (unsubRagas) unsubRagas();
    };
  }, [selectionType]);

  const handleFilter = (e: ChangeEvent) => {
    const key = (e.target as HTMLInputElement).value;
    setSearchKey(key);
    const data = originalListRef.current;
    setItemsList(() => {
      return data.filter((item: string) =>
        item.toLowerCase().includes(key.toLowerCase())
      );
    });
    setListPage(1);
  };

  const handleItemSelection = (item: string) => {
    selectItem(item, selectionType);
    dispatch(hideSearchFilter());
  };

  const isSearching = searchKey.trim().length > 0;
  const totalPages = Math.ceil(itemsList.length / PAGE_SIZE);
  const paginatedItems = isSearching ? itemsList : itemsList.slice(0, listPage * PAGE_SIZE);

  useEffect(() => {
    if (!sentinelRef.current || listPage >= totalPages) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setListPage((p) => p + 1);
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [listPage, totalPages]);

  return (
    <div className="filter-selection">
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search raga"
            onChange={(e) => handleFilter(e as ChangeEvent)}
          />
          <div
            className="filter-icon"
            onClick={() => {
              dispatch(hideSearchFilter());
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <div className="list-container">
          {loading ? (
            <div className="load-more-trigger">
              <FontAwesomeIcon icon={faSpinner} spin />
              <span>Loading...</span>
            </div>
          ) : (
            <>
              {paginatedItems.map((item: string, index) => (
                <div
                  className="list"
                  key={index}
                  onClick={() => handleItemSelection(item)}
                >
                  <div className="list-text">{item}</div>
                </div>
              ))}
              {!isSearching && listPage < totalPages && (
                <div ref={sentinelRef} className="load-more-trigger">
                  <FontAwesomeIcon icon={faChevronDown} />
                  <span>Scroll for more</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSelection;
