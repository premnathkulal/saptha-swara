import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './FloatingButton.scss'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export interface FloatingButtonProps {
    openHalfSheet: () => void
}

const FloatingButton = (props: FloatingButtonProps) => {
    const { openHalfSheet } = props

    return (
        <div className="floating-btn" onClick={openHalfSheet}>
            <FontAwesomeIcon icon={faPlus} />
        </div>
    )
}

export default FloatingButton
