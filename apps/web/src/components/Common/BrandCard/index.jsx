import Link from "next/link";
import styles from "./index.module.scss";
import { getImageUrl } from "@/utlls/pocketbase";

export default function index({ image, collectionId, id, name }) {
  return (
    <Link href="/new/brand" key={id} className={styles.wrapper}>
      <img className={styles.image} src={getImageUrl(image, collectionId, id)} alt={name} />
      <span className={styles.title}>{name}</span>
    </Link>
  );
}
