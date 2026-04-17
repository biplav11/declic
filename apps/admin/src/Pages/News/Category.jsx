import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Input, Popconfirm, Table } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { convertToSlug, getPopMessage, notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import { changeCategoriesLoading, getNewsCategories } from "src/Redux/news";
import { Text } from "src/Components/Common/Typography";

export default function Categories() {
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { categories, categoriesLoading: dataLoading } = useSelector((state) => state.news);

  function getData() {
    dispatch(changeCategoriesLoading(true));
    dispatch(getNewsCategories());
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
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <span>{text.toUpperCase()}</span>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      render: (text) => <span>/{text}</span>,
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      render: (text, record) => {
        return <Button onClick={() => handleEdit(record.id)} type="text" icon={<ArrowRightOutlined />} />;
      },
    },
  ];

  const data = categories.map((r) => ({ key: r.id, ...r }));

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
    <MainLayout selected="Category" expanded="News" title="News Category" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={categories.length === 0}>
        <Table onRow={rowEvent} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <AddUser {...{ addOpen, setAddOpen, api, getData, categories }} />
        <EditUser {...{ editOpen, setEditOpen, id, setId, categories, api, getData }} />
      </Wrapper>
    </MainLayout>
  );
}

function AddUser({ addOpen, setAddOpen, api, getData, categories }) {
  const [slug, setSlug] = useState("");
  const [form] = Form.useForm();

  function closeDrawer() {
    setAddOpen(false);
    form.resetFields();
  }
  function handleAddUser() {
    document.getElementById("submitBtn").click();
  }

  async function handleSubmit(values) {
    const latestPosition = [...categories].sort((a, b) => b.position - a.position)[0]?.position;
    values = { ...values, position: latestPosition + 1, slug };
    let [success, error] = notification(api, "create", "category");
    try {
      await pb.collection("news_categories").create(values);
      success();
      setAddOpen(false);
      form.resetFields();
      getData();
    } catch (err) {
      error();
    }
  }

  function handleChange(v) {
    setSlug(convertToSlug(v.name));
  }

  const footerAdd = (
    <Button onClick={handleAddUser} type="default" size="large" style={{ width: "100%" }}>
      Create Category
    </Button>
  );

  return (
    <Drawer footer={footerAdd} title="Add New Category" placement="right" onClose={closeDrawer} open={addOpen}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} onValuesChange={handleChange}>
        <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 2 }]}>
          <Input id="nameNew" size="large" placeholder="eg some category" />
        </Form.Item>

        <Flex vertical>
          <Text strong>Slug</Text>
          <span>/{slug}</span>
        </Flex>

        <Form.Item style={{ display: "none" }}>
          <Button id="submitBtn" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

function EditUser({ editOpen, setEditOpen, id, categories, setId, api, getData }) {
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState({ country_code: "+221" });
  const [slug, setSlug] = useState("");

  async function deleteConfirm() {
    let [delSuccess, delError] = notification(api, "delete", "category");
    try {
      await pb.collection("news_categories").delete(id);
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
    setSlug("");
    setId(null);
  }

  function handleChange(v) {
    setSlug(convertToSlug(v.name));
  }

  async function handleSubmit(val) {
    let values = Object.fromEntries(Object.entries(val).filter(([v]) => val[v] != (null || "" || 0)));
    if (values.position !== editRecord?.position) {
      let nextBT = await pb.collection("news_categories").getFullList({ filter: `position=${values.position}` });
      if (nextBT.length > 0) {
        await pb.collection("news_categories").update(nextBT[0].id, { position: editRecord.position });
      }
    }
    let [editSuccess, editError] = notification(api, "update", "category");
    try {
      await pb.collection("news_categories").update(editRecord?.id, { ...values, slug });
      editSuccess();
      setEditOpen(false);
      editForm.resetFields();
      getData();
    } catch (error) {
      editError();
    }
  }

  useEffect(() => {
    let res = categories[categories.findIndex((e) => e.id === id)];
    res = { ...res }?.country_code ? { ...res } : { ...res, country_code: "+221" };
    editForm.setFieldsValue(res);
    setEditRecord(res);
    setSlug(res?.slug);
  }, [id]);

  const footer = (
    <Popconfirm {...getPopMessage("category")} onConfirm={deleteConfirm} okText="Yes" cancelText="No">
      <Button type="default" danger size="large" style={{ width: "100%" }}>
        Delete Category
      </Button>
    </Popconfirm>
  );

  return (
    <Drawer forceRender footer={footer} title={`Edit ${editRecord?.name}`} placement="right" onClose={closeDrawer} open={editOpen}>
      <Form form={editForm} layout="vertical" onFinish={handleSubmit} onValuesChange={handleChange}>
        <Form.Item label="Name" name="name" rules={[{ required: true }, { min: 2 }]}>
          <Input size="large" placeholder="eg some Title" />
        </Form.Item>

        <Flex vertical style={{ marginBottom: 20 }}>
          <Text strong>Slug</Text>
          <span>/{slug}</span>
        </Flex>

        <Form.Item label="Position" name="position" rules={[{ required: true }]}>
          <Input size="large" placeholder="eg 1,2,3,4" type="number" />
        </Form.Item>

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Category
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
