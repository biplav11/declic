import { Flex } from "antd";
import Link from "next/link";
import styles from "./index.module.scss";
import { Breadcrumb } from "antd";

export default function index({
    title,
    subtitle,
    href,
    linkText,
    hideLink,
    breadcrumbs,
}) {
    const items = [
        {
            title: <Link href="/">Home</Link>,
        },
    ].concat(
        breadcrumbs.map(({ title, link }) => ({
            title: link ? <Link href={link}>{title}</Link> : title,
        }))
    );
    return (
        <Flex align="center" justify="space-between" className={styles.wrapper}>
            <Flex vertical>
                <span className={styles.title}>{title || "Some Title"}</span>
                {subtitle && (
                    <span className={styles.subtitle}>
                        {subtitle || "This is our new subtitle"}
                    </span>
                )}
            </Flex>
            <Breadcrumb items={items} />
        </Flex>
    );
}
