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
            <div className="relative h-60 w-full overflow-hidden rounded-lg md:h-96">
              <Image
                fill
                sizes="80vw"
                className="object-cover object-center"
                src={image}
                alt={"Carousel Image"}
              />
            </div>

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
