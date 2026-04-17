import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CloseOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Flex, Input, Layout, Menu } from "antd";

import { pb } from "src/Utility/pocketbase";
import { Title } from "src/Components/Common/Typography";
import { LOGO_URL } from "src/Utility/variables";

import styles from "./MainLayout.module.scss";
import { getSideMenu } from "src/Utility/Menu";
import { getCurrentRole } from "src/Utility/permissions";

const { Header, Content, Sider } = Layout;
const { Search } = Input;

const App = ({ children, title = "Page Title", breadcrumb, selected = "Dashboard", expanded = "Dashboard", clickfunction = function () {} }) => {
  const navigate = useNavigate();

  const items = getSideMenu(navigate, getCurrentRole());

  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    pb.authStore.clear();
    navigate("/login", { replace: true });
  }

  const mainClasses = collapsed ? `${styles.main} ${styles.collapsed}` : styles.main;
  const siderClasses = collapsed ? `${styles.sider} collapsedSider` : styles.sider;

  return (
    <Layout>
      <Header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src={LOGO_URL} />
        </Link>

        <Button onClick={handleLogout} icon={<LogoutOutlined />} type="text">
          Logout
        </Button>
      </Header>
      <Layout hasSider>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={200} className={siderClasses}>
          <Menu mode="inline" className={styles.siderMenu} items={items} defaultSelectedKeys={[selected]} defaultOpenKeys={[expanded]} />
        </Sider>
        <Layout className={mainClasses}>
          <Flex align="center" justify="space-between">
            <Title style={{ margin: "20px 0" }} level={3}>
              {title}
            </Title>
            {breadcrumb && breadcrumb.length > 0 && (
              <Breadcrumb className={styles.breadcrumb}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
            )}
            {clickfunction !== null && (
              <Button onClick={clickfunction} type="primary" icon={<PlusOutlined />}>
                New Record
              </Button>
            )}
          </Flex>
          {/* <Flex gap={10} align="center" style={{ marginBottom: 20 }}>
            <Search placeholder="Search model here...." allowClear onSearch={(val, _e, info) => console.log({ val, _e, info })} size="large" />
            <Button onClick={clickfunction} type="text" size="large" icon={<CloseOutlined />}>
              Reset Search
            </Button>
          </Flex> */}
          <Content className={styles.content}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;
