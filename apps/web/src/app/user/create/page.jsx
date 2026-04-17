"use client";
import { Container } from "@/components/Utility";
import { Button, Checkbox, Col, Divider, Flex, Form, Input, List, Row, Select } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import pb from "@/utlls/pocketbase";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

export default function Page() {
  const onFinish = (values) => {
    console.log(`selected ${values}`);
  };

  const initValues = {
    sale_type: "Regular Price",
  };

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [body, setBody] = useState([]);

  useEffect(() => {
    pb.collection("brands")
      .getFullList({ requestKey: null })
      .then((res) => setBrands(res));
    pb.collection("models")
      .getFullList({ requestKey: null })
      .then((res) => setModels(res));
    pb.collection("variants")
      .getFullList({ requestKey: null })
      .then((res) => setVariants(res));
    pb.collection("body_types")
      .getFullList({ requestKey: null })
      .then((res) => setBody(res));
  }, []);

  const props = {
    name: "file",
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Container>
      <Title level={3}>Create Your Ad</Title>

      <Form name="login-form" initialValues={initValues} onFinish={onFinish} layout="vertical">
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item name="brand" label="Brand" placeholder="Select brand" required rules={[{ required: true }]}>
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={brands.map((item) => ({ value: item.id, label: item.name }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="model" label="Model" placeholder="Select model" required rules={[{ required: true }]}>
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={models.map((item) => ({ value: item.id, label: item.name }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="variant"
              label="Variant"
              placeholder="Select variant"
              extra="Leave Empty if you don't know."
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={variants.map((item) => ({ value: item.id, label: item.title }))}
              ></Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider>
          <span style={{ fontSize: 12 }}>Vehicle Age</span>
        </Divider>
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item name="year" label="Year" placeholder="Select year" required rules={[{ required: true }]}>
              <Select
                options={Array.from({ length: 126 }, (_, i) => i + 1900)
                  .reverse()
                  .map((item) => ({
                    value: item,
                    label: item,
                  }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="milage" label="Mileage" placeholder="Select model" required rules={[{ required: true }]}>
              <Input type="number" suffix="KM" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>
          <span style={{ fontSize: 12 }}>Selling Price</span>
        </Divider>
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item
              name="sale_type"
              label="Sale Type"
              placeholder="Select sale type"
              required
              rules={[{ required: true }]}
            >
              <Select
                options={["Regular Price", "Under Lease", "Not cleared through Customs"].map((item) => ({
                  value: item,
                  label: item,
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="price" label="Price" placeholder="Enter your price" required rules={[{ required: true }]}>
              <Input type="number" suffix="KM" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>
          <span style={{ fontSize: 12 }}>Vehicle Location</span>
        </Divider>
        <Row gutter={20}>
          <Col xs={24} md={16}>
            <Form.Item
              name="address"
              label="Address"
              placeholder="Enter your address"
              required
              rules={[{ required: true }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="phone" label="Phone" placeholder="Enter your phone" required rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>
          <span style={{ fontSize: 12 }}>Technical Details</span>
        </Divider>
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item
              name="body"
              label="Body Type"
              placeholder="Select body type"
              required
              rules={[{ required: true }]}
            >
              <Select
                options={body.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="doors"
              label="Number of Doors"
              placeholder="Enter number of doors"
              required
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="seats"
              label="Number of Seats"
              placeholder="Enter number of seats"
              required
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="exterior_color"
              label="Exterior Color"
              placeholder="Enter exterior color"
              required
              rules={[{ required: true }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="energy" label="Energy" placeholder="Select energy" required rules={[{ required: true }]}>
              <Select
                options={["Petrol", "Disel", "Electric"].map((item) => ({
                  value: item,
                  label: item,
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="horsepower"
              label="Horsepower"
              placeholder="Enter horsepower"
              required
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="cylinder_capacity"
              label="Cylinder Capacity"
              placeholder="Enter cylinder capacity"
              required
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="transmission"
              label="Transmission"
              placeholder="Select year"
              required
              rules={[{ required: true }]}
            >
              <Select
                options={["Manual", "Automatic"].map((item) => ({
                  value: item,
                  label: item,
                }))}
              ></Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="interior_color"
              label="Interior Color"
              placeholder="Enter interior color"
              required
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>

          <Col xs={24} md={24}>
            <Form.Item name="safety" label="SAFETY EQUIPMENTS">
              <Row>
                {["ABS", "Front Airbags", "Side Airbags"].map((value, i) => (
                  <Col xs={12} md={6} key={i}>
                    <Checkbox value={value} style={{ lineHeight: "32px" }}>
                      {value}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Form.Item>
          </Col>

          <Col xs={24} md={24}>
            <Form.Item name="exterior" label="EXTERIOR EQUIPMENTS">
              <Row>
                {["Rear View Camera", "360 Camera", "Electric Trunk"].map((value, i) => (
                  <Col xs={12} md={6} key={i}>
                    <Checkbox value={value} style={{ lineHeight: "32px" }}>
                      {value}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Form.Item>
          </Col>

          <Col xs={24} md={24}>
            <Form.Item name="interior" label="INTERIOR EQUIPMENTS">
              <Row>
                {["Front Armrest", "Rear Armrest", "Head-up Display"].map((value, i) => (
                  <Col xs={12} md={6} key={i}>
                    <Checkbox value={value} style={{ lineHeight: "32px" }}>
                      {value}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Form.Item>
          </Col>

          <Col xs={24} md={24}>
            <Form.Item name="funcational" label="FUNCTIONAL EQUIPMENTS">
              <Row>
                {["Front Armrest", "Rear Armrest", "Head-up Display"].map((value, i) => (
                  <Col xs={12} md={6} key={i}>
                    <Checkbox value={value} style={{ lineHeight: "32px" }}>
                      {value}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Form.Item>
          </Col>
        </Row>

        <Divider>
          <span style={{ fontSize: 12 }}>Vehicle Photos</span>
        </Divider>

        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
          </p>
        </Dragger>

        <Flex justify="flex-end" style={{ marginTop: 20 }} gap={20}>
          <Button type="default">Cancel</Button>
          <Button type="primary" htmlType="submit">
            Create Ad
          </Button>
        </Flex>
      </Form>
    </Container>
  );
}
