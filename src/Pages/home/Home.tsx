import "./Home.scss";
import FloatingButton from "../../components/floating-button/FloatingButton";
import ListCard from "../../components/list-card/ListCard";
import SearchBar from "../../components/search-bar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import { openAddEditOption } from "../../store/slices/app-slice";
import { useEffect, useState } from "react";
import AddEditForm from "../../components/add-edit-form/AddEditForm";

interface SongInfo {
    name: string;
    raga: string;
    tala: string;
    type: string;
}

const songsData = [
    {
        name: "Maha Ganapathim",
        raga: "Natti",
        type: "Divotional",
        tala: "Adi",
    },
    {
        name: "Chandra Chooda",
        raga: "Darbari Kanada",
        type: "Divotional",
        tala: "Adi",
    },
    {
        name: "Pillangoviya",
        raga: "Mohana",
        type: "Divotional",
        tala: "Adi",
    },
    {
        name: "Lambodhara",
        raga: "Malahari",
        type: "Divotional",
        tala: "Roopaka",
    },
    {
        name: "Jayatu Jaya Vithala",
        raga: "Mohana",
        type: "Divotional",
        tala: "Adi",
    },
    {
        name: "Nammamma Sharade",
        raga: "Hamsadwani",
        type: "Divotional",
        tala: "Adi",
    },
    {
        name: "Ranga Nayaka",
        raga: "Mohana",
        tala: "Adi",
    },
    {
        name: "Banallu Neene",
        raga: "Mohana",
        type: "Movie",
        tala: "Adi",
    },
    {
        name: "Bhagyada Lakshmi",
        raga: "Madhayamavathi",
        type: "Divotional",
        tala: "Adi",
    },
    {
        name: "Gajamukhadavage Ganapage",
        raga: "Naati",
        type: "Yakshagana",
        tala: "Eka",
    },
];

const Home = () => {
    const dispatch = useDispatch();
    const filterSlice = useSelector((store: MyStore) => store.search);
    const showAddEditOption = useSelector(
        (store: MyStore) => store.app.isAddEditOptionEnabled
    );
    const [songsList, setSongsList] = useState(songsData);

    useEffect(() => {
        handleSearch();
    }, [filterSlice.searchKey]);

    useEffect(() => {
        console.log("Hello", filterSlice.filterOptions);
        handleFilter();
    }, [filterSlice.filterOptions]);

    const handleHalfSheet = () => {
        dispatch(openAddEditOption());
    };

    const handleSearch = () => {
        setSongsList(() =>
            songsData.filter(({ name }) =>
                name.toUpperCase().includes(filterSlice.searchKey)
            )
        );
    };

    const handleFilter = () => {
        if (!filterSlice.filterOptions.length) {
            setSongsList(songsData);
        } else {
            setSongsList(() =>
                songsData.filter(({ type }) => {
                    if (type) {
                        return filterSlice.filterOptions.includes(type.toUpperCase());
                    }
                    return false;
                })
            );
        }
    };

    return (
        <div className="home">
            <SearchBar />
            {!songsList.length && <div className="no-item">No Song Found</div>}
            {songsList.map((songInfo, index) => (
                <ListCard songInfo={songInfo} key={index} />
            ))}
            {showAddEditOption && <AddEditForm />}
            <FloatingButton openHalfSheet={handleHalfSheet} />
        </div>
    );
};

export default Home;
