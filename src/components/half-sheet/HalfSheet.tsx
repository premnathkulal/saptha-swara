import './HalfSheet.scss'

const HalfSheet = () => {
    return (
        <div className="half-sheet-container">
            <div className="half-sheet">
                <div className="text-input">
                    <input type="text" placeholder="Song Name" />
                    <input type="text" placeholder="Song Raga" />
                    <input type="text" placeholder="Song Tala" />
                    <input type="text" placeholder="Refference Link" />
                </div>
                <button className="btn">Add/Update To The List</button>
            </div>
        </div>
    )
}

export default HalfSheet
