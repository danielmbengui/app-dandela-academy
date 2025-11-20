import { IconLogo, IconTiktok } from "@/assets/icons/IconsComponent";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { translateWithVars } from "@/contexts/functions";
import { NS_HOME_FOOTER } from "@/contexts/i18n/settings";
import { Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import TextFieldComponent from "../elements/TextFieldComponent";


const LoginPageWrapper = ({ children }) => {
  const { t } = useTranslation([NS_HOME_FOOTER]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  return (<div style={{
    height: '100vh',
    width: '100vw',
    backgroundImage: 'url("/images/login/back.png")',
    backgroundSize: 'cover',        // l'image couvre tout l'écran
    backgroundPosition: 'center',   // centrée
    backgroundRepeat: 'no-repeat',  // pas de répétition
    //background:'red'
  }}>
    <Stack sx={{ background: '', height: '100%', p: '10px' }} spacing={1}>
      <Stack direction={'column'} alignItems={'center'} justifyContent={'center'} sx={{ height: '100%', width: '100%', background: '' }}>
        <Stack spacing={3} sx={{ py: 3, px: 5, background: 'white', borderRadius: '10px' }}>
          {children}
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
  </div>);
};
export default LoginPageWrapper;
