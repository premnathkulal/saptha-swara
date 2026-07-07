import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MyStore } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronDown,
  faMusic,
  faStar,
  faAward,
  faPen,
  faCheck,
  faBook,
  faEdit,
  faPlus,
  faRightFromBracket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useSongInfo } from "../../hooks/api-hook/useSongInfo";
import { openAddEditOption } from "../../store/slices/app-slice";
import AddEditForm from "../../components/add-edit-form/AddEditForm";
import "./Profile.scss";

const Profile = () => {
  const navigate = useNavigate();
  const authUser = useSelector((store: MyStore) => store.app.authUser);
  const allSongs = useSelector(
    (store: MyStore) => store.songInfo.songInformation,
  );
  const dispatch = useDispatch();
  const showAddEditOption = useSelector(
    (store: MyStore) => store.app.isAddEditOptionEnabled,
  );
  const { signInWithGoogle, signOut } = useAuth();
  const { removeSongDetails } = useSongInfo();
  const [userName, setUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [addedPage, setAddedPage] = useState(1);
  const [editedPage, setEditedPage] = useState(1);
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

  const displayName = authUser?.displayName || userName;
  const displayEmail = authUser?.email || null;
  const displayPhoto = authUser?.photoURL || null;
  const initials =
    displayName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const addedSongs = useMemo(
    () => allSongs.filter((s) => s.createdBy === authUser?.uid),
    [allSongs, authUser],
  );
  const editedSongs = useMemo(
    () => allSongs.filter((s) => s.editedBy === authUser?.uid),
    [allSongs, authUser],
  );

  const PAGE_SIZE = 10;
  const paginatedAdded = addedSongs.slice(0, addedPage * PAGE_SIZE);
  const paginatedEdited = editedSongs.slice(0, editedPage * PAGE_SIZE);

  const totalSongs = addedSongs.length + editedSongs.length;
  const favoriteSongs = allSongs.filter((s) => s.isFavorite).length;
  const totalRagas = new Set(allSongs.map((s) => s.raga)).size;
  const points = allSongs.reduce((p, s) => p + (s.isFavorite ? 5 : 0), 0);

  if (!authUser) {
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
          <div className="auth-prompt">
            <div className="auth-icon">
              <FontAwesomeIcon icon={faGoogle} />
            </div>
            <h2 className="auth-title">Sign in to Sync</h2>
            <p className="auth-desc">
              Sign in with Google to sync your songs and contributions across
              devices.
            </p>
            <button className="google-btn" onClick={signInWithGoogle}>
              <FontAwesomeIcon icon={faGoogle} className="google-icon" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          {displayPhoto ? (
            <img
              src={displayPhoto}
              alt=""
              className="user-avatar user-avatar-img"
            />
          ) : (
            <div className="user-avatar">{initials}</div>
          )}
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
                <span className="user-name">{displayName}</span>
                {!authUser && (
                  <button
                    className="icon-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                )}
              </div>
            )}
            {displayEmail && <div className="user-email">{displayEmail}</div>}
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

        {authUser && (
          <button className="add-song-card" onClick={() => dispatch(openAddEditOption(null))}>
            <FontAwesomeIcon icon={faPlus} className="add-song-icon" />
            <div className="add-song-text">
              <span className="add-song-title">Add New Song</span>
              <span className="add-song-desc">Contribute a song to the collection</span>
            </div>
          </button>
        )}

        <div className="section-title">My Contributions</div>
        <div className="contrib-list">
          <div
            className="contrib-item clickable"
            onClick={() => {
              setAddedPage(1);
              setEditedPage(1);
              setExpandedSection(expandedSection === "added" ? null : "added");
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="ci-icon" />
            <div className="ci-info">
              <span className="ci-title">Songs Added</span>
              <span className="ci-desc">
                Songs you have contributed to the collection
              </span>
            </div>
            <span className="ci-count">{addedSongs.length}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`ci-chevron ${expandedSection === "added" ? "open" : ""}`}
            />
          </div>
          {expandedSection === "added" && addedSongs.length > 0 && (
            <div className="contrib-sublist">
              {paginatedAdded.map((s) => (
                <div key={s.id} className="sublist-item">
                  <div className="sublist-info">
                    <span className="sublist-name">{s.name}</span>
                    <span className="sublist-meta">
                      {s.raga}
                      {s.tala ? ` · ${s.tala}` : ""}
                    </span>
                  </div>
                  <button
                    className="sublist-delete"
                    onClick={() => s.id && removeSongDetails(s.id)}
                    aria-label="Delete song"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
              {addedPage * PAGE_SIZE < addedSongs.length && (
                <button
                  className="load-more-sublist"
                  onClick={() => setAddedPage((p) => p + 1)}
                >
                  Load More ({addedSongs.length - addedPage * PAGE_SIZE} remaining)
                </button>
              )}
            </div>
          )}

          <div
            className={`contrib-item clickable ${!editedSongs.length ? "disabled" : ""}`}
            onClick={() => {
              if (!editedSongs.length) return;
              setAddedPage(1);
              setEditedPage(1);
              setExpandedSection(expandedSection === "edited" ? null : "edited");
            }}
          >
            <FontAwesomeIcon icon={faEdit} className="ci-icon" />
            <div className="ci-info">
              <span className="ci-title">Songs Edited</span>
              <span className="ci-desc">
                Songs you have corrected or updated
              </span>
            </div>
            <span className="ci-count">{editedSongs.length}</span>
            {editedSongs.length > 0 && (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`ci-chevron ${expandedSection === "edited" ? "open" : ""}`}
              />
            )}
          </div>
          {expandedSection === "edited" && editedSongs.length > 0 && (
            <div className="contrib-sublist">
              {paginatedEdited.map((s) => (
                <div key={s.id} className="sublist-item">
                  <div className="sublist-info">
                    <span className="sublist-name">{s.name}</span>
                    <span className="sublist-meta">
                      {s.raga}
                      {s.tala ? ` · ${s.tala}` : ""}
                    </span>
                  </div>
                </div>
              ))}
              {editedPage * PAGE_SIZE < editedSongs.length && (
                <button
                  className="load-more-sublist"
                  onClick={() => setEditedPage((p) => p + 1)}
                >
                  Load More ({editedSongs.length - editedPage * PAGE_SIZE} remaining)
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <button className="sign-out-btn" onClick={signOut}>
        <FontAwesomeIcon icon={faRightFromBracket} /> Sign Out
      </button>
      {showAddEditOption && <AddEditForm />}
    </div>
  );
};

export default Profile;
