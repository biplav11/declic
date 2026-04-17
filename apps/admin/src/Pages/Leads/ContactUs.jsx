import MainLayout from "src/Components/Layouts/MainLayout";
import { useEffect } from "react";
import { Button, Flex, Table } from "antd";
import moment from "moment";
import Wrapper from "src/Components/Common/Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { changeNewsletterLoading, getContactMessages } from "src/Redux/leads";

export default function ContactUs() {
  const dispatch = useDispatch();
  const { contactMessagesLoading: dataLoading, contactMessages } = useSelector((state) => state.leads);

  function getData() {
    dispatch(changeNewsletterLoading(true));
    dispatch(getContactMessages());
  }

  useEffect(() => {
    getData();
  }, []);

  //   Read Data
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created",
      dataIndex: "created",
      defaultSortOrder: "descend",
      render: (text, record) => <span>{moment(record.created).format("DD/MM/YYYY")}</span>,
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
    },
    {
      title: "Reply",
      dataIndex: "action",
      render: (text, record) => {
        const mailTo = () => (window.location.href = "mailto:" + record.email);
        const telTo = () => (window.location.href = "tel:" + record.phone);
        return (
          <Flex gap={20}>
            <Button type="text" icon={<MailOutlined />} onClick={mailTo} />
            <Button type="text" icon={<PhoneOutlined />} onClick={telTo} />
          </Flex>
        );
      },
    },
  ];

  const data = contactMessages.map((r) => ({ key: r.id, ...r }));

  function scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const expandable = {
    expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.message}</p>,
  };

  return (
    <MainLayout selected="Contact Us" expanded="Leads" title="Contact Us" clickfunction={null}>
      <Wrapper loading={dataLoading} empty={contactMessages.length === 0}>
        <Table bordered columns={columns} expandable={expandable} dataSource={data} onChange={scrollTop} />
      </Wrapper>
    </MainLayout>
  );
}
