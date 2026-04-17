import { UsedCarsCard } from "@/components/Common";
import { usedCars } from "@/utlls/data";
import { Col, Row } from "antd";
import React from "react";

export default function page() {
  return (
    <Row gutter={[20, 20]}>
      {usedCars.map((car, i) => (
        <Col xs={24} sm={12} md={8} lg={8} key={i}>
          <UsedCarsCard key={i} {...car} index={i} showEdit showDelete />
        </Col>
      ))}
    </Row>
  );
}
