import { Col, Flex, Row } from "antd";
import { Container, Gap } from "@/components/Utility";
import { TitleSub, UsedCarsCard } from "@/components/Common";

export default function index({ usedCars, usedCarsTitle }) {
  return (
    <Container>
      <TitleSub {...usedCarsTitle} />
      <Gap height={30} />
      <Row gutter={[20, 20]}>
        {usedCars.map((car, i) => (
          <Col xs={24} sm={12} md={8} lg={6} key={i}>
            <UsedCarsCard key={i} {...car} index={i} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
