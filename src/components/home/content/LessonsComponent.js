"use client";
import { usePathname } from "next/navigation";
import LessonsSliderComponent from "./LessonsSliderComponent";
import { useTranslation } from "react-i18next";
import { NS_HOME } from "@/contexts/i18n/settings";
import SectionName from "./SectionName";
import HeadingPrimary from "./HeadingPrimary";

const LessonsComponent = ({ subTitle }) => {
  const { t } = useTranslation([NS_HOME]);
  const { tag,content} = t(`lessons`, { returnObjects: true });

  const path = usePathname();

  return (
    <section id='lessons'>
      <div
        className={`pt-100px`}
      >
        <div
          className={"container-fluid-2"}
        >
          {/* heading */}
          <div data-aos="fade-up" className="mb-5 md:mb-10">
              {subTitle ? <SectionName>{subTitle}</SectionName> : ""}
              <HeadingPrimary data-aos="fade-up">{tag}</HeadingPrimary>
            </div>
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
