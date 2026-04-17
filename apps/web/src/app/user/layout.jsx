"use client";
import { Container, Gap } from "@/components/Utility";
import { dashlist } from "@/utlls/variables";
import { Col, Row } from "antd";
import Link from "next/link";
import React from "react";
import styles from "./layout.module.scss";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();
  function logout() {
    localStorage.removeItem("login");
    router.push("/login");
  }
  return (
    <Container>
      <Gap height={30} />
      <Row gutter={20}>
        <Col sm={24} md={5}>
          <ul>
            {dashlist.map(({ name, icon, link, action }) => (
              <li
                key={name}
                className={name === "My Profile" ? `${styles.dashlist} ${styles.active}` : styles.dashlist}
              >
                {action ? (
                  <a onClick={logout}>
                    <span className={styles.icon}>{icon}</span> {name}
                  </a>
                ) : (
                  <Link href={link}>
                    <span className={styles.icon}>{icon}</span> {name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Col>
        <Col sm={24} offset={1} md={18}>
          {children}
        </Col>
      </Row>
      <Gap height={30} />
    </Container>
  );
}
