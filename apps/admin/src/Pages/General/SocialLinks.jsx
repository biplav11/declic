import MainLayout from "src/Components/Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Input, Table } from "antd";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { EllipsisOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { notification } from "src/Utility/function";
import { pb } from "src/Utility/pocketbase";
import { NotificationContext } from "src/App";
import "react-quill/dist/quill.snow.css";
import { getSocialLinks, changeSocialLinksLoading } from "src/Redux/general";
import { getIcons } from "src/Utility/social";

export default function SocialLinks() {
  const [editOpen, setEditOpen] = useState(false);
  const [id, setId] = useState(null);
  const api = useContext(NotificationContext);

  const dispatch = useDispatch();
  const { socialLinksLoading: dataLoading, socialLinks } = useSelector((state) => state.general);

  function getData() {
    dispatch(changeSocialLinksLoading(true));
    dispatch(getSocialLinks());
  }

  useEffect(() => {
    getData();
  }, []);

  const iconStyle = { fontSize: 20 };

  //   Read Data
  const columns = [
    {
      title: "Platform",
      dataIndex: "platform",
      render: (_, { platform }) => (
        <Flex align="center" gap={10}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              width: 40,
              border: "1px solid #ddd",
              borderRadius: 30,
            }}
          >
            {getIcons(platform, iconStyle)}
          </span>
          <span>{platform}</span>
        </Flex>
      ),
    },
    {
      title: "Link",
      dataIndex: "link",
    },
    {
      title: <EllipsisOutlined />,
      dataIndex: "action",
      render: (text, record) => {
        return <Button onClick={() => handleEdit(record.id)} type="text" icon={<ArrowRightOutlined />} />;
      },
    },
  ];

  const data = socialLinks.map((r) => ({ key: r.id, ...r }));

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
    <MainLayout selected="Social Links" expanded="General" title="Social Links" clickfunction={null}>
      <Wrapper loading={dataLoading} empty={socialLinks.length === 0}>
        <Table onRow={rowEvent} bordered columns={columns} dataSource={data} onChange={scrollTop} />
        <EditUser {...{ editOpen, setEditOpen, id, socialLinks, api, getData }} />
        <button onClick={() => dispatch(changeSocialLinksLoading(true))}>test btn</button>
      </Wrapper>
    </MainLayout>
  );
}

function EditUser({ editOpen, setEditOpen, id, socialLinks, api, getData }) {
  const [editForm] = Form.useForm();
  const [editRecord, setEditRecord] = useState();

  function closeDrawer() {
    setEditOpen(false);
    editForm.resetFields();
  }

  async function handleSubmit(val) {
    let values = Object.fromEntries(Object.entries(val).filter(([v]) => val[v] != (null || "" || 0 || undefined)));
    let [success, error] = notification(api, "update", "Social Links");
    try {
      await pb.collection("social_links").update(editRecord?.id, values);
      success();
      setEditOpen(false);
      editForm.resetFields();
      getData();
    } catch (err) {
      error();
    }
  }

  useEffect(() => {
    let res = socialLinks[socialLinks.findIndex((e) => e.id === id)];
    editForm.setFieldsValue(res);
    setEditRecord(res);
  }, [id]);

  return (
    <Drawer forceRender title={`Edit Social Link`} placement="right" onClose={closeDrawer} open={editOpen}>
      <Form form={editForm} layout="vertical" onFinish={handleSubmit} style={{ position: "relative" }}>
        <Form.Item label={editRecord?.platform} name="link">
          <Input placeholder="eg. example@declic.com" />
        </Form.Item>
        {editRecord?.image && (
          <small style={{ color: "red", position: "relative", top: -15 }}>* This is an image so make sure you paste the image link.</small>
        )}

        <Form.Item>
          <Button type="default" size="large" style={{ width: "100%" }} htmlType="submit">
            Edit Settings
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
