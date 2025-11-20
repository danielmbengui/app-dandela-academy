"use client";
import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { NS_BUTTONS, NS_LANGS } from "@/contexts/i18n/settings";
import { PAGE_HOME, PAGE_WAITING_LIST } from "@/contexts/constants/constants_pages";
import { useAuth } from "@/contexts/AuthProvider";
import { usePathname } from "next/navigation";
import MobileMenuOpen from "./mobile/MobileMenuOpen";
import LoginButton from "../others/LoginButton";
import SelectLang from "../others/SelectLang";

const NavbarRight = () => {
  const { t } = useTranslation([NS_LANGS, NS_BUTTONS]);
  const {user}=useAuth();
  const path = usePathname();

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
        !user && <li className={`hidden lg:${path !== PAGE_HOME ? 'hidden' : 'block'}`}>
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

export default NavbarRight;
