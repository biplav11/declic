import { BlogCard, TitleSubBreadcrumb } from "@/components/Common"
import { Container, Gap, capitalize } from "@/components/Utility"
import { newsData } from "@/utlls/data"
import { getCategory, getNewsCategory } from "@/utlls/request"
import { Flex } from "antd"

export async function generateStaticParams() {
    const category = await getNewsCategory()
    return category.map(({ slug, id }) => ({
        slug
    }))
}
export default async function page({ params }) {
    const category = await getCategory(params.slug)
    const breadcrumbs = [{ title: "Magazine", link: "/magazine" }, { title: capitalize(category.name) }]
    return (
        <Container>
            <Gap height={30} />
            <TitleSubBreadcrumb title={capitalize(category.name)} breadcrumbs={breadcrumbs} />
            <Gap height={30} />
            <Flex align='center' justify='start' wrap='wrap' gap={20} className="carList">
                {
                    [...newsData, ...newsData, ...newsData].map((blog, i) => (
                        <BlogCard key={i} {...blog} />
                    ))
                }
            </Flex>
            <Gap />
        </Container>
    )
}
