import { IconLogo, IconLogoImage, IconTiktok } from "@/assets/icons/IconsComponent";
import { ClassColor } from "@/classes/ClassColor";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { PAGE_HOME, PAGE_NOT_FOUND } from "@/contexts/constants/constants_pages";
import { translateWithVars } from "@/contexts/functions";
import { getPreferredLocale } from "@/contexts/i18n/detect-locale";
import { getTranslations } from "@/contexts/i18n/init";
import { defaultLanguage, languages, NS_ERRORS, NS_HOME_FOOTER, NS_NOT_FOUND } from "@/contexts/i18n/settings";
import { generatePageMetadata } from "@/contexts/seo/metadata";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

export const generateMetadata = generatePageMetadata({
  ns: NS_NOT_FOUND,
  path: PAGE_NOT_FOUND,
});

const FooterComponent = async () => {
  //const { t } = useTranslation([NS_HOME_FOOTER]);
  const locale = await getPreferredLocale();
  const lng = languages.includes(locale) ? locale : defaultLanguage;
  const trans = await getTranslations(lng, NS_HOME_FOOTER);
  const { copyright, allRights = trans['all-rights'] } = trans;
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
          {translateWithVars(copyright, { year: year, website: WEBSITE_NAME })} {allRights}
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
                <IconTiktok icon="ic:baseline-tiktok" width={22} height={22} />
              </Stack>
            </a>
          </li>


        </ul>
      </Stack>
    </Grid>
  </Grid>)
}

const NotFound = async () => {
    const locale = await getPreferredLocale();
  const lng = languages.includes(locale) ? locale : defaultLanguage;
    const trans = await getTranslations(lng, NS_NOT_FOUND);
  const { error404=trans['404'], notFound = trans['not-found'], backHome= trans['back-home'] } = trans;
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
        <Container maxWidth="sm" sx={{ width: '100%', color: ClassColor.WHITE, alignItems: 'center' }} >
          <Stack alignItems={'center'} spacing={1} sx={{textAlign:'center'}}>
            <Typography variant="h4">
            {error404}
          </Typography>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={0} sx={{ color: ClassColor.WHITE }}>
            <Typography variant="h1" sx={{ fontSize: '150px' }}>4</Typography>
            <Box sx={{ width: 'auto', height: '150px', background: '' }}>
              <IconLogoImage width={'100%'} height={'100%'} />
            </Box>
            <Typography variant="h1" sx={{ fontSize: '150px' }}>4</Typography>
          </Stack>
                    <Typography sx={{mt:5}} variant="h5">
            {notFound}
          </Typography>
          </Stack>

          <Stack alignItems={'center'}>
            <Link href={PAGE_HOME} variant="contained" style={{
              background:'var(--primary)',
              padding:'10px 20px',
              borderRadius:'5px',
              marginTop:'20px',
              color: ClassColor.WHITE,
              textDecoration: 'none'
            }}>
            {backHome}
          </Link>
          </Stack>
        </Container>
      </Stack>
      <FooterComponent />
    </Stack>
  </div>);
};

export default NotFound;
