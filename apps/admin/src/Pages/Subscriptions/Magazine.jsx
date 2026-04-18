import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import dayjs from "dayjs";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  HomeOutlined,
  MailOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { Text } from "src/Components/Common/Typography";
import { NotificationContext } from "src/App";
import {
  changeMagazineSubscriptionsLoading,
  getMagazines,
  getMagazineSubscriptions,
} from "src/Redux/subscriptions";
import TextArea from "antd/es/input/TextArea";

const DELIVERY_METHODS = [
  { value: "delivery", label: "Physical Delivery", icon: <HomeOutlined /> },
  { value: "email", label: "Email Copy", icon: <MailOutlined /> },
  { value: "whatsapp", label: "WhatsApp", icon: <WhatsAppOutlined /> },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "green" },
  { value: "paused", label: "Paused", color: "gold" },
  { value: "cancelled", label: "Cancelled", color: "default" },
  { value: "expired", label: "Expired", color: "red" },
];

function methodMeta(method) {
  return DELIVERY_METHODS.find((m) => m.value === method);
}

function statusMeta(status) {
  return STATUS_OPTIONS.find((s) => s.value === status) || { label: status, color: "default" };
}

export default function MagazineSubscriptions() {
  const api = useContext(NotificationContext);
  const dispatch = useDispatch();
  const { magazineSubscriptions, magazineSubscriptionsLoading: dataLoading } = useSelector(
    (state) => state.subscriptions
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [delSuccess, delError] = notification(api, "delete", "Magazine Subscription");

  function getData() {
    dispatch(changeMagazineSubscriptionsLoading(true));
    dispatch(getMagazineSubscriptions());
  }

  useEffect(() => {
    getData();
    dispatch(getMagazines());
  }, []);

  async function deleteConfirm(id) {
    try {
      dispatch(changeMagazineSubscriptionsLoading(true));
      await pb.collection("magazine_subscriptions").delete(id);
      delSuccess();
      getData();
    } catch (err) {
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
      title: "Subscriber",
      dataIndex: "name",
      render: (text, { email, phone }) => (
        <Flex vertical gap={2}>
          <Text>{text}</Text>
          <Text style={{ fontSize: 12, color: "#888" }}>{email || phone || "—"}</Text>
        </Flex>
      ),
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Magazine",
      dataIndex: "magazine",
      render: (_, { expand }) => {
        const mag = expand?.magazine;
        if (!mag) return <Text>—</Text>;
        return (
          <Flex vertical gap={2}>
            <Text>{mag.title || "Untitled"}</Text>
            {mag.field && (
              <Text style={{ fontSize: 12, color: "#888" }}>
                {moment(mag.field).format("MMM YYYY")}
              </Text>
            )}
          </Flex>
        );
      },
    },
    {
      title: "Method",
      dataIndex: "delivery_method",
      width: 180,
      filters: DELIVERY_METHODS.map((m) => ({ text: m.label, value: m.value })),
      onFilter: (value, record) => record.delivery_method === value,
      render: (m) => {
        const meta = methodMeta(m);
        return meta ? (
          <Tag icon={meta.icon}>{meta.label}</Tag>
        ) : (
          <Text>{m || "—"}</Text>
        );
      },
    },
    {
      title: "Destination",
      dataIndex: "destination",
      render: (_, record) => {
        if (record.delivery_method === "delivery") {
          const parts = [record.address, record.city, record.postal_code, record.country]
            .filter(Boolean)
            .join(", ");
          return <Text>{parts || "—"}</Text>;
        }
        if (record.delivery_method === "email") return <Text>{record.email || "—"}</Text>;
        if (record.delivery_method === "whatsapp") return <Text>{record.phone || "—"}</Text>;
        return <Text>—</Text>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      filters: STATUS_OPTIONS.map((s) => ({ text: s.label, value: s.value })),
      onFilter: (value, record) => record.status === value,
      render: (s) => {
        const meta = statusMeta(s);
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Period",
      dataIndex: "period",
      width: 180,
      render: (_, { start_date, end_date }) => (
        <Text style={{ fontSize: 12 }}>
          {start_date ? moment(start_date).format("DD/MM/YY") : "—"}
          {" → "}
          {end_date ? moment(end_date).format("DD/MM/YY") : "—"}
        </Text>
      ),
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      width: 110,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            {...getPopMessage("Magazine Subscription")}
            onConfirm={() => deleteConfirm(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = magazineSubscriptions.map((r) => ({ key: r.id, ...r }));

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout
      selected="Subscription"
      expanded="Magazine"
      title="Magazine Subscriptions"
      clickfunction={openAdd}
    >
      <Wrapper loading={dataLoading} empty={magazineSubscriptions.length === 0}>
        <Table bordered columns={columns} dataSource={data} onChange={scrollTop} />
      </Wrapper>
      <SubscriptionDrawer
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

function SubscriptionDrawer({ open, record, onClose, onSaved, api }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEdit = !!record;
  const { magazines } = useSelector((state) => state.subscriptions);
  const [success, error] = notification(
    api,
    isEdit ? "update" : "create",
    "Magazine Subscription"
  );

  const method = Form.useWatch("delivery_method", form);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        ...record,
        start_date: record.start_date ? dayjs(record.start_date) : null,
        end_date: record.end_date ? dayjs(record.end_date) : null,
      });
    } else {
      form.setFieldsValue({ status: "active", delivery_method: "email" });
    }
  }, [open, record, form]);

  async function handleSubmit(values) {
    setSaving(true);
    try {
      const payload = {
        ...values,
        start_date: values.start_date ? values.start_date.toISOString() : "",
        end_date: values.end_date ? values.end_date.toISOString() : "",
      };
      // Strip fields that aren't relevant to the selected method so stale values
      // don't carry over when switching delivery_method.
      if (values.delivery_method !== "delivery") {
        payload.address = "";
        payload.city = "";
        payload.postal_code = "";
        payload.country = "";
      }
      if (values.delivery_method !== "email") {
        payload.email = values.email || "";
      }
      if (values.delivery_method !== "whatsapp") {
        payload.phone = values.phone || "";
      }
      if (isEdit) {
        await pb.collection("magazine_subscriptions").update(record.id, payload);
      } else {
        await pb.collection("magazine_subscriptions").create(payload);
      }
      success();
      onSaved();
    } catch (err) {
      console.error("magazine subscription save failed:", err);
      const detail =
        err?.data?.message ||
        Object.entries(err?.data?.data || {})
          .map(([k, v]) => `${k}: ${v?.message || v?.code}`)
          .join("; ") ||
        err?.message ||
        "Unknown error";
      api.error({ message: "Save failed", description: detail });
      error();
    } finally {
      setSaving(false);
    }
  }

  const footer = (
    <Flex justify="end" gap={10}>
      <Button onClick={onClose}>Cancel</Button>
      <Button type="primary" loading={saving} onClick={() => form.submit()}>
        {isEdit ? "Save Changes" : "Create Subscription"}
      </Button>
    </Flex>
  );

  return (
    <Drawer
      title={isEdit ? "Edit Magazine Subscription" : "Add Magazine Subscription"}
      placement="right"
      width={560}
      onClose={onClose}
      open={open}
      footer={footer}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Magazine"
              name="magazine"
              rules={[{ required: true, message: "Select a magazine" }]}
            >
              <Select
                placeholder="Select magazine issue"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={magazines.map((m) => ({
                  value: m.id,
                  label: `${m.title || "Untitled"}${
                    m.field ? ` — ${moment(m.field).format("MMM YYYY")}` : ""
                  }`,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Subscriber Name"
              name="name"
              rules={[{ required: true, min: 2 }]}
            >
              <Input placeholder="eg. Jane Doe" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Delivery Method"
              name="delivery_method"
              rules={[{ required: true }]}
            >
              <Select
                options={DELIVERY_METHODS.map((m) => ({
                  value: m.value,
                  label: (
                    <Space>
                      {m.icon}
                      {m.label}
                    </Space>
                  ),
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
              <Select options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))} />
            </Form.Item>
          </Col>
        </Row>

        {method === "email" && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Email is required for email delivery" },
                  { type: "email" },
                ]}
              >
                <Input placeholder="subscriber@example.com" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {method === "whatsapp" && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="WhatsApp Number"
                name="phone"
                rules={[{ required: true, message: "Phone is required for WhatsApp delivery" }]}
              >
                <Input placeholder="+216 XX XXX XXX" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {method === "delivery" && (
          <>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Street Address"
                  name="address"
                  rules={[
                    { required: true, message: "Address is required for physical delivery" },
                  ]}
                >
                  <TextArea rows={2} placeholder="Street, apartment, etc." />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <Form.Item label="City" name="city">
                  <Input placeholder="eg. Tunis" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Postal Code" name="postal_code">
                  <Input placeholder="eg. 1000" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Country" name="country">
                  <Input placeholder="eg. Tunisia" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Backup Phone" name="phone">
                  <Input placeholder="Optional contact number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Backup Email" name="email" rules={[{ type: "email" }]}>
                  <Input placeholder="Optional backup email" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Start Date" name="start_date">
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="End Date" name="end_date">
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Notes" name="notes">
          <TextArea rows={3} placeholder="Internal notes about this subscription" />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
