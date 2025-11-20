"use client";
import { useTranslation } from "react-i18next";
import MobileMenuItemsHome from "./MobileItemsHome";
import MobileSocial from "./MobileSocial";
import MobileMenuClose from "@/components/shared/buttons/MobileMenuClose";
import useIsTrue from "@/hooks/useIsTrue";
import { NS_BUTTONS } from "@/libs/i18n/settings";
import { PAGE_LOGIN } from "@/libs/constants/constants_pages";
import Link from "next/link";
import SelectLang from "./SelectLang";
import MobileMenuItemsDashboard from "./MobileItemsDashboard";

const MobileMenuDashboard = () => {
  const { t } = useTranslation([NS_BUTTONS]);
  return (
    <div className="mobile-menu w-mobile-menu-sm md:w-mobile-menu-lg fixed top-0 -right-[280px] md:-right-[330px] transition-all duration-500 w-mobile-menu h-full shadow-dropdown-secodary bg-whiteColor dark:bg-whiteColor-dark z-high block lg:hidden">
      <MobileMenuClose />

      {/*  mobile menu wrapper */}
      <div className="px-5 md:px-30px pt-3 md:pt-10 pb-50px h-full overflow-y-auto">
        {/*  mobile menu accordions */}
        <MobileMenuItemsDashboard />
        {/*  my account accordion
        
        <MobileMyAccount />
        */}

        <div className="accordion-container mt-4.5 pb-4.5 border-b border-borderColor dark:border-borderColor-dark">
          <SelectLang />
        </div>
        <div className="accordion-container py-25px border-b border-borderColor dark:border-borderColor-dark">
          <Link
            href={PAGE_LOGIN}
            //style={{width:'90%'}}
            className="w-100% text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
          >
            {t(`${NS_BUTTONS}:connect`)}
          </Link>
        </div>
        {/*  Mobile menu social area */}

        <MobileSocial />
      </div>
    </div>
  );
};

export default MobileMenuDashboard;
