import './FilterBar.scss'

const filterOptiosn = [
    "Bhakthi",
    "Cinema",
    "Yakshagana",
    "Folk"
]

const FilterBar = () => {
    return (
        <div className="filter-bar">
            {filterOptiosn.map((option) => <span className="filter-chip">{option}</span>)}
        </div>
    )
}

export default FilterBar