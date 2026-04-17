import MainLayout from "src/Components/Layouts/MainLayout";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Drawer, Flex, Form, Input, Popconfirm, Row, Select, Space, Table } from "antd";
import moment from "moment";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { countries } from "src/Utility/countries";
import { getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeFinanceLeadsLoading, getFinanceLeads } from "src/Redux/leads";
import { getStatusIcons } from "src/Utility/social";
import { statuses } from "src/Utility/variables";
import TextArea from "antd/es/input/TextArea";

const PREFIX_OPTIONS = ["Mr.", "Mrs.", "Ms."];
const TYPE_OPTIONS = ["Company", "Individual"];

const options = countries.map((m) => ({ label: `${m.alpha} (${m.code})`, value: m.code }));
const EditableContext = createContext(null);

export default function FinanceLeads() {
  const api = useContext(NotificationContext);
  const [success, error] = notification(api, "update", "Finance Leads");
  const [deleteSuccess, deleteError] = notification(api, "delete", "Finance Leads");

  const dispatch = useDispatch();
  const { financeLeadsLoading: dataLoading, financeLeads } = useSelector((state) => state.leads);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  function getData() {
    dispatch(getFinanceLeads());
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

  useEffect(() => {
    getData();
  }, []);

  async function handleSave({ id, status }) {
    dispatch(changeFinanceLeadsLoading(true));
    try {
      await pb.collection("finance_leads").update(id, { status });
      success();
      getData();
      dispatch(changeFinanceLeadsLoading(false));
    } catch (err) {
      error();
      dispatch(changeFinanceLeadsLoading(false));
    }
  }

  async function deleteConfirm(id) {
    dispatch(changeFinanceLeadsLoading(true));
    try {
      await pb.collection("finance_leads").delete(id);
      deleteSuccess();
      getData();
      dispatch(changeFinanceLeadsLoading(false));
    } catch (err) {
      deleteError();
      dispatch(changeFinanceLeadsLoading(false));
    }
  }

  //   Read Data
  const defaultColumns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_, { first_name, last_name, prefix, type }) => (
        <Flex vertical>
          <span>
            {prefix} {first_name} {last_name}
          </span>
          <small>{type}</small>
        </Flex>
      ),
      sorter: (a, b) => {
        let aName = `${a.first_name} ${a.last_name}`;
        let bName = `${b.first_name} ${b.last_name}`;
        return aName.localeCompare(bName);
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
      editable: true,
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
      render: (_, record) => {
        return (
          <Space>
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
            <Popconfirm {...getPopMessage("Finance Leads")} onConfirm={() => deleteConfirm(record.id)} okText="Yes" cancelText="No">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const data = financeLeads.map((r) => ({ key: r.id, ...r }));

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const expandable = {
    expandedRowRender: (record) => {
      return (
        <Row>
          <Col xs={8}>
            <h2>Loanee Info:</h2>
            {record.type === "Company" && (
              <>
                <p>Company Name: {record.company_name}</p>
                <p>Industry: {record.industry}</p>
              </>
            )}
            <p>Address: {record.address}</p>
            <p>State: {record.state}</p>
          </Col>
          <Col xs={8}>
            <h2>Finance Info:</h2>
            <p>Loan Amount: {record.loan_amount}</p>
            <p>Down Payment: {record.downpayment}</p>
            <p>Tenures: {record.tenure} years</p>
          </Col>
          <Col xs={8}>
            <h2>Remarks:</h2>
            <p>{record.remarks}</p>
          </Col>
        </Row>
      );
    },
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <MainLayout selected="Finance Leads" expanded="Leads" title="Finance Leads" clickfunction={openAdd}>
      <Wrapper loading={dataLoading} empty={financeLeads.length === 0}>
        <Table components={components} expandable={expandable} bordered columns={columns} dataSource={data} onChange={scrollTop} />
      </Wrapper>
      <FinanceLeadDrawer
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

function FinanceLeadDrawer({ open, record, onClose, onSaved, api }) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const isEdit = !!record;
  const [success, error] = notification(api, isEdit ? "update" : "create", "Finance Lead");
  const type = Form.useWatch("type", form);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (record) {
        form.setFieldsValue(record);
      }
    }
  }, [open, record, form]);

  async function handleSubmit(values) {
    setSaving(true);
    try {
      const payload = {
        ...values,
        loan_amount: values.loan_amount != null ? Number(values.loan_amount) : undefined,
        downpayment: values.downpayment != null ? Number(values.downpayment) : undefined,
        tenure: values.tenure != null ? Number(values.tenure) : undefined,
      };
      if (isEdit) {
        await pb.collection("finance_leads").update(record.id, payload);
      } else {
        await pb.collection("finance_leads").create(payload);
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
        {isEdit ? "Save Changes" : "Create Finance Lead"}
      </Button>
    </Flex>
  );

  return (
    <Drawer
      title={isEdit ? "Edit Finance Lead" : "Add Finance Lead"}
      placement="right"
      width={560}
      onClose={onClose}
      open={open}
      footer={footer}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Prefix" name="prefix">
              <Select options={PREFIX_OPTIONS.map((v) => ({ value: v, label: v }))} allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="First Name" name="first_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Last Name" name="last_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Type" name="type" rules={[{ required: true }]}>
              <Select options={TYPE_OPTIONS.map((v) => ({ value: v, label: v }))} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Select options={statuses.map((v) => ({ value: v, label: v }))} allowClear />
            </Form.Item>
          </Col>
        </Row>

        {type === "Company" && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Company Name" name="company_name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Industry" name="industry">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
              <Input placeholder="example@declic.com" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Country Code" name="country_code">
              <Select
                showSearch
                options={options}
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Phone" name="phone">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="State" name="state">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Loan Amount" name="loan_amount">
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Down Payment" name="downpayment">
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Tenure (years)" name="tenure">
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Remarks" name="remarks">
          <TextArea rows={3} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <Select
          ref={inputRef}
          style={{ width: 120 }}
          onChange={save}
          options={[
            { value: "Unfollowed", label: "Unfollowed" },
            { value: "Followed", label: "Followed" },
            { value: "Interested", label: "Interested" },
            { value: "Won", label: "Won" },
            { value: "Lost", label: "Lost" },
          ]}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
