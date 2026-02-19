"use client";
import React, { useEffect, useState } from 'react';
import { IconEmail, IconLogo, IconLogoImage, IconTiktok } from "@/assets/icons/IconsComponent";
import LoginPageWrapper from "@/components/wrappers/LoginPageWrapper";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { translateWithVars } from "@/contexts/functions";
import { NS_HOME, NS_HOME_FOOTER } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import TextFieldComponent from '@/components/elements/TextFieldComponent';
import TextFieldPasswordComponent from '@/components/elements/TextFieldPasswordComponent';
import ButtonNextComponent from '@/components/elements/ButtonNextComponent';
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import { useRouter } from 'next/navigation';
import { PAGE_ACTIVE_ACCOUNT, PAGE_DASHBOARD_HOME, PAGE_LOGIN } from '@/contexts/constants/constants_pages';
import { ClassColor } from '@/classes/ClassColor';
import HomeComponent from '@/components/home/HomeComponent';
import { useInternet } from '@/contexts/InternetProvider';
import NoInternetComponent from '@/components/not-internet/NoInternetComponent';

export default function Home() {
  const {isOnline} = useInternet();
  if(!isOnline) {
    return(<NoInternetComponent />)
  }
  return (<LoginPageWrapper>
    <HomeComponent />
  </LoginPageWrapper>);
}
