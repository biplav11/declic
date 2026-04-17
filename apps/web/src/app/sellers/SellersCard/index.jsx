"use client";
import { RightOutlined } from "@ant-design/icons";
import { Avatar, Flex } from "antd";
import styles from "./index.module.scss";
import { getImageUrl } from "@/utlls/pocketbase";
import Link from "next/link";

function SellersCard({ name, fax, phone, avatar, collectionId, id }) {
  return (
    <Link href="/used/search" className={styles.wrapperLink}>
      <Flex vertical className={styles.wrapper} gap={10}>
        <div className={styles.imageWrapper}>
          <img className={styles.image} src={getImageUrl(avatar, collectionId, id)} alt={name} />
        </div>
        <Flex align="flex-start" justify="space-between">
          <Flex vertical gap={10}>
            <span className={styles.title}>{name}</span>
            <span className={styles.address}>39 Avenue Kheireddine Pacha, 1002 Tunis, 2 more Addresses</span>
          </Flex>
        </Flex>
        <Flex align="center" justify="space-between">
          <Flex vertical gap={5}>
            <span className={styles.phone}>Tel: {phone}</span>
            <span className={styles.phone}>Fax: {fax}</span>
          </Flex>
          <span className={styles.link}>
            See Details <RightOutlined />
          </span>
        </Flex>
      </Flex>
    </Link>
  );
}

export default SellersCard;
