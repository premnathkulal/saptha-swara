import "./ListCard.scss";
import {
  SongInfo,
  useSongInfo,
} from "../../hooks/api-hook/useSongInfo";
import { useDispatch } from "react-redux";
import { openAddEditOption } from "../../store/slices/app-slice";
import { faPen, faTrash, faEllipsisV, faHeart as faHeartSolid, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const typeColors: Record<string, string> = {
  DIVOTIONAL: "#f59e0b",
  MOVIE: "#3b82f6",
  YAKSHAGANA: "#10b981",
  FOLK: "#8b5cf6",
};

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
    type,
    raga,
    tala,
    refLink,
    isFavorite,
  } = props.songInfo;
  const { removeSongDetails, toggleFavorite } = useSongInfo();
  const navigate = useNavigate();

  const handleRemove = () => {
    if (id) removeSongDetails(id);
    props.onToggleMenu();
  };

  const handleEdit = () => {
    props.onToggleMenu();
    dispatch(openAddEditOption(props.songInfo));
  };

  const typeColor = typeColors[type.toUpperCase()] || "#606078";

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) toggleFavorite(id, !!isFavorite);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    props.onToggleMenu();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".menu-backdrop")) return;
    if (target.classList.contains("favorite-icon")) return;
    if (props.isMenuOpen) {
      props.onToggleMenu();
      return;
    }
    if (refLink) window.open(refLink, "_blank");
  };

  return (
    <div
      className="list-card-container"
      onClick={(e) => handleCardClick(e)}
      style={{ animationDelay: `${props.index * 0.04}s` }}
    >
      <div className="list-card">
        <div className="song-title">
          <div className="song-name song-name-gradient">{name}</div>
          <div className="song-controls">
            <FontAwesomeIcon
              className="favorite-icon"
              icon={isFavorite ? faHeartSolid : faHeartRegular}
              onClick={(e) => handleFavorite(e)}
            />
            <div className="menu-container">
              <button className="menu-trigger" onClick={handleMenuToggle}>
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
              <FontAwesomeIcon icon={faChevronRight} className="raga-link-arrow" />
            </div>
            {tala && <div className="song-tala">{tala}</div>}
          </div>
        </div>
      </div>
      {props.isMenuOpen && (
        <>
          <div className="menu-backdrop" onClick={() => props.onToggleMenu()} />
          <div className="menu-dropdown">
            <button className="menu-item" onClick={handleEdit}>
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>
            <button className="menu-item danger" onClick={handleRemove}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListCard;
