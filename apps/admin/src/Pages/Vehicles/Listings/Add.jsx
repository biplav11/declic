import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Divider, Form, Input, InputNumber, Row, Select } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "src/Utility/function";
import { useNavigate } from "react-router-dom";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { getBrands, getModels, getVariants } from "src/Redux/vehicles";
import { getSellers } from "src/Redux/users";

const STATE_OPTIONS = ["Used", "Like New", "Certified", "Available"];
const COLOR_OPTIONS = ["red", "blue", "green", "other"];
const CONDITION_OPTIONS = ["new", "excellent", "good", "fair", "poor"];

const EQUIPMENT_COLLECTIONS = ["safety", "interior", "functional", "outdoor"];

async function loadEquipment() {
  const entries = await Promise.all(
    EQUIPMENT_COLLECTIONS.map(async (c) => [
      c,
      await pb.collection(c).getFullList({ sort: "name", requestKey: null }),
    ]),
  );
  return Object.fromEntries(entries);
}

export default function AddListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { brands, models, variants } = useSelector((state) => state.vehicles);
  const { sellers } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [equipment, setEquipment] = useState({ safety: [], interior: [], functional: [], outdoor: [] });
  const [form] = Form.useForm();
  const selectedBrand = Form.useWatch("brand", form);
  const selectedModel = Form.useWatch("model", form);
  const filteredVariants = selectedModel ? variants.filter((v) => v.model === selectedModel) : [];

  const api = useContext(NotificationContext);
  const [success, error] = notification(api, "create", "Listing");

  useEffect(() => {
    (async () => {
      const [, , , equip] = await Promise.all([
        dispatch(getBrands()),
        dispatch(getVariants()),
        dispatch(getSellers()),
        loadEquipment(),
      ]);
      setEquipment(equip);
      setLoading(false);
    })();
  }, [dispatch]);

  function handleBrandChange(brandId) {
    form.setFieldsValue({ model: undefined, variant: undefined });
    dispatch(getModels(brandId));
  }

  function handleModelChange() {
    form.setFieldsValue({ variant: undefined });
  }

  async function handleSubmit(val) {
    try {
      setSubmitting(true);
      const payload = {
        state: val.state,
        price: val.price,
        year: val.year,
        mileage: val.mileage,
        address: val.address,
        phone: val.phone,
        model: val.model,
        variant: val.variant,
        user: val.user,
        interior_color: val.interior_color,
        exterior_color: val.exterior_color,
        general_condition: val.general_condition,
        previous_owners: val.previous_owners,
        engine_displacement: val.engine_displacement,
        safety: val.safety || [],
        interior: val.interior || [],
        outdoor: val.outdoor || [],
        functional: val.functional || [],
      };
      await pb.collection("listings").create(payload);
      success();
      navigate("/vehicles/listings");
    } catch (err) {
      error();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MainLayout selected="Listings" expanded="Vehicles" title="Add Listing" clickfunction={null}>
      <Wrapper loading={loading} empty={false}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ padding: 20 }} disabled={submitting}>
          <Row gutter={30}>
            <Col xs={8}>
              <Form.Item label="Brand" name="brand">
                <Select
                  placeholder="Select a Brand"
                  showSearch
                  size="large"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={brands.map((b) => ({ value: b.id, label: b.name }))}
                  onChange={handleBrandChange}
                />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Model" name="model" rules={[{ required: true }]}>
                <Select
                  placeholder={selectedBrand ? "Select a Model" : "Pick a brand first"}
                  showSearch
                  size="large"
                  disabled={!selectedBrand}
                  notFoundContent={selectedBrand ? "No models for this brand" : null}
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={models.map((m) => ({ value: m.id, label: m.name }))}
                  onChange={handleModelChange}
                />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Variant" name="variant">
                <Select
                  placeholder={selectedModel ? "Select a Variant" : "Pick a model first"}
                  showSearch
                  size="large"
                  disabled={!selectedModel}
                  notFoundContent={selectedModel ? "No variants for this model" : null}
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={filteredVariants.map((v) => ({ value: v.id, label: v.title }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={30}>
            <Col xs={8}>
              <Form.Item label="Year" name="year" rules={[{ required: true }]}>
                <InputNumber size="large" placeholder="eg 2024" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Mileage" name="mileage">
                <Input size="large" placeholder="eg 45000 km" />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                <Input size="large" placeholder="eg 15000 TND" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={30}>
            <Col xs={12}>
              <Form.Item label="State" name="state">
                <Select placeholder="Select state" size="large" options={STATE_OPTIONS.map((s) => ({ value: s, label: s }))} />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item label="Seller" name="user">
                <Select
                  placeholder="Select a Seller"
                  showSearch
                  size="large"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={sellers.map((u) => ({ value: u.id, label: u.name || u.email }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={30}>
            <Col xs={12}>
              <Form.Item label="Address" name="address">
                <Input size="large" placeholder="eg Tunis, Tunisia" />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item label="Phone" name="phone">
                <Input size="large" placeholder="eg +216 XX XXX XXX" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={30}>
            <Col xs={12}>
              <Form.Item label="Interior Color" name="interior_color">
                <Select placeholder="Select color" size="large" options={COLOR_OPTIONS.map((c) => ({ value: c, label: c }))} />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item label="Exterior Color" name="exterior_color">
                <Select placeholder="Select color" size="large" options={COLOR_OPTIONS.map((c) => ({ value: c, label: c }))} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={30}>
            <Col xs={8}>
              <Form.Item label="General Condition" name="general_condition">
                <Select placeholder="Select condition" size="large" options={CONDITION_OPTIONS.map((c) => ({ value: c, label: c }))} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Previous Owners" name="previous_owners">
                <InputNumber size="large" min={0} placeholder="eg 1" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Engine Displacement (cm³)" name="engine_displacement">
                <InputNumber size="large" min={0} placeholder="eg 1600" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={30}>
            <Col xs={12}>
              <Form.Item label="Safety Equipment" name="safety">
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select safety features"
                  size="large"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={equipment.safety.map((r) => ({ value: r.id, label: r.name }))}
                />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item label="Outdoor Equipment" name="outdoor">
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select outdoor features"
                  size="large"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={equipment.outdoor.map((r) => ({ value: r.id, label: r.name }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={30}>
            <Col xs={12}>
              <Form.Item label="Interior Equipment" name="interior">
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select interior features"
                  size="large"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={equipment.interior.map((r) => ({ value: r.id, label: r.name }))}
                />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item label="Functional Equipment" name="functional">
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select functional features"
                  size="large"
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  options={equipment.functional.map((r) => ({ value: r.id, label: r.name }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" size="large" style={{ width: "100%" }} htmlType="submit" loading={submitting}>
              Add Listing
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>
    </MainLayout>
  );
}
