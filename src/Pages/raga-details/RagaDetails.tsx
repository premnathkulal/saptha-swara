import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MyStore } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faEdit,
  faMusic,
  faSave,
  faSpinner,
  faBackspace,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getDummySongs } from "../../data/ragas";
import { useSongInfo } from "../../hooks/api-hook/useSongInfo";
import { useRagaInfo } from "../../hooks/api-hook/useRagaInfo";
import RagaKeyboard from "../../components/raga-keyboard/RagaKeyboard";
import { ref, update, remove } from "firebase/database";
import { db } from "../../firebase";
import { showToastMessage } from "../../store/slices/app-slice";
import type { RagaInfo } from "../../data/ragas";
import "./RagaDetails.scss";

const swaras = [
  "S", "R₁", "R₂", "R₃",
  "G₁", "G₂", "G₃",
  "M₁", "M₂",
  "P",
  "D₁", "D₂", "D₃",
  "N₁", "N₂", "N₃",
  "Ṡ",
];

const RagaDetails = () => {
  const { ragaName } = useParams<{ ragaName: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allSongs = useSelector(
    (store: MyStore) => store.songInfo.songInformation,
  );
  const authUser = useSelector((store: MyStore) => store.app.authUser);

  const { readSongDetails } = useSongInfo();
  const { getRagaInfoFromDb } = useRagaInfo();

  useEffect(() => {
    if (!allSongs.length) {
      readSongDetails();
    }
  }, []);

  const decoded = decodeURIComponent(ragaName ?? "");
  const info = getRagaInfoFromDb(decoded);
  const songsInRaga = allSongs.filter(
    (s) => s.raga.toUpperCase() === decoded.toUpperCase(),
  );
  const dummySongs = getDummySongs(decoded);
  const displaySongs = songsInRaga.length ? songsInRaga : dummySongs;
  const isDummy = !songsInRaga.length && dummySongs.length;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<RagaInfo | null>(null);
  const [activeScale, setActiveScale] = useState<"aarohana" | "avarohana">("aarohana");

  useEffect(() => {
    if (isEditing && info) {
      setEditForm({ ...info });
    }
  }, [isEditing, info]);

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditForm(null);
    } else {
      setEditForm(info ? { ...info } : {
        name: decoded,
        melakarta: 0,
        aarohana: "",
        avarohana: "",
      });
      setIsEditing(true);
    }
  };

  const appendSwara = (swara: string) => {
    if (!editForm) return;
    const current = editForm[activeScale];
    const updated = current ? `${current} ${swara}` : swara;
    setEditForm({ ...editForm, [activeScale]: updated });
  };

  const backspaceScale = () => {
    if (!editForm) return;
    const current = editForm[activeScale];
    if (!current) return;
    const parts = current.trim().split(/\s+/);
    parts.pop();
    setEditForm({ ...editForm, [activeScale]: parts.join(" ") });
  };

  const clearScale = () => {
    if (!editForm) return;
    setEditForm({ ...editForm, [activeScale]: "" });
  };

  const handleSave = async () => {
    if (!editForm || !authUser) return;
    setSaving(true);
    const oldKey = decoded.trim().toLowerCase();
    const newKey = editForm.name.trim().toLowerCase();
    try {
      const data = {
        ...editForm,
        editedBy: authUser.uid,
        editedByName: authUser.displayName || undefined,
      };
      await update(ref(db, `saptha-swara/ragas/${newKey}`), data);
      if (newKey !== oldKey) {
        await remove(ref(db, `saptha-swara/ragas/${oldKey}`));
      }
      dispatch(showToastMessage("Raga details updated!"));
      setIsEditing(false);
      setEditForm(null);
    } catch {
      dispatch(showToastMessage("Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="raga-details">
      <div className="header-bar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className="header-title">Raga Details</span>
      </div>

      <div className="content">
        <div className="raga-header">
          {!isEditing ? (
            <div className="raga-title-row">
              <h1>{decoded}</h1>
              {authUser && (
                <button className="edit-btn" onClick={handleEditToggle}>
                  <FontAwesomeIcon icon={isEditing ? faEdit : faEdit} />
                </button>
              )}
            </div>
          ) : editForm ? (
            <div className="edit-field">
              <div className="edit-label">Raga Name</div>
              <input
                className="edit-input"
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
          ) : null}
          <div className="raga-tags">
            {!isEditing && info?.melakarta ? (
              <span className="raga-tag">Melakarta #{info.melakarta}</span>
            ) : !isEditing && info ? (
              <span className="raga-tag">Janya</span>
            ) : null}
            {isEditing && editForm && editForm.chakra && (
              <span className="raga-tag">{editForm.chakra} Chakra</span>
            )}
            {!isEditing && info?.chakra && (
              <span className="raga-tag">{info.chakra} Chakra</span>
            )}
            {isEditing && editForm && editForm.parentMelakarta ? (
              <span className="raga-tag">Parent: Melakarta #{editForm.parentMelakarta}</span>
            ) : null}
            {!isEditing && info?.parentMelakarta && (
              <span className="raga-tag">Parent: Melakarta #{info.parentMelakarta}</span>
            )}
          </div>
          {!isEditing && info?.meaning && (
            <div className="raga-meaning">"{info.meaning}"</div>
          )}
          {isEditing && editForm && (
            <div className="edit-field">
              <div className="edit-label">Meaning</div>
              <textarea
                className="edit-input"
                value={editForm.meaning || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, meaning: e.target.value })
                }
                placeholder="Meaning of the raga name"
                rows={2}
              />
            </div>
          )}
        </div>

        <div className="info-grid">
          {!isEditing ? (
            <>
              {info?.chakra && (
                <div className="info-card">
                  <div className="info-label">Chakra</div>
                  <div className="info-value">{info.chakra}</div>
                </div>
              )}
              {info?.melakarta ? (
                <div className="info-card">
                  <div className="info-label">Category</div>
                  <div className="info-value">
                    {info.melakarta >= 1 && info.melakarta <= 72
                      ? "Melakarta"
                      : "Janya"}
                  </div>
                </div>
              ) : null}
              {info?.parentMelakarta ? (
                <div className="info-card">
                  <div className="info-label">Parent Melakarta</div>
                  <div className="info-value">#{info.parentMelakarta}</div>
                </div>
              ) : null}
            </>
          ) : editForm ? (
            <div className="info-card info-card-full">
              <details className="carnatic-details">
                <summary className="carnatic-summary">
                  Carnatic Properties
                </summary>
                <div className="carnatic-fields">
                  <div className="edit-field">
                    <div className="edit-label">Chakra</div>
                    <input
                      className="edit-input"
                      type="text"
                      value={editForm.chakra || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, chakra: e.target.value })
                      }
                      placeholder="e.g. Indu"
                    />
                  </div>
                  <div className="edit-field">
                    <div className="edit-label">Melakarta Number</div>
                    <input
                      className="edit-input"
                      type="number"
                      min={0}
                      max={72}
                      value={editForm.melakarta || 0}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          melakarta: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0 for janya"
                    />
                  </div>
                  <div className="edit-field">
                    <div className="edit-label">Parent Melakarta</div>
                    <input
                      className="edit-input"
                      type="number"
                      min={0}
                      max={72}
                      value={editForm.parentMelakarta || 0}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          parentMelakarta: parseInt(e.target.value) || undefined,
                        })
                      }
                      placeholder="e.g. 28"
                    />
                  </div>
                </div>
              </details>
            </div>
          ) : null}
          {!isEditing && info?.famousComposition ? (
            <div className="info-card info-card-full">
              <div className="info-label">Famous Composition</div>
              <div className="info-value-sm">{info.famousComposition}</div>
            </div>
          ) : null}
          {isEditing && editForm && (
            <div className="info-card info-card-full">
              <div className="info-label">Famous Composition</div>
              <input
                className="edit-input"
                type="text"
                value={editForm.famousComposition || ""}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    famousComposition: e.target.value,
                  })
                }
                placeholder="e.g. Endaro Mahanubhavulu (Thyagaraja)"
              />
            </div>
          )}
        </div>

        {isEditing && editForm ? (
          <><div className="scale-card edit-scale">
            <div className="scale-tabs">
              <button
                className={`scale-tab ${activeScale === "aarohana" ? "active" : ""}`}
                onClick={() => setActiveScale("aarohana")}
              >
                Aarohana
              </button>
              <button
                className={`scale-tab ${activeScale === "avarohana" ? "active" : ""}`}
                onClick={() => setActiveScale("avarohana")}
              >
                Avarohana
              </button>
            </div>
            <div className="scale-display">
              {editForm[activeScale] || (
                <span className="scale-placeholder">Tap swaras below</span>
              )}
            </div>
            <div className="scale-actions">
              <button
                className="scale-action-btn"
                onClick={backspaceScale}
                title="Remove last swara"
              >
                <FontAwesomeIcon icon={faBackspace} />
              </button>
              <button
                className="scale-action-btn"
                onClick={clearScale}
                title="Clear all"
              >
                <FontAwesomeIcon icon={faEraser} />
              </button>
            </div>
            <div className="swara-palette">
              {swaras.map((swara) => (
                <button
                  key={swara}
                  className="swara-btn"
                  onClick={() => appendSwara(swara)}
                >
                  {swara}
                </button>
              ))}
            </div>
          </div>
          <div className="edit-actions">
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faSave} />
              )}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                setIsEditing(false);
                setEditForm(null);
              }}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
          </>
        ) : info ? (
          <RagaKeyboard aarohana={info.aarohana} avarohana={info.avarohana} />
        ) : (
          <div className="scale-card unknown">
            <div className="scale-label">Scale Information</div>
            <div className="scale-coming-soon">
              Raga details not yet available — contribute by adding the aarohana
              & avarohana for <strong>{decoded}</strong>.
            </div>
          </div>
        )}

        <div className="songs-section">
          <h2>Songs in {decoded}</h2>
          {isDummy && (
            <div className="dummy-notice">
              Sample songs shown — add your own to see them here
            </div>
          )}
          {displaySongs.length ? (
            displaySongs.map((song, i) => {
              const songKey =
                "id" in song
                  ? (song.id ?? `${i}-${song.name}`)
                  : `${i}-${song.name}`;

              return (
                <div
                  className={`raga-song-item ${isDummy ? "dummy" : ""}`}
                  key={songKey}
                  onClick={() => !isDummy && navigate(-1)}
                >
                  <div className="raga-song-name">
                    <FontAwesomeIcon
                      icon={faMusic}
                      style={{
                        marginRight: "0.4rem",
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                      }}
                    />
                    {song.name}
                  </div>
                  <div className="raga-song-meta">
                    {song.type && <span>{song.type}</span>}
                    {song.tala && <span>{song.tala}</span>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-songs">No songs found in this raga.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RagaDetails;
