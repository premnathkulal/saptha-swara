import "./ListCard.scss";
// AUTH GATE: uncomment useSwipe when Phase 4.2 auth is done (for swipe edit/delete)
// import { useSwipe } from "../../hooks/useSwipe";
import {
  SongInfo,
  useSongInfo,
} from "../../hooks/api-hook/useSongInfo";
import { useState } from "react";
// AUTH GATE: uncomment when Phase 4.2 auth is done
// import { useDispatch } from "react-redux";
// import { openAddEditOption } from "../../store/slices/app-slice";
// import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ListCardProps {
  songInfo: SongInfo;
}

const ListCard = (props: ListCardProps) => {
  // AUTH GATE: uncomment dispatch when Phase 4.2 auth is done
  // const dispatch = useDispatch();
  const {
    id,
    name,
    raga,
    tala,
    refLink,
    isFavorite,
  } = props.songInfo;
  // AUTH GATE: removeSongDetails will be used again when Phase 4.2 auth is done
  const { toggleFavorite } = useSongInfo();
  // AUTH GATE: uncomment when Phase 4.2 auth is done (swipe state)
  // const [activeAction, setActiveAction] = useState<"edit" | "delete" | null>(null);
  // const {
  //   onTouchStart,
  //   onTouchMove,
  //   onTouchEnd,
  //   touchDirection,
  //   resetActions,
  // } = useSwipe();

  // AUTH GATE: uncomment when Phase 4.2 auth is done
  // useEffect(() => {
  //   handleSwipe();
  // }, [touchDirection]);

  // const dismissAction = () => {
  //   setActiveAction(null);
  //   resetActions();
  // };

  // const handleSwipe = () => {
  //   if (touchDirection === "right") {
  //     setActiveAction((prev) => prev === "edit" ? null : "edit");
  //   } else if (touchDirection === "left") {
  //     setActiveAction((prev) => prev === "delete" ? null : "delete");
  //   }
  // };

  // const handleRemove = (songId: string) => {
  //   removeSongDetails(songId);
  // };

  // const handleEdit = () => {
  //   resetActions();
  //   dispatch(openAddEditOption(props.songInfo));
  // };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) toggleFavorite(id, !!isFavorite);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const className = (e.target as HTMLElement).className;
    // AUTH GATE: restore edit-option/delete-option checks when Phase 4.2 auth is done
    // if (className.startsWith("edit-option") || className.startsWith("delete-option") || className === "favorite-icon") return;
    // if (activeAction) {
    //   dismissAction();
    //   return;
    // }
    if (className === "favorite-icon") return;
    if (refLink) window.open(refLink, "_blank");
  };

  return (
    <div className="list-card-container" onClick={(e) => handleCardClick(e)}>
      {/* AUTH GATE: uncomment when Phase 4.2 auth is done */}
      {/* {activeAction === "edit" && (
        <div className="edit-option" onClick={() => handleEdit()}>
          <FontAwesomeIcon icon={faPen} className="action-icon" />
        </div>
      )}
      {activeAction === "delete" && (
        <div className="delete-option" onClick={() => id && handleRemove(id)}>
          <FontAwesomeIcon icon={faTrash} className="action-icon" />
        </div>
      )} */}
      <div className="list-card">
      {/* AUTH GATE: restore onTouchStart/Move/End when Phase 4.2 auth is done */}
      {/* <div
        className="list-card"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      > */}
        <div className="song-title">
          <div className="song-name">{name}</div>
          <div className="song-controls">
            <FontAwesomeIcon
              className="favorite-icon"
              icon={isFavorite ? faHeartSolid : faHeartRegular}
              onClick={(e) => handleFavorite(e)}
            />
          </div>
        </div>
        <div className="song-details">
          <div className="song-ragas">Raga: {raga}</div>
          {tala && <div className="song-tala">Tala: {tala}</div>}
        </div>
      </div>
    </div>
  );
};

export default ListCard;
