import { Container, Gap } from "@/components/Utility";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, Flex, Input, Row } from "antd";
import styles from "./index.module.scss";
import { borderColor, iconColor } from "@/utlls/variables";
import { newCars } from "@/utlls/data";
import { NewCarsCard } from "@/components/Common";
import Title from "antd/es/typography/Title";

export default function page() {
  const text = <p style={{ paddingLeft: 24 }}>Content part here</p>;

  const search = (
    <Flex>
      <Input className={styles.headerSearch} placeholder="Search Vehicle, Make, Model etc." allowClear />
      <Button className={styles.headerSearchBtn}>
        <SearchOutlined />
      </Button>
    </Flex>
  );

  const items = ["Keywords", "Price", "Body", "Number of Doors", "Energy", "Fiscal Power", "Transmission"].map(
    (item, i) => ({
      key: i,
      label: (
        <span
          style={{
            textTransform: "uppercase",
            fontSize: 11,
            color: iconColor,
          }}
        >
          {item}
        </span>
      ),
      children: i === 0 ? search : text,
    })
  );

  return (
    <Container>
      <Gap height={30} />
      <Row gutter={20}>
        <Col xs={0} lg={6}>
          <div
            style={{
              border: "1px solid",
              borderColor: borderColor,
              borderRadius: 10,
            }}
          >
            <Flex style={{ padding: 15, paddingBottom: 0 }} justify="space-between">
              <Title level={5}>Filters</Title>
              <Button size="small">Reset</Button>
            </Flex>
            <Collapse
              style={{ position: "sticky", top: 120 }}
              items={items}
              bordered={false}
              defaultActiveKey={["0"]}
              expandIconPosition="end"
            />
          </div>
        </Col>
        <Col xs={24} lg={18}>
          <Row gutter={[20, 20]}>
            {newCars.map((car, i) => (
              <Col xs={24} sm={12} md={8} lg={8} key={i}>
                <NewCarsCard {...car} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Gap height={30} />
    </Container>
  );
}
