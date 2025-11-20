import Scrollup from "../shared/Scrollup";
import React from "react";
import { IconLogo, IconTiktok } from "@/assets/icons/IconsComponent";
import Link from "next/link";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { NS_HOME_FOOTER } from "@/contexts/i18n/settings";
import { translateWithVars } from "@/contexts/functions";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { useThemeMode } from "@/contexts/ThemeProvider";

const LoginPageWrapper = ({ children }) => {
  return (<div style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: 'url("/images/login/back.png")',
        backgroundSize: 'cover',        // l'image couvre tout l'écran
        backgroundPosition: 'center',   // centrée
        backgroundRepeat: 'no-repeat',  // pas de répétition
        //background:'red'
      }}>
    {children}
  </div>);
};
export default LoginPageWrapper;
