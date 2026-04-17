"use client";
import React from "react";
import { Divider, Flex, List, Typography } from "antd";
import Link from "next/link";
import { Text } from "@/components/Common";
import { BlockOutlined } from "@ant-design/icons";

const App = ({ data, selected }) => (
    <>
        <List
            size="large"
            // bordered
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    {item.slug === selected ? (
                        <Flex gap={10}>
                            <BlockOutlined />
                            <Text strong>{item.name.toUpperCase()}</Text>
                        </Flex>
                    ) : (
                        <Link href={`/guides/${item.slug}`}>
                            <Flex gap={10}>
                                <BlockOutlined />
                                {item.name.toUpperCase()}
                            </Flex>
                        </Link>
                    )}
                </List.Item>
            )}
        />
    </>
);
export default App;
