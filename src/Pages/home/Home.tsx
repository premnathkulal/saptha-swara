import ListCard from "../../components/list-card/ListCard";
import "./Home.scss";

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
    return (
        <div className="home">
            {songsList.map((songInfo) => (
                <ListCard songInfo={songInfo} />
            ))}
        </div>
    );
};

export default Home;
