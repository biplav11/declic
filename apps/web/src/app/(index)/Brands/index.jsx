import { BrandCard, TitleSub } from "@/components/Common";
import { Container, Gap } from "../../../components/Utility"
import { Flex } from "antd";

export default async function index({ brands, brandsTitle }) {
    return (
        <Container>
            <TitleSub {...brandsTitle} />
            <Gap height={30} />
            <Flex wrap="wrap" gap={15}>
                {brands.map((brand) => <BrandCard {...brand} key={brand.id} />)}
            </Flex>
        </Container>
    )
}
