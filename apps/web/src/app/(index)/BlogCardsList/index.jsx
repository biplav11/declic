import { Flex } from "antd";
import { Container, Gap } from "../../../components/Utility";
import { BlogCard, TitleSub } from "@/components/Common";

export default function index({ blogs, blogTitle }) {

    return (
        <Container>
            <TitleSub {...blogTitle} />
            <Gap height={30} />
            <Flex align='center' justify='start' wrap='wrap' gap={20} className="carList">
                {
                    blogs.map((blog, i) => (
                        <BlogCard key={i} {...blog} />
                    ))
                }
            </Flex>
        </Container>
    )
}
