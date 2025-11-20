"use client";
import TabButtonSecondary from "@/components/shared/buttons/TabButtonSecondary";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
//import AboutContent from "@/components/shared/overviews/AboutContent";
//import AwardContent from "@/components/shared/overviews/AwardContent";
//import OurMissionContent from "@/components/shared/overviews/OurMissionContent";
//import OurVissionContent from "@/components/shared/overviews/OurVissionContent";
import SectionName from "@/components/shared/section-names/SectionName";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import useTab from "@/hooks/useTab";
import React, { useEffect } from "react";
import useIsTrue from "@/hooks/useIsTrue";
import EducationContent from "@/components/shared/overviews/EducationContent";
//import CourseContent from "@/components/shared/overviews/CourseContent";
import Counter2 from "@/components/sections/sub-section/Counter2";
import Image from "next/image";
import overviewImage from "@/assets/images/about/overview.jpg";
import overviewKidImage from "@/assets/images/about/overview_kg.png";
import missionImage from "@/assets/images/about/mission.jpg";
import vissionImage from "@/assets/images/about/vision.jpg";
import awardImage1 from "@/assets/images/about/award-1.jpg";
import awardImage2 from "@/assets/images/about/award-2.jpg";
import awardImage3 from "@/assets/images/about/award-3.jpg";
import awardImage4 from "@/assets/images/about/award-4.jpg";
import AwardSingle from "@/components/shared/overviews/AwardSingle";
import { useTranslation } from "react-i18next";
import { getJsonValues } from "@/libs/functions";
import { NS_HOME } from "@/libs/i18n/settings";
import { IMAGE_HOME_BUILDING } from "@/libs/constants/constants_images";

const AboutContent = ({ about }) => {
    const { title, content } = about.ul;
    return (
        <div>
            <p className="text-contentColor dark:text-contentColor-dark mb-25px">
                {about['paragraph-1']}
            </p>

            <div className="text-contentColor dark:text-contentColor-dark mb-25px">
                <p className="text-contentColor dark:text-contentColor-dark mb-10px">
                    {title}
                </p>

                <ul className="space-y-3">
                    {
                        content.map((item, i) => {
                            return (<li key={`${item}-${i}`} className="flex items-center group">
                                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                                    {item}
                                </p>
                            </li>)
                        })
                    }
                </ul>
            </div>
            <p className="text-contentColor dark:text-contentColor-dark mb-30px">
                {about['paragraph-2']}
            </p>
            <Image
                src={IMAGE_HOME_BUILDING}
                alt=""
                className="w-full"
                placeholder="blur"
            />
        </div>
    );
};
const OurMissionContent = ({ mission }) => {
    const { title, content } = mission.ul;
    return (
        <div>
            <p className="text-contentColor dark:text-contentColor-dark mb-25px">
                {mission['paragraph-1']}
            </p>
            <div className="text-contentColor dark:text-contentColor-dark mb-25px">
                <p className="text-contentColor dark:text-contentColor-dark mb-10px">
                    {title}
                </p>
                <ul className="space-y-3">
                    {
                        content.map((item, i) => {
                            return (<li key={`${item}-${i}`} className="flex items-center group">
                                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                                    {item}
                                </p>
                            </li>)
                        })
                    }
                </ul>
            </div>
            <p className="text-contentColor dark:text-contentColor-dark mb-30px">
                {mission['paragraph-2']}
            </p>
            <Image src={missionImage} alt="" className="w-full" placeholder="blur" />
        </div>
    );
};
const OurVisionContent = ({ vision }) => {
    const { title, content } = vision.ul;
    return (
        <div>
            <p className="text-contentColor dark:text-contentColor-dark mb-25px">
                {vision['paragraph-1']}
            </p>
            <div className="text-contentColor dark:text-contentColor-dark mb-25px">
                <p className="text-contentColor dark:text-contentColor-dark mb-10px">
                    {title}
                </p>
                <ul className="space-y-3">
                    {
                        content.map((item, i) => {
                            return (<li key={`${item}-${i}`} className="flex items-center group">
                                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                                    {item}
                                </p>
                            </li>)
                        })
                    }
                </ul>
            </div>
            <p className="text-contentColor dark:text-contentColor-dark mb-30px">
                {vision['paragraph-2']}
            </p>

            <Image src={vissionImage} alt="" className="w-full" placeholder="blur" />
        </div>
    );
};
const AwardContent = ({ inefop }) => {
    const { title, content } = inefop.ul;
    const {certificates} = inefop;
    const awards = certificates.map((item, i)=>({
        id:i+1,
        image:i===0?awardImage1 : awardImage2,
        title:item
    }));
    //const awards = [...allAwards];

    return (<>
        <div>
            <p className="text-contentColor dark:text-contentColor-dark mb-25px">
            {inefop['paragraph-1']}
            </p>
            <div className="text-contentColor dark:text-contentColor-dark mb-25px">
                <p className="text-contentColor dark:text-contentColor-dark mb-10px">
                    {title}
                </p>
                <ul className="space-y-3">
                {
                        content.map((item, i) => {
                            return (<li key={`${item}-${i}`} className="flex items-center group">
                                <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                                <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                                    {item}
                                </p>
                            </li>)
                        })
                    }
                </ul>
            </div>
            <p className="text-contentColor dark:text-contentColor-dark mb-30px">
            {inefop['paragraph-2']}
                        </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-30px items-center">
            {awards.map((award, idx) => (
                <AwardSingle key={idx} award={award} />
            ))}
        </div>
    </>

    );
};
const ServicesComponent = () => {
    const { t } = useTranslation([NS_HOME]);
    const { title, tag, about, mission, vision, inefop } = t(`services`, { returnObjects: true });
    const { currentIdx, handleTabClick } = useTab();
    const tabButtons = [
        { name: about.title, content: <AboutContent about={about} /> },
        {
            name: mission.title,
            content: <OurMissionContent mission={mission} />,
        },
        {
            name: vision.title,
            content: <OurVisionContent vision={vision} />,
        },
        {
            name: inefop.title,
            content: <AwardContent inefop={inefop} />,
        },
    ];
    return (
        <section id='services'>
            <div
                className={`container pt-100px pb-20`}
            >
                {/* overview  Heading */}
                <div className="mb-5 md:mb-10 " data-aos="fade-up">
                    <div className="text-center">
                        <SectionName>{tag}</SectionName>
                    </div>

                    <HeadingPrimary text="center">
                        {title}
                    </HeadingPrimary>
                </div>
                {/* overview tabs */}
                <div data-aos="fade-up" className="tab">
                    <div
                        className={`flex flex-wrap md:flex-nowrap  ${"justify-center"
                            } mb-10px lg:mb-50px rounded gap-10px lg:gap-35px`}
                    >
                        {tabButtons.map(({ name }, idx) => (
                            <TabButtonSecondary
                                key={idx}
                                name={name}
                                idx={idx}
                                currentIdx={currentIdx}
                                handleTabClick={handleTabClick}
                            />
                        ))}
                    </div>
                    <div className="tab-contents">
                        {tabButtons.map(({ content }, idx) => (
                            <TabContentWrapper
                                key={idx}
                                idx={idx}
                                isShow={idx === currentIdx || false}
                            >
                                {content}
                            </TabContentWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesComponent;
