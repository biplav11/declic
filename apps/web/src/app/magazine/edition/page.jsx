"use client";
import { MagCard, Magazine, TitleSub } from "@/components/Common";
import { Container, Gap } from "@/components/Utility";
import { magData } from "@/utlls/data";
import { Flex } from "antd";
import { Fragment } from "react";

export default async function page() {
  let news = [...magData, ...magData];
  return (
    <Container>
      <Gap height={30} />
      <Fragment>
        <TitleSub title={"Latest Edition"} href={`/magazine/edition`} hideLink={true} />
        <Gap height={30} />
        <Flex align="center" justify="start" wrap="wrap" gap={20} className="carList">
          {news.map((blog, i) => (
            <MagCard key={i} {...blog} />
          ))}
        </Flex>
        <Gap />
      </Fragment>
    </Container>
  );
}
