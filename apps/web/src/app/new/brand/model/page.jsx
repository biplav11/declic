import { ImageGallery, TitleSub, TitleSubBreadcrumb } from "@/components/Common";
import { Container, Gap } from "@/components/Utility";
import { Col, Row } from "antd";
import VariantsList from "./components/VariantsList";
import SimilarSlider from "./components/SimilarSlider";
import { newCars } from "@/utlls/data";

export default function page() {
  let titleProps = {
    title: "Audi Q5",
    breadcrumbs: [{ title: "Brand", link: "/brand" }, { title: "Model Name" }],
  };
  const similarCarsTitle = {
    title: "Similar Cars",
    subtitle: "Find the car similar to this range",
    hideLink: true,
  };
  const variants = [
    {
      title: "1.0 EcoBoost 125 Titanium",
      price: "79,990 DT",
    },
    {
      title: "1.0 EcoBoost 125 Titanium",
      price: "79,990 DT",
    },
    {
      title: "1.0 EcoBoost 125 Titanium",
      price: "79,990 DT",
    },
  ];

  return (
    <Container>
      <Gap height={30} />
      <TitleSubBreadcrumb {...titleProps} />
      <Gap height={30} />
      <Row gutter={30}>
        <Col xs={24} md={14}>
          {/* <img
                        className={styles.thumbnail}
                        src="https://catalogue.automobile.tn/big/2022/06/46766.webp?t=1678353134"
                    /> */}
          <ImageGallery />
        </Col>
        <Col xs={24} md={10}>
          <VariantsList data={variants} />
        </Col>
      </Row>
      <Gap height={30} />
      <TitleSub {...similarCarsTitle} />
      <Gap height={30} />
      <SimilarSlider data={newCars} />
      <Gap height={30} />
    </Container>
  );
}
