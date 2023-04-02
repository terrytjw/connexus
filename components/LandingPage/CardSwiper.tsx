import React from "react";
import { Navigation, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import ProductCard from "./ProductCard";

type CardSwiperProps = {
  cards: any;
};
export const CardSwiper = ({ cards }: CardSwiperProps) => {
  return (
    <Swiper
      grabCursor
      navigation={false}
      pagination={true}
      autoplay={true}
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      spaceBetween={20}
      style={{
        paddingLeft: "1rem",
        paddingTop: "1rem",
        paddingRight: "1rem",
        paddingBottom: "3rem",
      }}
    >
      {cards.map((card: any, index: number) => (
        <SwiperSlide key={index}>
          <ProductCard card={card} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CardSwiper;
