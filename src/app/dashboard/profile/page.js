"use client";
import React, { useState } from 'react';
import { IconDashboard, IconEmail, IconLogo, IconProfile, IconTiktok } from "@/assets/icons/IconsComponent";
import LoginPageWrapper from "@/components/wrappers/LoginPageWrapper";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { translateWithVars } from "@/contexts/functions";
import { NS_DASHBOARD_CALENDAR, NS_DASHBOARD_HOME, NS_DASHBOARD_MENU, NS_DASHBOARD_PROFILE, NS_HOME_FOOTER } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import TextFieldComponent from '@/components/elements/TextFieldComponent';
import TextFieldPasswordComponent from '@/components/elements/TextFieldPasswordComponent';
import ButtonNextComponent from '@/components/elements/ButtonNextComponent';
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import ProfileComponent from '@/components/dashboard/profile/ProfileComponent';

const LoginComponent = () => {
  return (<Stack>

  </Stack>)
}



export default function DashboardCalendar() {
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_DASHBOARD_PROFILE]);

  return (<DashboardPageWrapper title={t('title')} subtitle={t('subtitle')} icon={<IconProfile width={22} height={22} />}>
    En construction...
   <Stack sx={{background:'', width:'100%'}}>
     <ProfileComponent />
   </Stack>
  </DashboardPageWrapper>)
  /*
  return (
    <LoginPageWrapper>
            <Typography>
              Se connecter
            </Typography>
            <Stack spacing={1}>
              <TextFieldComponent
                //label='email'
                name='email'
                icon={<IconEmail width={20} />}
                placeholder='adress'
                value={email}
                onChange={(e) => {
                  e.preventDefault();
                  setEmail(e.target.value);
                }}
                onClear={() => {
                  setEmail('');
                }}

              />
              <TextFieldPasswordComponent
                //label='email'
                name='password'
                placeholder='password'
                value={password}
                onChange={(e) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
                onClear={() => {
                  setPassword('');
                }}

              />
            </Stack>
            <ButtonNextComponent 
            label='Se connecter'
            onClick={()=>{
              login(email, password);
            }}
            />
    </LoginPageWrapper>
  );
  */
}
