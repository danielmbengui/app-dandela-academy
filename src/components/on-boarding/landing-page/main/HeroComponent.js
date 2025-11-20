"use client";

import React, { useEffect, useState } from "react";
import AppleImage from "@/components/shared/animaited-images/AppleImage";
import BalbImage from "@/components/shared/animaited-images/BalbImage";
import BookImage from "@/components/shared/animaited-images/BookImage";
import GlobImage from "@/components/shared/animaited-images/GlobImage";
import TriangleImage from "@/components/shared/animaited-images/TriangleImage";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import universityImage1 from "@/assets/images/herobanner/university_1.jpg";
import universityImage2 from "@/assets/images/herobanner/university_2.jpg";
import universityImage3 from "@/assets/images/herobanner/university_3.jpg";
import Image from "next/image";
//import HeroSlide2 from "@/components/shared/hero-banner/HeroSlide2";

//import React from "react";
import { Stack } from "@mui/material";
import HreoName from "@/components/shared/section-names/HreoName";
import { useTranslation } from "react-i18next";
import { NS_BUTTONS, NS_HOME } from "@/libs/i18n/settings";
import { getJsonValues } from "@/libs/functions";
import { IMAGE_HOME_BUILDING, IMAGE_HOME_SCHOOL_1, IMAGE_HOME_SCHOOL_2, PUBLIC_IMAGE_HOME_BUILDING, PUBLIC_IMAGE_HOME_SCHOOL_1, PUBLIC_IMAGE_HOME_SCHOOL_2, PUBLIC_IMAGE_HOME_SCHOOL_3 } from "@/libs/constants/constants_images";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_TIKTOK } from "@/libs/constants/constants";
import { IconTiktok } from "@/assets/icons/IconsComponent";

const OneSlide = ({ slide, idx, image }) => {
  const { t } = useTranslation([NS_BUTTONS, NS_HOME]);
  const { title, tag } = slide;
  return (
    <div
      className="inset-0 bg-center bg-no-repeat bg-cover h-full"
      style={{ backgroundImage: `url(${image})` }}
    //className={`hero relative z-0 bg-center bg-no-repeat bg-cover h-[100%]`}
    //style={{ backgroundImage: `url(${image})`,backgroundColor:'red' }}
    >
      <div className="h-[100%] bg-black bg-opacity-70 overflow-hidden pt-50px pb-100px md:pt-35 md:pb-170px lg:pt-100px lg:pb-150px 2xl:pt-35 2xl:pb-170px">
        <div className="container 2xl:container-secondary-md relative overflow-hidden text-center">
          <div data-aos="fade-up">
            <div>
              <HreoName>{tag}</HreoName>

              <Stack sx={{ width: '100%', height: '100%' }} alignItems={'center'} >
                <Stack sx={{ pt: 2, pb: 5, width: '50%' }} justifyContent={'center'} alignItems={'center'}>
                  <h1 className="text-size-40 md:text-size-30 lg:text-2xl 2xl:text-size-35 leading-42px md:leading-15 lg:leading-14 2xl:leading-50px text-whiteColor md:tracking-half lg:tracking-normal 2xl:tracking-half font-bold">
                    {title}
                  </h1>
                </Stack>
              </Stack>

              <div>
                <a
                  href="/#about"
                  className="text-whiteColor bg-secondaryColor border border-secondaryColor px-10 py-15px hover:text-whiteColor hover:bg-primaryColor hover:border-primaryColor rounded-full inline-block dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor"
                >
                  {t(`${NS_BUTTONS}:know-more`)}
                </a>
              </div>
              <div className="mt-20 md:mt-50px">
                <p className="text-whiteColor mb-15px">{t(`${NS_HOME}:join-us`)}</p>
                <ul className="flex gap-3 items-center justify-center">
                  <li>
                    <a
                      href={WEBSITE_FACEBOOK}
                      target={`_blank`}
                      className="w-50px h-50px md:w-15 md:h-15 leading-50px md:leading-15 text-whiteColor bg-white bg-opacity-10 hover:bg-secondaryColor text-sm md:text-xl rounded-100"
                    >
                      <i className="icofont-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href={WEBSITE_LINKEDIN}
                      target={`_blank`}
                      className="w-50px h-50px md:w-15 md:h-15 leading-50px md:leading-15 text-whiteColor bg-white bg-opacity-10 hover:bg-secondaryColor text-sm md:text-xl rounded-100"
                    >
                      <i className="icofont-linkedin"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href={WEBSITE_TIKTOK}
                      target={`_blank`}
                      className="w-50px h-50px md:w-15 md:h-15 leading-50px md:leading-15 text-whiteColor bg-white bg-opacity-10 hover:bg-secondaryColor text-sm md:text-xl rounded-100"
                    >
                      <Stack justifyContent={'center'} alignItems={'center'} sx={{ width: '100%', height: '100%' }}>
                        <IconTiktok width={26} height={26} />
                      </Stack>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSlider = () => {
  const { t } = useTranslation([NS_HOME])
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const slides = getJsonValues(t("slides", { returnObjects: true }));

  const images = [
    {
      thumb: IMAGE_HOME_SCHOOL_1,
      image: PUBLIC_IMAGE_HOME_SCHOOL_1,
    },
    {
      thumb: universityImage2,
      image: PUBLIC_IMAGE_HOME_SCHOOL_2
    },
    {
      thumb: universityImage3,
      image: PUBLIC_IMAGE_HOME_SCHOOL_3
    }];
  const thumbsImages = [IMAGE_HOME_SCHOOL_1, universityImage2, universityImage3];
  return (
    <div className="relative w-full h-screen">
      <Swiper
        navigation={true}
        //grabCursor={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs]}
        className="w-full h-full"
        autoHeight={false} // s'assure que Swiper ne calcule pas des hauteurs différentes
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="!h-full">
            <OneSlide slide={slide} idx={idx} image={images[idx].image} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        modules={[Thumbs]}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        className="hidden absolute bottom-5 left-1/2 -translate-x-1/2 w-auto"
      >
        {images.map((item, idx) => (
          <SwiperSlide
            className={`swiper-slide cursor-pointer max-w-150px rounded-lg2 `}
            key={idx}
          >
            <Image
              src={item.thumb}
              alt=""
              placeholder="blur"
              className="w-full rounded-lg2"
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const HeroComponent = () => {
  return (
    <section data-aos="fade-up" className="hero relative z-0 overflow-hidden">
      {/* banner section  */}
      <div>
        {/* animated icons  */}
        <div>
          <div className="hidden">
            <BookImage />
          </div>
          <GlobImage />
          <BalbImage />
          <AppleImage />
          <TriangleImage />
        </div>

        {/* Swiper  */}
        <HeroSlider />
      </div>
    </section>
  );
};

export default HeroComponent;
