"use client";
import { NewCarsCard } from "@/components/Common";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import Slider from "react-slick";

export default function index({ data }) {
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
        <Slider {...settings}>
            {data.map((car, i) => (
                <NewCarsCard
                    key={i}
                    {...car}
                    index={i}
                    wrapperClass="used_car_card_slider"
                />
            ))}
        </Slider>
    );
}
