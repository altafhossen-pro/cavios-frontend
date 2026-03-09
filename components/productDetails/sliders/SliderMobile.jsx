"use client";
import { slides } from "@/data/singleProductSliders";
import { useState } from "react";
import { Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

export default function SliderMobile({
  firstItem,
  slideItems = slides,
}) {
  const items = [...slideItems];
  items[0].src = firstItem ?? items[0].src;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="thumbs-slider">
      <Swiper
        className="swiper tf-product-media-thumbs other-image-zoom"
        spaceBetween={10}
        slidesPerView={4}
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        breakpoints={{
          0: {
            slidesPerView: 4,
          },
          480: {
            slidesPerView: 5,
          },
          640: {
            slidesPerView: 6,
          },
        }}
      >
        {items.map((slide, index) => (
          <SwiperSlide
            className="swiper-slide stagger-item"
            data-color={slide.color}
            key={index}
          >
            <div className="item">
              <Image
                className="lazyload"
                data-src={slide.src}
                alt={slide.alt || ""}
                src={slide.src}
                width={slide.width}
                height={slide.height}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        className="swiper tf-product-media-main"
        spaceBetween={10}
        slidesPerView={1}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs]}
      >
        {items.map((slide, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <div className="item">
              <Image
                className="lazyload"
                data-src={slide.src}
                alt={slide.alt || ""}
                src={slide.src}
                width={slide.width}
                height={slide.height}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
