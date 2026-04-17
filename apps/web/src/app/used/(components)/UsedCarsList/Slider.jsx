"use client";
import Slider from "react-slick";
import { Container } from "@/components/Utility";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { UsedCarsCard } from "@/components/Common";

export default function UsedCarSliders({ usedCars }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: (
            <button className="slick-button">
                <CaretRightOutlined />
            </button>
        ),
        prevArrow: (
            <button className="slick-button">
                <CaretLeftOutlined />
            </button>
        ),
    };
    return (
        <Container>
            <Slider {...settings}>
                {usedCars.map((car, i) => (
                    <UsedCarsCard
                        key={i}
                        {...car}
                        index={i}
                        wrapperClass="used_car_card_slider"
                    />
                ))}
            </Slider>
        </Container>
    );
}
