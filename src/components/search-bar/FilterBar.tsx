import "./FilterBar.scss";
import { useDispatch, useSelector } from "react-redux";
import { setFilterKey } from "../../store/slices/search-slice";
import { MyStore } from "../../store/store";
import { useEffect, useState } from "react";

const filterOptionsData = ["Divotional", "Movie", "Yakshagana", "Folk"];

const chipColors: Record<string, string> = {
  DEVOTIONAL: "#f59e0b",
  MOVIE: "#3b82f6",
  YAKSHAGANA: "#10b981",
  FOLK: "#8b5cf6",
};

const FilterBar = () => {
    const dispatch = useDispatch();
    const filterOptions = useSelector(
        (store: MyStore) => store.search.filterOptions
    );
    const [selectetOptions, setSelectetOptions] = useState(filterOptions);

    useEffect(() => {
        setSelectetOptions(filterOptions);
    }, [filterOptions]);

    const handleFilterChips = (filterOption: string) => {
        dispatch(setFilterKey(filterOption));
    };

    return (
        <div className="filter-bar">
            {filterOptionsData.map((option, index) => {
                const key = option.toUpperCase();
                const isActive = selectetOptions.includes(key);
                const color = chipColors[key];
                return (
                    <span
                        className={`filter-chip ${isActive ? "active" : ""}`}
                        key={index}
                        onClick={() => handleFilterChips(option)}
                        style={
                            isActive
                                ? { background: color, borderColor: color, color: "#fff" }
                                : {}
                        }
                    >
                        {option}
                    </span>
                );
            })}
        </div>
    );
};

export default FilterBar;
