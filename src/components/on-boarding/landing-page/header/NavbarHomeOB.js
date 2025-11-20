"use client";
import NavItemsHomeOB from "./NavItemsHomeOB";
import NavbarRightHomeOB from "./NavbarRightHomeOB";
import { Stack } from "@mui/material";
import NavbarLogoOB from "../../NavbarLogoOB";
import { usePathname } from "next/navigation";
import { PAGE_HOME } from "@/libs/constants/constants_pages";

const NavbarHomeOB = () => {
  const path = usePathname();
  return (
    <div
      className={`bg-menuBg transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark`}
    >
      <nav>
        <Stack sx={{ px: { xs: 2, sm: 15 },py:1.5,bgcolor:''}} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <NavbarLogoOB />
          {/* Main menu */}
         <div className={`${path !== PAGE_HOME ? 'hidden' : ''}`}>
         <NavItemsHomeOB />
         </div>

          {/* navbar right */}
          <NavbarRightHomeOB />
        </Stack>
      </nav>
    </div>
  );
};

export default NavbarHomeOB;
