import styles from "./index.module.scss";
import { Container } from "@/components/Utility";
import { Button, Col, Flex, Row } from "antd";
import Link from "next/link";

export default function index() {
  return (
    <div className={styles.wrapper}>
      <Container>
        <Row gutter={30}>
          <Col xs={24} md={12}>
            <Link className={styles.thumbnailWrapper} href="/magazine">
              <img
                className={styles.thumbnail}
                src="https://firebasestorage.googleapis.com/v0/b/declicweb.appspot.com/o/mag.png?alt=media&token=3470813e-56ac-4f71-81de-8e4f09003b90&_gl=1*1rm9g18*_ga*MjI2NzE3MzA0LjE2OTc1ODAxMzA.*_ga_CW55HF8NVT*MTY5ODAxMjgyMi42LjEuMTY5ODAxMjk5My4zMy4wLjA."
                alt=""
              />
            </Link>
          </Col>
          <Col xs={24} md={12}>
            <span className={styles.title}>THE NEW EDITION IS OUT</span>
            <p className={styles.para}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, velit officia. Ea error eos incidunt
              a velit asperiores placeat dignissimos magni tempora fugiat repudiandae, nisi, mollitia, perspiciatis
              tempore laborum adipisci.
              <br />
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, velit officia. Ea error eos incidunt
              a velit asperiores placeat dignissimos magni tempora fugiat repudiandae, nisi, mollitia, perspiciatis
              tempore laborum adipisci.
              <br />
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, velit officia. Ea error eos incidunt
              a velit asperiores placeat dignissimos magni tempora fugiat repudiandae, nisi, mollitia, perspiciatis
              tempore laborum adipisci.
            </p>
            <Flex gap={20}>
              <Button size="large" type="primary" className={styles.button}>
                Order Now
              </Button>
              {/* <Button size='large' className={styles.button} type='primary'>Subscribe</Button> */}
            </Flex>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
