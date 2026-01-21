import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/AuthProvider';
import { Stack } from '@mui/material';
import { IconDownloadDesktopApp, IconDownloadMobileApp, IconDropDown, IconProfile, IconSettings } from '@/assets/icons/IconsComponent';
import { useUserDevice } from '@/contexts/UserDeviceProvider';
import InstallPwaBanner from '../pwa/InstallPwaBanner';
import { usePwa } from '@/contexts/PwaProvider';
import { usePathname } from 'next/navigation';
import { PAGE_DASHBOARD_PROFILE, PAGE_SETTINGS } from '@/contexts/constants/constants_pages';
import { useRouter } from 'next/navigation';
import { NS_DASHBOARD_MENU } from '@/contexts/i18n/settings';
import { useTranslation } from 'react-i18next';

export default function AccountMenu() {
  const {t} = useTranslation([NS_DASHBOARD_MENU]);
  const router = useRouter();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { isMobile, isLaptop, device, hasScreen } = useUserDevice();
  const [showPwa, setShowPwa] = useState(false);
  const path = usePathname();
  const { show, setShow, isPwa } = usePwa();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Stack aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined} onClick={handleClick} direction={'row'} spacing={0.5} alignItems={'center'}
          sx={{
            fontWeight: 600,
            py: 0.25,
            px: 0.5,
            height: '100%',
            color: "var(--primary)",
            border: `1px solid var(--primary-shadow-md)`,
            borderRadius: '20px',
            cursor: 'pointer',
            background: "var(--primary-shadow-sm)"
          }}>

          {
            user?.showAvatar({ size: 20, fontSize: '5px' })
          }
          <Stack>
            <Typography variant={'string'} noWrap fontSize={'12px'}>
              {user?.getCompleteName() || ''}
            </Typography>
          </Stack>
          <IconDropDown height={6} />
        </Stack>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,

            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
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
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
              '& .Mui-selected': {
                backgroundColor: 'var(--primary) !important',
                color: 'text.reverse'
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
        <MenuItem onClick={() => {
          if (!path?.includes(PAGE_DASHBOARD_PROFILE)) {
            router.push(PAGE_DASHBOARD_PROFILE);
            handleClose();
          }
        }} selected={path?.includes(PAGE_DASHBOARD_PROFILE)}>
          <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
            <IconProfile height={18} width={18} /> <Typography>{`Profile`}</Typography>
          </Stack>
        </MenuItem>
        <Divider />
        {
          !isPwa && <Stack>
            <Typography sx={{ ml: 2, fontWeight: 600 }}>{`Dandela Academy App`}</Typography>
            <MenuItem onClick={() => {
              setShow(true);
              handleClose();
            }}>
              <ListItemIcon>

                {
                  hasScreen ? <IconDownloadDesktopApp width={20} height={20} /> : isMobile ? <IconDownloadMobileApp width={20} height={20} /> : null
                }
              </ListItemIcon>
              {`Télécharger l’application`}
            </MenuItem>
            <Divider />
          </Stack>
        }

        <MenuItem onClick={() => {
          if (!path?.includes(PAGE_SETTINGS)) {
            router.push(PAGE_SETTINGS);
            handleClose();
          }
        }} selected={path?.includes(PAGE_SETTINGS)}>
          <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
            <IconSettings height={18} width={18} /> <Typography>{`Paramètres`}</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={async () => await logout()} sx={{ color: 'red' }}>
          <ListItemIcon>
            <Logout sx={{ color: 'red' }} fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
