import { ImageGallery, TitleSub } from "@/components/Common";
import { Container, Gap } from "@/components/Utility";
import { Col, Row } from "antd";
import Sidebar from "./Sidebar";

const images = [
  {
    original:
      "https://occasion.automobile.tn/2021/08/67084_405677x3a75p2bi4t7svfuyok_max.webp?t=e60f0e208c371e700a68b3b7a3e5d4f9",
    thumbnail:
      "https://occasion.automobile.tn/2021/08/67084_405677x3a75p2bi4t7svfuyok_min.webp?t=e60f0e208c371e700a68b3b7a3e5d4f9",
  },
  {
    original:
      "https://occasion.automobile.tn/2021/08/67084_9dn81r3uq1fo2u3wcovksv0ms_max.webp?t=cbc6d6f9eeef1ea639f7a460239e4424",
    thumbnail:
      "https://occasion.automobile.tn/2021/08/67084_9dn81r3uq1fo2u3wcovksv0ms_min.webp?t=cbc6d6f9eeef1ea639f7a460239e4424",
  },
  {
    original:
      "https://occasion.automobile.tn/2021/08/67084_0wo6jgrltzsw4fzhvohloyo5n_max.webp?t=34898e4555ddd27d8451602880200a99",
    thumbnail:
      "https://occasion.automobile.tn/2021/08/67084_0wo6jgrltzsw4fzhvohloyo5n_min.webp?t=34898e4555ddd27d8451602880200a99",
  },
];

export default function page() {
  const titleProps = {
    title: "MAX VERSTAPPEN CELEBRATES HIS 50TH F1 GRAND PRIX VICTORY IN THE UNITED STATES",
  };
  return (
    <Container>
      <Gap height={30} />
      <Row>
        <Col>
          <TitleSub {...titleProps} hideLink />
        </Col>
      </Row>
      <Gap height={30} />
      <Row gutter={30}>
        <Col xs={24} md={18}>
          <ImageGallery images={images} />
          <p>
            <b>
              In 2018, the premium manufacturer entered the era of electric mobility with the Audi e-tron, marking the
              start of its electric adventure. Since then, the model has been a benchmark in the luxury electric SUV
              segment. The new Audi Q8 e-tron today represents a new page in the success story of the electric pioneer.
              The premium electric SUV and crossover impresses with its optimized drivetrain, improved aerodynamics,
              superior charging performance, increased battery capacity and range, which increases to 582 kilometers for
              the SUV version and 600 kilometers for the Sportback, according to the WLTP cycle. The new flagship SUV
              gets a facelift with significant changes, especially at the front of the vehicle.
            </b>
          </p>
          <Gap height={10} />
          <p>
            Since the introduction of the Audi e-tron four years ago and with 150,000 units sold to its credit, Audi has
            been pursuing its electric initiative systematically. Its electric portfolio today consists of 8 models; by
            2026, there will be more than 20. At this point, Audi will only sell 100% electric models. “As part of our
            'Vorsprung 2030' strategy, we have set a date for the withdrawal of our combustion engines, and we have
            decided to become a 100% electric manufacturer within 11 years,” explains Markus Duesmann, president of the
            board of AUDI AG. “With an improved design, improved efficiency and range, the new Audi Q8 e-tron joins the
            models in the electric portfolio designed for everyday use which are arousing users' interest in
            electromobility. » Oliver Hoffmann, member of the management board responsible for technical development,
            also emphasizes the advantages that these changes offer customers. “In the new Q8 e-tron, we have
            significantly increased the battery capacity and charging performance. This allowed us to achieve an optimal
            balance between energy density and load capacity, and to improve efficiency,” explains Hoffmann. “In
            addition, we have further refined the engines, progressive steering and chassis control systems, and thus
            the dynamic driving characteristics of all versions of the Audi Q8 e-tron.&nbsp;
          </p>
          <Gap height={10} />
          <p>
            <strong>New face, new name and new corporate identity</strong>
            <br />
            By naming this model Q8, Audi clearly affirms that the Audi Q8 e-tron is THE high-end model of its electric
            SUVs and crossovers. The 100% electric character of the Audi Q8 e-tron and the Audi Q8 Sportback e-tron can
            be identified at first glance thanks to the new front and rear design, which takes up the electric visual
            identity of the brand with rings. A prestigious electric SUV, the Audi Q8 e-tron embodies the new corporate
            identity with a two-dimensional design of the four rings on the exterior. The lettering of the model, which
            is accompanied by the Audi logo on the window pillar, is also new.
          </p>
        </Col>
        <Sidebar />
      </Row>
      <Gap height={30} />
      {/* <Comments title={"test"} identifier={"test"} url={"http://localhost:3000/magazine/detail"} /> */}
    </Container>
  );
}
