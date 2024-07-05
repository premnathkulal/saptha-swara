import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FilterSelection.scss";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideSearchFilter } from "../../store/slices/app-slice";

const dataList = {
    raga: [
        "Mohana",
        "Shri",
        "Madhyamavathi",
        "Mohana",
        "Shri",
        "Madhyamavathi",
        "Mohana",
        "Shri",
        "Madhyamavathi",
        "Mohana",
        "Shri",
        "Madhyamavathi",
        "Mohana",
        "Shri",
        "Madhyamavathi",
        "Mohana",
        "Shri",
        "Madhyamavathi",
        "Mohana",
        "Shri",
        "Madhyamavathi",
        "Mohana",
        "Shri",
        "Saranga",
    ],
    tala: [
        'Adi',
        'Eka',
        'Asta',
        'Triputa'
    ],
    type: [
        'Divotional',
        'Movie',
        'Yakshagana',
        'Folk'
    ],
    default: []
};

export enum DataItem {
    Raga = 'raga',
    Tala = 'tala',
    Type = 'type',
    Default = 'default'
}

export interface FilterSelection {
    selectionType: DataItem
    selectItem: (item: string, id: string) => void
}

const FilterSelection = (props: FilterSelection) => {
    const { selectionType, selectItem } = props

    const dispatch = useDispatch();
    const [itemsList, setItemsList] = useState<string[]>([]);

    useEffect(() => {
        setItemsList(dataList[selectionType])
    }, [])

    const handleFilter = (e: ChangeEvent) => {
        const searchKey = (e.target as HTMLInputElement).value;
        const data = dataList[selectionType]
        setItemsList(() => {
            return data.filter((item: string) =>
                item.toLowerCase().includes(searchKey.toLowerCase())
            );
        });
    };

    const handleItemSelection = (item: string) => {
        selectItem(item, selectionType)
        dispatch(hideSearchFilter())
    }

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
                <div className="list-contaner">
                    {itemsList.map((item: string, index) => (
                        <div className="list" key={index} onClick={() => handleItemSelection(item)}>
                            <div className="list-text">{item}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSelection;
