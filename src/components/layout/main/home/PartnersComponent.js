import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import React, { useEffect } from "react";
import brandImage1 from "@/assets/images/partners/inefop.png";
import brandImage2 from "@/assets/images/brand/brand_2.png";
import brandImage3 from "@/assets/images/brand/brand_3.png";
import brandImage4 from "@/assets/images/brand/brand_4.png";
import brandImage5 from "@/assets/images/brand/brand_5.png";
import brandImage6 from "@/assets/images/brand/brand_6.png";
import brandImage7 from "@/assets/images/brand/brand_7.png";
import brandImage8 from "@/assets/images/brand/brand_8.png";
import brandImage9 from "@/assets/images/brand/brand_9.png";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { NS_HOME } from "@/libs/i18n/settings";
import { IMAGE_PARNER_NG_ANALYTICS, IMAGE_PARNER_NG_LEARNING, IMAGE_PARTNER_INEFOP, IMAGE_PARTNER_MMS_MEMORIAL } from "@/libs/constants/constants_images";
import { Stack } from "@mui/material";
import { LINK_INEFOP } from "@/libs/constants/constants";
const PartnersComponent = () => {
  const { t } = useTranslation([NS_HOME]);
  const { title, subtitle,form, bubble, goals, tag,content, about, mission, vision, inefop } = t(`partners`, { returnObjects: true });
  useEffect(()=>{
    console.log("REGISTER", title)
  })
  const brands = [
    {link:LINK_INEFOP,image:IMAGE_PARTNER_INEFOP},
    {image:IMAGE_PARNER_NG_LEARNING},
    {image:IMAGE_PARTNER_MMS_MEMORIAL},
    {image:IMAGE_PARNER_NG_ANALYTICS},
  ];
  return (
    <section id='partners' className="dark:bg-lightGrey10-dark ">
      <div className="container pt-100px pb-60px">
        {/* Brands Heading  */}
        <div className="mb-5 md:mb-10" data-aos="fade-up">
          <HeadingPrimary text="center">
            {title}
          </HeadingPrimary>
        </div>
        {/* brands  */}
        <div className="flex flex-wrap justify-center">
          {brands.map((brand, idx) => (
            <Stack
            justifyContent={'center'}
            alignItems={'center'}
              key={idx}
              className="basis-1/2 md:basis-1/4 lg:basis-1/5"
              data-aos="fade-up"
            >
              {
                brand.link ? <Link
                href={brand.link || ''}
                target={'_blank'}
                className="pt-25px pb-45px text-center w-full flex justify-center"
              >
                <Image src={brand.image} style={{height:'auto',maxHeight:'100px',width:'auto'}} alt="" />
              </Link> : <div
                //href={brand.link || ''}
                //target={'_blank'}
                className="pt-25px pb-45px text-center w-full flex justify-center"
              >
                <Image src={brand.image} style={{height:'auto',maxHeight:'100px',width:'auto'}} alt="" />
              </div>
              }
            </Stack>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersComponent;
