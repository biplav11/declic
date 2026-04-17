"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { Button, Col, Flex, Row, Form, Input } from "antd";
import { EditOutlined } from "@ant-design/icons";
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

export default function User({ name, title, image }) {
  const [isEdit, setIsEdit] = useState(false);

  const intiValues = {
    name: "Biplav Sharma",
    email: "admin@declic.com",
    phone: "+1 9876543210",
    address: "2222 Some Street, City, State, Coutry",
  };
  const onFinish = (values) => {
    console.log("Success:", values);
    setIsEdit(false);
  };
  return (
    <Flex gap={30} vertical>
      <Flex className={styles.container} align="center" justify="space-between">
        <div className={styles.profile}>
          <div className={styles.image}>
            <img
              src={
                true
                  ? "https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=1365"
                  : "/images/user.png"
              }
              alt="User"
            />
          </div>
          <div className={styles.name}>
            <span>Biplav Sharma</span>
            <span>Individual</span>
          </div>
        </div>
        <Button
          onClick={() => {
            setIsEdit(!isEdit);
          }}
          disabled={isEdit}
          icon={<EditOutlined />}
        >
          Edit
        </Button>
      </Flex>

      <Flex className={styles.container} vertical>
        <span className={styles.title}>Personal information</span>
        {!isEdit ? (
          <div>
            <Row gutter={20}>
              <Col xs={24} md={8}>
                <span className={styles.label}>Name</span>
                <span className={styles.value}>Biplav Sharma</span>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24} md={8}>
                <span className={styles.label}>Phone</span>
                <span className={styles.value}>+1 9876543210</span>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24} md={8}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>admin@decliccar.com</span>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col xs={24}>
                <span className={styles.label}>Address</span>
                <span className={styles.value}>2222 Some Street, City, State, Coutry</span>
              </Col>
            </Row>
          </div>
        ) : (
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <Form name="login-form" initialValues={intiValues} onFinish={onFinish} layout="vertical">
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter your full name!" }]}
                >
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
                  <Input disabled prefix={<MailOutlined />} placeholder="Enter your name" />
                </Form.Item>

                <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please enter your phone!" }]}>
                  <Input prefix={<PhoneOutlined />} placeholder="Enter your name" />
                </Form.Item>

                <Form.Item label="Address" name="address">
                  <Input prefix={<HomeOutlined />} placeholder="Enter your name" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        )}
      </Flex>
    </Flex>
  );
}
