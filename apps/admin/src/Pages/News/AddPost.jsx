import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Flex, Form, Input, Modal, Row, Select, Switch, Upload } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { getNewsCategories } from "src/Redux/news";
import { capitalize, convertToSlug, getBase64, notification } from "src/Utility/function";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../../Components/Common/EditToolbar";
import { PlusOutlined, LoadingOutlined, CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";

export default function Categories() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.news);
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
  const [success, error] = notification(api, "create", "News Posts");
  const navigate = useNavigate();

  async function checkSlug(slug, id) {
    const rec = await pb.collection("news").getFullList({
      filter: `slug="${slug}"`,
    });
    return rec.length > 1 ? `${slug}-${id}` : slug;
  }

  async function getData() {
    dispatch(getNewsCategories());
    setLoading(false);
  }

  async function handleSubmit(val) {
    try {
      console.log(val);
      setLoading(true);
      const data = new FormData();
      if (val.gallery.fileList) {
        console.log("object.");
        val.gallery.fileList.forEach(async (img) => {
          data.append("gallery", img.originFileObj);
        });
      }

      if (val.thumbnail !== null) {
        data.append("thumbnail", val.thumbnail.file);
      }
      data.append("content", value);
      data.append("admin", pb.authStore.model.id);
      data.append("slug", convertToSlug(val.title.trim()));
      data.append("title", capitalize(val.title.trim()));
      Object.keys(val).forEach((key) => {
        if (key !== "gallery" && key !== "thumbnail" && key !== "content" && key !== "title") {
          data.append(key, val[key]);
        }
      });
      const res = await pb.collection("news").create(data);
      let slug = await checkSlug(convertToSlug(val.title.trim()), res.id);
      if (slug !== res.slug) {
        await pb.collection("news").update(res.id, {
          slug: slug,
        });
      }
      setTimeout(() => {
        setLoading(false);
        success();
        navigate("/news/posts");
      }, 1000);
    } catch (err) {
      console.log(err);
      error();
    }
  }

  function handleContentChange(val) {
    setValue(val);
    if (val === "<p><br></p>") {
      setShowError(true);
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

  return (
    <MainLayout selected="Posts" expanded="News" title="Add Post" clickfunction={null}>
      <Wrapper loading={loading} empty={false}>
        <Form form={editForm} layout="vertical" onFinish={handleSubmit} style={{ padding: 20 }}>
          <Row gutter={30}>
            <Col xs={16}>
              <Form.Item label="Title" name="title" rules={[{ required: true }, { min: 2 }]}>
                <Input size="large" placeholder="eg some Title" />
              </Form.Item>
              {/* <span style={{ marginBottom: 20, display: "block" }}>Slug : /{slug}</span> */}

              <Form.Item label="Category" name="category_id" rules={[{ required: true }, { min: 2 }]}>
                <Select placeholder="Select a category">
                  {categories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                      {capitalize(cat.name)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={8}>
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

          <Row>
            <Col xs={8}>
              <Form.Item label="Published" name="published">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Show in Home Page" name="featured">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label="Show in Magazine Category" name="show_in_scroller">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <label style={{ marginBottom: 10, display: "block" }}>
            <span style={{ color: "#ff4d4f" }}>*</span> Content
          </label>
          <EditorToolbar {...{ showError }} />
          <ReactQuill
            theme="snow"
            value={value}
            onChange={handleContentChange}
            placeholder={"Write something awesome..."}
            modules={modules}
            formats={formats}
            style={{ minHeight: 400, borderColor: "#ff4d4f" }}
            className={`custom-quill ${showError ? "error" : ""}`}
          />
          <span style={{ color: "#ff4d4f", minHeight: 20, display: "block" }}>{showError && "Please enter content"}</span>

          <div style={{ height: 20 }}></div>

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
              Add New Post
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>
    </MainLayout>
  );
}
