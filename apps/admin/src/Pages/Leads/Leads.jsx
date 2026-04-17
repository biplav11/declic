import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Input, Popconfirm, Select, Space, Table } from "antd";
import moment from "moment";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { countries } from "src/Utility/countries";
import { getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeLeadsLoading, getLeads } from "src/Redux/leads";
import { getStatusIcons } from "src/Utility/social";
import { sources, statuses } from "src/Utility/variables";
import { Text } from "src/Components/Common/Typography";
import ListingCard from "src/Components/Common/ListingCard";
import TextArea from "antd/es/input/TextArea";

const options = countries.map((m) => ({ label: `${m.alpha} (${m.code})`, value: m.code }));

export default function Leads() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { leads, leadsLoading: dataLoading } = useSelector((state) => state.leads);

  function getData() {
    dispatch(changeLeadsLoading(true));
    dispatch(getLeads());
  }

  useEffect(() => {
    getData();
  }, []);

  //   Read Data
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_, { name, user_type }) => (
        <Flex vertical>
          <span>{name}</span>
          <small>{user_type}</small>
        </Flex>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Flex align="center" gap={10}>
          {getStatusIcons(s)}
          <span>{s}</span>
        </Flex>
      ),
      filters: statuses.map((s) => ({ text: s, value: s })),
      filterSearch: true,
      onFilter: (value, record) => record.status.includes(value),
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

  const data = leads.map((r) => ({ key: r.id, ...r }));

  function handleAdd() {
    setAddOpen(true);
  }

  function handleEdit(id) {
    setId(id);
    setEditOpen(true);
  }

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const expandable = {
    expandedRowRender: (record) => {
      return (
        <Flex gap={50}>
          <Flex vertical gap={15}>
            <Text strong>Vehicle for requested quote: </Text>
            <ListingCard {...record} />
          </Flex>
          <Flex vertical gap={15}>
            <Flex vertical>
              <Text strong>Source: </Text>
              <Text>{record.source}</Text>
            </Flex>
            <Flex vertical>
              <Text strong>Message: </Text>
              <Text>{record.message}</Text>
            </Flex>
          </Flex>
        </Flex>
      );
    },
  };

  return (
    <MainLayout selected="All Leads" expanded="Leads" title="All Leads" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={leads.length === 0}>
        <Table expandable={expandable} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <AddUser {...{ addOpen, setAddOpen, api, getData }} />
        <EditUser {...{ editOpen, setEditOpen, id, setId, leads, api, getData }} />
      </Wrapper>
    </MainLayout>
  );
}

function AddUser({ addOpen, setAddOpen, api, getData }) {
  const [code, setCode] = useState("+221");
  const [form] = Form.useForm();

  function closeDrawer() {
    setAddOpen(false);
    form.resetFields();
  }
  function handleAddUser() {
    document.getElementById("submitBtn").click();
  }

  async function handleSubmit(values) {
    let [success, error] = notification(api, "create", "lead");
    try {
      await pb.collection("leads").create(values);
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
      Create Lead
    </Button>
  );
  return (
    <Drawer footer={footerAdd} title="Add New Leads" placement="right" onClose={closeDrawer} open={addOpen}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ country_code: "+221" }}>
        <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 5 }]}>
          <Input id="nameNew" size="large" placeholder="eg John Doe" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: "email" }]}>
          <Input id="emailNew" placeholder="eg. example@declic.com" autoComplete="false" />
        </Form.Item>
        <Form.Item label="Phone">
          <Space.Compact>
            <Form.Item noStyle name="country_code">
              <Select
                id="countryCodeNew"
                placeholder="Country Code"
                showSearch
                style={{ width: 115 }}
                defaultValue={code}
                onChange={(v) => setCode(v)}
                options={options}
              />
            </Form.Item>
            <Form.Item name="phone">
              <Input id="phoneNew" placeholder="eg. 9876543210" style={{ width: 200 }} name="phone" type="number" />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item label="Message" name="message">
          <TextArea id="messageNew" placeholder="Type your message here..." rows={3} />
        </Form.Item>

        <Form.Item label="User Type" name="user_type">
          <Select placeholder="Select User Type" id="userTypeNew">
            <Select.Option value="Individual">Individual</Select.Option>
            <Select.Option value="Company">Company</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select placeholder="Select Status" id="statusNew">
            {statuses.map((m) => (
              <Select.Option key={m} value={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Source" name="source">
          <Select placeholder="Select Source" id="sourceNew">
            {sources.map((m) => (
              <Select.Option key={m} value={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Variant">
          <Select placeholder="Select Variant" id="variantNew">
            <Select.Option value="demo">Demo</Select.Option>
            <Select.Option value="Company">Company</Select.Option>
          </Select>
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

function EditUser({ editOpen, setEditOpen, id, leads, setId, api, getData }) {
  // const [code, setCode] = useState("+221");
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState({ country_code: "+221" });

  async function deleteConfirm() {
    let [delSuccess, delError] = notification(api, "delete", "lead");
    try {
      await pb.collection("leads").delete(id);
      setEditOpen(false);
      setId(null);
      delSuccess();
      getData();
    } catch (error) {
      delError();
    }
  }
  function closeDrawer() {
    setEditOpen(false);
    editForm.resetFields();
  }
  async function handleSubmit(val) {
    let values = Object.fromEntries(Object.entries(val).filter(([v]) => val[v] != (null || "" || 0)));

    let [editSuccess, editError] = notification(api, "update", "leads");
    try {
      await pb.collection("leads").update(editRecord?.id, values);
      editSuccess();
      setEditOpen(false);
      editForm.resetFields();
      getData();
    } catch (error) {
      editError();
    }
  }

  useEffect(() => {
    let res = leads[leads.findIndex((e) => e.id === id)];
    res = { ...res }?.country_code ? { ...res } : { ...res, country_code: "+221" };
    editForm.setFieldsValue(res);
    setEditRecord(res);
  }, [id]);

  const footer = (
    <Popconfirm {...getPopMessage("lead")} onConfirm={deleteConfirm} okText="Yes" cancelText="No">
      <Button type="default" danger size="large" style={{ width: "100%" }}>
        Delete Lead
      </Button>
    </Popconfirm>
  );

  return (
    <Drawer forceRender footer={footer} title={`Edit ${editRecord?.name}`} placement="right" onClose={closeDrawer} open={editOpen}>
      <Form form={editForm} layout="vertical" onFinish={handleSubmit}>
        {/* <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 5 }]}>
          <Input size="large" placeholder="eg John Doe" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: "email" }]}>
          <Input placeholder="eg. example@declic.com" autoComplete="false" />
        </Form.Item>
        <Form.Item label="Phone">
          <Space.Compact>
            <Form.Item noStyle name="country_code">
              <Select
                placeholder="Country Code"
                showSearch
                style={{ width: 115 }}
                defaultValue={code}
                onChange={(v) => setCode(v)}
                options={options}
              />
            </Form.Item>
            <Form.Item name="phone">
              <Input placeholder="eg. 9876543210" style={{ width: 200 }} name="phone" type="number" />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item label="Message" name="message">
          <TextArea placeholder="Type your message here..." rows={3} />
        </Form.Item> */}

        <Form.Item label="User Type" name="user_type">
          <Select placeholder="Select User Type">
            <Select.Option value="Individual">Individual</Select.Option>
            <Select.Option value="Company">Company</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select placeholder="Select Status">
            {statuses.map((m) => (
              <Select.Option key={m} value={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Source" name="source">
          <Select placeholder="Select Source">
            {sources.map((m) => (
              <Select.Option key={m} value={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item label="Variant">
          <Select placeholder="Select Variant">
            <Select.Option value="demo">Demo</Select.Option>
            <Select.Option value="Company">Company</Select.Option>
          </Select>
        </Form.Item> */}

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Lead
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
