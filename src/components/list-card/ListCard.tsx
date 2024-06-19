import Icon from '../FontAwesomeIcon'
import './ListCard.scss'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

const ListCard = () => {
    return (
        <div className="list-card">
            List
            <Icon icon={faEnvelope} />
        </div >
    )
}

export default ListCard
