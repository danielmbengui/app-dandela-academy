import React from "react";
import { useTranslation } from "react-i18next";
import { NS_HOME_MENU } from "@/contexts/i18n/settings";
import { PAGE_CONTACT } from "@/contexts/constants/constants_pages";
import Navitem from "./Navitem";
import DropdownWrapper from "../others/DropdownWrapper";

const NavItems = () => {
  const {t} = useTranslation([NS_HOME_MENU])
  const navItems = [
    {
      id: 1,
      name: t(`about`),
      path: "/#about",
      dropdown: null,
      isRelative: false,
    },
    {
      id: 2,
      name: t(`services`),
      path: "/#services",
      dropdown: null,
      isRelative: false,
    },
    {
      id: 3,
      name: t(`lessons`),
      path: "/#lessons",
      dropdown: null,
      isRelative: false,
    },
    {
      id: 4,
      name: t(`partners`),
      path: "/#partners",
      dropdown: null,
      isRelative: false,
    },
    {
      id: 5,
      name: t(`contact`),
      path: PAGE_CONTACT,
      dropdown: null,
      isRelative: false,
    },
  ];
  return (
    <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
      <ul className="nav-list flex justify-center">
        {navItems.map((navItem, idx) => (
          <Navitem key={idx} idx={idx} navItem={{ ...navItem, idx: idx }}>
            <DropdownWrapper>{navItem.dropdown}</DropdownWrapper>
          </Navitem>
        ))}
      </ul>
    </div>
  );
};
export default NavItems;
