"use client";

import React from "react";
import { Form, Input, Button, Card, Typography, Flex, Space, notification } from "antd";
import { LockOutlined, UserOutlined, FacebookFilled, GoogleCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Title } = Typography;

const LoginPage = () => {
  const router = useRouter();
  const onFinish = (values) => {
    let { email, password } = values;
    if (email === "admin@declic.com" && password === "123456") {
      localStorage.setItem("login", "true");
      router.push("/user");
    } else {
      notification.error({
        message: "Error",
        description: "Invalid credentials",
      });
    }
  };

  return (
    <div>
      <Flex align="center" justify="center">
        <Card style={{ border: 0, width: 400 }}>
          <Title level={3}>LOGIN</Title>

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

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Flex vertical align="flex-end" justify="flex-end" gap="middle">
              <Link href="/forgot">Forgot password?</Link>
              <span></span>
            </Flex>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>

            <Flex align="flex-start" justify="flex-start" gap="small" style={{ margin: "10px 0" }}>
              <span>Dont have an account?</span>
              <Link href="/signup">Signup</Link>
            </Flex>
          </Form>
          <Flex align="center" justify="center" vertical gap={20}>
            <span>OR</span>

            <Button icon={<FacebookFilled />} block>
              Login with Facebook
            </Button>
            <Button icon={<GoogleCircleFilled />} block>
              Login with Google
            </Button>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
};

export default LoginPage;
