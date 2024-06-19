import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface PropType {
    icon: IconDefinition
}

const Icon = ({ icon }: PropType) => {
    return (
        <div>
            <FontAwesomeIcon icon={icon} />
        </div>
    )
}

export default Icon
