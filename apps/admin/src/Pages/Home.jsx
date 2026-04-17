import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Row, Space, Statistic, Table, Tag } from "antd";
import {
  AppstoreAddOutlined,
  CarOutlined,
  FileAddOutlined,
  FileTextOutlined,
  FormOutlined,
  FunnelPlotOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import MainLayout from "src/Components/Layouts/MainLayout";
import { pb } from "src/Utility/pocketbase";
import { Text } from "src/Components/Common/Typography";
import { getCurrentRole, ROLE_SUPER } from "src/Utility/permissions";

const STAT_COL_PROPS = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };

async function countOnly(collection) {
  try {
    const res = await pb.collection(collection).getList(1, 1, { requestKey: null });
    return res.totalItems ?? 0;
  } catch {
    return 0;
  }
}

async function fetchBuiltInAdminCount() {
  try {
    const res = await pb.admins.getList(1, 1, { requestKey: null });
    return res.totalItems ?? 0;
  } catch {
    return 0;
  }
}

async function fetchRecentListings() {
  try {
    const res = await pb.collection("listings").getList(1, 5, {
      sort: "-created",
      expand: "model, model.brand",
      requestKey: null,
    });
    return res.items || [];
  } catch {
    return [];
  }
}

async function fetchRecentLeads() {
  try {
    const res = await pb.collection("leads").getList(1, 5, {
      sort: "-created",
      requestKey: null,
    });
    return res.items || [];
  } catch {
    return [];
  }
}

const listingColumns = [
  {
    title: "Title",
    dataIndex: "title",
    render: (v) => <Text>{v || "—"}</Text>,
  },
  {
    title: "Brand / Model",
    dataIndex: "model",
    render: (_, { expand }) => (
      <Text>
        {expand?.model?.expand?.brand?.name ? `${expand.model.expand.brand.name} — ` : ""}
        {expand?.model?.name || ""}
      </Text>
    ),
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
    width: 120,
    render: (v) => (v ? <Tag>{v}</Tag> : <Text>—</Text>),
  },
];

const leadColumns = [
  { title: "Name", dataIndex: "name", render: (v) => <Text>{v || "—"}</Text> },
  { title: "Email", dataIndex: "email", render: (v) => <Text>{v || "—"}</Text> },
  {
    title: "Created",
    dataIndex: "created",
    width: 180,
    render: (v) => <Text>{v ? new Date(v).toLocaleString() : "—"}</Text>,
  },
];

export default function Home() {
  const role = getCurrentRole();
  const isSuper = role === ROLE_SUPER;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentListings, setRecentListings] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const base = [
        countOnly("listings"),
        countOnly("variants"),
        countOnly("models"),
        countOnly("brands"),
        countOnly("news"),
        countOnly("leads"),
        countOnly("newsletter"),
        fetchRecentListings(),
        fetchRecentLeads(),
      ];
      const extras = isSuper
        ? [countOnly("users"), fetchBuiltInAdminCount()]
        : [Promise.resolve(0), Promise.resolve(0)];

      const [
        listings,
        variants,
        models,
        brands,
        news,
        leads,
        newsletter,
        listingsRecent,
        leadsRecent,
        users,
        admins,
      ] = await Promise.all([...base, ...extras]);

      if (cancelled) return;
      setStats({ listings, variants, models, brands, news, leads, newsletter, users, admins });
      setRecentListings(listingsRecent);
      setRecentLeads(leadsRecent);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [isSuper]);

  const statCards = [
    isSuper && { key: "users", title: "Users", value: stats.users, icon: <UserOutlined /> },
    isSuper && { key: "admins", title: "Admins", value: stats.admins, icon: <UserOutlined /> },
    { key: "listings", title: "Listings", value: stats.listings, icon: <CarOutlined /> },
    { key: "variants", title: "Variants", value: stats.variants, icon: <AppstoreAddOutlined /> },
    { key: "models", title: "Models", value: stats.models, icon: <AppstoreAddOutlined /> },
    { key: "brands", title: "Brands", value: stats.brands, icon: <AppstoreAddOutlined /> },
    { key: "news", title: "News Posts", value: stats.news, icon: <FileTextOutlined /> },
    { key: "leads", title: "Leads", value: stats.leads, icon: <FunnelPlotOutlined /> },
    { key: "newsletter", title: "Newsletter Subs", value: stats.newsletter, icon: <MailOutlined /> },
  ].filter(Boolean);

  return (
    <MainLayout title="Dashboard" selected="Dashboard" expanded="Dashboard" clickfunction={null}>
      <div style={{ padding: 20 }}>
        <Row gutter={[16, 16]}>
          {statCards.map((s) => (
            <Col {...STAT_COL_PROPS} key={s.key}>
              <Card loading={loading} bordered>
                <Statistic title={s.title} value={s.value ?? 0} prefix={s.icon} />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={14}>
            <Card title="Recent Listings" loading={loading} bordered>
              <Table
                size="small"
                columns={listingColumns}
                dataSource={recentListings.map((r) => ({ key: r.id, ...r }))}
                pagination={false}
                locale={{ emptyText: "No listings yet" }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Card title="Recent Leads" loading={loading} bordered>
              <Table
                size="small"
                columns={leadColumns}
                dataSource={recentLeads.map((r) => ({ key: r.id, ...r }))}
                pagination={false}
                locale={{ emptyText: "No leads yet" }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24}>
            <Card title="Quick Actions" bordered>
              <Space wrap>
                <Link to="/vehicles/listings/add">
                  <Button type="primary" icon={<CarOutlined />}>
                    Add Listing
                  </Button>
                </Link>
                <Link to="/news/posts/add">
                  <Button icon={<FileAddOutlined />}>Add News Post</Button>
                </Link>
                {isSuper && (
                  <Link to="/general/pages/add">
                    <Button icon={<FormOutlined />}>Add Page</Button>
                  </Link>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
