"use client";
import { useTranslation } from "react-i18next";
import MobileMenuItemsHome from "./MobileItemsHome";
import MobileSocial from "./MobileSocial";
import MobileMenuClose from "@/components/shared/buttons/MobileMenuClose";
import { NS_BUTTONS } from "@/libs/i18n/settings";
import { PAGE_LOGIN, PAGE_WAITING_LIST } from "@/libs/constants/constants_pages";
import Link from "next/link";
import SelectLang from "./SelectLang";
import { WEBSITE_EMAIL_INFO, WEBSITE_LOCATION, WEBSITE_PHONE_NUMBER, WEBSITE_WHATSAPP } from "@/libs/constants/constants";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { IconEmail } from "@/assets/icons/IconsComponent";
import { Stack } from "@mui/material";

const MobileMenuHome = () => {
  const { t } = useTranslation([NS_BUTTONS]);
  return (
    <div className="mobile-menu w-mobile-menu-sm md:w-mobile-menu-lg fixed top-0 -right-[280px] md:-right-[330px] transition-all duration-500 w-mobile-menu h-full shadow-dropdown-secodary bg-whiteColor dark:bg-whiteColor-dark z-high block lg:hidden">
      <MobileMenuClose />

      {/*  mobile menu wrapper */}
      <div className="px-5 md:px-30px pt-3 md:pt-10 pb-50px h-full overflow-y-auto">
        {/*  mobile menu accordions */}
        <MobileMenuItemsHome />
        {/*  my account accordion
        
        <MobileMyAccount />
        */}

        <div className="accordion-container mt-4.5 pb-4.5 border-b border-borderColor dark:border-borderColor-dark">
          <SelectLang />
        </div>
        <div className="accordion-container py-25px border-b border-borderColor dark:border-borderColor-dark">
          <Link
            href={PAGE_WAITING_LIST}
            //style={{width:'90%'}}
            className="w-100% text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
          >
            {t(`${NS_BUTTONS}:subscribe`)}
          </Link>
        </div>
        {/*  Mobile menu social area */}
        <div className="accordion-container py-25px border-b border-borderColor dark:border-borderColor-dark">
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
            <Link href={`mailto:${WEBSITE_EMAIL_INFO}`} style={{textWrap:'nowrap'}}>
              <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
                <IconEmail width={14} height={14} />
                <p>{WEBSITE_EMAIL_INFO}</p>
              </Stack>
            </Link>
            <Stack direction={'row'} alignItems={'center'} spacing={0.5}>
              <i className="icofont-location-pin text-size-14 mr-0.5px"></i>
              <p>{WEBSITE_LOCATION}</p>
            </Stack>
        </div>
        <MobileSocial />
      </div>
    </div>
  );
};

export default MobileMenuHome;
