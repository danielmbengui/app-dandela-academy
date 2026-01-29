import { IconLogo, IconLogoImage, IconTiktok } from "@/assets/icons/IconsComponent";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_NAME, WEBSITE_START_YEAR, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { PAGE_TERMS_PRIVACY, PAGE_TERMS_USAGE } from "@/contexts/constants/constants_pages";
import { translateWithVars } from "@/contexts/functions";
import { languages, NS_HOME, NS_HOME_FOOTER, NS_LANGS, NS_NOT_FOUND, NS_TERMS_PRIVACY, NS_TERMS_USAGE } from "@/contexts/i18n/settings";
import Link from "next/link";
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

const FooterLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      href={href} 
      className="footer-link"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        color: isHovered ? 'var(--primary)' : 'var(--font-color)', 
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
        opacity: isHovered ? 1 : 0.9,
        borderBottom: isHovered ? '1px solid var(--primary)' : '1px solid transparent',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease'
      }}
    >
      {children}
    </Link>
  );
};

const FooterComponent = () => {
  const { t } = useTranslation([NS_HOME_FOOTER, NS_TERMS_USAGE, NS_TERMS_PRIVACY]);
  const now = new Date();
  const year = now.getFullYear() > WEBSITE_START_YEAR ? `${WEBSITE_START_YEAR}-${now.getFullYear()}` : WEBSITE_START_YEAR;

  return (<footer className="footer-wrapper">
    <Grid container spacing={2} sx={{ width:'100%', py:{xs:4,sm:3}, px:{xs:2,sm:3} }} justifyContent={'center'} alignItems={'center'}>
      <Grid size={{ xs: 12, sm: 3 }}>
        <Stack sx={{ alignItems: { xs: 'center', sm: 'start' }, gap: 1 }}>
          <nav className="footer-links">
            <FooterLink href={PAGE_TERMS_USAGE}>
              {t('title', { ns: NS_TERMS_USAGE })}
            </FooterLink>
            <FooterLink href={PAGE_TERMS_PRIVACY}>
              {t('title', { ns: NS_TERMS_PRIVACY })}
            </FooterLink>
          </nav>
        </Stack>
      </Grid>
      <Grid sx={{ justifyContent: 'center' }} alignItems={'center'} size={{ xs: 12, sm: 6 }}>
        <Stack sx={{ textAlign: 'center' }} alignItems={'center'}>
          <p className="footer-copyright">
            {translateWithVars(t('copyright'), { year: year, website: WEBSITE_NAME })} {t('all-rights')}
          </p>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <Stack sx={{ alignItems: { xs: 'center', sm: 'end' } }}>
          <ul className="socials-list">
            <li>
              <a
                href={WEBSITE_FACEBOOK}
                target={`_blank`}
                rel="noopener noreferrer"
                className="social-link social-facebook"
                aria-label="Facebook"
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
                rel="noopener noreferrer"
                className="social-link social-linkedin"
                aria-label="LinkedIn"
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
                rel="noopener noreferrer"
                className="social-link social-tiktok"
                aria-label="TikTok"
              >
                <Stack alignItems={'center'} justifyContent={'center'} sx={{ height: '100%', width: '100%' }}>
                  <IconTiktok width={20} height={20} />
                </Stack>
              </a>
            </li>
          </ul>
        </Stack>
      </Grid>
    </Grid>
    <style jsx>{`
      .footer-wrapper {
        width: 100%;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        margin-top: auto;
        padding-top: 24px;
      }

      :global(.dark) .footer-wrapper {
        border-top-color: rgba(255, 255, 255, 0.15);
      }

      .footer-links {
        display: flex;
        flex-direction: row;
        gap: 16px;
        align-items: center;
        flex-wrap: wrap;
      }

      @media (max-width: 600px) {
        .footer-links {
          justify-content: center;
          gap: 12px;
        }
      }

      .footer-link {
        display: inline-block;
      }

      :global(.dark) .footer-link {
        opacity: 1 !important;
      }

      :global(a.footer-link:hover),
      :global(.footer-link:hover) {
        opacity: 1 !important;
        color: var(--primary) !important;
        border-bottom-color: var(--primary) !important;
      }

      :global(.dark) :global(a.footer-link:hover),
      :global(.dark) :global(.footer-link:hover) {
        color: var(--primary) !important;
        opacity: 1 !important;
        border-bottom-color: var(--primary) !important;
      }

      .footer-copyright {
        color: var(--font-color);
        font-size: 0.875rem;
        margin: 0;
        opacity: 0.9;
        line-height: 1.6;
      }

      .socials-list {
        display: flex;
        gap: 12px;
        list-style: none;
        padding: 0;
        margin: 0;
        justify-content: center;
      }

      @media (min-width: 600px) {
        .socials-list {
          gap: 10px;
        }
      }

      @media (min-width: 1200px) {
        .socials-list {
          gap: 12px;
        }
      }

      .social-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: var(--card-color);
        color: var(--font-color);
        border-radius: 10px;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid var(--card-border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      :global(.dark) .social-link {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.15);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        color: var(--font-color);
      }

      .social-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      :global(.dark) .social-link:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }

      .social-facebook:hover {
        background: #1877f2 !important;
        color: white !important;
        border-color: #1877f2 !important;
      }

      .social-linkedin:hover {
        background: #0077b5 !important;
        color: white !important;
        border-color: #0077b5 !important;
      }

      .social-tiktok:hover {
        background: #000000;
        color: white;
        border-color: #000000;
      }

      :global(.dark) .social-tiktok:hover {
        background: #ff0050 !important;
        color: white !important;
        border-color: #ff0050 !important;
      }

      @media (min-width: 900px) {
        .social-link {
          width: 38px;
          height: 38px;
        }
      }

      @media (min-width: 1200px) {
        .social-link {
          width: 40px;
          height: 40px;
        }
      }
    `}</style>
  </footer>)
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
  useEffect(() => {
    if (user && user.uid) {
      //router.push(PAGE_DASHBOARD_HOME);
    }
  }, [user]);
  if (isLoading) {
    return (<Preloader />);
  }
  return (<div className="page-wrapper">
    <Stack 
      alignItems={'center'} 
      justifyContent={'center'}
      direction={'column'}
      sx={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        background: mode === 'dark' 
          ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f1419 75%, #000000 100%)'
          : 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 25%, #ffffff 50%, #f5f7fa 75%, #eef2f6 100%)',
        backgroundAttachment: 'fixed',
        px: {xs: 0, sm: 2},
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack 
        alignItems={'center'} 
        justifyContent={'center'} 
        sx={{
          minHeight: '90vh',
          flex: 1,
          width: '100%',
        }}
      >
        <Container maxWidth={'sm'} sx={{ width: '100%', pt: {xs: 2, sm: 3}, pb: 2 }}>
          <Stack 
            alignItems={'center'} 
            spacing={3} 
            sx={{ width: '100%' }}
            className="main-content"
          >
            <Box 
              sx={{ 
                width: 'auto', 
                height: '56px',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              className="logo-container"
            >
              <IconLogo width={'100%'} height={'100%'} color={"var(--font-color)"} />
            </Box>
<Stack alignItems={'center'}>
<SelectComponentDark
                value={lang}
                values={LANGS.map(lang => ({ id: lang.id, value: `${lang.flag_str} ${t(lang.id, { ns: NS_LANGS })}` }))}
                hasNull={false}
                onChange={(e) => {
                  const { value } = e.target;
                  changeLang(value);
                }}
              />
</Stack>

            <div className="children-wrapper">
              {user ? <AlreadyConnectedComponent /> : children}
            </div>
          </Stack>
        </Container>
      </Stack>
      
      <FooterComponent />
    </Stack>
    <style jsx>{`
      .page-wrapper {
        min-height: 100vh;
        width: 100%;
        max-width: 100vw;
        overflow-x: hidden;
        position: relative;
      }

      .main-content {
        animation: fadeIn 0.6s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .logo-container {
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
      }

      :global(.dark) .logo-container {
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
      }

      .language-selector-wrapper {
        width: 100%;
        max-width: 280px;
        transition: transform 0.2s ease;
      }

      .language-selector-wrapper:hover {
        transform: translateY(-1px);
      }

      .children-wrapper {
        width: 100%;
        animation: slideUp 0.5s ease-out 0.2s both;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 600px) {
        .logo-container {
          height: 48px !important;
        }

        .language-selector-wrapper {
          max-width: 100%;
        }
      }
    `}</style>
  </div>);
};
export default LoginPageWrapper;
