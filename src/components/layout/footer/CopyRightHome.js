import Image from "next/image";
import React from "react";
import logoImage from "@/assets/images/logo/logo_2.png";
import { IconLogo, IconTiktok } from "@/assets/icons/IconsComponent";
import { LOGO_DANDELA, LOGO_DANDELA_ICON } from "@/libs/constants/constants_images";
import Link from "next/link";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { NS_HOME_FOOTER } from "@/libs/i18n/settings";
import { translateWithVars } from "@/libs/functions";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/libs/constants/constants";
const CopyRightHome = () => {
  const {t}=useTranslation([NS_HOME_FOOTER]);
  const now = new Date();
  const year = now.getFullYear()>WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-30px pt-10 items-center">
        <div className="lg:col-start-1 lg:col-span-3">
        <Stack alignItems={'start'}>
           <Link href={"/"}>
           <IconLogo height={'35px'} width={'100%'} color={'white'} />
            </Link>
           </Stack>
        </div>

        <div className="lg:col-start-4 lg:col-span-6">
          <p className="text-whiteColor">
            {translateWithVars(t('copyright'),{year:year,website:WEBSITE_NAME})} {t('all-rights')}
          </p>
        </div>

        <div className="lg:col-start-10 lg:col-span-3">
          <ul className="flex gap-3 lg:gap-2 2xl:gap-3 lg:justify-end">
            <li>
              <a
                href={WEBSITE_FACEBOOK}
                target={`_blank`}
                className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-secondaryColor text-center"
              >
                <i className="icofont-facebook"></i>
              </a>
            </li>
            <li>
              <a
                href={WEBSITE_LINKEDIN}
                target={`_blank`}
                className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-secondaryColor text-center"
              >
                <i className="icofont-linkedin"></i>
              </a>
            </li>
            <li>
              <a
                href={WEBSITE_TIKTOK}
                target={`_blank`}
                className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-secondaryColor text-center"
              >
                 <Stack alignItems={'center'} justifyContent={'center'} sx={{height:'100%',}}>
                 <IconTiktok icon="ic:baseline-tiktok" width={22} height={22}  />
                 </Stack>
              </a>
            </li>

           
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CopyRightHome;
