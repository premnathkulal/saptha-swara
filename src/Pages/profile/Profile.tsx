import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faMusic,
  faStar,
  faAward,
  faPen,
  faCheck,
  faBook,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import "./Profile.scss";

const Profile = () => {
  const navigate = useNavigate();
  const allSongs = useSelector(
    (store: MyStore) => store.songInfo.songInformation,
  );
  const [userName, setUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("userName");
    if (stored) {
      setUserName(stored);
    } else {
      const gen = "User_" + Math.random().toString(36).slice(2, 6);
      setUserName(gen);
      localStorage.setItem("userName", gen);
    }
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleNameSave = () => {
    const trimmed = userName.trim() || "User";
    setUserName(trimmed);
    localStorage.setItem("userName", trimmed);
    setIsEditing(false);
  };

  const totalSongs = allSongs.length;
  const favoriteSongs = allSongs.filter((s) => s.isFavorite).length;
  const totalRagas = new Set(allSongs.map((s) => s.raga)).size;
  const points = allSongs.reduce((p, s) => p + (s.isFavorite ? 5 : 0), 0);
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div className="profile">
      <div className="header-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className="header-title">Profile</span>
        <div className="header-points">
          <FontAwesomeIcon icon={faAward} />
          <span>{points}</span>
        </div>
      </div>

      <div className="content">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            {isEditing ? (
              <div className="name-edit">
                <input
                  ref={inputRef}
                  className="name-input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                  maxLength={24}
                />
                <button className="icon-btn" onClick={handleNameSave}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
            ) : (
              <div className="name-display">
                <span className="user-name">{userName}</span>
                <button
                  className="icon-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </div>
            )}
            <div className="user-badge">Contributor</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <FontAwesomeIcon icon={faMusic} className="stat-icon" />
            <div className="stat-value">{totalSongs}</div>
            <div className="stat-label">Total Songs</div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faStar} className="stat-icon fav" />
            <div className="stat-value">{favoriteSongs}</div>
            <div className="stat-label">Favorites</div>
          </div>
          <div className="stat-card">
            <FontAwesomeIcon icon={faBook} className="stat-icon raga" />
            <div className="stat-value">{totalRagas}</div>
            <div className="stat-label">Ragas</div>
          </div>
        </div>

        <div className="section-title">Other Contributions</div>
        <div className="contrib-list">
          <div className="contrib-item">
            <FontAwesomeIcon icon={faBook} className="ci-icon" />
            <div className="ci-info">
              <span className="ci-title">Raga Information</span>
              <span className="ci-desc">Add aarohana, avarohana & details</span>
            </div>
            <span className="ci-count">0</span>
          </div>
          <div className="contrib-item">
            <FontAwesomeIcon icon={faEdit} className="ci-icon" />
            <div className="ci-info">
              <span className="ci-title">Song Edits</span>
              <span className="ci-desc">Corrections & updates to songs</span>
            </div>
            <span className="ci-count">0</span>
          </div>
          <div className="contrib-item">
            <FontAwesomeIcon icon={faStar} className="ci-icon" />
            <div className="ci-info">
              <span className="ci-title">Reviews & Feedback</span>
              <span className="ci-desc">Suggestions & quality feedback</span>
            </div>
            <span className="ci-count">0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
