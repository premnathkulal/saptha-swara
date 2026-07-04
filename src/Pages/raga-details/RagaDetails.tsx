import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faMusic } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { getRagaInfo, getDummySongs } from "../../data/ragas";
import { useSongInfo } from "../../hooks/api-hook/useSongInfo";
import "./RagaDetails.scss";

const RagaDetails = () => {
  const { ragaName } = useParams<{ ragaName: string }>();
  const navigate = useNavigate();
  const allSongs = useSelector(
    (store: MyStore) => store.songInfo.songInformation
  );

  const { readSongDetails } = useSongInfo();

  useEffect(() => {
    if (!allSongs.length) {
      readSongDetails();
    }
  }, []);

  const decoded = decodeURIComponent(ragaName ?? "");
  const info = getRagaInfo(decoded);
  const songsInRaga = allSongs.filter(
    (s) => s.raga.toUpperCase() === decoded.toUpperCase()
  );
  const dummySongs = getDummySongs(decoded);
  const displaySongs = songsInRaga.length ? songsInRaga : dummySongs;
  const isDummy = !songsInRaga.length && dummySongs.length;

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
          <h1>{decoded}</h1>
          <div className="raga-tags">
            {info?.melakarta ? (
              <span className="raga-tag">
                Melakarta #{info.melakarta}
              </span>
            ) : info ? (
              <span className="raga-tag">Janya</span>
            ) : null}
            {info?.chakra && (
              <span className="raga-tag">{info.chakra} Chakra</span>
            )}
            {info?.parentMelakarta && (
              <span className="raga-tag">
                Parent: Melakarta #{info.parentMelakarta}
              </span>
            )}
          </div>
          {info?.meaning && (
            <div className="raga-meaning">"{info.meaning}"</div>
          )}
        </div>

        <div className="info-grid">
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
                {info.melakarta >= 1 && info.melakarta <= 72 ? "Melakarta" : "Janya"}
              </div>
            </div>
          ) : null}
          {info?.parentMelakarta ? (
            <div className="info-card">
              <div className="info-label">Parent Melakarta</div>
              <div className="info-value">#{info.parentMelakarta}</div>
            </div>
          ) : null}
          {info?.famousComposition ? (
            <div className="info-card info-card-full">
              <div className="info-label">Famous Composition</div>
              <div className="info-value-sm">{info.famousComposition}</div>
            </div>
          ) : null}
        </div>

        {info ? (
          <>
            <div className="scale-card">
              <div className="scale-label">Aarohana (Ascending)</div>
              <div className="scale-notes">{info.aarohana}</div>
            </div>
            <div className="scale-card">
              <div className="scale-label">Avarohana (Descending)</div>
              <div className="scale-notes">{info.avarohana}</div>
            </div>
          </>
        ) : (
          <div className="scale-card unknown">
            <div className="scale-label">Scale Information</div>
            <div className="scale-coming-soon">
              Raga details not yet available — contribute by adding the
              aarohana & avarohana for <strong>{decoded}</strong>.
            </div>
          </div>
        )}

        <div className="songs-section">
          <h2>Songs in {decoded}</h2>
          {isDummy && (
            <div className="dummy-notice">Sample songs shown — add your own to see them here</div>
          )}
          {displaySongs.length ? (
            displaySongs.map((song, i) => (
              <div
                className={`raga-song-item ${isDummy ? "dummy" : ""}`}
                key={isDummy ? i : song.id}
                onClick={() => !isDummy && navigate(-1)}
              >
                <div className="raga-song-name">
                  <FontAwesomeIcon
                    icon={faMusic}
                    style={{ marginRight: "0.4rem", fontSize: "0.8rem", color: "var(--text-muted)" }}
                  />
                  {song.name}
                </div>
                <div className="raga-song-meta">
                  {song.type && <span>{song.type}</span>}
                  {song.tala && <span>{song.tala}</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="no-songs">No songs found in this raga.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RagaDetails;
