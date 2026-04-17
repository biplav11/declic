import { Flex } from "antd";
import Link from "next/link";
import styles from './index.module.scss'
import { RightOutlined } from "@ant-design/icons";

export default function index({ title, subtitle, href, linkText, hideLink }) {
    return (
        <Flex align="center" justify="space-between" className={styles.wrapper}>
            <Flex vertical >
                <span className={styles.title}>{title || 'Some Title'}</span>
                {subtitle && <span className={styles.subtitle}>{subtitle || 'This is our new subtitle'}</span>}
            </Flex>

            {!hideLink && <Link className={styles.link} href={href || "#"}>{linkText || 'Explore All'} <RightOutlined /></Link>}
        </Flex>
    )
}
