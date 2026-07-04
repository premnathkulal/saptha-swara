import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SearchBar.scss";
import { faSliders, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import FilterBar from "./FilterBar";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchKey } from "../../store/slices/search-slice";
import { MyStore } from "../../store/store";

const SearchBar = () => {
    const [showFilter, setShowFilter] = useState(false);
    const dispatch = useDispatch();
    const searchValue = useSelector((store: MyStore) => store.search.searchKey);

    const handleShowFilter = () => {
        setShowFilter((prev: boolean) => !prev);
    };

    const handleSearch = (e: ChangeEvent) => {
        const searchKey = (e.target as HTMLInputElement).value
        dispatch(setSearchKey(searchKey))
    };

    const handleClear = () => {
        dispatch(setSearchKey(""));
    };

    return (
        <div className="search-bar-container">
            <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                    type="search"
                    placeholder="Search songs..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e as ChangeEvent)}
                />
                {searchValue && (
                    <button className="clear-icon" onClick={handleClear}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                )}
                <div
                    className={`filter-icon ${showFilter ? "active" : ""}`}
                    onClick={handleShowFilter}
                >
                    <FontAwesomeIcon icon={faSliders} />
                </div>
            </div>
            {showFilter && <FilterBar />}
        </div>
    );
};

export default SearchBar;
