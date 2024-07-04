import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ListCard.scss";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useSwipe } from "../../hooks/useSwipe";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { SongInfo, useSongInfo } from "../../hooks/api-hook/useSongInfo";
import { useDispatch } from "react-redux";
import { openAddEditOption } from "../../store/slices/app-slice";

interface ListCardProps {
    songInfo: SongInfo;
}

const ListCard = (props: ListCardProps) => {
    const dispatch = useDispatch();
    const { id, name, raga, tala, refLink } = props.songInfo;
    const [showEdit, setShowEdit] = useState(false);
    const { onTouchStart, onTouchMove, onTouchEnd, touchDirection, resetActions } = useSwipe();
    const { removeSongDetails } = useSongInfo();

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

    const handleRemove = (songId: string) => {
        removeSongDetails(songId);
    };

    const handleEdit = () => {
        resetActions()
        dispatch(openAddEditOption(props.songInfo));
    };

    const hanldeCardClick = (e: React.MouseEvent) => {
        e.preventDefault()
        const className = (e.target as HTMLElement).className
        if (!refLink || className === 'edit-option') return
        window.open(refLink, "_blank")
    }

    return (
        <div className="list-card-container" onClick={(e) => hanldeCardClick(e)}>
            {showEdit && (
                <div className="edit-option" onClick={() => handleEdit()}>
                    <FontAwesomeIcon icon={faPen} className="edit-icon" />
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
                    <FontAwesomeIcon
                        className="remove-icon"
                        icon={faTimes}
                        onClick={() => id && handleRemove(id)}
                    />
                </div>
                <div className="song-details">
                    <div className="song-ragas">Raga: {raga}</div>
                    <div className="song-tala">Tala: {tala}</div>
                </div>
            </div>
        </div>
    );
};

export default ListCard;
