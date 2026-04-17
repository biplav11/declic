"use client";
import { Button, Divider, Drawer, Flex, Modal } from "antd";
import styles from "./index.module.scss";
import Link from "next/link";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  ExpandAltOutlined,
  HeartOutlined,
  InfoOutlined,
  LikeOutlined,
  MobileOutlined,
  PictureOutlined,
  SafetyOutlined,
  SwapOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { confirm } = Modal;

export default function Index({
  image,
  make,
  name,
  price,
  engine,
  wrapperClass,
  showDelete = false,
  showEdit = false,
}) {
  const [open, setOpen] = useState(false);

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <DeleteOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      closable: true,
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <>
      <div className={`${styles.wrapper} ${wrapperClass}`}>
        <Link href="/used/detail" className={styles.thumbnailWrapper}>
          <img src={image} className={styles.thumbnail} alt={name} />
          <span className={styles.proSeller}>Pro</span>
          <span className={styles.imageCount}>
            <PictureOutlined /> 15
          </span>
          <Flex className={styles.deleteBtn} align="center" justify="center" gap={10}>
            {showEdit && <Button icon={<EditOutlined />} onClick={() => {}} type="default" />}
            {showDelete && <Button icon={<DeleteOutlined />} onClick={showDeleteConfirm} type="primary" danger />}
          </Flex>
        </Link>
        <Flex align="center" justify="space-between">
          <Link href="#">
            <Flex vertical gap={5} style={{ paddingTop: 5 }}>
              <span className={styles.title}>
                {make} {name}
              </span>
              <span className={styles.engine}>{engine}</span>
            </Flex>
          </Link>
          <Button icon={<InfoOutlined />} onClick={() => setOpen(true)} />
        </Flex>
        <Link href="#">
          <Flex gap={10} wrap="wrap" style={{ paddingTop: 5 }}>
            <span className={styles.info}>2012</span>
            <span className={styles.info}>130,000 kms</span>
            <span className={styles.info}>Automatic</span>
            <span className={styles.info}>Petrol</span>
          </Flex>
        </Link>
        <Divider style={{ margin: "10px 0" }} />
        <Link href="#">
          <Flex gap={10} wrap="wrap">
            <span className={styles.tag}>
              <LikeOutlined style={{ color: "darkgreen" }} /> Good Deal
            </span>
            <span className={styles.tag}>
              <SafetyOutlined style={{ color: "blue" }} /> 6 months warranty
            </span>
          </Flex>
        </Link>
        <Divider style={{ margin: "10px 0" }} />
        <Link href="#">
          <span className={styles.price}>$ {(price * 1000).toLocaleString("en-US")} (Negotiable)</span>
        </Link>
      </div>
      <Drawer
        title={`Car Overview`}
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        footer={<DrawerFooter />}
      >
        <img src={image} alt={`${make} ${name}`} className={styles.thumbnail} />
        <Link href="#">
          <Flex vertical gap={5} style={{ paddingTop: 5 }}>
            <span className={styles.title}>
              {make} {name}
            </span>
            <span className={styles.engine}>{engine}</span>
          </Flex>
        </Link>
        <Link href="#">
          <Flex gap={10} wrap="wrap" style={{ paddingTop: 5 }}>
            <span className={styles.info}>2012</span>
            <span className={styles.info}>130,000 kms</span>
            <span className={styles.info}>Automatic</span>
            <span className={styles.info}>Petrol</span>
          </Flex>
        </Link>
        <Divider style={{ margin: "10px 0" }} />
        <Link href="#">
          <span className={styles.price}>$ {(price * 1000).toLocaleString("en-US")} (Negotiable)</span>
          <span className={styles.tag} style={{ marginLeft: 10 }}>
            <LikeOutlined style={{ color: "darkgreen" }} /> Good Deal
          </span>
        </Link>
        <Divider style={{ margin: "10px 0" }} />

        <Link href="#">
          <Flex vertical gap={5}>
            <span className={styles.price}>Seller Info:</span>
            <span className={styles.title}>
              Cazes Spoticar & Certified Bergerac{" "}
              <SafetyOutlined style={{ color: "blue", position: "relative", top: 1 }} />
            </span>
            <span className={styles.info}>Route Dd Bordeaux 24100 Bergerac</span>
          </Flex>
        </Link>
        <Flex vertical gap={10} style={{ paddingTop: 10 }}>
          <Button style={{ width: "100%" }} icon={<WhatsAppOutlined />} size="large">
            WhatsApp Seller
          </Button>
          <Button type="primary" style={{ width: "100%" }} icon={<MobileOutlined />} size="large">
            Contact Seller
          </Button>
        </Flex>
        <div style={{ borderRadius: 10, overflow: "hidden", height: 230, marginTop: 10 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49767.50361397369!2d-104.88521997832035!3d38.77588199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8713436577bf4d99%3A0x16749a2486a691c5!2sTire%20World%20Auto%20Repair!5e0!3m2!1sen!2sus!4v1698060456625!5m2!1sen!2sus"
            style={{ border: 0, width: "100%", height: 230 }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Drawer>
    </>
  );
}

function DrawerFooter() {
  return (
    <>
      <Button style={{ width: "100%" }} icon={<ExpandAltOutlined />} size="large">
        See Details
      </Button>
      <Flex gap={10} style={{ paddingTop: 10 }}>
        <Button icon={<HeartOutlined />} size="large">
          Add to Favourites
        </Button>
        <Button icon={<SwapOutlined />} type="primary" size="large">
          Add to Compare
        </Button>
      </Flex>
    </>
  );
}
