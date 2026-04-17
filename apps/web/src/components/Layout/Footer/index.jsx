import React from 'react'
import { Container } from '@/components/Utility'
import styles from './index.module.scss'
import { Button, Col, Divider, Flex, Input, Row, Space } from 'antd'
import Link from 'next/link'
import { ArrowRightOutlined, FacebookFilled, InstagramOutlined, LinkedinFilled, MailOutlined, MobileOutlined, PhoneOutlined, SendOutlined, TwitterOutlined, YoutubeFilled } from '@ant-design/icons'

export default function index() {
    return (
        <footer className={styles.footer}>
            <Divider style={{ margin: 0 }} />
            <Container>
                <Flex align='center' justify='space-between' style={{ padding: '20px 0' }} wrap='wrap' gap={20}>
                    <span className={styles.memberTitle}>Unlock your Car Knowledge with our industry news</span>
                    <Button size="large" type="primary" style={{ textTransform: "uppercase" }}>Become our Member</Button>
                </Flex>
            </Container>
            <Divider style={{ margin: 0 }} />
            <Container>
                <Flex align='center' justify='space-between' wrap='wrap' style={{ paddingTop: 15 }}>
                    <Link href="/">
                        <img
                            className={styles.logo}
                            src={"https://www.nreo.org.np/declic/logo.svg"}
                            alt='Declic Logo'
                        />
                    </Link>
                    <Flex>
                        <Row style={{ paddingRight: 10 }} gutter={10}>
                            <Col><span className={styles.socialTitle}>Follow Us :</span></Col>
                            <Col><Button className={styles.socialButton} icon={<FacebookFilled className={styles.headerIcon} style={{ position: "relative", top: 1 }} />} /></Col>
                            <Col><Button className={styles.socialButton} icon={<TwitterOutlined className={styles.headerIcon} style={{ position: "relative", top: 1 }} />} /></Col>
                            <Col><Button className={styles.socialButton} icon={<InstagramOutlined className={styles.headerIcon} style={{ position: "relative", top: 1 }} />} /></Col>
                            <Col><Button className={styles.socialButton} icon={<LinkedinFilled className={styles.headerIcon} style={{ position: "relative", top: 1 }} />} /></Col>
                            <Col><Button className={styles.socialButton} icon={<YoutubeFilled className={styles.headerIcon} style={{ position: "relative", top: 1 }} />} /></Col>
                        </Row>
                    </Flex>
                </Flex>
                <Divider style={{ margin: '15px 0' }} />
                <Row gutter={30}>
                    <Col xs={24} md={16}>
                        <Row>
                            <Col xs={12} md={8}>
                                <span className={styles.linkTitle}>New Cars</span>
                                <ul style={{ paddingBottom: 15 }}>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> Brands</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> Dealers</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> News Cars Comparator</Link></li>
                                </ul>
                            </Col>
                            <Col xs={12} md={8}>
                                <span className={styles.linkTitle}>Used Cars</span>
                                <ul style={{ paddingBottom: 15 }}>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> Research</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> Announcement of the Day</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> Professional Sellers</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> Used Cars Comparator</Link></li>
                                </ul>
                            </Col>
                            <Col xs={12} md={8}>
                                <span className={styles.linkTitle}>News</span>
                                <ul style={{ paddingBottom: 15 }}>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> What's New</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> News</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> Trials</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> Concepts</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> SuperCars</Link></li>
                                    <li ><Link href="#" className={styles.link}><ArrowRightOutlined style={{ fontSize: 11 }} /> Sports Auto</Link></li>
                                </ul>
                            </Col>
                        </Row>
                        <Row >
                            <Col xs={12} md={8}>
                                <Link href="#" className={styles.linkTitleCapU}>Declic Guide</Link>
                            </Col>
                            <Col xs={12} md={8}>
                                <Link href="#" className={styles.linkTitleCapU}>About Us</Link>
                            </Col>
                            <Col xs={12} md={8}>
                                <Link href="#" className={styles.linkTitleCapU}>Contact Us</Link>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={8}>
                                <Link href="#" className={styles.linkTitleCap}>Legal Notice</Link>
                            </Col>
                            <Col xs={12} md={8}>
                                <Link href="#" className={styles.linkTitleCap}>Privacy Policy</Link>
                            </Col>
                            <Col xs={12} md={8}>
                                <Link href="#" className={styles.linkTitleCap}>Latest Edition</Link>
                            </Col>
                        </Row>

                    </Col>
                    <Col xs={24} md={8}>
                        <span className={styles.contactTitle}>Keep in Touch</span>
                        <Flex gap={15} vertical>
                            <span><MailOutlined /> &nbsp;&nbsp;support@decliccar.com </span>
                            <span><MobileOutlined /> &nbsp;&nbsp;+1 1234567890</span>
                            <span>&nbsp;</span>
                            <span>Keep up with our latest updates and offers</span>
                            <Flex>
                                <Input style={{ borderRadius: 0 }} placeholder="Enter your email address" />
                                <Button style={{ borderRadius: 0 }} type="primary"><SendOutlined /></Button>
                            </Flex>

                        </Flex>

                    </Col>
                </Row>
                <Divider style={{ margin: '15px 0' }} />
                <Flex align='center' justify='center'>
                    <span style={{ marginBottom: 15, fontWeight: 500, fontSize: 12 }}>&copy; Copyright 2023 DECLICCAR. All Rights Reserved.</span>
                </Flex>
            </Container>
        </footer>
    )
}