"use client";
import React, { useEffect } from "react";
import MobileMenuOpen from "@/components/shared/buttons/MobileMenuOpen";
import useIsTrue from "@/hooks/useIsTrue";
import { useLanguage } from "@/contexts/LangProvider";
import { useTranslation } from "react-i18next";
import { NS_BUTTONS, NS_LANGS } from "@/libs/i18n/settings";
import SelectLang from "./SelectLang";

const NavbarRightLogin = () => {
  const { classLang } = useLanguage();
  return (
    <div className="">
      <ul className="relative nav-list flex justify-end items-center">

      <div className="col-start-1 hidden lg:block">
          <SelectLang />
        </div>

        <li className="block lg:hidden">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRightLogin;
