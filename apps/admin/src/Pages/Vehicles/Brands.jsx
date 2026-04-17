import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Input, Popconfirm, Table, Upload } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ArrowRightOutlined, UploadOutlined, LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import { getBase64, getImages, getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeBrandsLoading, getBrands } from "src/Redux/vehicles";
import moment from "moment";

export default function Brands() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { brands, brandsLoading: dataLoading } = useSelector((state) => state.vehicles);

  function getData() {
    dispatch(changeBrandsLoading(true));
    dispatch(getBrands());
  }

  useEffect(() => {
    getData();
  }, []);

  //   Read Data
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_, { collectionName, id, image, name }) => (
        <Flex gap={10} align="center">
          <img style={{ height: 50, width: 50, objectFit: "contain" }} src={getImages(id, collectionName, image)} />
          <span>{name}</span>
        </Flex>
      ),
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Updated",
      dataIndex: "updated",
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

  const data = brands.map((r) => ({ key: r.id, ...r }));

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
    <MainLayout selected="Brands" expanded="Vehicles" title="Brands" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={brands.length === 0}>
        <Table onRow={rowEvent} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <AddUser {...{ addOpen, setAddOpen, api, getData, brands }} />
        <EditUser {...{ editOpen, setEditOpen, id, setId, brands, api, getData }} />
      </Wrapper>
    </MainLayout>
  );
}

function AddUser({ addOpen, setAddOpen, api, getData }) {
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
    let [success, error] = notification(api, "create", "Brand");
    try {
      await pb.collection("brands").create(createData);
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
      Create Brand
    </Button>
  );
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Drawer footer={footerAdd} title="Add New Brand" placement="right" onClose={closeDrawer} open={addOpen}>
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
          <Input id="nameNew" size="large" placeholder="eg brand name" />
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

function EditUser({ editOpen, setEditOpen, id, brands, setId, api, getData }) {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState({ country_code: "+221" });

  async function deleteConfirm() {
    let [delSuccess, delError] = notification(api, "delete", "brand");
    try {
      await pb.collection("brands").delete(id);
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
    let [editSuccess, editError] = notification(api, "update", "brand");
    try {
      await pb.collection("brands").update(editRecord?.id, userData);
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
    let res = brands[brands.findIndex((e) => e.id === id)];
    res = { ...res }?.country_code ? { ...res } : { ...res, country_code: "+221" };
    editForm.setFieldsValue(res);
    setEditRecord(res);
    setImageUrl(getImages(res?.id, "brands", res?.image));
  }, [id]);

  const footer = (
    <Popconfirm {...getPopMessage("Brand")} onConfirm={deleteConfirm} okText="Yes" cancelText="No">
      <Button type="default" danger size="large" style={{ width: "100%" }}>
        Delete Brand
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

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Brand
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
