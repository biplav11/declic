import { Container, Gap } from "@/components/Utility"
import { Flex } from "antd";
import { BrandCard, TitleSub } from "@/components/Common";

export default async function index({ brands, brandsTitle }) {


    return (
        <Container>
            <TitleSub {...brandsTitle} />
            <Gap height={30} />
            <Flex wrap="wrap" gap={15}>
                {brands.map((brand) => (<BrandCard key={brand.id} {...brand} />))}
            </Flex>
        </Container>
    )
}
