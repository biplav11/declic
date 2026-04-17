"use client";
import { Text } from "@/components/Common";
import { Flex, List } from "antd";

export default function index(props) {
  return (
    <List
      size="small"
      header={<div style={{ textTransform: "uppercase", fontWeight: 600 }}>{props.header}</div>}
      dataSource={props.data}
      renderItem={(item) => (
        <List.Item style={{ padding: "3px 0" }}>
          <List.Item.Meta title={item.label.replaceAll("_", " ")} className="specs-list" />
          <Text>{item.value}</Text>
        </List.Item>
      )}
    />
  );
}
