import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Divider, Form, Input, InputNumber, Row, Select } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "src/Utility/function";
import { useNavigate, useParams } from "react-router-dom";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { getBrands, getModels, getSingleListing, getVariants } from "src/Redux/vehicles";
import { getSellers } from "src/Redux/users";

const STATE_OPTIONS = ["Used", "Like New", "Certified", "Available"];
const COLOR_OPTIONS = ["red", "blue", "green", "other"];

export default function EditListing() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { brands, models, variants } = useSelector((state) => state.vehicles);
  const { sellers } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const selectedBrand = Form.useWatch("brand", form);
  const selectedModel = Form.useWatch("model", form);
  const filteredVariants = selectedModel ? variants.filter((v) => v.model === selectedModel) : [];

  const api = useContext(NotificationContext);
  const [success, error] = notification(api, "update", "Listing");
  const [, deleteError] = notification(api, "delete", "Listing");

  useEffect(() => {
    (async () => {
      try {
        const [, , , record] = await Promise.all([
          dispatch(getBrands()),
          dispatch(getVariants()),
          dispatch(getSellers()),
          getSingleListing(id),
        ]);
        const brandId = record.expand?.model?.expand?.brand?.id;
        if (brandId) {
          await dispatch(getModels(brandId));
        }
        form.setFieldsValue({
          brand: brandId,
          title: record.title,
          state: record.state,
          price: record.price,
          year: record.year,
          mileage: record.mileage,
          address: record.address,
          phone: record.phone,
          model: record.model,
          variant: record.variant,
          user: record.user,
          interior_color: record.interior_color,
          exterior_color: record.exterior_color,
          interior_fabric: record.interior_fabric,
        });
      } catch (err) {
        deleteError();
      } finally {
        setLoading(false);
      }
    })();
  }, [id, dispatch, form, deleteError]);

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
        title: val.title?.trim(),
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
        interior_fabric: val.interior_fabric,
      };
      await pb.collection("listings").update(id, payload);
      success();
      navigate("/vehicles/listings");
    } catch (err) {
      error();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MainLayout selected="Listings" expanded="Vehicles" title="Edit Listing" clickfunction={null}>
      <Wrapper loading={loading} empty={false}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ padding: 20 }} disabled={submitting}>
          <Row gutter={30}>
            <Col xs={24}>
              <Form.Item label="Title" name="title" rules={[{ required: true }, { min: 2 }]}>
                <Input size="large" placeholder="eg Low mileage, one owner" />
              </Form.Item>
            </Col>
          </Row>

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
            <Col xs={8}>
              <Form.Item label="Interior Color" name="interior_color">
                <Select placeholder="Select color" size="large" options={COLOR_OPTIONS.map((c) => ({ value: c, label: c }))} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Exterior Color" name="exterior_color">
                <Select placeholder="Select color" size="large" options={COLOR_OPTIONS.map((c) => ({ value: c, label: c }))} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Interior Fabric" name="interior_fabric">
                <Select placeholder="Select fabric" size="large" options={COLOR_OPTIONS.map((c) => ({ value: c, label: c }))} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" size="large" style={{ width: "100%" }} htmlType="submit" loading={submitting}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>
    </MainLayout>
  );
}
