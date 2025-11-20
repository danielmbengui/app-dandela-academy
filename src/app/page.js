"use client";
import React, { useState } from 'react';
import { IconEmail, IconLogo, IconTiktok } from "@/assets/icons/IconsComponent";
import ThemeController from "@/components/shared/ThemeController";
import CopyRight from "@/components/wrappers/footer/CopyRight";
import LoginPageWrapper from "@/components/wrappers/LoginPageWrapper";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { translateWithVars } from "@/contexts/functions";
import { NS_HOME_FOOTER } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextFieldComponent from '@/components/elements/TextFieldComponent';
import TextFieldPasswordComponent from '@/components/elements/TextFieldPasswordComponent';
import ButtonNextComponent from '@/components/elements/ButtonNextComponent';
import { useAuth } from '@/contexts/AuthProvider';

const LoginComponent = () => {
  return (<Stack>

  </Stack>)
}



export default function Home() {
  const { theme } = useThemeMode();
  const { text } = theme.palette;
  const { t } = useTranslation([NS_HOME_FOOTER]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {user, login, logout} = useAuth();
  if (user) {
    return (<div>
      Vous êtes déjà connecté en tant que {user.email}
         <ButtonNextComponent 
            label='Se deconnecter'
            onClick={()=>{
              logout();
            }}
            />
    </div>);
  }
  return (
    <LoginPageWrapper>
      <Stack sx={{ background: '', height: '100%', p: '10px' }} spacing={1}>
        <Stack direction={'column'} alignItems={'center'} justifyContent={'center'} sx={{ height: '100%', width: '100%', background: '' }}>
          <Stack spacing={3} sx={{ py:5,px: 8, background: 'white', borderRadius: '10px' }}>
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
          </Stack>

        </Stack>
        <Grid container sx={{ background: '' }} justifyContent={'center'} alignItems={'center'}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack sx={{ background: '' }} alignItems={'start'}>
              <div>
                <IconLogo height={'30px'} width={'100%'} color={'white'} />
              </div>
            </Stack>
          </Grid>
          <Grid sx={{ background: '', justifyContent: 'center' }} alignItems={'center'} size={{ xs: 12, sm: 6 }}>
            <Stack sx={{ background: '' }} alignItems={'center'}>
              <p className="text-whiteColor">
                {translateWithVars(t('copyright'), { year: year, website: WEBSITE_NAME })} {t('all-rights')}
              </p>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack sx={{ background: '' }} alignItems={'end'}>
              <ul className="flex gap-3 lg:gap-2 2xl:gap-3 lg:justify-end">
                <li>
                  <a
                    href={WEBSITE_FACEBOOK}
                    target={`_blank`}
                    className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-fontColor bg-opacity-10 hover:bg-secondaryColor text-center"
                  >
                    <i className="icofont-facebook"></i>
                  </a>
                </li>
                <li>
                  <a
                    href={WEBSITE_LINKEDIN}
                    target={`_blank`}
                    className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-fontColor bg-opacity-10 hover:bg-secondaryColor text-center"
                  >
                    <i className="icofont-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a
                    href={WEBSITE_TIKTOK}
                    target={`_blank`}
                    className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-fontColor bg-opacity-10 hover:bg-secondaryColor text-center"
                  >
                    <Stack alignItems={'center'} justifyContent={'center'} sx={{ height: '100%', }}>
                      <IconTiktok icon="ic:baseline-tiktok" width={22} height={22} />
                    </Stack>
                  </a>
                </li>


              </ul>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </LoginPageWrapper>
  );
}
