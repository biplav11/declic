import { TitleSub } from "@/components/Common";
import { Container, Gap, capitalize } from "@/components/Utility";
import { getPages } from "@/utlls/request";
import { ArrowRightOutlined, BlockOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Row } from "antd";
import Link from "next/link";
import React from "react";

export default async function page() {
    const pages = await getPages();
    return (
        <Container>
            <Gap height={30} />
            <TitleSub {...{ title: "Guides List", hideLink: true }} />
            <Gap height={30} />
            <Row gutter={[20, 20]}>
                {pages.map((p) => (
                    <Col key={p.id} xs={24} md={16}>
                        <Link
                            href={`/guides/${p.slug}`}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: 5,
                                padding: "20px 10px",
                                display: "block",
                            }}
                        >
                            <Flex align="center" justify="space-between">
                                <Flex gap={5}>
                                    <BlockOutlined />
                                    <span>{capitalize(p.name)}</span>
                                </Flex>
                                <ArrowRightOutlined />
                            </Flex>
                        </Link>
                    </Col>
                ))}
            </Row>
            <Gap height={30} />
        </Container>
    );
}
