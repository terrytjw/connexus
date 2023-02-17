import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import Button from "./Button";

type CarouselProps = {
  images: string[];
  removeImage?: Function;
};

const Carousel = ({ images, removeImage }: CarouselProps) => {
  return (
    <Swiper
      slidesPerView={1}
      pagination={{
        type: "fraction",
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="w-full"
    >
      {images.map((image, index) => {
        return (
          <SwiperSlide key={index} className="relative">
            <Image
              height={60}
              width={1200}
              className="h-60 w-full rounded-lg object-cover object-center md:h-96"
              src={image}
              alt={"Carousel Image"}
            />

            {removeImage ? (
              <Button
                variant="solid"
                size="md"
                className="!btn-circle absolute top-4 right-4"
                type="button"
                onClick={() => removeImage(image)}
              >
                <FaTimes />
              </Button>
            ) : null}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Carousel;
