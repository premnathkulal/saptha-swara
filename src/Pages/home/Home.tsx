import "./Home.scss";
import FloatingButton from "../../components/floating-button/FloatingButton";
import HalfSheet from "../../components/half-sheet/HalfSheet";
import ListCard from "../../components/list-card/ListCard";
import SearchBar from "../../components/search-bar/SearchBar";
import { useDispatch, useSelector } from 'react-redux'
import { MyStore } from '../../store/store'
import { closeHalfSheet, openHalfSheet } from "../../store/slices/app-slice";

interface SongInfo {
    name: string;
    raga: string;
    tala: string;
}

const songsList = [
    {
        name: "Maha Ganapathim",
        raga: "Natti",
        tala: "Adi",
    },
    {
        name: "Chandra Chooda",
        raga: "Darbari Kanada",
        tala: "Adi",
    },
    {
        name: "Pillangoviya",
        raga: "Mohana",
        tala: "Adi",
    },
    {
        name: "Lambodhara",
        raga: "Malahari",
        tala: "Roopaka",
    },
    {
        name: "Jayatu Jaya Vithala",
        raga: "Mohana",
        tala: "Adi",
    },
    {
        name: "Nammamma Sharade",
        raga: "Hamsadwani",
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
        tala: "Adi",
    },
    {
        name: "Bhagyada Lakshmi",
        raga: "Madhayamavathi",
        tala: "Adi",
    },
];

const Home = () => {
    const dispatch = useDispatch()
    const showHalftSheet = useSelector(
        (store: MyStore) => store.app.isHalfsheetOpen
    )

    const handleHalfSheet = () => {
        dispatch(openHalfSheet())
    }

    return (
        <div className="home">
            <SearchBar />
            {songsList.map((songInfo) => (
                <ListCard songInfo={songInfo} />
            ))}
            {showHalftSheet && <HalfSheet />}
            <FloatingButton openHalfSheet={handleHalfSheet} />
        </div>
    );
};

export default Home;
