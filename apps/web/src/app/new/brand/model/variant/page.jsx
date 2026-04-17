import { ImageGallery, Text, Title, TitleSubBreadcrumb } from "@/components/Common";
import { Container, Gap } from "@/components/Utility";
import { CopyOutlined, SafetyOutlined, SwapOutlined } from "@ant-design/icons";
import { Button as Btn, Col, Flex, Row } from "antd";
import SpecsList from "./components/SpecsList";
import SimilarSlider from "./components/SimilarSlider";
import { newCars } from "@/utlls/data";

function Button(props) {
  return (
    <Btn size="large" style={{ width: "100%", height: 80 }}>
      <Flex align="center" gap={15}>
        <span style={{ fontSize: 32 }}>{props.icon}</span>
        <span className="variantBtn">{props.children}</span>
      </Flex>
    </Btn>
  );
}

const features = [
  { label: "availability", value: "Pre-order now" },
  { label: "body", value: "Sedan" },
  { label: "guarantee", value: "3 years" },
  { label: "number_of_places", value: 5 },
  { label: "number_of_doors", value: 4 },
];

const motorization = [
  { label: "number_of_cylinders", value: 4 },
  { label: "energy", value: "Essence" },
  { label: "tax_power", value: "8 HP" },
  { label: "power", value: "150 HP" },
  { label: "torque", value: "250 nm 1500 rpm" },
  { label: "cylinder_capacity", value: "1395 CM³" },
];

const transmission = [
  { label: "box", value: "Automatic" },
  { label: "number_of_reports", value: 8 },
  { label: "transmission", value: "Traction" },
  { label: "self_locking_differential", value: "XDS" },
];

const dimensions = [
  { label: "length", value: "4698 mm" },
  { label: "width", value: "1829 mm" },
  { label: "height", value: "1470 mm" },
  { label: "trunk_volume", value: "600 L" },
];

const performance = [
  { label: "acceleration_0_100_kmh", value: "8.2 s" },
  { label: "maximum_speed", value: "219 KM/H" },
];

const consumption = [
  { label: "urban", value: "6 L/100 km" },
  { label: "extra_urban", value: "4.2 L/100 km" },
  { label: "mixed", value: "4.8 L/100 km" },
];

const safety_eq = [
  { label: "abs", value: true },
  { label: "airbags", value: "Front | Side | Head protection" },
  { label: "automatic_ignition_of_lights", value: true },
  { label: "electronic_immobilizer", value: true },
  { label: "stabilizer_bar", value: "Front" },
  { label: "tire_pressure_check", value: true },
  { label: "isofix_fixings", value: true },
];

const exterior_eq = [
  { label: "fog_lights", value: true },
  { label: "body_colored_exterior_elements", value: "Bumpers | Rearview mirrors" },
  { label: "led_lights", value: "Daytime running lights | Front | Rear" },
  { label: "rims", value: "Aluminum | 16''" },
  { label: "lighthouses", value: "LED" },
];

const interior_eq = [
  { label: "armrests", value: "Front" },
  { label: "rear_headrests", value: 3 },
  { label: "interior_finish", value: "Chrome" },
  { label: "lighting_kit", value: true },
  { label: "mood_lights", value: true },
  { label: "saddlery", value: "Leatherette/Fabric" },
  { label: "door_sills", value: "Chrome" },
  { label: "seats", value: "Lumbar adjustment" },
  { label: "height_adjustable_seats", value: "Driver and passenger" },
  { label: "floor_mats", value: true },
  { label: "windows", value: "Athermic" },
  { label: "steering_wheel", value: "Leather | Multi-function | With paddles" },
  { label: "adjustable_steering_wheel", value: "In height and in depth" },
];

const funcational_eq = [
  { label: "power_supply", value: "1 12 V socket" },
  { label: "start_stop_button", value: "Hands-free start" },
  { label: "smart_key", value: "Hands-free access" },
  { label: "air_conditioning", value: "Automatic" },
  { label: "rain_detector", value: true },
  { label: "central_locking", value: "From a distance" },
  { label: "parking_brake", value: "Electric" },
  { label: "on_board_computer", value: true },
  { label: "digital_instrumentation", value: "10.25''" },
  { label: "interior_rearview_mirror", value: "Anti-glare" },
  { label: "exterior_mirrors", value: "Electric | Defrosters" },
  { label: "start_stop_system", value: true },
  { label: "electric_windows", value: "Front/Back" },
];

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
      { title: "New Car", link: "/new" },
      { title: "Audi", link: "/new/brand" },
      { title: "Q5", link: "/new/brand/model" },
      { title: "Some Variant" },
    ],
  };
  return (
    <Container>
      <Gap height={30} />
      <TitleSubBreadcrumb {...titleProps} />
      <Text strong>starting from DT 79,990</Text>
      <Gap height={30} />

      {/* <Gap height={30} /> */}
      <Row gutter={30}>
        <Col xs={24} md={18}>
          <ImageGallery />
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
              <SpecsList data={features} header="Features" />
            </Col>
            <Col xs={24} md={12}>
              <SpecsList data={motorization} header="Motorization" />
            </Col>
            <Col xs={24} md={12}>
              <SpecsList data={transmission} header="Transmission" />
            </Col>
            <Col xs={24} md={12}>
              <SpecsList data={dimensions} header="Dimensions" />
            </Col>
            <Col xs={24} md={12}>
              <SpecsList data={performance} header="Performance" />
            </Col>
            <Col xs={24} md={12}>
              <SpecsList data={consumption} header="Consumption" />
            </Col>
            <Col xs={24} md={12}>
              <SpecsList data={safety_eq} header="Security Equipment" />
            </Col>
            <Col xs={24} md={12}>
              <SpecsList data={interior_eq} header="Interior Equipment" />
            </Col>
            <Col xs={24} md={12}>
              <SpecsList data={exterior_eq} header="Exterior Equipment" />
            </Col>
            <Col xs={24} md={12}>
              <SpecsList data={funcational_eq} header="Functional Equipment" />
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={6}>
          <Row gutter={[10, 10]} style={{ position: "sticky", top: 130 }}>
            <Col xs={12} md={24}>
              <Button icon={<CopyOutlined />}>Request Free Quote</Button>
            </Col>
            <Col xs={12} md={24}>
              <Button icon={<SwapOutlined />}>Add to comparision</Button>
            </Col>
            <Col xs={12} md={24}>
              <Button icon={<SafetyOutlined />}>Finance with Us</Button>
            </Col>

            {/* <Col xs={12} md={24}>
              <Button icon={<SafetyOutlined />}>Request Free Quote</Button>
            </Col>
            <Col xs={12} md={24}>
              <Button icon={<SafetyOutlined />}>Request Free Quote</Button>
            </Col>
            <Col xs={12} md={24}>
              <Button icon={<SafetyOutlined />}>Request Free Quote</Button>
            </Col> */}
          </Row>
        </Col>
      </Row>
      <Gap height={30} />
      <Title level={3} style={{ textTransform: "uppercase" }}>
        Similar Models
      </Title>
      <SimilarSlider data={newCars} />
      <Gap height={30} />
    </Container>
  );
}
