import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import moment from "moment";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeNewsletterLoading, getNewsletter } from "src/Redux/leads";

export default function Newsletter() {
  const [addOpen, setAddOpen] = useState(false);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { newsletters, newslettersLoading: dataLoading } = useSelector((state) => state.leads);

  function getData() {
    dispatch(changeNewsletterLoading(true));
    dispatch(getNewsletter());
  }

  async function deleteConfirm(id) {
    let [delSuccess, delError] = notification(api, "delete", "newsletter");
    try {
      await pb.collection("newsletters").delete(id);
      delSuccess();
      getData();
    } catch (err) {
      delError();
    }
  }

  useEffect(() => {
    getData();
  }, []);

  //   Read Data
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
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
        return (
          <Popconfirm {...getPopMessage("Newsletter")} onConfirm={() => deleteConfirm(record.id)} okText="Yes" cancelText="No">
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        );
      },
    },
  ];

  const data = newsletters.map((r) => ({ key: r.id, ...r }));

  function handleAdd() {
    setAddOpen(true);
  }

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout selected="Newsletter" expanded="Leads" title="Newsletter" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={newsletters.length === 0}>
        <Table bordered columns={columns} dataSource={data} onChange={scrollTop} />
      </Wrapper>
      <AddUser {...{ addOpen, setAddOpen, api, getData }} />
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
    let [success, error] = notification(api, "create", "newsletter");
    try {
      await pb.collection("newsletters").create(values);
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
      Create Newsletter
    </Button>
  );
  return (
    <Drawer footer={footerAdd} title="Add New Newsletter" placement="right" onClose={closeDrawer} open={addOpen}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ country_code: "+221" }}>
        <Form.Item label="Email" name="email" rules={[{ required: true }, { type: "email" }]}>
          <Input id="emailNew" placeholder="eg. example@declic.com" autoComplete="false" />
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
