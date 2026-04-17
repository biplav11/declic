import { Button, Flex } from "antd";
import styles from "./index.module.scss";
import Link from "next/link";

export default function index({ image, title, link }) {
  return (
    <Link href={"#"} className={styles.wrapper}>
      <div className={styles.thumbnailWrapper}>
        <img className={styles.thumbnail} src={image} alt={title} />
      </div>
      <Flex vertical gap={10} style={{ paddingTop: 10 }}>
        <span className={styles.title}>{title}</span>
        <Button type="primary">ORDER NOW</Button>
      </Flex>
    </Link>
  );
}
