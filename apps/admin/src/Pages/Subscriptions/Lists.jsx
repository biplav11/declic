import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, DatePicker, Drawer, Flex, Form, Input, Popconfirm, Space, Table } from "antd";
import moment from "moment";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeMagazinesLoading, getMagazines } from "src/Redux/subscriptions";

export default function MagazineLists() {
  const api = useContext(NotificationContext);
  const dispatch = useDispatch();
  const { magazines, magazinesLoading: dataLoading } = useSelector((state) => state.subscriptions);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [delSuccess, delError] = notification(api, "delete", "Magazine");

  function getData() {
    dispatch(changeMagazinesLoading(true));
    dispatch(getMagazines());
  }

  useEffect(() => {
    getData();
  }, []);

  async function deleteConfirm(id) {
    try {
      dispatch(changeMagazinesLoading(true));
      await pb.collection("magazine").delete(id);
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
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Issue Date",
      dataIndex: "field",
      render: (date) => (date ? moment(date).format("MMM YYYY") : "—"),
      sorter: (a, b) => new Date(a.field || 0) - new Date(b.field || 0),
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      width: 110,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            {...getPopMessage("Magazine")}
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

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout selected="Lists" expanded="Magazine" title="Magazine Issues" clickfunction={openAdd}>
      <Wrapper loading={dataLoading} empty={magazines.length === 0}>
        <Table bordered columns={columns} dataSource={magazines.map((record) => ({ key: record.id, ...record }))} onChange={scrollTop} />
      </Wrapper>
      <MagazineDrawer
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

function MagazineDrawer({ open, record, onClose, onSaved, api }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEdit = !!record;
  const [success, error] = notification(api, isEdit ? "update" : "create", "Magazine");

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        title: record.title,
        field: record.field ? moment(record.field) : null,
      });
    } else {
      form.setFieldsValue({ title: "", field: null });
    }
  }, [open, record, form]);

  async function handleSubmit(values) {
    setSaving(true);
    try {
      const payload = {
        title: values.title,
        field: values.field ? values.field.toISOString() : "",
      };
      if (isEdit) {
        await pb.collection("magazine").update(record.id, payload);
      } else {
        await pb.collection("magazine").create(payload);
      }
      success();
      onSaved();
    } catch (err) {
      error();
    } finally {
      setSaving(false);
    }
  }

  const footer = (
    <Flex justify="end" gap={10}>
      <Button onClick={onClose}>Cancel</Button>
      <Button type="primary" loading={saving} onClick={() => form.submit()}>
        {isEdit ? "Save Changes" : "Create Magazine"}
      </Button>
    </Flex>
  );

  return (
    <Drawer
      title={isEdit ? `Edit ${record?.title || "Magazine"}` : "Add Magazine Issue"}
      placement="right"
      width={520}
      onClose={onClose}
      open={open}
      footer={footer}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Title" name="title" rules={[{ required: true }, { min: 2 }]}> 
          <Input placeholder="Magazine title" />
        </Form.Item>
        <Form.Item label="Issue Date" name="field" rules={[{ required: true, message: "Select issue date" }]}> 
          <DatePicker picker="month" style={{ width: "100%" }} format="MMM YYYY" />
        </Form.Item>
        <Form.Item style={{ display: "none" }}>
          <Button id="submitMagazine" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
