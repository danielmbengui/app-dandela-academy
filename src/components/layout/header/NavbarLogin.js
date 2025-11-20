"use client";
import NavbarLogo from "@/components/layout/header/NavbarLogo";
import NavbarRightLogin from "./NavbarRightLogin";
import { Stack } from "@mui/material";

const NavbarLogin = () => {
  return (
    <div
      className={`bg-menuBg transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark`}
    >
      <nav>
        <Stack sx={{px:{xs:2,sm:15},py:1.5}} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <NavbarLogo />
        <NavbarRightLogin />
        </Stack>
      </nav>
    </div>
  );
};

export default NavbarLogin;
