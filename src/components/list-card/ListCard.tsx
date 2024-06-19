import './ListCard.scss'

interface SongInfo {
    name: string
    raga: string
    tala: string
}

interface ListCardProps {
    songInfo: SongInfo
}

const ListCard = (props: ListCardProps) => {
    const { name, raga, tala } = props.songInfo
    return (
        <div className="list-card">
            <div className="song-title">
                <div className="song-name">{name}</div>

            </div>
            <div className="song-details">
                <div className="song-ragas">ರಾಗ: {raga}</div>
                <div className="song-tala">ತಾಳ: {tala}</div>
            </div>
        </div>
    )
}

export default ListCard
