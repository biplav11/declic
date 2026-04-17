"use client";
import {
  CaretDownOutlined,
  CloseCircleOutlined,
  FacebookFilled,
  InstagramOutlined,
  LinkedinFilled,
  MenuOutlined,
  SearchOutlined,
  TwitterOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { Col, Drawer, Flex, Button, Menu, Row, Dropdown } from "antd";
import { Fragment, useEffect, useState } from "react";
import { menu as pageMenu } from "@/utlls/variables";
import Link from "next/link";
import styles from "./index.module.scss";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
const font = Inter({
  weight: "400",
  subsets: ["latin"],
});

const GUIDES_VIEW_ALL_KEY = "practical-guides-view-all";

const Header = ({ pages }) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("mail");
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const latestGuides = pages.slice(0, 5).map((p) => ({
    label: p.name,
    key: p.id,
    link: "/guides/" + p.slug,
  }));
  const menu = pageMenu.map((pa) => {
    if (pa.key == 3) {
      return {
        label: "Practical Guides",
        key: 3,
        children: latestGuides,
        viewAllLink: "/guides",
      };
    }
    return pa;
  });

  useEffect(() => {
    localStorage.getItem("login") ? setIsLoggedIn(true) : setIsLoggedIn(false);
  }, []);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  function onClose() {
    setOpen(false);
  }

  function buildDropdownItems(m) {
    const items = m.children.map((child) => ({
      key: child.key,
      label: child.link ? (
        <Link href={child.link}>{child.label}</Link>
      ) : (
        <span>{child.label}</span>
      ),
    }));
    if (m.viewAllLink) {
      items.push({ type: "divider", key: `${m.key}-divider` });
      items.push({
        key: GUIDES_VIEW_ALL_KEY,
        label: (
          <Link href={m.viewAllLink} style={{ fontWeight: 600 }}>
            View All
          </Link>
        ),
      });
    }
    return items;
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topHeader}>
          <div className="container">
          <Flex align="center" justify="space-between">
            <Link href="/">
              <img className={styles.logo} src={"https://www.nreo.org.np/declic/logo.svg"} alt="Declic Logo" />
            </Link>
            <Flex align="center" className={styles.rightTopNavMobile}>
              <Button type="text" icon={<SearchOutlined />}></Button>
              <Button type="text" icon={<MenuOutlined />} onClick={() => setOpen(true)}></Button>
            </Flex>

            <Flex className={styles.rightTopNav} align="center" justify="center">
              <Row style={{ paddingRight: 10 }} gutter={10}>
                <Col>
                  <Button
                    className={styles.socialButton}
                    icon={
                      <FacebookFilled
                        className={styles.headerIcon}
                        style={{
                          position: "relative",
                          top: 1,
                        }}
                      />
                    }
                  />
                </Col>
                <Col>
                  <Button
                    className={styles.socialButton}
                    icon={
                      <TwitterOutlined
                        className={styles.headerIcon}
                        style={{
                          position: "relative",
                          top: 1,
                        }}
                      />
                    }
                  />
                </Col>
                <Col>
                  <Button
                    className={styles.socialButton}
                    icon={
                      <InstagramOutlined
                        className={styles.headerIcon}
                        style={{
                          position: "relative",
                          top: 1,
                        }}
                      />
                    }
                  />
                </Col>
                <Col>
                  <Button
                    className={styles.socialButton}
                    icon={
                      <LinkedinFilled
                        className={styles.headerIcon}
                        style={{
                          position: "relative",
                          top: 1,
                        }}
                      />
                    }
                  />
                </Col>
                <Col>
                  <Button
                    className={styles.socialButton}
                    icon={
                      <YoutubeFilled
                        className={styles.headerIcon}
                        style={{
                          position: "relative",
                          top: 1,
                        }}
                      />
                    }
                  />
                </Col>
              </Row>
              <Link href="/magazine">
                <img height={55} src={"https://www.nreo.org.np/declic/mag.png"} alt="mag" />
              </Link>
            </Flex>
          </Flex>
          </div>
        </div>
        <div className={styles.middleHeader}>
          <div className="container">
          <Flex justify="center" align="center">
            <Row className={styles.navMenu} justify="center" align="middle">
              {menu.map((m, i) => (
                <Fragment key={i}>
                  {m.children.length > 0 ? (
                    <Col>
                      <Dropdown
                        menu={{ items: buildDropdownItems(m) }}
                        trigger={["hover"]}
                        placement="bottom"
                      >
                        <Button className={styles.navMenuBtn} type="text">
                          {m.label} <CaretDownOutlined className={styles.navMenuAnticon} />
                        </Button>
                      </Dropdown>
                    </Col>
                  ) : (
                    <Col>
                      <Button
                        className={styles.navMenuBtn}
                        onClick={() => (!!isLoggedIn ? router.push("/user") : router.push("/login"))}
                        type="text"
                      >
                        {m.label}
                      </Button>
                    </Col>
                  )}
                </Fragment>
              ))}
            </Row>
          </Flex>
          </div>
        </div>

        <Drawer
          placement="right"
          width={400}
          onClose={onClose}
          open={open}
          closable={false}
          classNames={{ body: styles.wrapperDrawer }}
        >
          <div
            style={{
              border: "1px solid #eaeaea",
              padding: "5px 15px",
            }}
          >
            <Flex align="center" justify="space-between">
              <Link href="/" style={{ display: "inline-block" }}>
                <img
                  className={styles.logo}
                  src={"https://www.nreo.org.np/declic/logo.svg"}
                  height={40}
                  alt="Declic Logo"
                />
              </Link>
              <Button type="text" onClick={onClose} icon={<CloseCircleOutlined />}></Button>
            </Flex>
          </div>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="inline"
            items={menu}
            style={{ textTransform: "capitalize" }}
          />
        </Drawer>
      </header>
      <div className={`${styles.bottomHeader} ${font.className}`}>
        <div className={`container ${styles.marquee} ${font.className}`}>
          <div className={`${styles.marqueeTitle} ${font.className}`}>Latest News</div>
          <p className={`${styles.marqueePara} ${font.className}`}>
            2023 BMW 540i M Sport Review: Light on Sport, Heavy on Tech | 2022 Volkswagen Taos First Drive: Exactly as
            Good as It Needs to Be | 2023 BMW 540 2023 BMW 540i M Sport Review: Light on Sport, Heavy on Tech | 2022
            Volkswagen Taos First Drive: Exactly as Good as It Needs to Be | 2023 BMW 540
          </p>
        </div>
      </div>
    </>
  );
};
export default Header;
