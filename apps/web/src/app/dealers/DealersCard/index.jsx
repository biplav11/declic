"use client";
import { RightOutlined } from "@ant-design/icons";
import { Avatar, Flex } from "antd";
import styles from "./index.module.scss";
import { getImageUrl } from "@/utlls/pocketbase";
import Link from "next/link";

function DealersCard({ name, phone, fax, expand, id, brands }) {
  const slug = `${name.toLowerCase()}-${id.toLowerCase()}`.replaceAll(" ", "-");
  console.log(expand?.brands);
  return (
    <Link href={`/dealers/${slug}`} className={styles.wrapperLink}>
      <Flex vertical className={styles.wrapper} gap={10}>
        <Flex align="flex-start" justify="space-between">
          <Flex vertical gap={10}>
            <span className={styles.title}>{name}</span>
            <span className={styles.address}>39 Avenue Kheireddine Pacha, 1002 Tunis, 2 more Addresses</span>
          </Flex>
          <Avatar.Group>
            {expand?.brands?.map((b, i) => (
              <Avatar className={styles.avatar} src={getImageUrl(b.image, b.collectionId, b.id)} key={i} />
            ))}
          </Avatar.Group>
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

export default DealersCard;
