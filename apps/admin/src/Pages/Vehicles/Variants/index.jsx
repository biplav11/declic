import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect } from "react";
import { Avatar, Button, Flex, Popconfirm, Table } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getImages, getPopMessage, notification } from "src/Utility/function";
import { Link, useNavigate } from "react-router-dom";
import { pb } from "src/Utility/pocketbase";
import { Text } from "src/Components/Common/Typography";
import { NotificationContext } from "src/App";
import { changeVariantsLoading, getVariants } from "src/Redux/vehicles";

export default function Variants() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { variantsLoading: dataLoading, variants } = useSelector((state) => state.vehicles);
  const api = useContext(NotificationContext);
  let [delSuccess, delError] = notification(api, "delete", "variants");

  function getData() {
    dispatch(changeVariantsLoading(true));
    dispatch(getVariants());
  }

  async function deleteConfirm(id) {
    try {
      dispatch(changeVariantsLoading(true));
      await pb.collection("variants").delete(id);
      delSuccess();
      getData();
    } catch (error) {
      delError();
    }
  }

  useEffect(() => {
    getData();
  }, []);

  console.log(variants);

  //   Read Data
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text, { id, collectionId, thumbnail }) => {
        return (
          <Flex gap={10} align="center">
            <Avatar shape="square" size={64} src={getImages(id, collectionId, thumbnail) + "?thumb=100x100"} />
            <Flex vertical gap={5}>
              <Text>{text}</Text>
            </Flex>
          </Flex>
        );
      },
    },
    {
      title: "Brand",
      dataIndex: "brand",
      render: (_, { expand }) => {
        return (
          <Flex gap={10} align="center">
            <Flex vertical gap={5}>
              <Text>{expand?.model?.expand?.brand?.name}</Text>
            </Flex>
          </Flex>
        );
      },
    },
    {
      title: "Model",
      dataIndex: "model",
      render: (_, { expand }) => {
        return (
          <Flex gap={10} align="center">
            <Flex vertical gap={5}>
              <Text>{expand?.model?.name}</Text>
            </Flex>
          </Flex>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text) => <Text>{Number(text).toLocaleString("en-US", { style: "currency", currency: "DKR" })}</Text>,
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      width: 200,
      render: (_, record) => {
        return (
          <Flex gap={10} justify="space-between">
            <Link to={"/vehicles/variants/" + record.id}>
              <Button type="default" icon={<EditOutlined />}>
                Edit
              </Button>
            </Link>
            <Popconfirm {...getPopMessage("Variant")} onConfirm={() => deleteConfirm(record.id)} okText="Yes" cancelText="No">
              <Button type="default" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  const data = variants.map((r) => ({ key: r.id, ...r }));

  function handleAdd() {
    navigate("/vehicles/variants/add");
  }

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout selected="Vaint" expanded="Vehicles" title="Variants" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={variants.length === 0}>
        <Table bordered columns={columns} dataSource={data} onChange={scrollTop} />
      </Wrapper>
    </MainLayout>
  );
}
