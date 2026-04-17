"use client";

import React from "react";
import { Form, Input, Button, Card, Typography, Flex } from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  GoogleCircleFilled,
  PhoneOutlined,
  HomeOutlined,
  FacebookFilled,
} from "@ant-design/icons";
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
          <Title level={3}>SIGNUP</Title>

          <Form name="login-form" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your full name!" }]}>
              <Input prefix={<UserOutlined />} placeholder="Enter your name" />
            </Form.Item>

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
              <Input prefix={<MailOutlined />} placeholder="Enter your name" />
            </Form.Item>

            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please enter your phone!" }]}>
              <Input prefix={<PhoneOutlined />} placeholder="Enter your phone" />
            </Form.Item>

            <Form.Item label="Address" name="address">
              <Input prefix={<HomeOutlined />} placeholder="Enter your name" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
            <Flex align="flex-start" justify="flex-start" gap="small" style={{ margin: "10px 0" }}>
              <span>Already have an account?</span>
              <Link href="/login">Login</Link>
            </Flex>
          </Form>
          <Flex align="center" justify="center" vertical gap={20}>
            <span>OR</span>

            <Button icon={<FacebookFilled />} block>
              Continue with Facebook
            </Button>
            <Button icon={<GoogleCircleFilled />} block>
              Continue with Google
            </Button>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
};

export default LoginPage;
