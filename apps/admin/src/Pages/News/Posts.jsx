import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Avatar, Button, Drawer, Flex, Form, Popconfirm, Switch, Table } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, EditOutlined, DeleteOutlined, CheckCircleFilled, InfoCircleFilled } from "@ant-design/icons";
import { capitalize, getImages, getPopMessage, notification } from "src/Utility/function";
import { changePostsLoading, getNewsCategories, getPosts } from "src/Redux/news";
import { Link, useNavigate } from "react-router-dom";
import { pb } from "src/Utility/pocketbase";
import { Text } from "src/Components/Common/Typography";
import { NotificationContext } from "src/App";

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, postsLoading: dataLoading, posts } = useSelector((state) => state.news);
  const api = useContext(NotificationContext);
  const [id, setId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  function getData() {
    dispatch(changePostsLoading(true));
    dispatch(getNewsCategories());
    dispatch(getPosts());
  }

  async function deleteConfirm(id) {
    dispatch(changePostsLoading(true));
    await pb.collection("news").delete(id);
    setTimeout(() => {
      getData();
    });
  }

  async function quickAction(id) {
    setEditOpen(true);
    setId(id);
  }

  useEffect(() => {
    getData();
  }, []);

  //   Read Data
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: function (a, b) {
        return a.title - b.position;
      },
      filters: [
        { text: "Published", value: true },
        { text: "Unpublished", value: false },
      ],
      onFilter: (value, record) => record.published === value,
      render: (text, { published, id, collectionId, thumbnail }) => {
        return (
          <Flex gap={10} align="center">
            <Avatar shape="square" size={64} src={getImages(id, collectionId, thumbnail) + "?thumb=100x100"} />
            <Flex vertical gap={5}>
              <Text>{text}</Text>
              <>
                {published ? (
                  <small style={{ fontSize: 10 }}>
                    <CheckCircleFilled style={{ color: "#52c41a", marginRight: 5 }} />
                    <span>Published</span>
                  </small>
                ) : (
                  <small style={{ fontSize: 10 }}>
                    <InfoCircleFilled style={{ color: "#faad14", marginRight: 5 }} />
                    <span>Unpublished</span>
                  </small>
                )}
              </>
            </Flex>
          </Flex>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category_id",
      filters: [...categories].map((cat) => ({ text: capitalize(cat.name), value: cat.id })),
      onFilter: (value, record) => record.category_id.indexOf(value) === 0,
      render: (text, record) => <span>{capitalize(record.expand.category_id.name)}</span>,
    },
    {
      title: "Preview",
      dataIndex: "slug",
      render: (text) => <span>/{text}</span>,
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      width: 200,
      render: (text, record) => {
        return (
          <Flex gap={10} justify="space-between">
            <Button type="text" icon={<EditOutlined />} onClick={() => quickAction(record.id)}>
              Quick Edit
            </Button>
            <Link to={"/news/posts/" + record.id}>
              <Button type="default" icon={<EditOutlined />}>
                Edit
              </Button>
            </Link>
            <Popconfirm {...getPopMessage("News Post")} onConfirm={() => deleteConfirm(record.id)} okText="Yes" cancelText="No">
              <Button type="default" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  const data = posts.map((r) => ({ key: r.id, ...r }));

  function handleAdd() {
    navigate("/news/posts/add");
  }

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout selected="Posts" expanded="News" title="Posts" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={categories.length === 0}>
        <Table bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <EditUser {...{ editOpen, setEditOpen, id, setId, posts, api, getData }} />
      </Wrapper>
    </MainLayout>
  );
}

function EditUser({ editOpen, setEditOpen, id, api, getData, posts }) {
  const [editForm] = Form.useForm();
  const record = posts.find((e) => e.id === id);
  console.log(record);

  function closeDrawer() {
    setEditOpen(false);
    editForm.resetFields();
  }

  async function handleSubmit(val) {
    let [editSuccess, editError] = notification(api, "update", "News Post");
    try {
      await pb.collection("news").update(id, val);
      editSuccess();
      setEditOpen(false);
      editForm.resetFields();
      getData();
    } catch (error) {
      editError();
    }
  }

  useEffect(() => {
    editForm.setFieldsValue(record);
  }, [id]);

  return (
    <Drawer forceRender title={`Edit ${record?.title}`} placement="right" onClose={closeDrawer} open={editOpen}>
      <Form form={editForm} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Published" name="published">
          <Switch />
        </Form.Item>
        <Form.Item label="Show in Home Page" name="featured">
          <Switch />
        </Form.Item>
        <Form.Item label="Show in Magazine Category" name="show_in_scroller">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Quick Edit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
