import { IconLogo, IconLogoImage, IconTiktok } from "@/assets/icons/IconsComponent";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { translateWithVars } from "@/contexts/functions";
import { NS_HOME, NS_HOME_FOOTER } from "@/contexts/i18n/settings";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import TextFieldComponent from "../elements/TextFieldComponent";
import { useAuth } from "@/contexts/AuthProvider";
import Preloader from "../shared/Preloader";
import { ClassColor } from "@/classes/ClassColor";
import ButtonNextComponent from "../elements/ButtonNextComponent";
import { useRouter } from "next/navigation";
import { PAGE_DASHBOARD_HOME } from "@/contexts/constants/constants_pages";

const FooterComponent = () => {
  const { t } = useTranslation([NS_HOME_FOOTER]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;

  return (<Grid container spacing={1.5} sx={{ px: 2, py: 1, background: '' }} justifyContent={'center'} alignItems={'center'}>
    <Grid size={{ xs: 12, sm: 3 }}>
      <Stack sx={{ background: '' }} alignItems={{ xs: 'center', sm: 'start' }}>
        <div>
          <IconLogo height={'30px'} width={'100%'} color={'white'} />
        </div>
      </Stack>
    </Grid>
    <Grid sx={{ background: '', justifyContent: 'center' }} alignItems={'center'} size={{ xs: 12, sm: 6 }}>
      <Stack sx={{ textAlign: 'center', background: '' }} alignItems={'center'}>
        <p className="text-whiteColor" >
          {translateWithVars(t('copyright'), { year: year, website: WEBSITE_NAME })} {t('all-rights')}
        </p>
      </Stack>
    </Grid>
    <Grid size={{ xs: 12, sm: 3 }}>
      <Stack sx={{ background: '' }} alignItems={{ xs: 'center', sm: 'end' }}>
        <ul className="flex gap-3 lg:gap-2 2xl:gap-3 lg:justify-end">
          <li>
            <a
              href={WEBSITE_FACEBOOK}
              target={`_blank`}
              className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-fontColor bg-opacity-10 hover:bg-primaryColor text-center"
            >
              <i className="icofont-facebook"></i>
            </a>
          </li>
          <li>
            <a
              href={WEBSITE_LINKEDIN}
              target={`_blank`}
              className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-fontColor bg-opacity-10 hover:bg-primaryColor text-center"
            >
              <i className="icofont-linkedin"></i>
            </a>
          </li>
          <li>
            <a
              href={WEBSITE_TIKTOK}
              target={`_blank`}
              className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-fontColor bg-opacity-10 hover:bg-primaryColor text-center"
            >
              <Stack alignItems={'center'} justifyContent={'center'} sx={{ height: '100%', }}>
                <IconTiktok width={22} height={22} />
              </Stack>
            </a>
          </li>
        </ul>
      </Stack>
    </Grid>
  </Grid>)
}

const LoginPageWrapper = ({ children }) => {
  const { t } = useTranslation([NS_HOME]);
  const router = useRouter();
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  const { user, isLoading } = useAuth();
  if (isLoading) {
    //return (<Preloader />);
  }
  return (<div style={{
    height: '100vh',
    width: '100vw',
    backgroundImage: 'url("/images/login/back.png")',
    backgroundSize: 'cover',        // l'image couvre tout l'écran
    backgroundPosition: 'center',   // centrée
    backgroundRepeat: 'no-repeat',  // pas de répétition
    //background:'red'
  }}>
    <Stack sx={{ background: '', height: '100%', p: 0 }} spacing={1}>
      <Stack direction={'column'} alignItems={'center'} justifyContent={'center'} sx={{ height: '100%', width: '100%', background: '' }}>
        <Container maxWidth="sm" sx={{ width: '100%', bgcolor: '' }} >
          <Stack alignItems={'center'} spacing={2.5} sx={{ color: ClassColor.WHITE }}>
            <Box sx={{ width: 'auto', height: '50px', background: '' }}>
              <IconLogo width={'100%'} height={'100%'} />
             
            </Box>
            {
              user ?
                <Stack spacing={2} alignItems={'center'} sx={{ color: ClassColor.WHITE }}>
                  <Typography variant="h5">{t('already-connected')}</Typography>
                  <ButtonNextComponent
                    //loading={isLoading}
                    label={t('btn-dashboard')}
                    onClick={async () => {
                      router.push(PAGE_DASHBOARD_HOME);
                    }}
                  />
                </Stack>
                : children
            }
          </Stack>
        </Container>
      </Stack>
      <FooterComponent />
    </Stack>
  </div>);
};
export default LoginPageWrapper;
