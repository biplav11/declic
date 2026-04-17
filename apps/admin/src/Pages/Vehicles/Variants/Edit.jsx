import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Divider, Flex, Form, Input, InputNumber, Modal, Row, Select, Upload } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { capitalize, convertToSlug, getBase64, getImages, notification } from "src/Utility/function";
import { PlusOutlined, LoadingOutlined, CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { getBrands, getModels, getSingleVariant } from "src/Redux/vehicles";
import { getFunctional, getInteriors, getOutdoor, getSafety } from "src/Redux/general";

export default function Variants() {
  const dispatch = useDispatch();
  const { brands, models } = useSelector((state) => state.vehicles);
  const { safety, interior, outdoor, functional } = useSelector((state) => state.general);
  const [loading, setLoading] = useState(true);
  const [editForm] = Form.useForm();
  const [value, setValue] = useState("");
  const [showError, setShowError] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const api = useContext(NotificationContext);
  const [success, error] = notification(api, "update", "Variants");
  const navigate = useNavigate();
  let { id } = useParams();

  async function getData() {
    dispatch(getBrands());
    dispatch(getSafety());
    dispatch(getInteriors());
    dispatch(getOutdoor());
    dispatch(getFunctional());
    const singlePost = await getSingleVariant(id);
    dispatch(getModels(singlePost.expand?.model?.expand?.brand?.id));
    editForm.setFieldsValue({
      ...singlePost,
      brand: singlePost.expand?.model?.expand?.brand?.id,
    });
    setImageUrl(getImages(singlePost?.id, singlePost.collectionName, singlePost?.thumbnail));
    const files = singlePost.gallery.map((img, i) => {
      return {
        uid: i + 1,
        name: img,
        status: "done",
        url: getImages(singlePost.id, singlePost.collectionId, img),
      };
    });
    setFileList(files);
    setLoading(false);
  }

  async function checkSlug(slug, id) {
    const rec = await pb.collection("news").getFullList({
      filter: `slug="${slug}"`,
    });
    return rec.length > 1 ? `${slug}-${id}` : slug;
  }

  async function handleSubmit(val) {
    try {
      setLoading(true);
      const data = new FormData();
      if (val.gallery.fileList) {
        val.gallery.fileList.forEach(async (img) => {
          if (!img.url) data.append("gallery", img.originFileObj);
        });
      }

      if (val.thumbnail !== null) {
        data.append("thumbnail", val.thumbnail.file ? val.thumbnail.file : val.thumbnail);
      } else {
        data.append("thumbnail", "");
      }

      val.safety.forEach((s) => {
        data.append("safety", s);
      });
      val.interior.forEach((i) => {
        data.append("interior", i);
      });
      val.outdoor.forEach((o) => {
        data.append("outdoor", o);
      });
      val.functional.forEach((f) => {
        data.append("functional", f);
      });
      data.append("content", value);
      data.append("slug", convertToSlug(val.title.trim()));
      data.append("title", capitalize(val.title.trim()));
      Object.keys(val).forEach((key) => {
        if (
          key !== "gallery" &&
          key !== "thumbnail" &&
          key !== "content" &&
          key !== "title" &&
          key !== "safety" &&
          key !== "interior" &&
          key !== "outdoor" &&
          key !== "functional"
        ) {
          data.append(key, val[key]);
        }
      });
      const res = await pb.collection("variants").update(id, data);
      let slug = await checkSlug(convertToSlug(val.title.trim()), id);
      if (slug !== res.slug) {
        await pb.collection("variants").update(id, {
          slug: slug,
        });
      }
      setTimeout(() => {
        setLoading(false);
        success();
        navigate("/vehicles/variants");
      }, 1000);
    } catch (err) {
      error();
      setLoading(false);
    }
  }

  function handleChangeUpload(info) {
    editForm.setFieldsValue({
      thumbnail: info,
    });
    getBase64(info.fileList[0].originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  }

  function handleRemoveUpload() {
    setImageUrl(null);
    editForm.setFieldsValue({
      thumbnail: null,
    });
  }

  const getNewBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getNewBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
  };

  useEffect(() => {
    getData();
  }, []);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const props = {
    name: "gallery",
    multiple: true,
    listType: "picture-card",
    onChange: (info) => {
      setFileList(info.fileList);
    },
    showUploadList: {
      showRemoveIcon: true,
      showPreviewIcon: true,
    },
    onPreview: handlePreview,
    /*eslint no-unused-vars: 0*/
    customRequest: ({ _, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    /*eslint no-unused-vars: 0*/
    fileList: fileList,
  };

  function handleContentChange(val) {
    dispatch(getModels(val));
  }

  return (
    <MainLayout selected="Variants" expanded="Vehicles" title="Add Variant" clickfunction={null}>
      <Wrapper loading={loading} empty={false}>
        <Form form={editForm} layout="vertical" onFinish={handleSubmit} style={{ padding: 20 }}>
          <Row gutter={30}>
            <Col xs={18}>
              <Form.Item label="Title" name="title" rules={[{ required: true }, { min: 2 }]}>
                <Input size="large" placeholder="eg some Title" />
              </Form.Item>
              <Row gutter={30}>
                <Col xs={8}>
                  <Form.Item label="Brand" name="brand">
                    <Select
                      placeholder="Select a Brand"
                      showSearch
                      style={{ width: "100%" }}
                      size="large"
                      filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                      options={brands.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      }))}
                      onChange={(val) => handleContentChange(val)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={8}>
                  <Form.Item label="Model" name="model">
                    <Select
                      placeholder="Select a Model"
                      showSearch
                      style={{ width: "100%" }}
                      size="large"
                      filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                      options={models.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={8}>
                  <Form.Item label="Year" name="year">
                    <InputNumber size="large" placeholder="eg 2024" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              {/* <span style={{ marginBottom: 20, display: "block" }}>Slug : /{slug}</span> */}
            </Col>
            <Col xs={6}>
              <Form.Item name="thumbnail" label="Thumbnail">
                <Upload
                  id="thumbnail_id"
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleChangeUpload}
                  fileList={[]}
                  accept="image/jpeg, image/*"
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: 100, height: 100, borderRadius: 10, objectFit: "cover" }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
                {imageUrl && (
                  <Button
                    onClick={handleRemoveUpload}
                    size="small"
                    type="text"
                    icon={<CloseOutlined />}
                    style={{ width: 102, position: "relative", top: -8 }}
                  >
                    Remove
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={30}>
            <Col xs={12}>
              <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                <InputNumber size="large" placeholder="eg 200000" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item label="Availability" name="availability">
                <Select placeholder="Select Availability" id="availability" size="large">
                  <Select.Option value="Available">Available</Select.Option>
                  <Select.Option value="Unavailable">Unavailable</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={30}>
            <Col xs={8}>
              <Form.Item label="Guarantee (Years)" name="guarantee" rules={[{ required: true }]}>
                <InputNumber size="large" placeholder="eg 1 " style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Number of Seats" name="seats" rules={[{ required: true }]}>
                <InputNumber size="large" placeholder="eg 5 " style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Number of Doors" name="doors" rules={[{ required: true }]}>
                <InputNumber size="large" placeholder="eg 1 " style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Energy" name="energy">
                <Select placeholder="Select Energy" id="energy" size="large">
                  <Select.Option value="Petrol">Petrol</Select.Option>
                  <Select.Option value="Deisel">Deisel</Select.Option>
                  <Select.Option value="Electric">Electric</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Transmission" name="transmission">
                <Select placeholder="Select Transmission" id="transmission" size="large">
                  <Select.Option value="Manual">Manual</Select.Option>
                  <Select.Option value="Automatic">Automatic</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item label="Safety Equipments" name="safety">
            <Select
              placeholder="Select Safety Equipments"
              showSearch
              style={{ width: "100%" }}
              size="large"
              mode="multiple"
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={safety.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Form.Item>

          <Divider />

          <Form.Item label="Outdoor Equipments" name="outdoor">
            <Select
              placeholder="Select Outdoor Equipments"
              showSearch
              style={{ width: "100%" }}
              size="large"
              mode="multiple"
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={outdoor.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Form.Item>

          <Divider />

          <Form.Item label="Interior Equipments" name="interior">
            <Select
              placeholder="Select Interior Equipments"
              showSearch
              style={{ width: "100%" }}
              size="large"
              mode="multiple"
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={interior.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Form.Item>

          <Divider />

          <Form.Item label="Functional Equipments" name="functional">
            <Select
              placeholder="Select Functional Equipments"
              showSearch
              style={{ width: "100%" }}
              size="large"
              mode="multiple"
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              options={functional.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Form.Item>

          <Divider />

          <Form.Item name="gallery" label="Image Gallery">
            <Upload.Dragger {...props} className="custom-class">
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Upload.Dragger>
          </Form.Item>

          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
            <Flex justify="center">
              <img
                alt="example"
                style={{
                  height: 300,
                  width: 300,
                  borderRadius: 10,
                  objectFit: "contain",
                }}
                src={previewImage}
              />
            </Flex>
          </Modal>

          <Form.Item>
            <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
              Update Variant
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>
    </MainLayout>
  );
}
