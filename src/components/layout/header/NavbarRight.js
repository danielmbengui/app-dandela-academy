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
import { PAGE_LOGIN } from "@/libs/constants/constants_pages";

const NavbarRight = () => {
  const { t } = useTranslation([NS_LANGS,NS_BUTTONS]);
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

        {!isHome2Dark && (<div className="col-start-1 col-span-3 hidden lg:block">
          <ul className="flex items-center nav-list">
            <li className="relative group">
              <button className="text-contentColor dark:text-contentColor-dark pr-10px flex items-center">
                <Image
                  src={classLang?.flag}
                  width={50}
                  height={50}
                  alt=""
                  className="w-auto h-3 mr-1 rounded-sm"
                />
                {t(`${NS_LANGS}:${classLang.id}`)}
                <i className="icofont-rounded-down"></i>
              </button>
              {/* dropdown menu  */}
              <DropdownWrapper>
                <div className="shadow-dropdown3 max-w-dropdown2 w-2000 rounded-standard bg-white dark:bg-whiteColor-dark">
                  <ul>
                    {
                      list.filter(item => item.id !== classLang?.id).map((item, i) => {
                        return (<li key={`${item.id}-${i}`}>
                          <Box
                            onClick={(e) => {
                              e.preventDefault();
                              changeLang(item.id);
                            }}
                            sx={{cursor:'pointer'}}
                            className="flex items-center text-size-13 text-blackColor p-10px transition duration-300 hover:bg-darkdeep4 hover:text-whiteColor dark:text-blackColor-dark dark:hover:text-whiteColor-dark dark:hover:bg-darkdeep4"
                          >
                            <Image
                              src={item.flag}
                              alt=""
                              width={50}
                              height={50}
                              className="w-auto h-10px rounded-sm mr-10px"
                            />
                            {t(`${NS_LANGS}:${item.id}`)}
                          </Box>
                        </li>)
                      })
                    }
                  </ul>
                </div>
              </DropdownWrapper>
            </li>
          </ul>
        </div>)}
        <li className="hidden lg:block" style={{display:'none'}}>
            <LoginButton />
          </li>
        <li className="hidden lg:block">
          <Link
            href={PAGE_LOGIN}
            className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
          >
            {isHome2Dark
              ? "Get Started Free"
              : isHome4 || isHome4Dark || isHome5 || isHome5Dark
                ? "Get Start Here"
                : t(`${NS_BUTTONS}:connect`)}
          </Link>
        </li>
        <li className="block lg:hidden">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRight;
