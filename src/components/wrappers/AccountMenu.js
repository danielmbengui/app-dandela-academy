import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Logout from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import SettingsBrightness from '@mui/icons-material/SettingsBrightness';
import { useAuth } from '@/contexts/AuthProvider';
import { Stack } from '@mui/material';
import { IconDownloadDesktopApp, IconDownloadMobileApp, IconDropDown, IconProfile, IconSettings } from '@/assets/icons/IconsComponent';
import { useUserDevice } from '@/contexts/UserDeviceProvider';
import { usePwa } from '@/contexts/PwaProvider';
import { usePathname } from 'next/navigation';
import { PAGE_DASHBOARD_PROFILE, PAGE_SETTINGS } from '@/contexts/constants/constants_pages';
import { useRouter } from 'next/navigation';
import { NS_DASHBOARD_MENU, NS_PWA, NS_BUTTONS, NS_COMMON, NS_LANGS, NS_SETTINGS } from '@/contexts/i18n/settings';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LangProvider';
import { useThemeMode } from '@/contexts/ThemeProvider';
import { THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/contexts/constants/constants';

export default function AccountMenu() {
  const {t} = useTranslation([NS_DASHBOARD_MENU, NS_PWA, NS_BUTTONS, NS_COMMON, NS_LANGS, NS_SETTINGS]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { lang, changeLang, list: languages } = useLanguage();
  const { modeApp, mode, changeTheme } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);
  const [langMenuAnchorEl, setLangMenuAnchorEl] = useState(null);
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const langMenuOpen = Boolean(langMenuAnchorEl);
  const themeMenuOpen = Boolean(themeMenuAnchorEl);
  const { isMobile, isLaptop, device, hasScreen } = useUserDevice();
  const [showPwa, setShowPwa] = useState(false);
  const path = usePathname();
  const { show, setShow, isPwa } = usePwa();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setLangMenuAnchorEl(null);
    setThemeMenuAnchorEl(null);
  };
  const handleLangMenuClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!langMenuOpen) {
      setLangMenuAnchorEl(event.currentTarget);
    } else {
      setLangMenuAnchorEl(null);
    }
  };
  const handleLangMenuClose = () => {
    setLangMenuAnchorEl(null);
  };
  const handleLanguageChange = (langId) => {
    changeLang(langId);
    handleLangMenuClose();
    handleClose();
  };
  const handleThemeMenuClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!themeMenuOpen) {
      setThemeMenuAnchorEl(event.currentTarget);
    } else {
      setThemeMenuAnchorEl(null);
    }
  };
  const handleThemeMenuClose = () => {
    setThemeMenuAnchorEl(null);
  };
  const handleThemeChange = (themeId) => {
    changeTheme(themeId);
    handleThemeMenuClose();
    handleClose();
  };
  const currentLanguage = languages.find(l => l.id === lang) || languages[0];
  const themes = [
    { id: THEME_LIGHT, label: t('light', { ns: NS_COMMON }), icon: <LightMode fontSize="small" /> },
    { id: THEME_DARK, label: t('dark', { ns: NS_COMMON }), icon: <DarkMode fontSize="small" /> },
    { id: THEME_SYSTEM, label: t('system', { ns: NS_COMMON }), icon: <SettingsBrightness fontSize="small" /> },
  ];
  const currentTheme = themes.find(theme => theme.id === modeApp) || themes[0];
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Stack 
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined} 
          onClick={handleClick} 
          direction={'row'} 
          spacing={0.75} 
          alignItems={'center'}
          sx={{
            fontWeight: 600,
            py: 0.5,
            px: 1,
            height: '100%',
            color: 'var(--primary)',
            border: '1.5px solid var(--primary)',
            borderRadius: '24px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--primary-shadow-xs) 0%, var(--primary-shadow) 100%)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--primary-shadow-sm) 0%, var(--primary-shadow-xs) 100%)',
              borderColor: 'var(--primary)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px var(--primary-shadow-md)',
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }}
        >
          {
            user?.showAvatar({ size: 22, fontSize: '5px' })
          }
          <Stack>
            <Typography variant={'string'} noWrap fontSize={'13px'} sx={{ fontWeight: 600, color: 'var(--primary)' }}>
              {user?.getCompleteName() || ''}
            </Typography>
          </Stack>
          <Box sx={{ 
            transition: 'transform 0.3s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            <IconDropDown height={6} />
          </Box>
        </Stack>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={(e) => {
          // Ne pas fermer si on clique sur le menu de langue ou de thème
          if (e.target.closest('[data-lang-menu]') || e.target.closest('#lang-submenu') || 
              e.target.closest('[data-theme-menu]') || e.target.closest('#theme-submenu')) {
            return;
          }
          handleClose();
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.15))',
              mt: 1.5,
              borderRadius: '16px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-color)',
              minWidth: 240,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'var(--card-color)',
                border: '1px solid var(--card-border)',
                borderBottom: 'none',
                borderRight: 'none',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
              '& .MuiMenuItem-root': {
                borderRadius: '8px',
                margin: '1px 8px',
                padding: '8px 12px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                color: 'var(--font-color)',
                '&:hover': {
                  backgroundColor: 'var(--primary-shadow-xs)',
                  color: 'var(--primary)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'var(--primary-shadow-sm)',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--primary-shadow-md)',
                  }
                }
              },
              '& .MuiDivider-root': {
                margin: '4px 12px',
                borderColor: 'var(--card-border)',
              }
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {
          /*
          user?.menuDashboard()?.map((menuItem) => {
            return (<MenuItem key={`${menuItem.name}`} onClick={() => {
              if (!path?.includes(PAGE_DASHBOARD_PROFILE)) {
                router.push(PAGE_DASHBOARD_PROFILE);
                handleClose();
              }
            }} selected={path?.includes(menuItem.path)}>
              <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
                {menuItem.icon} <Typography>{t(menuItem.name)}</Typography>
              </Stack>
            </MenuItem>)
          })
          */
        }
        <MenuItem 
          onClick={() => {
            if (!path?.includes(PAGE_DASHBOARD_PROFILE)) {
              router.push(PAGE_DASHBOARD_PROFILE);
              handleClose();
            }
          }} 
          selected={path?.includes(PAGE_DASHBOARD_PROFILE)}
          sx={{
            '& .MuiListItemIcon-root': {
              minWidth: 40,
              color: path?.includes(PAGE_DASHBOARD_PROFILE) ? 'var(--primary)' : 'var(--font-color)',
            }
          }}
        >
          <ListItemIcon>
            <IconProfile height={20} width={20} />
          </ListItemIcon>
          <Typography sx={{ 
            fontWeight: path?.includes(PAGE_DASHBOARD_PROFILE) ? 600 : 400,
            fontSize: '0.9rem'
          }}>
            {t('profile', { ns: NS_DASHBOARD_MENU })}
          </Typography>
        </MenuItem>
        <Divider />
        {
          !isPwa && <Stack>
            <Typography sx={{ 
              ml: 2.5, 
              mt: 1,
              mb: 0.5,
              fontWeight: 600, 
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--grey-light)'
            }}>
              {t('app-title', { ns: NS_PWA })}
            </Typography>
            <MenuItem 
              onClick={() => {
                setShow(true);
                handleClose();
              }}
              sx={{
                '& .MuiListItemIcon-root': {
                  minWidth: 40,
                }
              }}
            >
              <ListItemIcon>
                {
                  hasScreen ? <IconDownloadDesktopApp width={20} height={20} /> : <IconDownloadMobileApp width={20} height={20} />
                }
              </ListItemIcon>
              <Typography sx={{ fontSize: '0.9rem', color: 'var(--font-color)' }}>
                {t('download-app', { ns: NS_PWA })}
              </Typography>
            </MenuItem>
            <Divider />
          </Stack>
        }

        <MenuItem 
          onClick={() => {
            if (!path?.includes(PAGE_SETTINGS)) {
              router.push(PAGE_SETTINGS);
              handleClose();
            }
          }} 
          selected={path?.includes(PAGE_SETTINGS)}
          sx={{
            '& .MuiListItemIcon-root': {
              minWidth: 40,
              color: path?.includes(PAGE_SETTINGS) ? 'var(--primary)' : 'var(--font-color)',
            }
          }}
        >
          <ListItemIcon>
            <IconSettings height={20} width={20} />
          </ListItemIcon>
          <Typography sx={{ 
            fontWeight: path?.includes(PAGE_SETTINGS) ? 600 : 400,
            fontSize: '0.9rem',
            color: 'var(--font-color)'
          }}>
            {t('settings', { ns: NS_DASHBOARD_MENU })}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleLangMenuClick}
          data-lang-menu
          sx={{
            '& .MuiListItemIcon-root': {
              minWidth: 40,
              color: langMenuOpen ? 'var(--primary)' : 'var(--font-color)',
            },
            backgroundColor: langMenuOpen ? 'var(--primary-shadow)' : 'transparent',
          }}
        >
          <ListItemIcon>
            <LanguageIcon fontSize="small" />
          </ListItemIcon>
          <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{ flex: 1, justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: langMenuOpen ? 600 : 400, color: 'var(--font-color)' }}>
              {t('language', { ns: NS_COMMON })}
            </Typography>
            {currentLanguage && (
              <Stack direction={'row'} alignItems={'center'} spacing={0.75}>
                {currentLanguage.flag_str && (
                  <Typography sx={{ fontSize: '1.1rem' }}>{currentLanguage.flag_str}</Typography>
                )}
                <Typography sx={{ 
                  fontSize: '0.8rem', 
                  color: langMenuOpen ? 'var(--primary)' : 'var(--grey-light)',
                  fontWeight: 500
                }}>
                  {t(currentLanguage.id, { ns: NS_LANGS })}
                </Typography>
              </Stack>
            )}
          </Stack>
        </MenuItem>
        <Menu
          id="lang-submenu"
          anchorEl={langMenuAnchorEl}
          open={langMenuOpen}
          onClose={handleLangMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                minWidth: 200,
                borderRadius: '12px',
                border: '1px solid var(--card-border)',
                background: 'var(--card-color)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                '& .MuiMenuItem-root': {
                  borderRadius: '8px',
                  margin: '4px 8px',
                  padding: '10px 14px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: 'var(--font-color)',
                  '&:hover': {
                    backgroundColor: 'var(--primary-shadow-xs)',
                    color: 'var(--primary)',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'var(--primary-shadow-sm)',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'var(--primary-shadow-md)',
                    }
                  }
                }
              }
            }
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.id}
              onClick={() => handleLanguageChange(language.id)}
              selected={lang === language.id}
            >
              <Stack direction={'row'} alignItems={'center'} spacing={1.5} sx={{ width: '100%' }}>
                {language.flag_str && (
                  <Typography sx={{ fontSize: '1.3rem' }}>{language.flag_str}</Typography>
                )}
                <Typography sx={{ 
                  fontSize: '0.9rem',
                  fontWeight: lang === language.id ? 600 : 400,
                  flex: 1,
                  color: 'var(--font-color)'
                }}>
                  {t(language.id, { ns: NS_LANGS })}
                </Typography>
                {lang === language.id && (
                  <Box sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--font-reverse-color)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}>
                    ✓
                  </Box>
                )}
              </Stack>
            </MenuItem>
          ))}
        </Menu>
        <Divider />
        <MenuItem 
          onClick={handleThemeMenuClick}
          data-theme-menu
          sx={{
            '& .MuiListItemIcon-root': {
              minWidth: 40,
              color: themeMenuOpen ? 'var(--primary)' : 'var(--font-color)',
            },
            backgroundColor: themeMenuOpen ? 'var(--primary-shadow)' : 'transparent',
          }}
        >
          <ListItemIcon>
            {currentTheme.icon}
          </ListItemIcon>
          <Stack direction={'row'} alignItems={'center'} spacing={1} sx={{ flex: 1, justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: themeMenuOpen ? 600 : 400, color: 'var(--font-color)' }}>
              {t('theme', { ns: NS_SETTINGS })}
            </Typography>
            {currentTheme && (
              <Typography sx={{ 
                fontSize: '0.8rem', 
                color: themeMenuOpen ? 'var(--primary)' : 'var(--grey-light)',
                fontWeight: 500
              }}>
                {currentTheme.label}
              </Typography>
            )}
          </Stack>
        </MenuItem>
        <Menu
          id="theme-submenu"
          anchorEl={themeMenuAnchorEl}
          open={themeMenuOpen}
          onClose={handleThemeMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                minWidth: 200,
                borderRadius: '12px',
                border: '1px solid var(--card-border)',
                background: 'var(--card-color)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                '& .MuiMenuItem-root': {
                  borderRadius: '8px',
                  margin: '4px 8px',
                  padding: '10px 14px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: 'var(--font-color)',
                  '&:hover': {
                    backgroundColor: 'var(--primary-shadow-xs)',
                    color: 'var(--primary)',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'var(--primary-shadow-sm)',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'var(--primary-shadow-md)',
                    }
                  }
                }
              }
            }
          }}
        >
          {themes.map((theme) => (
            <MenuItem
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              selected={modeApp === theme.id}
            >
              <Stack direction={'row'} alignItems={'center'} spacing={1.5} sx={{ width: '100%' }}>
                <Box sx={{ color: modeApp === theme.id ? 'var(--primary)' : 'var(--font-color)' }}>
                  {theme.icon}
                </Box>
                <Typography sx={{ 
                  fontSize: '0.9rem',
                  fontWeight: modeApp === theme.id ? 600 : 400,
                  flex: 1,
                  color: 'var(--font-color)'
                }}>
                  {theme.label}
                </Typography>
                {modeApp === theme.id && (
                  <Box sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--font-reverse-color)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}>
                    ✓
                  </Box>
                )}
              </Stack>
            </MenuItem>
          ))}
        </Menu>
        <Divider />
        <MenuItem 
          onClick={async () => await logout()} 
          sx={{ 
            color: 'var(--error) !important',
            '&:hover': {
              backgroundColor: 'var(--error-shadow-xs) !important',
              color: 'var(--error) !important',
              transform: 'translateX(4px)',
            },
            '& .MuiListItemIcon-root': {
              minWidth: 40,
              color: 'var(--error) !important',
            },
            '& .MuiTypography-root': {
              color: 'var(--error) !important',
            }
          }}
        >
          <ListItemIcon>
            <Logout sx={{ color: 'var(--error) !important' }} fontSize="small" />
          </ListItemIcon>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--error) !important' }}>
            {t('disconnect', { ns: NS_BUTTONS })}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
