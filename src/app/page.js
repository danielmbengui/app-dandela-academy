"use client";
import React, { useState } from 'react';
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
import { PAGE_ACTIVE_ACCOUNT, PAGE_LOGIN } from '@/contexts/constants/constants_pages';
import { ClassColor } from '@/classes/ClassColor';

const HomePageComponent = () => {
  return (<Stack>

  </Stack>)
}



export default function Home() {
  const router = useRouter();
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_HOME]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout } = useAuth();
  return (<LoginPageWrapper>
<Stack sx={{width:'100%'}} spacing={2}>
      <Stack alignItems={'center'} sx={{textAlign:'center'}}>
      <Typography variant="h4">
        {t('title')}
      </Typography>
      <Typography sx={{ color: ClassColor.GREY_HYPER_LIGHT, fontStyle:'italic' }} variant="h5">
        {t('subtitle')}
      </Typography>
    </Stack>
    <Stack spacing={2} alignItems={'center'} justifyContent={'center'} direction={{ xs: 'column', sm: 'row' }} sx={{ width: '100%', background: '' }}>
      <ButtonNextComponent
        //loading={isLoading}
        label={t('btn-login')}
        onClick={async () => {
          router.push(PAGE_LOGIN);
        }}
        fullWidth
      />
      <ButtonNextComponent
        //loading={isLoading}
        label={t('btn-activate')}
        onClick={async () => {
          router.push(PAGE_ACTIVE_ACCOUNT);
        }}
        fullWidth
      />
    </Stack>
</Stack>
  </LoginPageWrapper>);
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
