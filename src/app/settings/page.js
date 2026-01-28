"use client";
import React, { useState } from 'react';
import { IconDashboard, IconEmail, IconLogo, IconProfile, IconSettings, IconTiktok } from "@/assets/icons/IconsComponent";
import LoginPageWrapper from "@/components/wrappers/LoginPageWrapper";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { translateWithVars } from "@/contexts/functions";
import { NS_DASHBOARD_CALENDAR, NS_DASHBOARD_HOME, NS_DASHBOARD_MENU, NS_PROFILE, NS_HOME_FOOTER, NS_SETTINGS } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import TextFieldComponent from '@/components/elements/TextFieldComponent';
import TextFieldPasswordComponent from '@/components/elements/TextFieldPasswordComponent';
import ButtonNextComponent from '@/components/elements/ButtonNextComponent';
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import ProfileComponent from '@/components/dashboard/profile/ProfileComponent';
import SettingsComponent from '@/components/settings/SettingsComponent';

export default function SettingsPage() {
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_SETTINGS]);

  return (<DashboardPageWrapper 
    titles={[
      { name: t('settings', { ns: NS_DASHBOARD_MENU }), url: '' },
      //{ name: lesson?.translate?.title, url: '' }
    ]}
    //title={`Cours / ${lesson?.title}`}
    //subtitle={lesson?.translate?.subtitle}
    icon={<IconSettings width={22} height={22} />}
  subtitle={t('subtitle')} 
>
   <Stack sx={{background:'', width:'100%'}}>
     <SettingsComponent />
   </Stack>
  </DashboardPageWrapper>)
}
