import { Container, Gap } from "@/components/Utility";
import Slider from './Slider'
import { TitleSub } from "@/components/Common";

function UsedCarsList({ usedCars, usedCarsTitle }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        accessibility: true,
    };
    return (
        <Container>
            <TitleSub {...usedCarsTitle} />
            <Gap height={30} />
            <Slider {...{ usedCars }} />
        </Container >
    )
}

export default UsedCarsList;