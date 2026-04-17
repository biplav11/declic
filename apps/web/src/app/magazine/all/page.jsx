import { BlogCard, TitleSub } from "@/components/Common";
import { Container, Gap, capitalize } from "@/components/Utility";
import { newsData } from "@/utlls/data";
import { getNewsCategory } from "@/utlls/request";
import { Col, Flex, Row } from "antd";
import { Fragment } from "react";

export default async function page() {
  const newsCategory = await getNewsCategory();
  let news = newsData.slice(0, 4);
  return (
    <Container>
      <Gap height={30} />
      {newsCategory.map((cat) => {
        return (
          <Fragment key={cat.id}>
            <TitleSub title={capitalize(cat.name)} href={`/magazine/${cat.slug}`} />
            <Gap height={30} />
            <Flex align="center" justify="start" wrap="wrap" gap={20} className="carList">
              {news.map((blog, i) => (
                <BlogCard key={i} {...blog} />
              ))}
            </Flex>
            <Gap />
          </Fragment>
        );
      })}
    </Container>
  );
}
