"use client";

import { ContainerOutlined, SettingOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Flex, List, Typography } from "antd";
import Link from "next/link";
const { Text, Title } = Typography;

export default function page({ data }) {
  return (
    <>
      <Flex align="center" justify="space-between">
        <Title level={5} style={{ margin: 0 }}>
          Variants List
        </Title>
        <Button icon={<SwapOutlined />}>Add all to Compare</Button>
      </Flex>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={({ title, price }, index) => (
          <List.Item>
            <List.Item.Meta title={<VariantTitle {...{ title, price }} />} description={<Description />} />
          </List.Item>
        )}
      />
    </>
  );
}

const VariantTitle = ({ title, price }) => (
  <Flex align="center" justify="space-between">
    <Link href="/new/brand/model/variant">{title}</Link>
    <Text strong>{price}</Text>
  </Flex>
);

const Description = ({ index }) => (
  <Flex align="center" justify="space-between">
    <Button size="small" icon={<SettingOutlined />} type="text">
      Technical Sheet
    </Button>
    <Button size="small" icon={<ContainerOutlined />} type="text">
      Free Quote
    </Button>
    <Button size="small" icon={<SwapOutlined />} type="text">
      Add to Compare
    </Button>
  </Flex>
);
