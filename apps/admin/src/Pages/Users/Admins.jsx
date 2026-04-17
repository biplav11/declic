import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Input, Popconfirm, Switch, Table, Tag } from "antd";
import moment from "moment";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading, getAdmins } from "src/Redux/users";
import { EllipsisOutlined, EditOutlined, DeleteOutlined, CheckCircleTwoTone, MinusCircleOutlined } from "@ant-design/icons";
import { getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";

const ROLE = "super";

function showPbError(api, title, err) {
  console.error(`${title}:`, err, "data:", err?.data);
  const fieldErrors = Object.entries(err?.data?.data || {})
    .map(([k, v]) => `${k}: ${v?.message || v?.code}`)
    .join("; ");
  const detail = fieldErrors || err?.data?.message || err?.message || "Unknown error";
  api.error({ message: title, description: detail });
}

export default function Admins() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { adminsLoading: dataLoading, admins } = useSelector((state) => state.user);

  const [delSuccess, delError] = notification(api, "delete", "admin");

  function getData() {
    dispatch(changeLoading(true));
    dispatch(getAdmins());
  }

  useEffect(() => {
    getData();
  }, []);

  async function deleteConfirm(id) {
    try {
      await pb.collection("admins").delete(id);
      delSuccess();
      getData();
    } catch (err) {
      showPbError(api, "Delete admin failed", err);
      delError();
    }
  }

  function openAdd() {
    setEditingRecord(null);
    setDrawerOpen(true);
  }

  function openEdit(record) {
    setEditingRecord(record);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingRecord(null);
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <span>{text || "—"}</span>,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => <span>{text || "—"}</span>,
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Username",
      dataIndex: "username",
      render: (text) => <span>{text || "—"}</span>,
    },
    {
      title: "Verified",
      dataIndex: "verified",
      width: 100,
      render: (v) => (v ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <MinusCircleOutlined style={{ color: "#bbb" }} />),
      filters: [
        { text: "Verified", value: true },
        { text: "Not verified", value: false },
      ],
      onFilter: (value, record) => !!record.verified === value,
    },
    {
      title: "Created",
      dataIndex: "created",
      defaultSortOrder: "descend",
      render: (_, record) => <span>{moment(record.created).format("DD/MM/YYYY")}</span>,
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      width: 110,
      render: (_, record) => (
        <Flex gap={6}>
          <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm {...getPopMessage("Admin")} onConfirm={() => deleteConfirm(record.id)} okText="Yes" cancelText="No">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const data = admins.map((r) => ({ key: r.id, ...r }));

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout selected="Admins" expanded="Users" title="Admins" clickfunction={openAdd}>
      <Wrapper loading={dataLoading} empty={admins.length === 0}>
        <Table bordered columns={columns} dataSource={data} onChange={scrollTop} />
      </Wrapper>
      <AdminDrawer
        open={drawerOpen}
        record={editingRecord}
        onClose={closeDrawer}
        onSaved={() => {
          closeDrawer();
          getData();
        }}
        api={api}
      />
    </MainLayout>
  );
}

function AdminDrawer({ open, record, onClose, onSaved, api }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEdit = !!record;
  const [success] = notification(api, isEdit ? "update" : "create", "admin");

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        name: record.name,
        email: record.email,
        username: record.username,
        emailVisibility: !!record.emailVisibility,
        verified: !!record.verified,
      });
    } else {
      form.setFieldsValue({
        emailVisibility: true,
        verified: true,
      });
    }
  }, [open, record, form]);

  async function handleSubmit(values) {
    setSaving(true);
    try {
      const payload = {
        name: values.name?.trim() || "",
        email: values.email,
      };
      if (values.username?.trim()) payload.username = values.username.trim();
      if (values.password) {
        payload.password = values.password;
        payload.passwordConfirm = values.password;
      }
      if (!isEdit) {
        payload.role = ROLE;
      }
      if (values.verified !== undefined && (!record || record.verified !== values.verified)) {
        payload.verified = !!values.verified;
      }
      if (
        values.emailVisibility !== undefined &&
        (!record || record.emailVisibility !== values.emailVisibility)
      ) {
        payload.emailVisibility = !!values.emailVisibility;
      }
      if (isEdit) {
        await pb.collection("admins").update(record.id, payload);
      } else {
        await pb.collection("admins").create(payload);
      }
      success();
      onSaved();
    } catch (err) {
      showPbError(api, isEdit ? "Update admin failed" : "Create admin failed", err);
    } finally {
      setSaving(false);
    }
  }

  const footer = (
    <Flex justify="space-between" gap={10}>
      <div />
      <Flex gap={10}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" loading={saving} onClick={() => form.submit()}>
          {isEdit ? "Save Changes" : "Create Admin"}
        </Button>
      </Flex>
    </Flex>
  );

  return (
    <Drawer
      forceRender
      title={isEdit ? `Edit ${record?.email || "Admin"}` : "Add New Admin"}
      placement="right"
      width={520}
      onClose={onClose}
      open={open}
      footer={footer}
      extra={isEdit ? <Tag color="red">Super Admin</Tag> : null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Name" name="name" rules={[{ required: true, min: 2 }]}>
          <Input placeholder="eg. Jane Doe" />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: "email" }]}>
          <Input placeholder="eg. admin@declic.com" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          extra="Optional — auto-generated if left blank."
          rules={[{ min: 3, message: "At least 3 characters." }]}
        >
          <Input placeholder="jane.doe" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          extra={isEdit ? "Leave blank to keep the current password." : "Minimum 8 characters."}
          rules={[
            { required: !isEdit, message: "Password is required" },
            { min: 8, message: "Minimum 8 characters" },
          ]}
        >
          <Input.Password placeholder="Enter password" autoComplete="new-password" />
        </Form.Item>

        <Flex gap={24}>
          <Form.Item label="Verified" name="verified" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Email Visibility" name="emailVisibility" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Flex>
      </Form>
    </Drawer>
  );
}
