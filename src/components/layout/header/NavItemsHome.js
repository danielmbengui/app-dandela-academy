import React from "react";
import DropdownHome from "./DropdownHome";
import DropdownCourses2 from "./DropdownCourses2";
import DropdownBlog from "./DropdownBlog";
import DropdownPages2 from "./DropdownPages2";
import Navitem from "./Navitem";
import DropdownWrapper from "@/components/shared/wrappers/DropdownWrapper";
import { useTranslation } from "react-i18next";
import { NS_HOME_MENU } from "@/libs/i18n/settings";
import { PAGE_CONTACT } from "@/libs/constants/constants_pages";

const NavItemsHome = () => {
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
export default NavItemsHome;
