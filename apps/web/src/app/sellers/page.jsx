import { TitleSubBreadcrumb } from "@/components/Common";
import { Container, Gap } from "@/components/Utility";
import { getSellers, getUser } from "@/utlls/request";
import { Col, Row } from "antd";
import SellersCard from "./SellersCard";

export default async function index() {
    const titleProps = {
        title: "Sellers",
        subtitle: "You can easily choose from our extensive seller network",
        breadcrumbs: [{ title: "Pro Sellers" }]
    }
    let sellers = await getSellers();

    return (
        <Container>
            <Gap height={30} />
            <TitleSubBreadcrumb {...titleProps} />
            <Gap height={30} />
            <Row gutter={[20, 20]}>
                {
                    sellers.map(async (seller, i) => {
                        return (
                            <Col xs={24} md={8} lg={6} key={i} >
                                <SellersCard {...seller} />
                            </Col>
                        )
                    })
                }
            </Row>
            <Gap />

        </Container>
    )
}

