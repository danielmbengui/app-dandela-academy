"use client";
import React, { useEffect } from "react";
import DropdownCart from "./DropdownCart";
import Link from "next/link";
import MobileMenuOpen from "@/components/shared/buttons/MobileMenuOpen";
import useIsTrue from "@/hooks/useIsTrue";
import LoginButton from "./LoginButton";
import Image from "next/image";
import flagImage1 from "@/assets/images/icon/flag1.webp";
import flagImage2 from "@/assets/images/icon/flag1.webp";
import flagImage3 from "@/assets/images/icon/flag1.webp";
//import flagImage2 from "@/assets/images/flags/flag-fr.png";
//import flagImage3 from "@/assets/images/flags/flag-pt.png";
//import flagImage2 from "@/assets/images/icon/flag2.webp";
//import flagImage3 from "@/assets/images/icon/flag3.webp";
import DropdownWrapper from "@/components/shared/wrappers/DropdownWrapper";
import { useLanguage } from "@/contexts/LangProvider";
import { useTranslation } from "react-i18next";
import { NS_BUTTONS, NS_LANGS } from "@/libs/i18n/settings";
import { Box } from "@mui/material";
import { PAGE_LOGIN, PAGE_WAITING_LIST } from "@/libs/constants/constants_pages";
import SelectLang from "./SelectLang";
import { useAuth } from "@/contexts/AuthProvider";

const NavbarRightHome = () => {
  const { t } = useTranslation([NS_LANGS, NS_BUTTONS]);
  const {user}=useAuth();
  const { lang, changeLang, classLang, list } = useLanguage();
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  const isHome2Dark = useIsTrue("/home-2-dark");
  useEffect(() => {
    console.log("GLAD", classLang?.flag)
  })
  return (
    <div className="lg:col-start-10 lg:col-span-3">
      <ul className="relative nav-list flex justify-end items-center">

        <div className="col-start-1 col-span-3 hidden lg:block">
        <SelectLang />
        </div>
        {
          user && <li className="hidden lg:block">
          <LoginButton />
        </li>
        }
       {
        !user &&  <li className="hidden lg:block">
        <Link
          href={PAGE_WAITING_LIST}
          className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-1 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
        >
          {t(`${NS_BUTTONS}:subscribe`)}
        </Link>
      </li>
       }
        <li className="block lg:hidden">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRightHome;
