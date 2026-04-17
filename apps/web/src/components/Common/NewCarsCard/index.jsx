import { Flex } from "antd";
import styles from "./index.module.scss";
import Link from "next/link";

export default function index({ image, make, name, price, wrapperClass }) {
  return (
    <Link href="/new/brand/model" className={`${styles.wrapper} ${wrapperClass}`}>
      <div className={styles.thumbnailWrapper}>
        <img src={image} className={styles.thumbnail} alt={name} />
      </div>
      <Flex vertical>
        <span className={styles.title}>
          {make} {name}
        </span>
        <span className={styles.price}>
          {price ? (
            <>
              starting from <b>$ {(price * 1000).toLocaleString("en-US")}</b>
            </>
          ) : (
            <>Price on request</>
          )}
        </span>
      </Flex>
    </Link>
  );
}
