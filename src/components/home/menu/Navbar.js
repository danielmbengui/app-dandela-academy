"use client";
import { Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import { PAGE_HOME } from "@/contexts/constants/constants_pages";
import NavItems from "./NavItems";
import NavbarRight from "./NavbarRight";
import NavbarLogo from "./NavbarLogo";

const Navbar = () => {
  const path = usePathname();
  return (
    <div
      className={`bg-menuBg transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark`}
    >
      <nav>
        <Stack sx={{ px: { xs: 2, sm: 15 },py:1.5,bgcolor:''}} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <NavbarLogo />
          {/* Main menu */}
         <div className={`${path !== PAGE_HOME ? 'hidden' : ''}`}>
         <NavItems />
         </div>

          {/* navbar right */}
          <NavbarRight />
        </Stack>
      </nav>
    </div>
  );
};

export default Navbar;
