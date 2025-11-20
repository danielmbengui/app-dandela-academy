import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { NS_HOME } from "@/libs/i18n/settings";
import { IMAGE_PARNER_NG_ANALYTICS, IMAGE_PARNER_NG_LEARNING, IMAGE_PARTNER_INEFOP, IMAGE_PARTNER_MMS_MEMORIAL } from "@/libs/constants/constants_images";
import { Stack } from "@mui/material";
import { LINK_INEFOP } from "@/libs/constants/constants";
import HeadingHome from "./HeadingHome";
const PartnersComponent = () => {
  const { t } = useTranslation([NS_HOME]);
  const { title} = t(`partners`, { returnObjects: true });

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
          <HeadingHome text="center">
            {title}
          </HeadingHome>
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
