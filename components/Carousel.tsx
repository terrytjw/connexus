import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type CarouselProps = {
  images: string[];
};

const Carousel = ({ images }: CarouselProps) => {
  return (
    <Swiper
      slidesPerView={1}
      pagination={{
        type: "fraction",
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
    >
      {images.map((image) => {
        return (
          <SwiperSlide key={image} className="!w-full">
            <img
              src={image}
              className="h-60 w-full rounded-lg object-cover object-center md:h-96"
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Carousel;
