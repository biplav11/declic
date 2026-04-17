import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect } from "react";
import { Button, Flex, Popconfirm, Table } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  InfoCircleFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getPopMessage, notification } from "src/Utility/function";
import { Link, useNavigate } from "react-router-dom";
import { pb } from "src/Utility/pocketbase";
import { Text } from "src/Components/Common/Typography";
import { NotificationContext } from "src/App";
import { changePagesLoading, getPages } from "src/Redux/general";

export default function Categories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pages, pagesLoading: dataLoading } = useSelector((state) => state.general);
  const api = useContext(NotificationContext);
  let [editSuccess, editError] = notification(api, "update", "Pages");

  function getData() {
    dispatch(changePagesLoading(true));
    dispatch(getPages());
  }

  async function deleteConfirm(id) {
    dispatch(changePagesLoading(true));
    await pb.collection("pages").delete(id);
    setTimeout(() => {
      getData();
    }, 1000);
  }

  async function quickAction(id, status) {
    try {
      dispatch(changePagesLoading(true));
      await pb.collection("pages").update(id, { published: !status });
      setTimeout(() => {
        editSuccess();
        getData();
      }, 1000);
    } catch (err) {
      editError();
    }
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
      render: (text, { published }) => {
        return (
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
        );
      },
    },
    {
      title: "Preview",
      dataIndex: "slug",
      render: (text) => <span>/{text}</span>,
    },
    {
      title: "Nav Menu Title",
      dataIndex: "name",
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      width: 200,
      render: (text, { id, published }) => {
        return (
          <Flex gap={10} justify="space-between">
            <Button
              type="text"
              danger={published}
              icon={!published ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              onClick={() => quickAction(id, published)}
            >
              {published ? "Unpublish" : "Publish"}
            </Button>
            <Link to={"/general/pages/" + id}>
              <Button type="default" icon={<EditOutlined />}>
                Edit
              </Button>
            </Link>
            <Popconfirm {...getPopMessage("Pages")} onConfirm={() => deleteConfirm(id)} okText="Yes" cancelText="No">
              <Button type="default" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  const data = pages.map((r) => ({ key: r.id, ...r }));

  function handleAdd() {
    navigate("/general/pages/add");
  }

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout selected="Pages" expanded="General" title="Pages" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={pages.length === 0}>
        <Table bordered columns={columns} dataSource={data} onChange={scrollTop} />
      </Wrapper>
    </MainLayout>
  );
}
