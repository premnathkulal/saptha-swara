import "./ListCard.scss";
import { SongInfo, useSongInfo } from "../../hooks/api-hook/useSongInfo";
import { useDispatch } from "react-redux";
import {
  openVideoPlayer,
  openAddEditOption,
} from "../../store/slices/app-slice";
import {
  faHeart as faHeartSolid,
  faChevronRight,
  faPlay,
  faEllipsisV,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { extractVideoId } from "../../utils/youtube";

interface ListCardProps {
  songInfo: SongInfo;
  index: number;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

const ListCard = (props: ListCardProps) => {
  const dispatch = useDispatch();
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
    props.onToggleMenu();
    dispatch(openAddEditOption(props.songInfo));
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".menu-backdrop")) return;
    if (target.classList.contains("favorite-icon")) return;
    if (props.isMenuOpen) {
      props.onToggleMenu();
      return;
    }
    if (videoId) {
      dispatch(openVideoPlayer({
        videoId,
        title: name,
        raga: raga || "",
        tala: tala || "",
        type: props.songInfo.type || "",
      }));
    } else if (refLink) {
      window.open(refLink, "_blank");
    }
  };

  return (
    <div
      className="list-card-container"
      onClick={(e) => handleCardClick(e)}
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
            <div className="menu-container">
              <button
                className="menu-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onToggleMenu();
                }}
                aria-label="Song menu"
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </div>
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
      {props.isMenuOpen && (
        <>
          <div className="menu-backdrop" onClick={props.onToggleMenu} />
          <div className="menu-dropdown">
            <button className="menu-item" onClick={handleEdit}>
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListCard;
