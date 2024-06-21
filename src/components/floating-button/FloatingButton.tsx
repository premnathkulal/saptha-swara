import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './FloatingButton.scss'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const FloatingButton = () => {
    return (
        <div className="floating-btn">
            <FontAwesomeIcon icon={faPlus} />
        </div>
    )
}

export default FloatingButton
