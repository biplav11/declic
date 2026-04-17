"use client";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Divider, Button, Flex, Select } from "antd";
const { Title, Text } = Typography;
import { Container, Gap } from "../../../components/Utility";
import { DeleteOutlined } from "@ant-design/icons";
import pb from "../../../utlls/pocketbase";

const car1 = {
  make: "Audi",
  model: "Q3",
  variant: "35 TFSI Advanced S-tronic",
  image: "https://catalogue.automobile.tn/max/2024/06/47151.webp?t=1744109469",
  features: [
    { label: "availability", value: "In stock" },
    { label: "body", value: "SUV" },
    { label: "guarantee", value: "4 years" },
    { label: "number_of_places", value: 5 },
    { label: "number_of_doors", value: 5 },
  ],
  motorization: [
    { label: "number_of_cylinders", value: 4 },
    { label: "energy", value: "Petrol" },
    { label: "tax_power", value: "10 HP" },
    { label: "power", value: "160 HP" },
    { label: "torque", value: "280 nm 1500 rpm" },
    { label: "cylinder_capacity", value: "1400 CM³" },
  ],
  transmission: [
    { label: "box", value: "Automatic" },
    { label: "number_of_reports", value: 7 },
    { label: "transmission", value: "AWD" },
    { label: "self_locking_differential", value: "No" },
  ],
  dimensions: [
    { label: "length", value: "4600 mm" },
    { label: "width", value: "1850 mm" },
    { label: "height", value: "1650 mm" },
    { label: "trunk_volume", value: "650 L" },
  ],
  performance: [
    { label: "acceleration_0_100_kmh", value: "7.8 s" },
    { label: "maximum_speed", value: "225 KM/H" },
  ],
  consumption: [
    { label: "urban", value: "7 L/100 km" },
    { label: "extra_urban", value: "5.5 L/100 km" },
    { label: "mixed", value: "6 L/100 km" },
  ],
  safety_equipments: [
    { label: "abs", value: true },
    { label: "airbags", value: "Front | Side | Curtain" },
    { label: "automatic_ignition_of_lights", value: true },
    { label: "electronic_immobilizer", value: true },
    { label: "stabilizer_bar", value: "Front" },
    { label: "tire_pressure_check", value: true },
    { label: "isofix_fixings", value: true },
  ],
  exterior_equipments: [
    { label: "fog_lights", value: true },
    { label: "body_colored_exterior_elements", value: "Bumpers | Side skirts" },
    { label: "led_lights", value: "Daytime running lights | Front" },
    { label: "rims", value: "Aluminum | 17" },
    { label: "lighthouses", value: "LED" },
  ],
  interior_equipments: [
    { label: "armrests", value: "Front" },
    { label: "rear_headrests", value: 2 },
    { label: "interior_finish", value: "Chrome and fabric" },
    { label: "lighting_kit", value: true },
    { label: "mood_lights", value: true },
    { label: "saddlery", value: "Leatherette/Fabric" },
    { label: "door_sills", value: "Chrome" },
    { label: "seats", value: "Manual adjustment" },
    { label: "height_adjustable_seats", value: "Driver only" },
    { label: "floor_mats", value: true },
    { label: "windows", value: "Tinted" },
    { label: "steering_wheel", value: "Leather | Multi-function" },
    { label: "adjustable_steering_wheel", value: "In height only" },
  ],
  functional_equipments: [
    { label: "power_supply", value: "1 12 V socket" },
    { label: "start_stop_button", value: "No" },
    { label: "smart_key", value: "Yes" },
    { label: "air_conditioning", value: "Manual" },
    { label: "rain_detector", value: true },
    { label: "central_locking", value: "Key operated" },
    { label: "parking_brake", value: "Manual" },
    { label: "on_board_computer", value: true },
    { label: "digital_instrumentation", value: "7.5''" },
    { label: "interior_rearview_mirror", value: "Anti-glare" },
    { label: "exterior_mirrors", value: "Electric | Defrosters" },
    { label: "start_stop_system", value: false },
    { label: "electric_windows", value: "Front only" },
  ],
};

const car2 = {
  make: "Audi",
  model: "Q5",
  variant: "40 TDI quattro S-tronic",
  image: "https://catalogue.automobile.tn/max/2025/01/47289.webp?t=1741088751",
  features: [
    { label: "availability", value: "In stock" },
    { label: "body", value: "SUV" },
    { label: "guarantee", value: "4 years" },
    { label: "number_of_places", value: 5 },
    { label: "number_of_doors", value: 5 },
  ],
  motorization: [
    { label: "number_of_cylinders", value: 6 },
    { label: "energy", value: "Diesel" },
    { label: "tax_power", value: "12 HP" },
    { label: "power", value: "200 HP" },
    { label: "torque", value: "400 nm 1800 rpm" },
    { label: "cylinder_capacity", value: "3000 CM³" },
  ],
  transmission: [
    { label: "box", value: "Automatic" },
    { label: "number_of_reports", value: 8 },
    { label: "transmission", value: "AWD" },
    { label: "self_locking_differential", value: "Yes" },
  ],
  dimensions: [
    { label: "length", value: "4700 mm" },
    { label: "width", value: "1900 mm" },
    { label: "height", value: "1600 mm" },
    { label: "trunk_volume", value: "700 L" },
  ],
  performance: [
    { label: "acceleration_0_100_kmh", value: "6.9 s" },
    { label: "maximum_speed", value: "240 KM/H" },
  ],
  consumption: [
    { label: "urban", value: "8 L/100 km" },
    { label: "extra_urban", value: "6 L/100 km" },
    { label: "mixed", value: "6.5 L/100 km" },
  ],
  safety_equipments: [
    { label: "abs", value: true },
    { label: "airbags", value: "Front | Side | Head protection" },
    { label: "automatic_ignition_of_lights", value: true },
    { label: "electronic_immobilizer", value: true },
    { label: "stabilizer_bar", value: "Front | Rear" },
    { label: "tire_pressure_check", value: true },
    { label: "isofix_fixings", value: true },
  ],
  exterior_equipments: [
    { label: "fog_lights", value: true },
    { label: "body_colored_exterior_elements", value: "Bumpers | Rearview mirrors" },
    { label: "led_lights", value: "Daytime running lights | Front | Rear" },
    { label: "rims", value: "Aluminum | 18" },
    { label: "lighthouses", value: "LED" },
  ],
  interior_equipments: [
    { label: "armrests", value: "Front | Rear" },
    { label: "rear_headrests", value: 3 },
    { label: "interior_finish", value: "Leather" },
    { label: "lighting_kit", value: true },
    { label: "mood_lights", value: true },
    { label: "saddlery", value: "Leather" },
    { label: "door_sills", value: "Chrome" },
    { label: "seats", value: "Electric adjustment" },
    { label: "height_adjustable_seats", value: "Driver and passenger" },
    { label: "floor_mats", value: true },
    { label: "windows", value: "Tinted" },
    { label: "steering_wheel", value: "Leather | Multi-function" },
    { label: "adjustable_steering_wheel", value: "In height and depth" },
  ],
  functional_equipments: [
    { label: "power_supply", value: "2 12 V socket" },
    { label: "start_stop_button", value: "Yes" },
    { label: "smart_key", value: "Yes" },
    { label: "air_conditioning", value: "Automatic" },
    { label: "rain_detector", value: true },
    { label: "central_locking", value: "Remote" },
    { label: "parking_brake", value: "Electric" },
    { label: "on_board_computer", value: true },
    { label: "digital_instrumentation", value: "10.25" },
    { label: "interior_rearview_mirror", value: "Anti-glare" },
    { label: "exterior_mirrors", value: "Electric | Defrosters" },
    { label: "start_stop_system", value: true },
    { label: "electric_windows", value: "All" },
  ],
};

const car3 = {
  make: "Audi",
  model: "A4",
  variant: "35 TDI Business Quattro",
  image: "https://catalogue.automobile.tn/max/2024/02/47001.webp?t=1744109634",
  features: [
    { label: "availability", value: "Pre-order now" },
    { label: "body", value: "Sedan" },
    { label: "guarantee", value: "5 years" },
    { label: "number_of_places", value: 5 },
    { label: "number_of_doors", value: 4 },
  ],
  motorization: [
    { label: "number_of_cylinders", value: 4 },
    { label: "energy", value: "Diesel" },
    { label: "tax_power", value: "10 HP" },
    { label: "power", value: "180 HP" },
    { label: "torque", value: "350 nm 1600 rpm" },
    { label: "cylinder_capacity", value: "2000 CM³" },
  ],
  transmission: [
    { label: "box", value: "Automatic" },
    { label: "number_of_reports", value: 8 },
    { label: "transmission", value: "AWD" },
    { label: "self_locking_differential", value: "Yes" },
  ],
  dimensions: [
    { label: "length", value: "4700 mm" },
    { label: "width", value: "1855 mm" },
    { label: "height", value: "1450 mm" },
    { label: "trunk_volume", value: "510 L" },
  ],
  performance: [
    { label: "acceleration_0_100_kmh", value: "7.1 s" },
    { label: "maximum_speed", value: "230 KM/H" },
  ],
  consumption: [
    { label: "urban", value: "6.5 L/100 km" },
    { label: "extra_urban", value: "5.2 L/100 km" },
    { label: "mixed", value: "5.8 L/100 km" },
  ],
  safety_equipments: [
    { label: "abs", value: true },
    { label: "airbags", value: "Front | Side | Head protection" },
    { label: "automatic_ignition_of_lights", value: true },
    { label: "electronic_immobilizer", value: true },
    { label: "stabilizer_bar", value: "Front | Rear" },
    { label: "tire_pressure_check", value: true },
    { label: "isofix_fixings", value: true },
  ],
  exterior_equipments: [
    { label: "fog_lights", value: true },
    { label: "body_colored_exterior_elements", value: "Bumpers | Rearview mirrors" },
    { label: "led_lights", value: "Daytime running lights | Front | Rear" },
    { label: "rims", value: "Aluminum | 17" },
    { label: "lighthouses", value: "LED" },
  ],
  interior_equipments: [
    { label: "armrests", value: "Front" },
    { label: "rear_headrests", value: 3 },
    { label: "interior_finish", value: "Leather" },
    { label: "lighting_kit", value: true },
    { label: "mood_lights", value: true },
    { label: "saddlery", value: "Leather" },
    { label: "door_sills", value: "Chrome" },
    { label: "seats", value: "Electric adjustment" },
    { label: "height_adjustable_seats", value: "Driver and passenger" },
    { label: "floor_mats", value: true },
    { label: "windows", value: "Tinted" },
    { label: "steering_wheel", value: "Leather | Multi-function" },
    { label: "adjustable_steering_wheel", value: "In height and depth" },
  ],
  functional_equipments: [
    { label: "power_supply", value: "2 12 V socket" },
    { label: "start_stop_button", value: "Yes" },
    { label: "smart_key", value: "Yes" },
    { label: "air_conditioning", value: "Automatic" },
    { label: "rain_detector", value: true },
    { label: "central_locking", value: "Remote" },
    { label: "parking_brake", value: "Electric" },
    { label: "on_board_computer", value: true },
    { label: "digital_instrumentation", value: "10.25" },
    { label: "interior_rearview_mirror", value: "Anti-glare" },
    { label: "exterior_mirrors", value: "Electric | Defrosters" },
    { label: "start_stop_system", value: true },
    { label: "electric_windows", value: "All" },
  ],
};

const sections = [
  { title: "Features", key: "features" },
  { title: "Motorization", key: "motorization" },
  { title: "Transmission", key: "transmission" },
  { title: "Dimensions", key: "dimensions" },
  { title: "Performance", key: "performance" },
  { title: "Consumption", key: "consumption" },
  { title: "Safety Equipments", key: "safety_equipments" },
  { title: "Exterior Equipments", key: "exterior_equipments" },
  { title: "Interior Equipments", key: "interior_equipments" },
  { title: "Functional Equipments", key: "functional_equipments" },
];

const CarComparisonPage = () => {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleChangeMake = (value) => {
    setSelectedMake(value);
    console.log(`selected ${value}`);
  };

  const handleChangeModel = (value) => {
    setSelectedModel(value);
    console.log(`selected ${value}`);
  };

  const handleChangeVariant = (value) => {
    setSelectedVariant(value);
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    pb.collection("brands")
      .getFullList({ requestKey: null })
      .then((res) => setBrands(res));
    pb.collection("models")
      .getFullList({ requestKey: null, expand: "brand" })
      .then((res) => setModels(res));
  }, []);

  useEffect(() => {
    if (selectedMake !== null && selectedModel !== null && selectedVariant !== null) {
      if (selectedModel === "Q3") {
        handleAdd(car1);
      }
      if (selectedModel === "Q5") {
        handleAdd(car2);
      }
      if (selectedModel === "A4") {
        handleAdd(car3);
      }
      setSelectedMake(null);
      setSelectedModel(null);
      setSelectedVariant(null);
    }
  }, [selectedMake, selectedModel, selectedVariant]);

  function handleRemove(idx) {
    let _data = [...cars].filter((_, i) => {
      return idx !== i;
    });
    setCars(_data);
  }

  function handleAdd(data) {
    let _data = [...cars, data];
    setCars(_data);
  }

  const modelOptions = models
    .filter((val) => selectedMake === val.expand.brand.name)
    .map((item) => ({ value: item.name, label: item.name }));

  console.log(modelOptions);

  const variantOptions = () => {
    if (selectedModel === "Q3") {
      return [{ label: "35 TFSI Advanced S-tronic", value: "35 TFSI Advanced S-tronic" }];
    }
    if (selectedModel === "Q5") {
      return [{ label: "40 TDI quattro S-tronic", value: "40 TDI quattro S-tronic" }];
    }
    if (selectedModel === "A4") {
      return [{ label: "35 TDI Business Quattro", value: "35 TDI Business Quattro" }];
    }
    return [];
  };

  return (
    <Container>
      <Gap height={20} />

      <Row
        gutter={16}
        style={{
          marginBottom: 24,
          position: "sticky",
          top: 90,
          background: "white",
          zIndex: 10,
        }}
      >
        <Col span={6}></Col>

        {cars.map((car, idx) => (
          <Col span={6} key={idx}>
            <Card bordered={false} style={{ boxShadow: "none" }}>
              <img style={{ width: "100%", objectFit: "contain" }} alt={car.variant} src={car.image} />
              <Title level={4}>{`${car.make} ${car.model}`}</Title>
              <Title level={5}>{`${car.variant}`}</Title>
              <Button
                style={{ position: "absolute", top: 5, right: 5 }}
                icon={<DeleteOutlined />}
                type="primary"
                danger
                onClick={() => handleRemove(idx)}
              />
            </Card>
          </Col>
        ))}
        {cars.length < 3 && (
          <Col span={6}>
            <Card bordered={false} style={{ boxShadow: "none" }}>
              <Flex align="center" justify="start" gap={10} wrap="wrap" style={{ paddingTop: 20, paddingBottom: 10 }}>
                <Select
                  value={selectedMake}
                  placeholder="Select Make"
                  showSearch
                  onChange={handleChangeMake}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: "100%" }}
                  options={brands.map((item) => ({ value: item.name, label: item.name }))}
                />
                <Select
                  value={selectedModel}
                  placeholder="Select Model"
                  showSearch
                  onChange={handleChangeModel}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: "100%" }}
                  options={modelOptions}
                />
                <Select
                  value={selectedVariant}
                  placeholder="Select Model"
                  showSearch
                  onChange={handleChangeVariant}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  style={{ width: "100%" }}
                  options={variantOptions()}
                />
              </Flex>
            </Card>
          </Col>
        )}
      </Row>

      {sections.map((section) => (
        <div key={section.title} style={{ marginBottom: 32 }}>
          <Divider orientation="left">{section.title}</Divider>
          {(car1[section.key] || []).map((spec, index) => (
            <Row key={spec.label} gutter={16} style={{ marginBottom: 12 }}>
              <Col span={6}>
                <Text style={{ textTransform: "capitalize" }} strong>
                  {spec.label.replaceAll("_", " ")}
                </Text>
              </Col>
              {cars.map((c, ci) => (
                <Col key={c.id ?? ci} span={6}>
                  <Text>{c[section.key][index]?.value || "-"}</Text>
                </Col>
              ))}
            </Row>
          ))}
        </div>
      ))}
    </Container>
  );
};

export default CarComparisonPage;
