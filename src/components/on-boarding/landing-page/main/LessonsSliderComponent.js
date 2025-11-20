"use client";
import React, { useEffect } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useIsTrue from "@/hooks/useIsTrue";
import { usePathname } from "next/navigation";
//import getAllCourses from "@/libs/getAllCourses";
import CourseCard from "@/components/shared/courses/CourseCard";
//import allCourses from "@/../public/fakedata/courses.json";
import gridImage1 from "@/assets/images/home/afonso-back.jpeg";
import gridImage2 from "@/assets/images/home/afonso-back.jpeg";
//import gridImage1 from "@/assets/images/grid/grid_1.png";
//import gridImage2 from "@/assets/images/grid/grid_2.png";
import gridImage3 from "@/assets/images/grid/grid_3.png";
import gridImage4 from "@/assets/images/grid/grid_4.png";
import gridImage5 from "@/assets/images/grid/grid_5.png";
import gridImage6 from "@/assets/images/grid/grid_6.png";
import gridImage7 from "@/assets/images/grid/grid_7.png";
import gridImage8 from "@/assets/images/grid/grid_8.png";
import gridImage9 from "@/assets/images/grid/grid_9.png";
import gridImage10 from "@/assets/images/grid/kid_1.jpg";
import gridImage11 from "@/assets/images/grid/kid_2.jpg";
import gridImage12 from "@/assets/images/grid/kid_3.jpg";
import gridImage13 from "@/assets/images/grid/kid_4.jpg";
import gridImage14 from "@/assets/images/grid/kid_5.jpg";
import gridImage15 from "@/assets/images/grid/kid_6.jpg";
import gridImage16 from "@/assets/images/grid/kid_6.jpg";
import gridSmallImg1 from "@/assets/images/grid/grid_small_1.jpg";
import gridSmallImg2 from "@/assets/images/grid/grid_small_2.jpg";
import gridSmallImg3 from "@/assets/images/grid/grid_small_3.jpg";
import gridSmallImg4 from "@/assets/images/grid/grid_small_4.jpg";
import gridSmallImg5 from "@/assets/images/grid/grid_small_5.jpg";
import LessonCardHome from "./LessonCardHome";
import { IMAGE_HOME_LESSON_1, IMAGE_HOME_LESSON_2, IMAGE_HOME_LESSON_3, IMAGE_HOME_LESSON_EXCEL } from "@/libs/constants/constants_images";
const getAllCourses = ({ allCourses = [] }) => {
  const images = [
    IMAGE_HOME_LESSON_EXCEL,
    IMAGE_HOME_LESSON_1,
    IMAGE_HOME_LESSON_2,
    IMAGE_HOME_LESSON_3,
    gridImage1,
    gridImage2,
    gridImage3,
    gridImage4,
    gridImage5,
    gridImage6,
    gridImage7,
    gridImage8,
    gridImage9,
    gridImage10,
    gridImage11,
    gridImage12,
    gridImage13,
    gridImage14,
    gridImage15,
    gridImage16,
    gridImage2,
    gridImage3,
    gridImage4,
    gridImage5,
    gridImage6,
    gridImage7,
    gridImage8,
    gridImage9,
    gridImage10,
    gridImage11,
    gridImage12,
    gridImage13,
    gridImage14,
    gridImage15,
    gridImage1,
    gridImage2,
    gridImage3,
    gridImage4,
    gridImage5,
    gridImage6,
    gridImage7,
    gridImage8,
    gridImage9,
    gridImage10,
    gridImage11,
    gridImage12,
    gridImage13,
    gridImage14,
    gridImage15,
    gridImage1,
    gridImage2,
    gridImage3,
    gridImage4,
    gridImage5,
    gridImage6,
    gridImage7,
    gridImage8,
    gridImage9,
  ];
  const insImages = [
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg3,
    gridSmallImg4,
    gridSmallImg5,
    gridSmallImg5,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg1,
    gridSmallImg4,
    gridSmallImg5,
    gridSmallImg5,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg1,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg3,
    gridSmallImg4,
    gridSmallImg5,
    gridSmallImg5,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg1,
    gridSmallImg4,
    gridSmallImg5,
    gridSmallImg5,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg1,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg3,
    gridSmallImg4,
    gridSmallImg5,
    gridSmallImg5,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg1,
    gridSmallImg4,
    gridSmallImg5,
    gridSmallImg5,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg1,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg3,
    gridSmallImg4,
    gridSmallImg5,
    gridSmallImg5,
    gridSmallImg1,
    gridSmallImg2,
    gridSmallImg1,
  ];
  const courses = [...allCourses]?.map((course, idx) => ({
    ...course,

    image: images[idx],
    insImg: insImages[idx],
  }));
  const courses_Bis = [{
    
  }];

  return courses;
};
const LessonsSliderComponent = ({ courses = [] }) => {
  const allCourses = getAllCourses({ allCourses: courses });
  const path = usePathname();

  const id = path?.split("/")[2];
  const isHome9 = useIsTrue("/home-9");
  const isHome9Dark = useIsTrue("/home-9-dark");
  const isHome10 = useIsTrue("/home-10");
  const isHome10Dark = useIsTrue("/home-10-dark");
  const isAbout = useIsTrue("/about");
  const isAboutDark = useIsTrue("/about-dark");
  let isCourseDetails = useIsTrue(`/courses/${id}`);
  let isCourseDetailsDark = useIsTrue(`/courses-dark/${id}`);
  const isCourseDetails2 = useIsTrue(`/course-details-2`);
  const isCourseDetails2Dark = useIsTrue(`/course-details-2-dark"`);
  const isCourseDetails3 = useIsTrue(`/course-details-3`);
  const isCourseDetails3Dark = useIsTrue(`/course-details-3-dark`);
  const isInstructorDetails = useIsTrue(`/instructors/${id}`);
  const isInstructorDetailsDark = useIsTrue(`/instructors-dark/${id}`);
  if (
    isCourseDetails2 ||
    isCourseDetails2Dark ||
    isCourseDetails3 ||
    isCourseDetails3Dark ||
    isInstructorDetails ||
    isInstructorDetailsDark
  ) {
    isCourseDetails = true;
  }
  const commonCourses = allCourses
    .filter(({ featured }) => featured)
  .slice(0, 1);
  const featuredCourses = [...commonCourses];

  return (
    <Swiper
      slidesPerView={1}
      grabCursor={true}
      autoplay={
        isAbout || isAboutDark || isCourseDetails || isCourseDetailsDark
          ? {
            delay: 5000,
            disableOnInteraction: false,
          }
          : false
      }
      loop={
        isAbout || isAboutDark || isCourseDetails || isCourseDetailsDark
          ? true
          : false
      }
      breakpoints={{
        576: {
          slidesPerView: isCourseDetails || isCourseDetailsDark ? 2 : 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: isCourseDetails || isCourseDetailsDark ? 2 : 3,
        },
        1500: {
          slidesPerView:
            isAbout || isAboutDark
              ? 3
              : isCourseDetails || isCourseDetailsDark
                ? 2
                : 4,
        },
      }}
      navigation={
        isAbout || isAboutDark || isCourseDetails || isCourseDetailsDark
          ? false
          : true
      }
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
