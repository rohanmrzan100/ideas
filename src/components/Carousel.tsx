'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Image from 'next/image';
import { Pagination, Navigation } from 'swiper/modules';
import { ProductImages } from '@/app/data';

type CarouselProps = {
  productImages: ProductImages[];
};

const Carousel = ({ productImages }: CarouselProps) => {
  return (
    <div className="relative h-125 w-125">
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop
        pagination={{ clickable: true }}
        // navigation
        modules={[Pagination, Navigation]}
        className="h-full w-full"
      >
        {productImages.map((item) => (
          <SwiperSlide key={item.id}>
            <Image src={item.url} alt="Product image" fill className="object-cover" priority />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
