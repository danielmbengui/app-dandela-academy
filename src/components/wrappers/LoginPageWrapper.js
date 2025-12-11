import { IconLogo, IconLogoImage, IconTiktok } from "@/assets/icons/IconsComponent";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { translateWithVars } from "@/contexts/functions";
import { languages, NS_HOME, NS_HOME_FOOTER, NS_LANGS, NS_NOT_FOUND } from "@/contexts/i18n/settings";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthProvider";
import Preloader from "../shared/Preloader";
import { ClassColor } from "@/classes/ClassColor";
import { useRouter } from "next/navigation";
import { useThemeMode } from "@/contexts/ThemeProvider";
import SelectComponentDark from "../elements/SelectComponentDark";
import { useLanguage } from "@/contexts/LangProvider";
import { ClassLang } from "@/classes/ClassLang";
import AlreadyConnectedComponent from "./AlreadyConnectedComponent";

const FooterComponent = () => {
  const { t } = useTranslation([NS_HOME_FOOTER]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;

  return (<Grid container spacing={1.5} sx={{background: '', width:'100%' }} justifyContent={'center'} alignItems={'center'}>
    <Grid size={{ xs: 12, sm: 3 }}>
      <Stack sx={{ background: '' }} alignItems={{ xs: 'center', sm: 'start' }}>
        <div>
          <IconLogo height={'30px'} width={'100%'} color={'var(--card-color)'} />
        </div>
      </Stack>
    </Grid>
    <Grid sx={{ background: '', justifyContent: 'center' }} alignItems={'center'} size={{ xs: 12, sm: 6 }}>
      <Stack sx={{ textAlign: 'center', background: '' }} alignItems={'center'}>
        <p style={{ color: "var(--card-color)" }} >
          {translateWithVars(t('copyright'), { year: year, website: WEBSITE_NAME })} {t('all-rights')}
        </p>
      </Stack>
    </Grid>
    <Grid size={{ xs: 12, sm: 3 }}>
      <Stack sx={{ background: '' }} alignItems={{ xs: 'center', sm: 'end' }}>
        <ul className="flex gap-2 lg:gap-1 2xl:gap-2 lg:justify-end">
          <li >
            <a
              href={WEBSITE_FACEBOOK}
              target={`_blank`}
              //className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-fontColor bg-opacity-10 hover:bg-primaryColor text-center"
              className="socials"
            >

              <Stack alignItems={'center'} justifyContent={'center'} sx={{ height: '100%', width: '100%' }}>
                <i className="icofont-facebook"></i>
              </Stack>
            </a>
          </li>
          <li>
            <a
              href={WEBSITE_LINKEDIN}
              target={`_blank`}
              // className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-fontColor bg-opacity-10 hover:bg-primaryColor text-center"
              className="socials"
            >

              <Stack alignItems={'center'} justifyContent={'center'} sx={{ height: '100%', width: '100%' }}>
                <i className="icofont-linkedin"></i>
              </Stack>
            </a>
          </li>
          <li>
            <a
              href={WEBSITE_TIKTOK}
              target={`_blank`}
              //  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-fontColor bg-opacity-10 hover:bg-primaryColor text-center"
              className="socials"
            >
              <Stack alignItems={'center'} justifyContent={'center'} sx={{ height: '100%', width: '100%' }}>
                <IconTiktok width={22} height={22} />
              </Stack>
            </a>
          </li>
        </ul>
      </Stack>
    </Grid>
    <style jsx>{`
          .socials {
            background: var(--card-color);
            color: var(--font-color);
            width:37px;
            height:37px;
            text-align: center;
            border-radius: 5px;
            overflow: hidden;
          }
         
          .socials:hover {
            background: var(--primary);
            color: var(--card-color);
          }
          
          @media (min-width: 900px) {
            .socials {
              width:35px;
              height:35px;
            }
          }
          @media (min-width: 1200px) {
            .socials {
              width:37px;
              height:37px;
            }
          }
        `}</style>
  </Grid>)
}

const LoginPageWrapper = ({ children }) => {
  const { t } = useTranslation([NS_HOME, NS_LANGS]);
  const router = useRouter();
  const { lang, changeLang } = useLanguage();
  const { mode } = useThemeMode();
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;
  const { user, isLoading, logout } = useAuth();
  const LANGS = ClassLang.ALL_LANGUAGES;
  useEffect(()=>{
    async function init() {
      //await logout();
    }
    //init()
  })
  if (user) {
    
    return (<Preloader />);
  }
  return (<Stack 
    alignItems={'center'} justifyContent={'center'}
    //spacing={3}
    direction={'column'}
    sx={{
    //height: '',
    //position:'absolute',
    //top:0,left:0,bottom:0,right:0,
    minHeight: '100vh',
    width: '100vw',
    backgroundImage: `url("/images/login/back-${mode}.png")`,
    backgroundSize: 'cover',        // l'image couvre tout l'écran
    backgroundPosition: 'center',   // centrée
    backgroundRepeat: 'no-repeat',  // pas de répétition
    px:2,
    //py:3,
    //py:3,
    //background:'red'
  }}>
         <Stack alignItems={'center'} justifyContent={'center'} sx={{minHeight:'90vh'}}>
           <Container maxWidth={'sm'} sx={{ width: '100%', bgcolor: '', pt:3 }} >
        <Stack alignItems={'center'} spacing={2.5} sx={{width:'100%', color: ClassColor.WHITE }}>
          <Box sx={{ width: 'auto', height: '50px', background: '' }}>
            <IconLogo width={'100%'} height={'100%'} color={"var(--card-color)"} />
          </Box>

          <SelectComponentDark
            value={lang}
            values={LANGS.map(lang => ({ id: lang.id, value: `${lang.flag_str} ${t(lang.id, { ns: NS_LANGS })}` }))}
            hasNull={false}
            onChange={(e) => {
              const { value } = e.target;
              changeLang(value);
            }}
          />
          {
            user ? <AlreadyConnectedComponent /> : children
          }

        </Stack>
      </Container>
         </Stack>
    <FooterComponent />
  </Stack>);
};
export default LoginPageWrapper;
