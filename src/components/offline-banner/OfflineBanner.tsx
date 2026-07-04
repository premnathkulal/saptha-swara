import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import "./OfflineBanner.scss";
import { addOfflineListener, addOnlineListener } from "../../utils/offlineCache";

const OfflineBanner = () => {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const unsub1 = addOfflineListener(() => setOffline(true));
    const unsub2 = addOnlineListener(() => setOffline(false));
    return () => { unsub1(); unsub2(); };
  }, []);

  if (!offline) return null;

  return (
    <div className="offline-banner">
      <FontAwesomeIcon icon={faWifi} />
      You're offline — showing cached data
    </div>
  );
};

export default OfflineBanner;
