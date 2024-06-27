import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SearchBar.scss";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import FilterBar from "./FilterBar";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchKey } from "../../store/slices/search-slice";

const SearchBar = () => {
    const [showFilter, setShowFilter] = useState(false);
    const dispatch = useDispatch();

    const handleShowFilter = () => {
        setShowFilter((showFilter: boolean) => !showFilter);
    };

    const handleSearch = (e: ChangeEvent) => {
        const searchKey = (e.target as HTMLInputElement).value
        dispatch(setSearchKey(searchKey))
    };

    return (
        <div className="search-bar-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search Teaxt"
                    onChange={(e) => handleSearch(e as ChangeEvent)}
                />
                <div className="filter-icon" onClick={handleShowFilter}>
                    <FontAwesomeIcon icon={faSliders} />
                </div>
            </div>
            {showFilter && <FilterBar />}
        </div>
    );
};

export default SearchBar;
