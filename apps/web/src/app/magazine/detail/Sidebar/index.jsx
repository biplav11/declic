import { Col } from "antd";
import Link from "next/link";
import styles from "./index.module.scss";
import Title from "antd/es/typography/Title";
import { Gap } from "@/components/Utility";

export default function index({ categories, posts }) {
  return (
    <Col xs={24} md={6}>
      <div style={{ position: "sticky", top: 30 }}>
        <Title level={5}>Topics</Title>
        <ul>
          {new Array(5).fill("_").map((_, i) => {
            return (
              <li key={i} className={styles.list}>
                <Link href="#">Category {i + 1}</Link>
              </li>
            );
          })}
        </ul>
        <Gap height={30}></Gap>
        <Title level={5}>Similar Posts</Title>
        <ul>
          {new Array(5).fill("_").map((_, i) => {
            return (
              <li key={i} className={styles.list}>
                <Link href="#">Post {i + 1}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Col>
  );
}
