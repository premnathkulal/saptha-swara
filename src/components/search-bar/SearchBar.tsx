import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SearchBar.scss'
import { faSliders } from '@fortawesome/free-solid-svg-icons'

const SearchBar = () => {
    return (
        <div className="search-bar-container">
            <div className="search-bar">
                <input type="text" />
                <div className="filter-icon">
                    <FontAwesomeIcon icon={faSliders} />
                </div>
            </div>
        </div>
    )
}

export default SearchBar
