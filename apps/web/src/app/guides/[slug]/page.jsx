import { TitleSubBreadcrumb } from "@/components/Common";
import { Container, Gap } from "@/components/Utility";
import { getPages } from "@/utlls/request";
import { Col, Row } from "antd";
import Sidebar from "./(components)/Sidebar";

export default async function page({ params }) {
    const pages = await getPages();
    const ind = pages.findIndex((v) => v.slug === params.slug);
    const page = pages[ind];
    const titleProps = {
        title: page.title.toUpperCase(),
        breadcrumbs: [
            { title: "Pages", link: "/guides" },
            { title: page.name },
        ],
    };
    return (
        <Container>
            <Gap height={30} />
            <TitleSubBreadcrumb {...titleProps} />
            <Row style={{ padding: "30px 0" }}>
                <Col xs={24} md={18}>
                    <div
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    ></div>
                </Col>
                <Col xs={0} md={6}>
                    <Sidebar data={pages} selected={params.slug} />
                </Col>
            </Row>
        </Container>
    );
}
