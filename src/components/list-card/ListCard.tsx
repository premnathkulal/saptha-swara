import "./ListCard.scss";
import { SongInfo, useSongInfo } from "../../hooks/api-hook/useSongInfo";
import { useDispatch, useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import { openAddEditOption } from "../../store/slices/app-slice";
import {
  faHeart as faHeartSolid,
  faChevronRight,
  faPlay,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { extractVideoId } from "../../utils/youtube";

interface ListCardProps {
  songInfo: SongInfo;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}

const ListCard = (props: ListCardProps) => {
  const dispatch = useDispatch();
  const authUser = useSelector((store: MyStore) => store.app.authUser);
  const {
    id,
    name,
    raga,
    tala,
    refLink,
    isFavorite,
  } = props.songInfo;
  const { toggleFavorite } = useSongInfo();
  const navigate = useNavigate();
  const videoId = refLink ? extractVideoId(refLink) : null;

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) toggleFavorite(id, !!isFavorite);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openAddEditOption(props.songInfo));
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".favorite-icon") || target.closest(".edit-btn")) return;
    props.onActivate();
  };

  return (
    <div
      className="list-card-container"
      onClick={(e) => {
        e.stopPropagation();
        handleCardClick(e);
      }}
      style={{ animationDelay: `${props.index * 0.04}s` }}
    >
      <div className="list-card">
        <div className="song-title">
          <div className="song-name song-name-gradient">
            {name}
            {videoId && (
              <FontAwesomeIcon icon={faPlay} className="play-indicator" />
            )}
          </div>
          <div className="song-controls">
            <FontAwesomeIcon
              className="favorite-icon"
              icon={isFavorite ? faHeartSolid : faHeartRegular}
              onClick={(e) => handleFavorite(e)}
            />
            {authUser && props.isActive && (
              <button
                className="edit-btn"
                onClick={handleEdit}
                aria-label="Edit song"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            )}
          </div>
        </div>
        <div className="song-details">
          <div className="song-details-row">
            <div
              className="raga-link"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/raga/${encodeURIComponent(raga)}`);
              }}
            >
              <span className="raga-link-label">{raga}</span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="raga-link-arrow"
              />
            </div>
            {tala && <div className="song-tala">{tala}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
