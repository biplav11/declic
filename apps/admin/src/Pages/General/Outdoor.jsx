import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeOutdoorLoading, getOutdoor } from "src/Redux/general";

export default function OutDoor() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { outdoorLoading: dataLoading, outdoor } = useSelector((state) => state.general);

  function getData() {
    dispatch(changeOutdoorLoading(true));
    dispatch(getOutdoor());
  }

  useEffect(() => {
    getData();
  }, []);

  //   Read Data
  const columns = [
    {
      title: "Title",
      dataIndex: "name",
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      render: (text, record) => {
        return <Button onClick={() => handleEdit(record.id)} type="text" icon={<ArrowRightOutlined />} />;
      },
    },
  ];

  const data = outdoor.map((r) => ({ key: r.id, ...r }));

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
    <MainLayout selected="Outdoor" expanded="General" title="Outdoor" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={outdoor.length === 0}>
        <Table onRow={rowEvent} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <AddUser {...{ addOpen, setAddOpen, api, getData }} />
        <EditUser {...{ editOpen, setEditOpen, id, setId, outdoor, api, getData }} />
      </Wrapper>
    </MainLayout>
  );
}

function AddUser({ addOpen, setAddOpen, api, getData }) {
  const [form] = Form.useForm();

  function closeDrawer() {
    setAddOpen(false);
    form.resetFields();
  }
  function handleAddUser() {
    document.getElementById("submitBtn").click();
  }

  async function handleSubmit(values) {
    let [success, error] = notification(api, "create", "outdoor");
    try {
      await pb.collection("outdoor").create(values);
      success();
      setAddOpen(false);
      form.resetFields();
      getData();
    } catch (err) {
      error();
    }
  }

  const footerAdd = (
    <Button onClick={handleAddUser} type="default" size="large" style={{ width: "100%" }}>
      Create Outdoor
    </Button>
  );
  return (
    <Drawer footer={footerAdd} title="Add New Outdoor" placement="right" onClose={closeDrawer} open={addOpen}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Title" name="name" rules={[{ required: true }, { min: 2 }]}>
          <Input id="titleNew" size="large" placeholder="eg some Title" />
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

function EditUser({ editOpen, setEditOpen, id, outdoor, setId, api, getData }) {
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState({ country_code: "+221" });

  async function deleteConfirm() {
    let [delSuccess, delError] = notification(api, "delete", "outdoor");
    try {
      await pb.collection("outdoor").delete(id);
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
    let [editSuccess, editError] = notification(api, "update", "outdoor");
    try {
      await pb.collection("outdoor").update(editRecord?.id, val);
      editSuccess();
      setEditOpen(false);
      editForm.resetFields();
      getData();
    } catch (error) {
      editError();
    }
  }

  useEffect(() => {
    let res = outdoor[outdoor.findIndex((e) => e.id === id)];
    editForm.setFieldsValue(res);
    setEditRecord(res);
  }, [id]);

  const footer = (
    <Popconfirm title="Delete User" description="Are you sure to delete this outdoor?" onConfirm={deleteConfirm} okText="Yes" cancelText="No">
      <Button type="default" danger size="large" style={{ width: "100%" }}>
        Delete Outdoor
      </Button>
    </Popconfirm>
  );

  return (
    <Drawer forceRender footer={footer} title={`Edit ${editRecord?.name}`} placement="right" onClose={closeDrawer} open={editOpen}>
      <Form form={editForm} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Title" name="name" rules={[{ required: true }, { min: 2 }]}>
          <Input size="large" placeholder="eg some Title" />
        </Form.Item>

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Outdoor
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
