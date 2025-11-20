"use client";
import React from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import gridSmallImg1 from "@/assets/images/grid/grid_small_1.jpg";
import gridSmallImg2 from "@/assets/images/grid/grid_small_2.jpg";
import gridSmallImg3 from "@/assets/images/grid/grid_small_3.jpg";
import gridSmallImg4 from "@/assets/images/grid/grid_small_4.jpg";
import LessonCardHome from "./LessonCardHome";
import { IMAGE_HOME_LESSON_1, IMAGE_HOME_LESSON_2, IMAGE_HOME_LESSON_3, IMAGE_HOME_LESSON_EXCEL } from "@/contexts/constants/constants_images";
const getAllCourses = ({ allCourses = [] }) => {
  const images = [
    IMAGE_HOME_LESSON_EXCEL,
    IMAGE_HOME_LESSON_1,
    IMAGE_HOME_LESSON_2,
    IMAGE_HOME_LESSON_3,
  ];
  const insImages = [
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg3,
    gridSmallImg4,
  ];
  const courses = [...allCourses]?.map((course, idx) => ({
    ...course,

    image: images[idx],
    insImg: insImages[idx],
  }));
  return courses;
};
const LessonsSliderComponent = ({ courses = [] }) => {
  const allCourses = getAllCourses({ allCourses: courses });
  const commonCourses = allCourses
    .filter(({ featured }) => featured)
    .slice(0, 1);
  const featuredCourses = [...commonCourses];

  return (
    <Swiper
      slidesPerView={1}
      grabCursor={true}
      autoplay={false}
      loop={false}
      breakpoints={{
        576: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
        1500: {
          slidesPerView: 4,
        },
      }}
      navigation={true}
      modules={[Autoplay, Navigation]}
      className="featured-courses"
    >
      {featuredCourses.map((course, idx) => (
        <SwiperSlide key={idx}>
          <LessonCardHome type="primary" course={course} idx={idx} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default LessonsSliderComponent;
