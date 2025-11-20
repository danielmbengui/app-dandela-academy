"use client";
import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { NS_BUTTONS, NS_LANGS } from "@/libs/i18n/settings";
import { PAGE_HOME, PAGE_WAITING_LIST } from "@/libs/constants/constants_pages";
import { useAuth } from "@/contexts/AuthProvider";
import { usePathname } from "next/navigation";
import SelectLangOB from "@/components/on-boarding/SelectLangOB";
import MobileMenuOpenOB from "@/components/on-boarding/MobileMenuOpenOB";

const NavbarRightDashboard = () => {
  const { t } = useTranslation([NS_LANGS, NS_BUTTONS]);
  const {user}=useAuth();
  const path = usePathname();

  return (
    <div className="lg:col-start-10 lg:col-span-3">
      <ul className="relative nav-list flex justify-end items-center">

        <div className="col-start-1 col-span-3 hidden lg:block">
        <SelectLangOB />
        </div>
        {
          user && <li className="hidden lg:block">
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
          <MobileMenuOpenOB />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRightDashboard;
