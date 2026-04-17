"use client";

import React from "react";
import { Form, Input, Button, Card, Typography, Flex, Space } from "antd";
import { LockOutlined, UserOutlined, FacebookFilled, GoogleCircleFilled } from "@ant-design/icons";
import Link from "next/link";

const { Title } = Typography;

const LoginPage = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <div>
      <Flex align="center" justify="center">
        <Card style={{ border: 0, width: 400 }}>
          <Title level={3}>FORGOT PASSWORD</Title>

          <Form name="login-form" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>

            <Flex align="flex-start" justify="flex-start" gap="small" style={{ margin: "10px 0" }}>
              <span>Dont have an account?</span>
              <Link href="/signup">Signup</Link>
            </Flex>
          </Form>
        </Card>
      </Flex>
    </div>
  );
};

export default LoginPage;
