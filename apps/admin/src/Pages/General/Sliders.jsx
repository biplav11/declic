import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Input, Popconfirm, Select, Switch, Table, Upload } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ArrowRightOutlined, UploadOutlined, LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import { getBase64, getImages, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeSlidersLoading, getSliders } from "src/Redux/general";
import { alignmentOptions } from "src/Utility/variables";

export default function Sliders() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { slidersLoading: dataLoading, sliders } = useSelector((state) => state.general);

  function getData() {
    dispatch(changeSlidersLoading(true));
    dispatch(getSliders());
  }

  useEffect(() => {
    getData();
  }, []);

  //   Read Data
  const columns = [
    {
      title: "Position",
      dataIndex: "position",
      defaultSortOrder: "ascend",
      sorter: function (a, b) {
        return a.position - b.position;
      },
      editable: true,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (_, { title, subtitle }) => (
        <Flex gap={5} vertical>
          <span>{title}</span>
          <small>{subtitle}</small>
        </Flex>
      ),
    },

    {
      title: "Alignment",
      dataIndex: "alignment",
    },
    {
      title: "Image",
      dataIndex: "image",

      render: (_, { id, collectionId, image }) => <img src={getImages(id, collectionId, image)} style={{ maxWidth: 200 }} />,
    },
    {
      title: "Dark Text",
      dataIndex: "dark_text",
      render: (_, record) => <span>{record.dark_text.toString()}</span>,
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      render: (text, record) => {
        return <Button onClick={() => handleEdit(record.id)} type="text" icon={<ArrowRightOutlined />} />;
      },
    },
  ];

  const data = sliders.map((r) => ({ key: r.id, ...r }));

  function handleAdd() {
    setAddOpen(true);
  }

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
    <MainLayout selected="Sliders" expanded="General" title="Sliders" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={sliders.length === 0}>
        <Table onRow={rowEvent} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <AddUser {...{ addOpen, setAddOpen, api, getData, alignmentOptions, sliders }} />
        <EditUser {...{ editOpen, setEditOpen, id, setId, sliders, api, getData }} />
      </Wrapper>
    </MainLayout>
  );
}

function AddUser({ addOpen, setAddOpen, api, getData, sliders }) {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  function closeDrawer() {
    setAddOpen(false);
    form.resetFields();
    setImageUrl(null);
  }
  function handleAddUser() {
    document.getElementById("submitBtn").click();
  }

  function handleChange(info) {
    getBase64(info.fileList[0].originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  }

  async function handleSubmit(values) {
    let userData = new FormData();
    for (var key in values) {
      if (key === "image") {
        userData.append("image", values.image.file);
      } else {
        userData.append(key, values[key]);
      }
    }
    const latestPosition = [...sliders].sort((a, b) => b.position - a.position)[0]?.position;
    userData.append("position", latestPosition + 1);
    let [success, error] = notification(api, "create", "sliders");
    try {
      await pb.collection("sliders").create(userData);
      success();
      setAddOpen(false);
      form.resetFields();
      setImageUrl(null);
      getData();
    } catch (err) {
      error();
    }
  }

  const footerAdd = (
    <Button onClick={handleAddUser} type="default" size="large" style={{ width: "100%" }}>
      Create Slider
    </Button>
  );
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Drawer footer={footerAdd} title="Add New Slider" placement="right" onClose={closeDrawer} open={addOpen}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ country_code: "+221" }}>
        <Form.Item name="image" label="Image" rules={[{ required: true }]}>
          <Upload
            id="avatarNew"
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
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%", height: 100, objectFit: "cover" }} /> : uploadButton}
          </Upload>
          {imageUrl && (
            <Button onClick={() => setImageUrl(null)} size="small" type="default" icon={<CloseOutlined />} style={{ width: 100 }}>
              Remove
            </Button>
          )}
        </Form.Item>
        <Form.Item label="Title" name="title" rules={[{ required: true }, { min: 2 }]}>
          <Input id="titleNew" size="large" placeholder="eg some Title" />
        </Form.Item>
        <Form.Item label="Sub Title" name="subtitle" rules={[{ required: true }, { min: 2 }]}>
          <Input id="subTitleNew" size="large" placeholder="eg some sub title" />
        </Form.Item>
        <Form.Item label="Link" name="link" rules={[{ required: true }]}>
          <Input id="linkNew" size="large" placeholder="eg https://somelink" />
        </Form.Item>

        <Form.Item label="Alignment" name="alignment" rules={[{ required: true }]}>
          <Select id="alignmentNew" placeholder="Select Alignment" options={alignmentOptions} />
        </Form.Item>

        <Form.Item label="Dark Text" valuePropName="checked" name="dark_text">
          <Switch id="darkTextNew" />
        </Form.Item>

        <Form.Item style={{ display: "none" }}>
          <Button id="submitBtn" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

function EditUser({ editOpen, setEditOpen, id, sliders, setId, api, getData, alignmentOptions }) {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState({ country_code: "+221" });

  async function deleteConfirm() {
    let [delSuccess, delError] = notification(api, "delete", "slider");
    try {
      await pb.collection("sliders").delete(id);
      setEditOpen(false);
      setId(null);
      delSuccess();
      getData();
    } catch (err) {
      delError();
    }
  }
  function closeDrawer() {
    setEditOpen(false);
    editForm.resetFields();
  }
  async function handleSubmit(val) {
    let values = Object.fromEntries(Object.entries(val).filter(([v]) => val[v] != (null || "" || 0)));
    let anotherSlider = await pb.collection("sliders").getFullList({ filter: `position=${values.position}` });
    if (anotherSlider.length > 0) {
      await pb.collection("sliders").update(anotherSlider[0].id, { position: editRecord.position });
    }

    let userData = new FormData();
    for (var key in values) {
      if (key === "image") {
        if (values.image?.file) {
          userData.append("image", values.image.file);
        } else if (!imageUrl) {
          userData.append("image", "");
        } else {
          userData.delete("image");
        }
      } else {
        userData.append(key, values[key]);
      }
    }
    let [editSuccess, editError] = notification(api, "update", "slider");
    try {
      await pb.collection("sliders").update(editRecord?.id, userData);
      editSuccess();
      setEditOpen(false);
      editForm.resetFields();
      setImageUrl(null);
      getData();
    } catch (error) {
      editError();
    }
  }

  function handleChange(info) {
    editForm.setFieldsValue({ avatar: info });
    getBase64(info.fileList[0].originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  }

  useEffect(() => {
    let res = sliders[sliders.findIndex((e) => e.id === id)];
    res = { ...res }?.country_code ? { ...res } : { ...res, country_code: "+221" };
    editForm.setFieldsValue(res);
    setEditRecord(res);
    setImageUrl(getImages(res?.id, "sliders", res?.image));
  }, [id]);

  const footer = (
    <Popconfirm title="Delete User" description="Are you sure to delete this slider?" onConfirm={deleteConfirm} okText="Yes" cancelText="No">
      <Button type="default" danger size="large" style={{ width: "100%" }}>
        Delete Slider
      </Button>
    </Popconfirm>
  );
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Drawer forceRender footer={footer} title={`Edit ${editRecord?.name}`} placement="right" onClose={closeDrawer} open={editOpen}>
      <Form form={editForm} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="image" label="Image" rules={[{ required: true }]}>
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
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%", height: 100, objectFit: "cover" }} /> : uploadButton}
          </Upload>
          {imageUrl && (
            <Button onClick={() => setImageUrl(null)} size="small" type="default" icon={<CloseOutlined />} style={{ width: 100 }}>
              Remove
            </Button>
          )}
        </Form.Item>
        <Form.Item label="Title" name="title" rules={[{ required: true }, { min: 2 }]}>
          <Input size="large" placeholder="eg some Title" />
        </Form.Item>
        <Form.Item label="Sub Title" name="subtitle" rules={[{ required: true }, { min: 2 }]}>
          <Input size="large" placeholder="eg some sub title" />
        </Form.Item>
        <Form.Item label="Link" name="link" rules={[{ required: true }]}>
          <Input size="large" placeholder="eg https://somelink" />
        </Form.Item>
        <Form.Item label="Position" name="position" rules={[{ required: true }]}>
          <Input size="large" placeholder="eg 1,2,3" type="number" />
        </Form.Item>
        <Form.Item label="Alignment" name="alignment" rules={[{ required: true }]}>
          <Select placeholder="Select Alignment" options={alignmentOptions} />
        </Form.Item>
        <Form.Item label="Dark Text" valuePropName="checked" name="dark_text">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Slider
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
