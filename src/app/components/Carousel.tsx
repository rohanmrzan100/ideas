'use client';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
const Carousel = () => {
  return (
    <div style={{ height: '500px', width: '500px' }}>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Image
            width={'100'}
            height={'100'}
            src={
              'https://fastly.picsum.photos/id/619/200/200.jpg?hmac=kS8OI8cYlvghz5FZaiYdIx96pUPQ30oF6bIsAg3AOZ4'
            }
            alt="123"
          ></Image>
        </SwiperSlide>
        <SwiperSlide>
          <Image
            width={'100'}
            height={'100'}
            alt="cas"
            src={'https://picsum.photos/id/29/4000/2670'}
          ></Image>
        </SwiperSlide>
        <SwiperSlide>
          <Image
            width={'100'}
            height={'100'}
            alt="cas"
            src={
              'https://fastly.picsum.photos/id/110/200/200.jpg?hmac=aekmsQTsPRt4hCd1khMC5QVihAaBeTigUCpcDBzhXlY'
            }
          ></Image>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;
