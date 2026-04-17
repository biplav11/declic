import { getAddresses, getBrands, getDealers, getUser } from "@/utlls/request";
import Maps from "./Maps";
import { Container, Gap } from "@/components/Utility";
import { BrandCard, TitleSubBreadcrumb } from "@/components/Common";
import Title from "antd/es/typography/Title";
import { Flex } from "antd";

export async function generateStaticParams() {
  const dealership = await getDealers();
  return dealership.map(({ name, id }) => ({
    slug: `${name}-${id}`.toLowerCase().replaceAll(" ", "-"),
    id,
  }));
}
export default async function page({ params }) {
  const id = params.slug.split("-").pop();
  const dealer = await getUser(id);
  const addresses = await getAddresses(id);
  const brands = await getBrands(3);

  let titleProps = {
    title: dealer.name,
    breadcrumbs: [
      { title: "Dealership", link: "/dealers" },
      { title: dealer.name },
    ],
  };
  return (
    <Container>
      <Gap height={30} />
      <TitleSubBreadcrumb {...titleProps} />
      <Gap height={30} />
      <Title level={4} style={{ fontWeight: 400 }}>
        Brands Represented
      </Title>
      <Flex wrap="wrap" gap={15}>
        {brands.map((brand) => (
          <BrandCard key={brand.id} {...brand} />
        ))}
      </Flex>
      <Gap height={30} />
      <Maps {...{ addresses }} />
      <Gap height={30} />
    </Container>
  );
}
