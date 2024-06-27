import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ListCard.scss";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useSwipe } from "../../hooks/useSwipe";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

interface SongInfo {
    name: string;
    raga: string;
    tala: string;
}

interface ListCardProps {
    songInfo: SongInfo;
}

const ListCard = (props: ListCardProps) => {
    const { name, raga, tala } = props.songInfo;
    const [showEdit, setShowEdit] = useState(false);
    const { onTouchStart, onTouchMove, onTouchEnd, touchDirection } = useSwipe();

    useEffect(() => {
        handleSwipe();
    }, [touchDirection]);

    const resetSwipEvent = () => {
        setShowEdit(false);
    };

    const handleSwipe = () => {
        resetSwipEvent();
        if (touchDirection === "right") setShowEdit(true);
    };

    return (
        <div className="list-card-container">
            {showEdit && (
                <div className="edit-option">
                    <FontAwesomeIcon icon={faPen} />
                </div>
            )}
            <div
                className="list-card"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="song-title">
                    <div className="song-name">{name}</div>
                    <FontAwesomeIcon className="remove-icon" icon={faTimes} />
                </div>
                <div className="song-details">
                    <div className="song-ragas">ರಾಗ: {raga}</div>
                    <div className="song-tala">ತಾಳ: {tala}</div>
                </div>
            </div>
        </div>
    );
};

export default ListCard;
