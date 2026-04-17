import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Switch } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { convertToSlug, notification } from "src/Utility/function";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../../Components/Common/EditToolbar";
import { useNavigate, useParams } from "react-router-dom";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";

export default function AddPages() {
  const [loading, setLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [value, setValue] = useState("");
  const [showError, setShowError] = useState(false);

  const api = useContext(NotificationContext);
  const [success, error] = notification(api, "update", "Pages");
  const navigate = useNavigate();

  const { id } = useParams();

  async function getData() {
    const singlePage = await pb.collection("pages").getOne(id);
    editForm.setFieldsValue({
      ...singlePage,
    });
    setValue(singlePage.content);
  }

  useEffect(() => {
    getData();
  }, []);

  async function checkSlug(slug, id) {
    const rec = await pb.collection("pages").getFullList({
      filter: `slug="${slug}"`,
    });
    return rec.length > 1 ? `${slug}-${id}` : slug;
  }

  async function handleSubmit(val) {
    try {
      setLoading(true);
      let slug = await checkSlug(convertToSlug(val.title.trim()), id);
      await pb.collection("pages").update(id, { ...val, content: value, slug });
      setTimeout(() => {
        setLoading(false);
        success();
        navigate("/general/pages");
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

  return (
    <MainLayout selected="Pages" expanded="General" title="Edit Pages" clickfunction={null}>
      <Wrapper loading={loading} empty={false}>
        <Form form={editForm} layout="vertical" onFinish={handleSubmit} style={{ padding: 20 }}>
          <Row gutter={30}>
            <Col xs={12}>
              <Form.Item label="Page Title" name="title" rules={[{ required: true }, { min: 2 }]}>
                <Input size="large" placeholder="eg some Title" />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item label="Nav Menu Name" name="name" rules={[{ required: true }, { min: 2 }]}>
                <Input size="large" placeholder="eg some Title" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={8}>
              <Form.Item label="Published" name="published">
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

          <Form.Item>
            <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
              Edit Page
            </Button>
          </Form.Item>
        </Form>
      </Wrapper>
    </MainLayout>
  );
}
