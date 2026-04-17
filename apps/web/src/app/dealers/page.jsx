import { TitleSubBreadcrumb } from "@/components/Common";
import { Container, Gap } from "@/components/Utility";
import { getDealers } from "@/utlls/request";
import { Col, Row } from "antd";
import DealersCard from "./DealersCard";

export default async function index() {
  const titleProps = {
    title: "DEALERS",
    subtitle: "You can easily choose from our extensive dealers network",
    breadcrumbs: [{ title: "Dealers" }],
  };
  let dealers = await getDealers();

  console.log(dealers);

  return (
    <Container>
      <Gap height={30} />
      <TitleSubBreadcrumb {...titleProps} />
      <Gap height={30} />
      <Row gutter={[20, 20]}>
        {dealers.map(async (dealer, i) => {
          // const user = await getUser(dealer.user_id)
          return (
            <Col xs={24} md={8} lg={6} key={i}>
              <DealersCard {...dealer} />
            </Col>
          );
        })}
      </Row>
      <Gap />
    </Container>
  );
}
