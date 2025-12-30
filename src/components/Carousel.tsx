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
    <div className="relative w-full h-full min-h-100 md:min-h-0">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop
        pagination={{ clickable: true }}
        modules={[Pagination, Navigation]}
        className="h-full w-full"
      >
        {productImages.map((item) => (
          <SwiperSlide key={item.id} className="relative bg-gray-50">
            <Image
              src={item.url}
              alt="Product view"
              fill
              className="object-cover"
              priority={item.position === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
