import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./AlertToast.scss";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { hideToastMessage, showToastMessage } from "../../store/slices/app-slice";
import { MyStore } from "../../store/store";
import { useEffect } from "react";

const AlertToast = () => {
    const dispatch = useDispatch()
    const toastMessage = useSelector((store: MyStore) => store.app.toastMessage)

    useEffect(() => {
        setTimeout(() => {
            dispatch(hideToastMessage())
        }, 2000)
    }, [toastMessage])

    return (
        <div className="alert-toast-container">
            <div className="alert-toast">
                <div className="alert-text">{toastMessage}</div>
                <FontAwesomeIcon
                    className="icon"
                    icon={faTimes}
                    onClick={() => dispatch(showToastMessage(''))}
                />
            </div>
        </div>
    );
};

export default AlertToast;
