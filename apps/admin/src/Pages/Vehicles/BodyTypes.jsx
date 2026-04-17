import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Input, Popconfirm, Table, Upload } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ArrowRightOutlined, UploadOutlined, LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import { getBase64, getImages, getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeBodyTypesLoading, getBodyTypes } from "src/Redux/vehicles";
import moment from "moment";

export default function BodyTypes() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { bodyTypes, bodyTypesLoading: dataLoading } = useSelector((state) => state.vehicles);

  function getData() {
    dispatch(changeBodyTypesLoading(true));
    dispatch(getBodyTypes());
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
      title: "Name",
      dataIndex: "name",
      render: (_, { collectionName, id, image, name }) => (
        <Flex gap={10} align="center">
          <img style={{ height: 50, width: 50, objectFit: "contain" }} src={getImages(id, collectionName, image)} />
          <span>{name}</span>
        </Flex>
      ),
    },
    {
      title: "Updated",
      dataIndex: "updated",
      defaultSortOrder: "descend",
      render: (text, record) => <span>{moment(record.updated).format("DD/MM/YYYY")}</span>,
      sorter: (a, b) => new Date(a.updated) - new Date(b.updated),
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      render: (text, record) => {
        return <Button onClick={() => handleEdit(record.id)} type="text" icon={<ArrowRightOutlined />} />;
      },
    },
  ];

  const data = bodyTypes.map((r) => ({ key: r.id, ...r }));

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
    <MainLayout selected="Body Types" expanded="Vehicles" title="Body Types" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={bodyTypes.length === 0}>
        <Table onRow={rowEvent} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <AddUser {...{ addOpen, setAddOpen, api, getData, bodyTypes }} />
        <EditUser {...{ editOpen, setEditOpen, id, setId, bodyTypes, api, getData }} />
      </Wrapper>
    </MainLayout>
  );
}

function AddUser({ addOpen, setAddOpen, api, getData, bodyTypes }) {
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
    let createData = new FormData();
    for (var key in values) {
      if (key === "image") {
        createData.append("image", values.image.file);
      } else {
        createData.append(key, values[key]);
      }
    }
    const latestPosition = [...bodyTypes].sort((a, b) => b.position - a.position)[0]?.position;
    createData.append("position", latestPosition + 1);
    let [success, error] = notification(api, "create", "Body Types");
    try {
      await pb.collection("body_types").create(createData);
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
      Create Body Type
    </Button>
  );
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Drawer footer={footerAdd} title="Add New Body Type" placement="right" onClose={closeDrawer} open={addOpen}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ country_code: "+221" }}>
        <Form.Item name="image" label="Image" rules={[{ required: true }]}>
          <Upload
            id="avatarNew"
            name="image"
            listType="picture-circle"
            className="avatar-uploader"
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
        <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 2 }]}>
          <Input id="nameNew" size="large" placeholder="eg some body type" />
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

function EditUser({ editOpen, setEditOpen, id, bodyTypes, setId, api, getData }) {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState({ country_code: "+221" });

  async function deleteConfirm() {
    let [delSuccess, delError] = notification(api, "delete", "body types");
    try {
      await pb.collection("body_types").delete(id);
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
    if (values.position !== editRecord?.position) {
      let nextBT = await pb.collection("body_types").getFullList({ filter: `position=${values.position}` });
      if (nextBT.length > 0) {
        await pb.collection("body_types").update(nextBT[0].id, { position: editRecord.position });
      }
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
    let [editSuccess, editError] = notification(api, "update", "body Types");
    try {
      await pb.collection("body_types").update(editRecord?.id, userData);
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
    editForm.setFieldsValue({ image: info });
    getBase64(info.fileList[0].originFileObj, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  }

  useEffect(() => {
    let res = bodyTypes[bodyTypes.findIndex((e) => e.id === id)];
    res = { ...res }?.country_code ? { ...res } : { ...res, country_code: "+221" };
    editForm.setFieldsValue(res);
    setEditRecord(res);
    setImageUrl(getImages(res?.id, "body_types", res?.image));
  }, [id]);

  const footer = (
    <Popconfirm {...getPopMessage("Body Type")} onConfirm={deleteConfirm} okText="Yes" cancelText="No">
      <Button type="default" danger size="large" style={{ width: "100%" }}>
        Delete Body Type
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
            className="avatar-uploader"
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
        <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 2 }]}>
          <Input size="large" placeholder="eg some Title" />
        </Form.Item>

        <Form.Item label="Position" name="position" rules={[{ required: true }]}>
          <Input size="large" placeholder="eg position" />
        </Form.Item>

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Body Type
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
