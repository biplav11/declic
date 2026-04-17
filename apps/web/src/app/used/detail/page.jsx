import { ImageGallery, Text, Title, TitleSubBreadcrumb } from "@/components/Common";
import { Container, Gap } from "@/components/Utility";
import { CopyOutlined, SafetyOutlined, SwapOutlined } from "@ant-design/icons";
import { Button as Btn, Col, Row } from "antd";
import SpecsList from "./components/SpecsList";
import SimilarSlider from "./components/SimilarSlider";
import { newCars, usedCars } from "@/utlls/data";

const images = [
  {
    original:
      "https://occasion.automobile.tn/2021/08/67084_405677x3a75p2bi4t7svfuyok_max.webp?t=e60f0e208c371e700a68b3b7a3e5d4f9",
    thumbnail:
      "https://occasion.automobile.tn/2021/08/67084_405677x3a75p2bi4t7svfuyok_min.webp?t=e60f0e208c371e700a68b3b7a3e5d4f9",
  },
  {
    original:
      "https://occasion.automobile.tn/2021/08/67084_9dn81r3uq1fo2u3wcovksv0ms_max.webp?t=cbc6d6f9eeef1ea639f7a460239e4424",
    thumbnail:
      "https://occasion.automobile.tn/2021/08/67084_9dn81r3uq1fo2u3wcovksv0ms_min.webp?t=cbc6d6f9eeef1ea639f7a460239e4424",
  },
  {
    original:
      "https://occasion.automobile.tn/2021/08/67084_0wo6jgrltzsw4fzhvohloyo5n_max.webp?t=34898e4555ddd27d8451602880200a99",
    thumbnail:
      "https://occasion.automobile.tn/2021/08/67084_0wo6jgrltzsw4fzhvohloyo5n_min.webp?t=34898e4555ddd27d8451602880200a99",
  },
];

function Button(props) {
  return (
    <Btn
      size="large"
      icon={<span style={{ position: "absolute", top: 11, left: 12 }}>{props.icon}</span>}
      style={{ width: "100%" }}
    >
      <span className="variantBtn">{props.children}</span>
    </Btn>
  );
}

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];

export default function page() {
  const titleProps = {
    title: "Audi Q5",
    subtitle: "Some Variant",
    breadcrumbs: [
      { title: "Used Car", link: "/used" },
      { title: "Search", link: "/used/search" },
      { title: "Audi Q5" },
    ],
  };
  return (
    <Container>
      <Gap height={30} />
      <TitleSubBreadcrumb {...titleProps} />
      <Gap height={30} />
      <Row gutter={[30, 10]}>
        <Col xs={12} lg={6}>
          <Text strong>Milage: </Text>
          <Text type="secondary">11,000</Text>
        </Col>
        <Col xs={12} lg={6}>
          <Text strong>Year: </Text>
          <Text type="secondary">2011</Text>
        </Col>
        <Col xs={12} lg={6}>
          <Text strong>Governarate: </Text>
          <Text type="secondary">Senegal</Text>
        </Col>
        <Col xs={12} lg={6}>
          <Text strong>Posted On: </Text>
          <Text type="secondary">2023/10/24</Text>
        </Col>
        <Col xs={24}>
          <Text strong>Address: </Text>
          <Text type="secondary">Some street, City, State</Text>
        </Col>
      </Row>
      <Gap height={30} />
      <Row gutter={30}>
        <Col xs={24} md={18}>
          <ImageGallery images={images} />
        </Col>
        <Col xs={24} md={6}>
          <Row gutter={[30, 30]}>
            <Col xs={12} md={24}>
              <Button icon={<CopyOutlined />}>Request Free Quote</Button>
            </Col>
            <Col xs={12} md={24}>
              <Button icon={<SwapOutlined />}>Add to comparision</Button>
            </Col>
            <Col xs={12} md={24}>
              <Button icon={<SafetyOutlined />}>Finance with Us</Button>
            </Col>

            <Col xs={12} md={24}>
              <Button icon={<SafetyOutlined />}>Request Free Quote</Button>
            </Col>
            <Col xs={12} md={24}>
              <Button icon={<SafetyOutlined />}>Request Free Quote</Button>
            </Col>
            <Col xs={12} md={24}>
              <Button icon={<SafetyOutlined />}>Request Free Quote</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Gap height={30} />
      <Title level={3} style={{ textTransform: "uppercase", margin: 0 }}>
        Technical Sheet
      </Title>
      <Text type="secondary" style={{ textTransform: "uppercase", marginTop: 5 }}>
        AUDI Q5 some variant
      </Text>
      <Gap height={30} />
      <Row gutter={[30, 30]}>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Features" />
        </Col>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Motorization" />
        </Col>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Transmission" />
        </Col>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Dimensions" />
        </Col>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Performance" />
        </Col>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Consumption" />
        </Col>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Security Equipment" />
        </Col>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Interior Equipment" />
        </Col>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Exterior Equipment" />
        </Col>
        <Col xs={24} md={12}>
          <SpecsList data={data} header="Functional Equipment" />
        </Col>
      </Row>
      <Gap height={30} />
      <Title level={3} style={{ textTransform: "uppercase" }}>
        Similar Vehicles
      </Title>
      <SimilarSlider data={usedCars} />
      <Gap height={30} />
    </Container>
  );
}
