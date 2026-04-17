import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect } from "react";
import { Button, Flex, Popconfirm, Table, Tag } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getPopMessage, notification } from "src/Utility/function";
import { Link, useNavigate } from "react-router-dom";
import { pb } from "src/Utility/pocketbase";
import { Text } from "src/Components/Common/Typography";
import { NotificationContext } from "src/App";
import { changeListingsLoading, getListings } from "src/Redux/vehicles";

export default function Listings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listingsLoading: dataLoading, listings } = useSelector((state) => state.vehicles);
  const api = useContext(NotificationContext);
  let [delSuccess, delError] = notification(api, "delete", "listings");

  function getData() {
    dispatch(changeListingsLoading(true));
    dispatch(getListings());
  }

  async function deleteConfirm(id) {
    try {
      dispatch(changeListingsLoading(true));
      await pb.collection("listings").delete(id);
      delSuccess();
      getData();
    } catch (error) {
      delError();
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Brand / Model",
      dataIndex: "model",
      render: (_, { expand }) => (
        <Flex vertical gap={2}>
          <Text>{expand?.model?.expand?.brand?.name || "—"}</Text>
          <Text style={{ color: "#888", fontSize: 12 }}>{expand?.model?.name || ""}</Text>
        </Flex>
      ),
    },
    {
      title: "Variant",
      dataIndex: "variant",
      render: (_, { expand }) => <Text>{expand?.variant?.title || "—"}</Text>,
    },
    {
      title: "Year",
      dataIndex: "year",
      width: 90,
      render: (v) => <Text>{v || "—"}</Text>,
    },
    {
      title: "Mileage",
      dataIndex: "mileage",
      width: 120,
      render: (v) => <Text>{v || "—"}</Text>,
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 140,
      render: (v) => <Text>{v || "—"}</Text>,
    },
    {
      title: "State",
      dataIndex: "state",
      width: 110,
      render: (v) => (v ? <Tag>{v}</Tag> : <Text>—</Text>),
    },
    {
      title: "Seller",
      dataIndex: "user",
      render: (_, { expand }) => <Text>{expand?.user?.name || expand?.user?.email || "—"}</Text>,
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      width: 200,
      render: (_, record) => (
        <Flex gap={10} justify="space-between">
          <Link to={"/vehicles/listings/" + record.id}>
            <Button type="default" icon={<EditOutlined />}>
              Edit
            </Button>
          </Link>
          <Popconfirm {...getPopMessage("Listing")} onConfirm={() => deleteConfirm(record.id)} okText="Yes" cancelText="No">
            <Button type="default" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const data = listings.map((r) => ({ key: r.id, ...r }));

  function handleAdd() {
    navigate("/vehicles/listings/add");
  }

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <MainLayout selected="Listings" expanded="Vehicles" title="Listings" clickfunction={handleAdd}>
      <Wrapper loading={dataLoading} empty={listings.length === 0}>
        <Table bordered columns={columns} dataSource={data} onChange={scrollTop} />
      </Wrapper>
    </MainLayout>
  );
}
