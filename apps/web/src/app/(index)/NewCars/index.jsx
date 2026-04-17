import { Col, Row } from "antd";
import { Container, Gap } from "@/components/Utility";
import { NewCarsCard, TitleSub } from "@/components/Common";
import { getImageUrl } from "@/utlls/pocketbase";

const FALLBACK_THUMB =
  "https://catalogue.automobile.tn/max/2023/03/46894.webp?t=1693578970";

function modelToCard(model) {
  const thumb = model.thumbnail
    ? getImageUrl(model.thumbnail, model.collectionId, model.id)
    : FALLBACK_THUMB;
  return {
    image: thumb,
    make: model.expand?.brand?.name || "",
    name: model.name,
    price: 0,
  };
}

export default function index({ models = [], newCarsTitle }) {
  return (
    <Container>
      <TitleSub {...newCarsTitle} />
      <Gap height={30} />
      <Row gutter={[20, 20]}>
        {models.map((model) => (
          <Col xs={24} sm={12} md={8} lg={6} key={model.id}>
            <NewCarsCard {...modelToCard(model)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
