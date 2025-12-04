"use client";
import React, { useEffect, useRef, useState } from 'react';
import { IconDashboard, IconMobile, } from "@/assets/icons/IconsComponent";
import { THEME_DARK, THEME_LIGHT, WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_BUTTONS, NS_DASHBOARD_COMPUTERS, NS_DASHBOARD_HOME, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import { ClassColor } from '@/classes/ClassColor';
import { Alert, Backdrop, Box, Button, Chip, CircularProgress, Container, Divider, Grid, IconButton, Slide, Snackbar, Stack, Typography } from '@mui/material';
import { ClassHardware, ClassDevice } from '@/classes/ClassDevice';
import { orderBy, where } from 'firebase/firestore';
import SelectComponent from '@/components/elements/SelectComponent';
import SelectComponentDark from '@/components/elements/SelectComponentDark';
import { ClassSchool } from '@/classes/ClassSchool';
import { ClassRoom } from '@/classes/ClassRoom';
import constants from 'constants';
import DeviceCard from './DeviceCard';
import { ClassUserAdmin, ClassUserIntern, ClassUserSuperAdmin } from '@/classes/users/ClassUser';
import TextFieldComponent from '@/components/elements/TextFieldComponent';
import DialogDevice from './DialogDevice';
import ButtonConfirm from '../elements/ButtonConfirm';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useSchool } from '@/contexts/SchoolProvider';
import { useRoom } from '@/contexts/RoomProvider';
import DialogSchool from './DialogSchool';
import BadgeStatusDevice from './BadgeStatusDevice';
import { DeviceProvider, useDevice } from '@/contexts/DeviceProvider';
import ComputerCard from './ComputerCard';


function LegendItem({ value = 0, status }) {
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const STATUS_CONFIG = ClassDevice.STATUS_CONFIG || [];
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="legend-item">
      <span className="legend-dot" />
      <span className="legend-label">{t(status)} ({value})</span>

      <style jsx>{`
      .legend-item {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: 0.78rem;
        color: #e5e7eb;
      }
      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        border: 2px solid ${cfg?.badgeBorder};
        background: ${cfg?.glow};
        box-shadow: 0 0 10px ${cfg?.glow};
      }
      .legend-label {
        color: #9ca3af;
        color: var(--font-color);
      }
    `}</style>
    </div>
  );
}
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function DevicesContent({}) {
  const { t } = useTranslation([ClassDevice.NS_COLLECTION, NS_DASHBOARD_COMPUTERS, NS_BUTTONS]);
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const { text, greyLight } = theme.palette;
  const [refresh, setRefresh] = useState(false);
  const [mode, setMode] = useState('');
  const { schools, school, } = useSchool();
  const { rooms, room, changeRoom} = useRoom();
  const { device,devices, changeDevice, refreshList, filterStatus,setFilterStatus, filterType, setFilterType,success,setSuccess,textSuccess } = useDevice();
  const handleCloseSnackbar = (event, reason) => {
    setSuccess(false);
    if (reason === 'clickaway') {
      return;
    }
  };
  const onChangeRoom = async (e) => {
    const { value } = e.target;
    const uidRoom = value;
    await changeRoom(uidRoom);
  }
  const handleCardClick = async (pc, mode='read') => {
    //setSelectedDevice(pc);
    setMode('read');
    changeDevice(pc?.uid, mode);
  };

  return (<Stack >
    {
      device && <DialogDevice
        mode={mode}
        setMode={setMode}
      />
    }
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Stack spacing={1}>
        <Stack alignItems={'start'} sx={{ background: '' }}>
          <Grid spacing={1} container>
            {
              schools.length > 0 && <Grid size={{ xs: 12, sm: 'auto' }}>
                <SelectComponentDark
                  label={t('school', { ns: NS_DASHBOARD_COMPUTERS })}
                  value={school?.uid || ''}
                  values={schools.map(item => ({ id: item.uid, value: item.name }))}
                  onChange={onChangeRoom}
                  hasNull={false}
                  disabled={schools.length === 1}
                />
              </Grid>
            }
            {
              rooms.length > 0 && <Grid size={{ xs: 12, sm: 'auto' }}>
                <SelectComponentDark
                  label={t('room', { ns: NS_DASHBOARD_COMPUTERS })}
                  value={room?.uid || 'all'}
                  //values={rooms.map(item => ({ id: item.uid, value: item.name }))}
                  values={[{ uid: 'all', name: `-- ${t('all')} --` }, ...rooms.map(item => ({ uid: item.uid, name: item.name }))].map(item => ({ id: item.uid, value: item.name }))}

                  onChange={onChangeRoom}
                  hasNull={false}
                />
              </Grid>
            }
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ display: schools.length > 0 && rooms.length > 0 ? 'block' : 'none' }}>
              <SelectComponentDark
                label={t('type')}
                value={filterType}
                values={[{ uid: 'all', name: `-- ${t('all')} --` }, ...ClassHardware.ALL_TYPES.map(item => ({ uid: item, name: t(item) }))].map(item => ({ id: item.uid, value: item.name }))}
                onChange={(e) => setFilterType(e.target.value)}
                hasNull={false}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} sx={{ display: schools.length > 0 && rooms.length > 0 ? 'block' : 'none' }}>
              <SelectComponentDark
                label={t('status', { ns: NS_DASHBOARD_COMPUTERS })}
                value={filterStatus}
                values={[{ uid: 'all', name: `-- ${t('all')} --` }, ...ClassDevice.ALL_STATUS.map(item => ({ uid: item, name: t(item) }))].map(item => ({ id: item.uid, value: item.name }))}
                onChange={(e) => setFilterStatus(e.target.value)}
                hasNull={false}
              />
            </Grid>
          </Grid>

        </Stack>
        <Stack sx={{ width: { xs: '100%', sm: '35%' } }}>
          {
            schools.length === 0 && <Alert
              severity="warning"
              action={
                <Button variant={'contained'} color="warning" size="small">
                  {'Créer'}
                </Button>
              }
            >
              <Stack>
                <Typography>{"Il n'y a pas d'école disponible, veuillez en créer une."}</Typography>
                <Button variant={'contained'} color="warning" size="small">
                  {'Créer'}
                </Button>
              </Stack>
            </Alert>
          }
          {
            rooms.length === 0 && <Alert
              severity="warning"
            >
              <Stack alignItems={'start'} spacing={1}>
                <Typography variant='p'>{"Il n'y a pas de salles disponibles, veuillez en créer une."}</Typography>
                <Button variant={'contained'} color="warning" size="small">
                  {'Créer'}
                </Button>
              </Stack>
            </Alert>
          }
        </Stack>
      </Stack>
      <Stack direction={'row'} alignItems={'center'} spacing={1}>
      <Typography><b>{'Total : '}</b>{devices.length}</Typography>
      <Stack direction={'row'} alignItems={'center'}>
          <IconButton loading={refresh}
            onClick={async () => {
              setRefresh(true);
              //await refreshList();
              setRefresh(false);
            }}
            color="primary" aria-label="add to shopping cart" size='small'
            sx={{ display: 'none' }}>
            <RestartAltIcon />
          </IconButton>
          {
            user instanceof ClassUserIntern && <ButtonConfirm
              label={t('new', { ns: NS_BUTTONS })}
              loading={device}
              onClick={async () => {
                setMode('create');
                //setIsOpen(true);
                changeDevice('', 'create');
                //setSelectedDevice(new ClassHardware({ uid_room: room?.uid || '', status: ClassDevice.STATUS.AVAILABLE }));
                //setSuccess(true);
                //handleCardClick(new ClassDevice());
              }}
            />
          }
        </Stack>

      </Stack>
      <Stack
        spacing={1}
        sx={{
          width: '100%',
          background: 'var(--card-color)',
          borderRadius: '10px',
          //border: '1px solid #1f2937',
          padding: '12px',
          //boxShadow: '0 18px 45px rgba(0, 0, 0, 0.4)',
        }}>
        <Stack spacing={1} direction={'row'} sx={{ background: '', width: '100%' }} className='legend'>
          {filterStatus === 'all' ? <>
            <Box sx={{ display: { md: 'none' } }}>
              <LegendItem status="all" value={devices.length} />
            </Box>
            <Stack direction={'row'} spacing={1} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <LegendItem status="available" value={devices.filter((c) => c.status === "available").length} />
              <LegendItem status="busy" value={devices.filter((c) => c.status === "busy").length} />
              <LegendItem status="maintenance" value={devices.filter((c) => c.status === "maintenance").length} />
              <LegendItem status="reparation" value={devices.filter((c) => c.status === "reparation").length} />
              <LegendItem status="hs" value={devices.filter((c) => c.status === "hs").length} />
            </Stack>
          </> : <>
            {
              (filterStatus === 'available') && <LegendItem status="available" value={devices.filter((c) => c.status === "available").length} />
            }
            {
              (filterStatus === 'busy') && <LegendItem status="busy" value={devices.filter((c) => c.status === "busy").length} />
            }
            {
              (filterStatus === 'maintenance') && <LegendItem status="maintenance" value={devices.filter((c) => c.status === "maintenance").length} />
            }
            {
              (filterStatus === 'reparation') && <LegendItem status="reparation" value={devices.filter((c) => c.status === "reparation").length} />
            }
            {
              (filterStatus === 'hs') && <LegendItem status="hs" value={devices.filter((c) => c.status === "hs").length} />
            }
          </>}
        </Stack>
        <Grid container sx={{ width: '100%', background: '' }} justifyContent={devices.length === 0 ? 'center' : 'stretch'} spacing={0.5}>
          {devices.length === 0 && (
            <div className="empty-state">
              {t('not-found', { ns: ClassDevice.NS_COLLECTION })}
            </div>
          )}
          {devices.map((pc, i) => (
            <Grid key={`${pc.uid}-${i}`} size={{ xs: 6, sm: 'auto' }} justifyItems={'stretch'}>
              <ComputerCard
                device={pc}
                isSelected={device?.uid === pc.uid}
                onClick={() => handleCardClick(pc)}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Stack>
    <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={success}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        slots={{ transition: SlideTransition }}
      //message="I love snacks"
      //key={vertical + horizontal}
      >
        <Alert
          //onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {textSuccess}
        </Alert>
      </Snackbar>
  </Stack>);
}
export default function ComputersComponent() {
  const componentRef = useRef(null);
  const { isLoading: isLoadingSchool } = useSchool();
  const { room, isLoading: isLoadingRoom } = useRoom();

  if (isLoadingSchool || isLoadingRoom) {
    return (<CircularProgress />)
  }

  return (<DeviceProvider uidRoom={room?.uid || ''}>
    <Stack ref={componentRef} sx={{ width: '100%', height: '100%' }}>
    <DevicesContent />

    </Stack>
  </DeviceProvider>)
}