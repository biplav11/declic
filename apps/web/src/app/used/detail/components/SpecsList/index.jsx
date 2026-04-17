"use client";
import { Text } from "@/components/Common";
import { Flex, List } from "antd";

export default function index(props) {
    return (
        <List
            size="small"
            header={
                <div style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                    {props.header}
                </div>
            }
            dataSource={props.data}
            renderItem={(item) => (
                <List.Item style={{ padding: "8px 0" }}>
                    <List.Item.Meta title={item} />
                    <Text>value</Text>
                </List.Item>
            )}
        />
    );
}
