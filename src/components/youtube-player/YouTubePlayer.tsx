import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faTag, faClock, faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import "./YouTubePlayer.scss";

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  raga?: string;
  tala?: string;
  type?: string;
  onClose: () => void;
}

const YouTubePlayer = ({ videoId, title, raga, tala, type, onClose }: YouTubePlayerProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="youtube-player-overlay">
      <div className="yp-header">
        <button className="yp-back-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className="yp-header-title">Now Playing</span>
      </div>
      <div className="yp-video-wrap">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&playsinline=1`}
          title={title || "YouTube player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="yp-body">
        <div className="yp-details">
          <h2 className="yp-song-title">{title || "Now Playing"}</h2>
          <div className="yp-detail-cards">
            {raga && (
              <div className="yp-detail-card">
                <div className="yp-dc-icon">
                  <FontAwesomeIcon icon={faMusic} />
                </div>
                <div className="yp-dc-body">
                  <div className="yp-dc-label">Raga</div>
                  <div className="yp-dc-value">{raga}</div>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="yp-dc-arrow" />
              </div>
            )}
            {type && (
              <div className="yp-detail-card">
                <div className="yp-dc-icon">
                  <FontAwesomeIcon icon={faTag} />
                </div>
                <div className="yp-dc-body">
                  <div className="yp-dc-label">Type</div>
                  <div className="yp-dc-value">{type}</div>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="yp-dc-arrow" />
              </div>
            )}
            {tala && (
              <div className="yp-detail-card">
                <div className="yp-dc-icon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="yp-dc-body">
                  <div className="yp-dc-label">Tala</div>
                  <div className="yp-dc-value">{tala}</div>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="yp-dc-arrow" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;
