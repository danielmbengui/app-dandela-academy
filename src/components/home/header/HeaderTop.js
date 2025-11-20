"use client";
import React from "react";
import Link from "next/link";
import { IconEmail, IconTiktok } from "@/assets/icons/IconsComponent";
import { WEBSITE_EMAIL_INFO, WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_LOCATION, WEBSITE_PHONE_NUMBER, WEBSITE_TIKTOK, WEBSITE_WHATSAPP } from "@/contexts/constants/constants";
import { Stack } from "@mui/material";
import { FaPhone, FaWhatsapp,} from 'react-icons/fa';
const HeaderTop = () => {

  return (
    <div className="bg-blackColor2 dark:bg-lightGrey10-dark hidden lg:block">
      <div
        className={`container 3xl:container-secondary-lg 4xl:container mx-auto text-whiteColor text-size-12 xl:text-sm py-5px xl:py-9px`}
      >

        <div className="flex justify-between items-center">
          <Stack direction={'row'} alignItems={'center'} spacing={1.5}>

            <Link href={`tel:${WEBSITE_PHONE_NUMBER}`}>
              <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                <FaPhone size={12} />
                <p>{WEBSITE_PHONE_NUMBER}</p>
              </Stack>
            </Link>
            <Link href={`tel:${WEBSITE_WHATSAPP}`}>
              <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                <FaWhatsapp size={12} />
                <p>{WEBSITE_WHATSAPP}</p>
              </Stack>
            </Link>
            <Link href={`mailto:${WEBSITE_EMAIL_INFO}`}>
              <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                <IconEmail width={14} height={14} />
                <p>{WEBSITE_EMAIL_INFO}</p>
              </Stack>
            </Link>
            <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
              <i className="icofont-location-pin text-size-14 mr-0.5px"></i>
              <p>{WEBSITE_LOCATION}</p>
            </Stack>
          </Stack>
          <div className="flex gap-37px items-center">
            <div>
              {/* header social list  */}
              <ul className="flex gap-[18px] text-size-15">
                <li>
                  <a
                    className="hover:text-secondaryColor"
                    target={`_blank`}
                    href={WEBSITE_FACEBOOK}
                  >
                    <i className="icofont-facebook"></i>
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-secondaryColor"
                    target={`_blank`}
                    href={WEBSITE_LINKEDIN}
                  >
                    <i className="icofont-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-secondaryColor"
                    href={WEBSITE_TIKTOK}
                    target={`_blank`}
                  >
                    <IconTiktok icon="ic:baseline-tiktok" width="18" height="18" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
