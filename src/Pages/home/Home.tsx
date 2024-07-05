import "./Home.scss";
import FloatingButton from "../../components/floating-button/FloatingButton";
import ListCard from "../../components/list-card/ListCard";
import SearchBar from "../../components/search-bar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import { openAddEditOption } from "../../store/slices/app-slice";
import { useEffect, useState } from "react";
import AddEditForm from "../../components/add-edit-form/AddEditForm";
import { SongInfo, useSongInfo } from "../../hooks/api-hook/useSongInfo";

const Home = () => {
    const dispatch = useDispatch();
    const songInformation = useSelector((store: MyStore) => store.songInfo.songInformation)
    const filterSlice = useSelector((store: MyStore) => store.search);
    const showAddEditOption = useSelector(
        (store: MyStore) => store.app.isAddEditOptionEnabled
    );
    const { readSongDetails } = useSongInfo()
    const [allSongsData, setAllSongsData] = useState<SongInfo[]>([]);
    const [songsList, setSongsList] = useState(allSongsData);

    useEffect(() => {
        readSongDetails()
    }, []);

    useEffect(() => {
        setAllSongsData(songInformation)
        setSongsList(songInformation)
    }, [songInformation]);

    useEffect(() => {
        handleSearch();
    }, [filterSlice.searchKey]);

    useEffect(() => {
        handleFilter();
    }, [filterSlice.filterOptions]);

    const handleHalfSheet = () => {
        dispatch(openAddEditOption(false));
    };

    const handleSearch = () => {
        setSongsList(() =>
            allSongsData.filter(({ name }) =>
                name.toUpperCase().includes(filterSlice.searchKey)
            )
        );
    };

    const handleFilter = () => {
        if (!filterSlice.filterOptions.length) {
            setSongsList(allSongsData);
        } else {
            setSongsList(() =>
                allSongsData.filter(({ type }) => {
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
            {(!songsList || !songsList.length) ? <div className="no-item">No Song Found!</div> :
                songsList.map((songInfo, index) => (
                    <ListCard songInfo={songInfo} key={index} />
                ))}
            {showAddEditOption && <AddEditForm />}
            <FloatingButton openHalfSheet={handleHalfSheet} />
        </div>
    );
};

export default Home;
