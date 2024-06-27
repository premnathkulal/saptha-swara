import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SearchBar.scss'
import { faSliders } from '@fortawesome/free-solid-svg-icons'
import FilterBar from './FilterBar'
import { useState } from 'react'

const SearchBar = () => {
    const [showFilter, setShowFilter] = useState(false)

    const handleShowFilter = () => {
        setShowFilter((showFilter: boolean) => !showFilter)
    }

    return (
        <div className="search-bar-container">
            <div className="search-bar">
                <input type="text" />
                <div className="filter-icon" onClick={handleShowFilter}>
                    <FontAwesomeIcon icon={faSliders} />
                </div>
            </div>
            {showFilter && <FilterBar />}
        </div>
    )
}

export default SearchBar
