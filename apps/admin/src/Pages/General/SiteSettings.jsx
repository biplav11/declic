import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Table, Upload } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ArrowRightOutlined, LoadingOutlined, UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { getBase64, getImages, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getSiteSettings, changeSiteSettingsLoading } from "src/Redux/general";

export default function SiteSettings() {
  const [editOpen, setEditOpen] = useState(false);
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { siteSettingsLoading: dataLoading, siteSettings } = useSelector((state) => state.general);

  function getData() {
    dispatch(changeSiteSettingsLoading(true));
    dispatch(getSiteSettings());
  }

  useEffect(() => {
    getData();
  }, []);

  //   Read Data
  const columns = [
    {
      title: "Label",
      dataIndex: "label",
    },
    {
      title: "Value",
      dataIndex: "value",
      render: (text, record) => {
        return record.image ? (
          <img src={record.value} style={{ maxWidth: 350 }} />
        ) : record.key === "mag_cover_description" ? (
          <div style={{ maxWidth: 450 }} dangerouslySetInnerHTML={{ __html: record.value }} />
        ) : (
          <span style={{ display: "inline-block", maxWidth: 350 }}>{record.value}</span>
        );
      },
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      render: (text, record) => {
        return <Button onClick={() => handleEdit(record.id)} type="text" icon={<ArrowRightOutlined />} />;
      },
    },
  ];

  const data = siteSettings.map((r) => ({ key: r.id, ...r }));

  function handleEdit(id) {
    setId(id);
    setEditOpen(true);
  }

  function rowEvent(record) {
    return {
      onClick: (event) => {
        event.preventDefault();
        handleEdit(record.id);
      },
    };
  }

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout selected="Site Settings" expanded="General" title="Site Settings" clickfunction={null}>
      <Wrapper loading={dataLoading} empty={siteSettings.length === 0}>
        <Table onRow={rowEvent} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <EditUser {...{ editOpen, setEditOpen, id, siteSettings, api, getData }} />
      </Wrapper>
    </MainLayout>
  );
}

function EditUser({ editOpen, setEditOpen, id, siteSettings, api, getData }) {
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState();
  const [value, setValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  function closeDrawer() {
    setEditOpen(false);
    editForm.resetFields();
  }

  function handleChange(info) {
    editForm.setFieldsValue({ image: info });
    getBase64(info.fileList[0].originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  }

  async function handleSubmit(val) {
    let values = Object.fromEntries(Object.entries(val).filter(([v]) => val[v] != (null || "" || 0 || undefined)));
    values = { value: values.value };
    let [success, error] = notification(api, "update", "settings");
    try {
      await pb.collection("site_settings").update(editRecord?.id, values);
      success();
      setEditOpen(false);
      editForm.resetFields();
      getData();
    } catch (err) {
      error();
    }
  }

  async function handleSubmitQuill() {
    let [success, error] = notification(api, "update", "settings");
    try {
      await pb.collection("site_settings").update(editRecord?.id, { value });
      setEditOpen(false);
      editForm.resetFields();
      getData();
      success();
    } catch (err) {
      error();
    }
  }

  async function handleSubmitImage(val) {
    if (imageUrl === editRecord.value) {
      return;
    }
    if (val.image) {
      let imageData = new FormData();
      imageData.append("image", val.image.file);
      const data = await pb.collection("images").create(imageData);
      let imgUrl = getImages(data.id, "images", data.image);
      let [success, error] = notification(api, "update", "settings");
      try {
        await pb.collection("site_settings").update(editRecord?.id, { value: imgUrl });
        success();
        setEditOpen(false);
        editForm.resetFields();
        getData();
      } catch (err) {
        error();
      }
    }
  }

  useEffect(() => {
    let res = siteSettings[siteSettings.findIndex((e) => e.id === id)];
    if (res?.image) {
      setImageUrl(res?.value);
    }
    if (res?.key === "mag_cover_description") {
      setValue(res?.value);
    } else {
      editForm.setFieldsValue({ value: res?.value });
    }
    setEditRecord(res);
  }, [id]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  if (editRecord?.key === "mag_cover_description") {
    return (
      <Drawer forceRender title={`Edit Site Settings`} placement="right" onClose={closeDrawer} open={editOpen}>
        <Form.Item label={editRecord?.label}>
          <ReactQuill style={{ height: 500, borderRadius: 8 }} theme="snow" value={value} onChange={setValue} />
        </Form.Item>
        <div style={{ height: 60 }} />
        <Button type="default" size="large" style={{ width: "100%" }} onClick={handleSubmitQuill}>
          Edit Settings
        </Button>
      </Drawer>
    );
  }

  if (editRecord?.image) {
    return (
      <Drawer forceRender title={`Edit Site Settings`} placement="right" onClose={closeDrawer} open={editOpen}>
        <Form form={editForm} layout="vertical" onFinish={handleSubmitImage} style={{ position: "relative" }}>
          <Form.Item name="image" label="Image" rules={imageUrl ? [] : [{ required: true }]}>
            <Upload
              name="image"
              listType="picture-circle"
              className="avatar-uploader-slider"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleChange}
              fileList={[]}
              accept="image/jpeg, image/*"
              style={{ width: "100%" }}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%", height: 100, objectFit: "contain" }} /> : uploadButton}
            </Upload>
            {imageUrl && (
              <Button onClick={() => setImageUrl(null)} size="small" type="default" icon={<CloseOutlined />} style={{ width: 100 }}>
                Remove
              </Button>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
              Edit Settings
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }

  return (
    <Drawer forceRender title={`Edit Site Settings`} placement="right" onClose={closeDrawer} open={editOpen}>
      <Form form={editForm} layout="vertical" onFinish={handleSubmit} style={{ position: "relative" }}>
        <Form.Item label={editRecord?.label} name="value">
          <Input placeholder="eg. example@declic.com" />
        </Form.Item>
        {editRecord?.image && (
          <small style={{ color: "red", position: "relative", top: -15 }}>* This is an image so make sure you paste the image link.</small>
        )}

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Settings
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
