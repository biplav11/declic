import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Input, Popconfirm, Select, Space, Table, Upload } from "antd";
import moment from "moment";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading, getDealers } from "src/Redux/users";
import { EllipsisOutlined, ArrowRightOutlined, PlusOutlined, LoadingOutlined, CloseOutlined } from "@ant-design/icons";
import Avatar from "src/Components/Common/Avatar";
import { countries } from "src/Utility/countries";
import { getBase64, getImages, getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { getBrands } from "src/Redux/vehicles";

const options = countries.map((m) => ({ label: `${m.alpha} (${m.code})`, value: m.code }));

export default function Dealers() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { dealersLoading: dataLoading, dealers } = useSelector((state) => state.user);
  const { brands } = useSelector((state) => state.vehicles);

  function getData() {
    dispatch(changeLoading(true));
    dispatch(getBrands());
    dispatch(getDealers());
  }

  useEffect(() => {
    getData();
  }, []);

  const brandOptions = brands.map((b) => ({ label: b.name, value: b.id }));

  //   Read Data
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <Flex align="center" gap={10}>
          <Avatar src={getImages(record.id, "users", record.avatar)} />
          {record.name}
        </Flex>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Brands",
      dataIndex: "brands",
      render: (text, record) => {
        return (
          <Flex align="center" gap={10}>
            {record?.expand?.brands?.length > 0 ? (
              <>
                {record?.expand?.brands?.map((r) => (
                  <Avatar key={r.id} shape="square" src={getImages(r.id, "brands", r.image)} />
                ))}
              </>
            ) : (
              <span>N/A</span>
            )}
          </Flex>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => {
        if (text == 0) {
          return <span>N/A</span>;
        }
        return (
          <span>
            {record.country_code} {text}
          </span>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "created",
      defaultSortOrder: "descend",
      render: (text, record) => <span>{moment(record.created).format("DD/MM/YYYY")}</span>,
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      render: (text, record) => {
        return <Button onClick={() => handleEdit(record.id)} type="text" icon={<ArrowRightOutlined />} />;
      },
    },
  ];

  const data = dealers.map((r) => ({ key: r.id, ...r }));

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
    <MainLayout selected="Dealers" expanded="Users" title="Dealers" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={dealers.length === 0}>
        <Table onRow={rowEvent} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <AddUser {...{ addOpen, setAddOpen, api, getData, brandOptions }} />
        <EditUser {...{ editOpen, setEditOpen, id, setId, dealers, api, getData, brandOptions }} />
      </Wrapper>
    </MainLayout>
  );
}

function AddUser({ addOpen, setAddOpen, api, getData, brandOptions }) {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("+221");
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
      if (key === "avatar") {
        if (values.avatar) {
          userData.append("avatar", values.avatar.file);
        }
      } else if (key === "brands") {
        values[key].map((b) => {
          userData.append("brands", b.toString());
        });
      } else {
        userData.append(key, values[key]);
      }
    }
    userData.append("verified", true);
    userData.append("role", "dealership");
    userData.append("passwordConfirm", values.password);
    let [success, error] = notification(api, "create", "dealer");
    try {
      await pb.collection("users").create(userData);
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
      Create Dealer
    </Button>
  );
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Drawer footer={footerAdd} title="Add New Dealer" placement="right" onClose={closeDrawer} open={addOpen}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ country_code: "+221" }}>
        <Form.Item name="avatar" label="Profile Image">
          <Upload
            id="avatarNew"
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleChange}
            fileList={[]}
            accept="image/jpeg, image/*"
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 100, height: 100, borderRadius: 50, objectFit: "cover" }} /> : uploadButton}
          </Upload>
          {imageUrl && (
            <Button onClick={() => setImageUrl(null)} size="small" type="default" icon={<CloseOutlined />} style={{ width: 100 }}>
              Remove
            </Button>
          )}
        </Form.Item>
        <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 5 }]}>
          <Input id="nameNew" size="large" placeholder="eg John Doe" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: "email" }]} autoComplete="false">
          <Input id="emailNew" placeholder="eg. example@declic.com" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }, { min: 8 }]}>
          <Input.Password id="passwordNew" placeholder="Enter password" autoComplete="false" />
        </Form.Item>

        <Form.Item label="Brands" name="brands">
          <Select id="brandsNew" placeholder="Select mulitple brands" showSearch options={brandOptions} mode="multiple" optionFilterProp="label" />
        </Form.Item>

        <Form.Item label="Phone">
          <Space.Compact>
            <Form.Item noStyle name="country_code">
              <Select
                id="countryCodeNew"
                placeholder="Country Code"
                showSearch
                style={{ width: 115 }}
                onChange={(v) => setCode(v)}
                defaultValue={code}
                options={options}
              />
            </Form.Item>
            <Form.Item name="phone">
              <Input id="phoneNew" placeholder="eg. 9876543210" style={{ width: 200 }} name="phone" type="number" />
            </Form.Item>
          </Space.Compact>
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

function EditUser({ editOpen, setEditOpen, id, dealers, setId, api, getData, brandOptions }) {
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("+221");
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState({ country_code: "+221" });

  async function deleteConfirm() {
    let [delSuccess, delError] = notification(api, "delete", "dealer");
    try {
      await pb.collection("users").delete(id);
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
      if (key === "avatar") {
        if (values.avatar.file) {
          userData.append("avatar", values.avatar.file);
        } else if (!imageUrl) {
          userData.append("avatar", "");
        } else {
          userData.delete("avatar");
        }
      } else if (key === "brands") {
        values[key].map((b) => {
          userData.append("brands", b.toString());
        });
      } else {
        userData.append(key, values[key]);
      }
    }
    let [editSuccess, editError] = notification(api, "update", "dealer");
    try {
      await pb.collection("users").update(editRecord?.id, userData);
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
    let res = dealers[dealers.findIndex((e) => e.id === id)];
    res = { ...res }?.country_code ? { ...res } : { ...res, country_code: "+221" };
    editForm.setFieldsValue(res);
    setEditRecord(res);
    setImageUrl(getImages(res?.id, "users", res?.avatar));
  }, [id]);

  const footer = (
    <Popconfirm {...getPopMessage("dealer")} onConfirm={deleteConfirm} okText="Yes" cancelText="No">
      <Button type="default" danger size="large" style={{ width: "100%" }}>
        Delete Dealer
      </Button>
    </Popconfirm>
  );
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Drawer forceRender footer={footer} title={`Edit ${editRecord?.name}`} placement="right" onClose={closeDrawer} open={editOpen}>
      <Form form={editForm} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="avatar" label="Profile Image">
          <div>
            <Upload
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleChange}
              fileList={[]}
              accept="image/jpeg, image/*"
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: 100, height: 100, borderRadius: 50, objectFit: "cover" }} />
              ) : (
                uploadButton
              )}
            </Upload>
            {imageUrl && (
              <Button onClick={() => setImageUrl(null)} size="small" type="default" icon={<CloseOutlined />} style={{ width: 100 }}>
                Remove
              </Button>
            )}
          </div>
        </Form.Item>

        <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 5 }]}>
          <Input size="large" placeholder="eg John Doe" />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: "email" }]}>
          <Input placeholder="eg. example@declic.com" />
        </Form.Item>

        <Form.Item label="Brands" name="brands">
          <Select id="brandsNew" placeholder="Select mulitple brands" showSearch options={brandOptions} mode="multiple" optionFilterProp="label" />
        </Form.Item>

        <Form.Item label="Phone">
          <Space.Compact>
            <Form.Item noStyle name="country_code">
              <Select defaultValue={code} placeholder="Tags Mode" showSearch style={{ width: 120 }} onChange={(v) => setCode(v)} options={options} />
            </Form.Item>
            <Form.Item name="phone">
              <Input placeholder="eg. example@declic.com" name="phone" type="number" />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Dealer
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
