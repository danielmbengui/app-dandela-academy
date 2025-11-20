import React from "react";
import Image from "next/image";
import logo from "@/assets/images/logos/logo.png";
import Link from "next/link";
import { Stack } from "@mui/material";
import { IconLogo } from "@/assets/icons/IconsComponent";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { THEME_DARK, THEME_LIGHT } from "@/libs/constants/constants";
import { ClassColor } from "@/classes/ClassColor";
const NavbarLogoOB = () => {
  const {mode,toggleTheme} = useThemeMode();
  return (
    <Stack className="lg:col-start-1 lg:col-span-2">
      <Link href="/" className="w-logo-sm lg:w-logo-lg ">
        {
          mode===THEME_LIGHT && <Image priority={true} src={logo} alt="logo" className="w-full" />
        }
        {
          mode===THEME_DARK && <IconLogo color={ClassColor.WHITE} width={'100%'} height={'100%'} />
        }
      </Link>
    </Stack>
  );
};

export default NavbarLogoOB;
