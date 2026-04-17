import { Flex } from "antd";
import styles from './index.module.scss'
import Link from "next/link";
import moment from "moment";

export default function index({ image, category, date, title, link }) {
    return (
        <Link href={link || "/magazine/detail"} className={styles.wrapper}>
            <div className={styles.thumbnailWrapper}>
                <img className={styles.thumbnail} src={image} alt={title} />
            </div>
            <Flex vertical gap={10} style={{ paddingTop: 10 }}>
                <span className={styles.category}>{category}</span>
                <span className={styles.title}>{title}</span>
                <span className={styles.date}>{moment(date).format('MMM Do YYYY')}</span>
            </Flex>
        </Link>
    )
}
