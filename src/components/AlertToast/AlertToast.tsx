import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './AlertToast.scss'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const AlertToast = () => {
    return (
        <div className="alert-toast-container">
            <div className="alert-toast">
                <div className="alert-text">
                    Alert Message!!
                </div>
                <FontAwesomeIcon className="icon" icon={faTimes} />
            </div>
        </div>
    )
}

export default AlertToast
