import Image from "next/image";
import React from "react";
import logo from "@/assets/images/logos/logo.png";
import logo1 from "@/assets/images/logo/logo_1.png";
import Link from "next/link";
import { Stack } from "@mui/material";
import { IconLogo } from "@/assets/icons/IconsComponent";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { THEME_DARK, THEME_LIGHT } from "@/libs/constants/constants";
import { ClassColor } from "@/classes/ClassColor";
const NavbarLogo = () => {
  const {mode,toggleTheme} = useThemeMode();
  return (
    <Stack className="lg:col-start-1 lg:col-span-2">
      <Link href="/" className="w-logo-sm lg:w-logo-lg ">
        {
          mode===THEME_LIGHT && <Image prioriy="fasle" src={logo} alt="logo" className="w-full" />
        }
        {
          mode===THEME_DARK && <IconLogo color={ClassColor.WHITE} width={'100%'} height={'100%'} />
        }
      </Link>
    </Stack>
  );
};

export default NavbarLogo;
