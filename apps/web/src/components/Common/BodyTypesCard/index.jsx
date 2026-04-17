import { getImageUrl } from '@/utlls/pocketbase'
import styles from './index.module.scss'

export default function index({ name, id, selected, collectionId, image, setSelected }) {
    return (
        <div className={styles.bodyTypes} onClick={() => setSelected(id)}>
            <div>
                <img className={styles.bodyTypeIcon} src={getImageUrl(image, collectionId, id)} alt={name} />
            </div>
            {
                id === selected ?
                    <span className={styles.active}>{name}</span> :
                    <span>{name}</span>
            }
        </div>
    )
}
