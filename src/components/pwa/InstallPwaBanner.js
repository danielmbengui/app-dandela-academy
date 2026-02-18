"use client";

import { usePwa } from "@/contexts/PwaProvider";
import { Backdrop, Stack, Typography, Box } from "@mui/material";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { IconLogoImage } from "@/assets/icons/IconsComponent";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { NS_PWA } from "@/contexts/i18n/settings";

export default function InstallPwaBanner({ showPwaComponent = false, skipAction = () => { } }) {

  const { isBrowser, isPWA, isMacOS, isSafari, isIOS, canInstall, promptInstall, installPwa } = usePwa();
  const { theme } = useThemeMode();
  const { cardColor, text } = theme.palette;
  const { t } = useTranslation([NS_PWA]);

  if (!isBrowser) return null;

  const CardContent = ({ children, steps, t }) => (
    <Box
      sx={{
        maxWidth: { xs: '90%', sm: '500px' },
        width: '100%',
        background: `linear-gradient(135deg, ${cardColor.main} 0%, ${cardColor.main} 100%)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
        p: { xs: 2.5, sm: 3.5 },
        color: text.main,
        position: 'relative',
        overflow: 'hidden',
        animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, var(--primary) 0%, var(--blue-cyan) 100%)`,
          borderRadius: '24px 24px 0 0',
        }
      }}
    >
      <Stack spacing={2.5} alignItems={'center'}>
        <Stack direction={'row'} spacing={1.5} alignItems={'center'} justifyContent={'center'} sx={{ width: '100%', justifyContent: 'center' }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: '12px', 
            background: 'rgba(17, 96, 229, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconLogoImage />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {t('app-title', { ns: NS_PWA })}
          </Typography>
        </Stack>
        
        <Typography sx={{ 
          textAlign: 'center', 
          fontSize: { xs: '0.95rem', sm: '1rem' },
          color: text.main,
          lineHeight: 1.6
        }}>
          {t('description', { ns: NS_PWA })}
        </Typography>
        
        <Stack direction={'row'} spacing={2} flexWrap="wrap" justifyContent="center" sx={{ width: '100%' }}>
          <Typography sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            color: 'var(--grey-light)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            ⚡ {t('faster', { ns: NS_PWA })}
          </Typography>
          <Typography sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            color: 'var(--grey-light)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            🔔 {t('notifications', { ns: NS_PWA })}
          </Typography>
          <Typography sx={{ 
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            color: 'var(--grey-light)',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            📱 {t('native-experience', { ns: NS_PWA })}
          </Typography>
        </Stack>
        
        {steps && (
          <Box sx={{ 
            width: '100%', 
            py: 2.5,
            px: 2,
            borderRadius: '16px',
            background: 'rgba(17, 96, 229, 0.05)',
            border: '1px solid rgba(17, 96, 229, 0.1)'
          }}>
            {steps}
          </Box>
        )}
        
        {children}
      </Stack>
    </Box>
  );

  return (<>
    <Backdrop
      sx={{ 
        zIndex: 1_000_000_000, 
        background: 'rgba(0, 0, 0, 0.4)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'opacity 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out',
        borderTopLeftRadius: { xs: 0, sm: '15px' } 
      }}
      open={showPwaComponent}
      onClick={skipAction}
      >
      <Stack 
        spacing={2} 
        alignItems={'center'} 
        justifyContent={'center'} 
        onClick={(e) => e.stopPropagation()}
        sx={{ 
          p: { xs: 0, sm: 2 }, 
          //background: 'red', 
          height: '100%', 
          width: '100%',
        }}>
        <div className="pwa-banner"   style={{
    color: "white",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  }}>
          {
            !isPWA && <>
              {
                isSafari && <>
                  {
                    isIOS && <CardContent
                      steps={
                        <Stack spacing={2}>
                          <Typography fontWeight={600} sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            {t('installation-steps', { ns: NS_PWA })}
                          </Typography>
                          <Box component="ol" sx={{ 
                            m: 0, 
                            pl: 3,
                            '& li': {
                              mb: 1.5,
                              fontSize: { xs: '0.9rem', sm: '0.95rem' },
                              lineHeight: 1.6,
                              '& b': {
                                fontWeight: 600,
                                color: 'var(--primary)'
                              }
                            }
                          }}>
                            <li dangerouslySetInnerHTML={{ __html: t('ios-step-1', { ns: NS_PWA }) }} />
                            <li dangerouslySetInnerHTML={{ __html: t('ios-step-2', { ns: NS_PWA }) }} />
                            <li dangerouslySetInnerHTML={{ __html: t('ios-step-3', { ns: NS_PWA }) }} />
                          </Box>
                          <Typography sx={{ 
                            fontSize: { xs: '0.85rem', sm: '0.9rem' },
                            color: 'var(--grey-light)',
                            fontStyle: 'italic',
                            mt: 1
                          }}>
                            {t('ios-note', { ns: NS_PWA })}
                          </Typography>
                        </Stack>
                      }
                    >
                      <Stack direction={'row'} spacing={1.5} alignItems={'center'} sx={{ width: '100%', justifyContent: 'center', pt: 1 }}>
                        <ButtonCancel onClick={skipAction} label={t('later', { ns: NS_PWA })} />
                      </Stack>
                    </CardContent>
                  }
                  {
                    isMacOS && <CardContent
                      t={t}
                      steps={
                        <Stack spacing={2}>
                          <Typography fontWeight={600} sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            {t('installation-steps', { ns: NS_PWA })}
                          </Typography>
                          <Box component="ol" sx={{ 
                            m: 0, 
                            pl: 3,
                            '& li': {
                              mb: 1.5,
                              fontSize: { xs: '0.9rem', sm: '0.95rem' },
                              lineHeight: 1.6,
                              '& b': {
                                fontWeight: 600,
                                color: 'var(--primary)'
                              }
                            }
                          }}>
                            <li dangerouslySetInnerHTML={{ __html: t('macos-step-1', { ns: NS_PWA }) }} />
                            <li dangerouslySetInnerHTML={{ __html: t('macos-step-2', { ns: NS_PWA }) }} />
                            <li dangerouslySetInnerHTML={{ __html: t('macos-step-3', { ns: NS_PWA }) }} />
                          </Box>
                          <Typography sx={{ 
                            fontSize: { xs: '0.85rem', sm: '0.9rem' },
                            color: 'var(--grey-light)',
                            fontStyle: 'italic',
                            mt: 1
                          }}>
                            {t('macos-note', { ns: NS_PWA })}
                          </Typography>
                        </Stack>
                      }
                    >
                      <Stack direction={'row'} spacing={1.5} alignItems={'center'} sx={{ width: '100%', justifyContent: 'center', pt: 1 }}>
                        <ButtonCancel onClick={skipAction} label={t('later', { ns: NS_PWA })} />
                      </Stack>
                    </CardContent>
                  }
                </>
              }
              {
                !isSafari && canInstall && <CardContent t={t}>
                  <Stack direction={'row'} spacing={1.5} alignItems={'center'} sx={{ width: '100%', justifyContent: 'center', pt: 1 }}>
                    <ButtonCancel label={t('later', { ns: NS_PWA })} onClick={skipAction} />
                    <ButtonConfirm label={t('install', { ns: NS_PWA })} onClick={installPwa} />
                  </Stack>
                </CardContent>
              }
            </>
          }
        </div>
      </Stack>
    </Backdrop>
    <style jsx>{`
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}
    </style>
  </>);
}
