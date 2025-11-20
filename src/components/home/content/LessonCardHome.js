"use client";
import React from "react";
import { IMAGE_HOME_TUTOR_AFONSO } from "@/contexts/constants/constants_images";
import { PAGE_WAITING_LIST } from "@/contexts/constants/constants_pages";
import { NS_BUTTONS, NS_HOME, NS_LEVELS, NS_ROLES } from "@/contexts/i18n/settings";
import { Button, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FaPhone, FaWhatsapp, FaClock } from 'react-icons/fa';
import { IconCertificate, IconEmail, IconLevel } from "@/assets/icons/IconsComponent";
import { WEBSITE_EMAIL_INFO, WEBSITE_LOCATION, WEBSITE_PHONE_NUMBER, WEBSITE_WHATSAPP } from "@/contexts/constants/constants";

let insId = 0;
const LessonCardHome = ({ course, type}) => {
  const { t } = useTranslation([NS_HOME, NS_ROLES, NS_LEVELS,NS_BUTTONS]);
  const free = t(`free`);
  const {location, contact} = t(`lessons`, {returnObjects:true});
  const {
    id,
    title,
    subtitle,
    certified,
    certified_text,
    level,
    lessons,
    duration,
    image,
    price,
    isFree,
    insName,
    tutor,
    test,
    role,
    insImg,
    categories,
    filterOption,
    tag,
    isActive,
    isCompleted,
    completedParchent,
  } = course;
  //const{name} = test;
  const depBgs = [
    {
      category: "Art & Design",
      bg: "bg-secondaryColor",
    },
    {
      category: "Data & Tech",
      bg: "bg-secondaryColor",
    },

    {
      category: "Development",
      bg: "bg-blue",
    },

    {
      category: "Lifestyle",
      bg: "bg-secondaryColor2",
    },

    {
      category: "Web Design",
      bg: "bg-greencolor2",
    },

    {
      category: "Business",
      bg: "bg-orange",
    },

    {
      category: "Art & Design",
      bg: "bg-yellow",
    },
    {
      category: "Data & Tech",
      bg: "bg-yellow",
    },
    {
      category: "Personal Development",
      bg: "bg-secondaryColor",
    },

    {
      category: "Marketing",
      bg: "bg-blue",
    },

    {
      category: "Photography",
      bg: "bg-secondaryColor2",
    },

    {
      category: "Data Science",
      bg: "bg-greencolor2",
    },

    {
      category: "Health & Fitness",
      bg: "bg-orange",
    },

    {
      category: "Mobile Application",
      bg: "bg-yellow",
    },
  ];

  const cardBg = depBgs?.find(
    ({ category: category1 }) => category1 === categories
  )?.bg;
  insId = id;
  insId = insId % 6 ? insId % 6 : 6;
  return (
    <div
      className={`group  ${type === "primary" || type === "primaryMd"
        ? ""
        : `w-full sm:w-1/2 lg:w-1/3 grid-item`
        } ${filterOption ? filterOption : ""}`}
    >
      <div href={PAGE_WAITING_LIST}>
        <div className={`  ${type === "primaryMd" ? "" : "sm:px-15px  mb-30px"}`}>
          <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
            {/* card image */}
            <div className="relative mb-2">
              <div
                href={PAGE_WAITING_LIST}
                className="w-full overflow-hidden rounded"
              >
                <Image
                  src={image}
                  alt=""
                  priority={true}
                  className="w-full overflow-hidden rounded h-200px transition-all duration-300 group-hover:scale-110"
                />
              </div>
              <div className="hidden absolute left-0 top-1 flex justify-between w-full items-center px-2">
                <div>
                  <p
                    className={`text-xs text-whiteColor px-4 py-[3px]  rounded font-semibold ${'bg-secondaryColor'}`}
                  >
                    {t('soon-online')}
                  </p>
                </div>
              </div>
            </div>
            {/* card content */}
            <Grid container spacing={1.5} className="mb-3">
              <Grid size='auto'>
                <Stack spacing={0.5} className="flex items-center" direction={'row'} alignItems={'center'}>
                  <IconLevel className="icofont-book-alt pr-5px text-primaryColor text-lg" />
                  <p>{t(`${NS_LEVELS}:${level}`)}</p>
                </Stack>
              </Grid>
              <Grid size='auto'>
                <Stack spacing={0.5} className="flex items-center" direction={'row'} alignItems={'center'}>
                  <FaClock className="text-primaryColor" />
                  <p>{duration}</p>
                </Stack>
              </Grid>
              {
                certified && <Grid size='auto'>
                  <Stack spacing={0.5} className="flex items-center" direction={'row'} alignItems={'center'}>
                    <IconCertificate className="text-primaryColor text-lg" />
                    <p>{certified_text}</p>
                  </Stack>
                </Grid>
              }
            </Grid>
            <div>
              <h5 className={`mb-5px ${type === "primaryMd" ? "text-lg " : "text-xl "}`}>
                <div
                  //href={`/courses/${id}`}
                  className={`font-semibold text-primaryColor dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor ${type === "primaryMd" ? "leading-25px" : "leading-27px "
                    } `}
                >
                  {title}
                </div>
              </h5>
              <span className={`text-md`}>
                <div
                  //href={`/courses/${id}`}
                  className={`text-contentColor dark:text-contentColor-dark mb-10px hover:text-primaryColor dark:hover:text-primaryColor ${type === "primaryMd" ? "leading-25px" : "leading-27px "
                    } `}
                >
                  {subtitle}
                </div>
              </span>
              {/* location */}
              <Stack className="py-10px border-t border-borderColor" alignItems={'center'}>
                <Typography className="text-contentColor dark:text-contentColor-dark">{location}</Typography>
                <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                  <i className="icofont-location-pin text-size-14 mr-0.5px"></i>
                  <p>{WEBSITE_LOCATION}</p>
                </Stack>
              </Stack>

              {/* contact */}
              <Stack className="py-10px text-primaryColor border-t border-borderColor" alignItems={'center'}>
                <Typography className="text-contentColor dark:text-contentColor-dark">{contact}</Typography>
                <Grid className="text-primaryColor" justifyContent={'center'} container columnSpacing={1.5} >
                  <Grid size='auto'>
                    <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                      <FaPhone size={12} />
                      <Link href={`tel:${WEBSITE_PHONE_NUMBER}`}>{WEBSITE_PHONE_NUMBER}</Link>
                    </Stack></Grid>
                  <Grid size='auto'> <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                    <FaWhatsapp size={12} />
                    <Link  href={`tel:${WEBSITE_WHATSAPP}`}>{WEBSITE_WHATSAPP}</Link>
                  </Stack></Grid>
                  <Grid size='auto'> <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                    <IconEmail width={14} height={14} />
                    <Link href={`mailto:${WEBSITE_EMAIL_INFO}`}>{WEBSITE_EMAIL_INFO}</Link>
                  </Stack></Grid>
                </Grid>
              </Stack>

              {/* tutor */}
              <Stack spacing={1} alignItems={'center'} className="bg-bodyBg rounded-lg grid grid-cols-1 md:grid-cols-2 py-10px">
                <h6>
                  <div
                    className="text-base flex items-center content-center hover:text-primaryColor dark:text-blackColor-dark dark:hover:text-primaryColor"
                  >
                    <Image
                      className="w-[45px] h-[45px] rounded-full mr-15px"
                      src={IMAGE_HOME_TUTOR_AFONSO}
                      alt=""
                      placeholder="blur"
                    />
                    <Stack>
                      <span className="whitespace-nowrap font-bold">{test?.first_name} {test?.last_name?.toUpperCase()}</span>
                      <span className="whitespace-nowrap">{t(`${NS_ROLES}:${role}`)}</span>
                    </Stack>
                  </div>
                </h6>
                <div className="text-lg font-semibold text-primaryColor">
                  {price.toLocaleString("pt-AO")} Kz
                  {
                    course['old-price'] && <del className="text-sm text-lightGrey4 font-semibold ml-1">
                      / {course['old-price'].toLocaleString("pt-AO")} Kz
                    </del>
                  }

                  <span
                    className={`ml-6 text-base font-semibold ${isFree ? " text-greencolor" : " text-secondaryColor3"
                      }`}
                  >
                    {isFree ? free : <del>{free}</del>}
                  </span>
                </div>
              </Stack>

              {/* price */}
              <Stack alignItems={'center'} justifyContent={'center'} spacing={1} sx={{ bgcolor: '' }} className="py-15px text-lg font-semibold text-primaryColor">
              <Link href={`tel:${test?.phone}`} style={{textAlign:'center'}}>
              <Button
                  variant={'outlined'}
                  startIcon={<FaPhone size={12} />}
                >
                  {`${test?.first_name}`}
                </Button>
              </Link>
                <Link href={PAGE_WAITING_LIST}>
                <Button
                  variant={'contained'}>
                  {t(`${NS_BUTTONS}:subscribe`)}
                </Button>
                </Link>
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCardHome;
