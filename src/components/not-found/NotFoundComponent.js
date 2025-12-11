"use client"
import { IconLogo, IconLogoImage, IconTiktok } from "@/assets/icons/IconsComponent";
import { ClassColor } from "@/classes/ClassColor";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { PAGE_HOME } from "@/contexts/constants/constants_pages";
import { translateWithVars } from "@/contexts/functions";
import { NS_HOME_FOOTER, NS_NOT_FOUND } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import LoginPageWrapper from "../wrappers/LoginPageWrapper";
const FooterComponent = () => {
    //const { t } = useTranslation([NS_HOME_FOOTER]);
    //const locale = await getPreferredLocale();
    //const lng = languages.includes(locale) ? locale : defaultLanguage;
    //const trans = await getTranslations(lng, NS_HOME_FOOTER);
    const { t } = useTranslation(NS_HOME_FOOTER);
    const copyright = t('copyright');
    const allRights = t('all-rights');
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
export default function NotFoundComponent() {
    //const locale = await getPreferredLocale();
    //const lng = languages.includes(locale) ? locale : defaultLanguage;
    const { mode } = useThemeMode();
    const { t } = useTranslation(NS_NOT_FOUND);
    const error404 = t('404');
    const notFound = t('not-found');
    const backHome = t('back-home');
    return (<LoginPageWrapper>
        <Stack spacing={3} sx={{ color: 'var(--font-color)', width: '100%', py: 3, px: { xs: 3, sm: 5 }, background: 'var(--card-color)', borderRadius: '5px' }}>
            <Stack spacing={1} alignItems={'center'} sx={{ textAlign: 'center' }}>
                <Typography variant="h4">
                    {error404}
                </Typography>
                <Typography variant="caption" sx={{ color: ClassColor.GREY_LIGHT }}>
                    {notFound}
                </Typography>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={0} sx={{ color: "var(--font-color)" }}>
                    <Typography variant="h1" sx={{ fontSize: '60px' }}>4</Typography>
                    <Box sx={{ width: 'auto', height: '40px', color: '' }}>
                        <IconLogoImage width={'100%'} height={'100%'} />
                    </Box>
                    <Typography variant="h1" sx={{ fontSize: '60px' }}>4</Typography>
                </Stack>

            </Stack>
            <Stack alignItems={'center'} justifyContent={'center'}>
                <Link href={PAGE_HOME}>
                    <ButtonConfirm
                        label={backHome}
                    />
                </Link>
            </Stack>
        </Stack>
    </LoginPageWrapper>);
}