import { useDispatch, useSelector } from "react-redux";
import "./FilterBar.scss";
import { setFilterKey } from "../../store/slices/search-slice";
import { MyStore } from "../../store/store";
import { useEffect, useState } from "react";

const filterOptionsData = ["Divotional", "Movie", "Yakshagana", "Folk"];

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
            {filterOptionsData.map((option, index) => (
                <span
                    className={`filter-chip ${selectetOptions.includes(
                        option.toUpperCase()
                    ) ? "active" : ""}`}
                    key={index}
                    onClick={() => handleFilterChips(option)}
                >
                    {option}
                </span>
            ))}
        </div>
    );
};

export default FilterBar;
