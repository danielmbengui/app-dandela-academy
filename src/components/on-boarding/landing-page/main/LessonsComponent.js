"use client";
import FeaturedSlider from "@/components/shared/featured-courses/FeaturedSlider";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import SectionName from "@/components/shared/section-names/SectionName";
import useIsTrue from "@/hooks/useIsTrue";
import { usePathname } from "next/navigation";
import LessonsSliderComponent from "./LessonsSliderComponent";
import { getJsonValues } from "@/libs/functions";
import { useTranslation } from "react-i18next";
import { NS_HOME } from "@/libs/i18n/settings";
import { useEffect } from "react";

const LessonsComponent = ({ subTitle }) => {
  const { t } = useTranslation([NS_HOME]);
  const slides = getJsonValues(t("about", { returnObjects: true }));
  const { title, subtitle, bubble, goals, tag,content, about, mission, vision, inefop } = t(`lessons`, { returnObjects: true });

  const path = usePathname();
  const id = path?.split("/")[2];
  const isAbout = useIsTrue("/about");
  const isAboutDark = useIsTrue("/about-dark");
  const isCourseDetails = useIsTrue(`/courses/${id}`);
  const isCourseDetailsDark = useIsTrue(`/courses-dark/${id}`);
  return (
    <section id='lessons'>
      <div
        className={`pt-100px`}
      >
        <div
          className={isAbout || isAboutDark ? "container" : "container-fluid-2"}
        >
          {/* heading */}
          {isCourseDetails || isCourseDetailsDark ? (
            ""
          ) : (
            <div data-aos="fade-up" className="mb-5 md:mb-10">
              {subTitle ? <SectionName>{subTitle}</SectionName> : ""}
              <HeadingPrimary data-aos="fade-up">{tag}</HeadingPrimary>
            </div>
          )}
          {/* featured cards */}

          <div data-aos="fade-up" className="sm:-mx-15px">
            {/* Swiper */}
            <LessonsSliderComponent courses={content} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonsComponent;
