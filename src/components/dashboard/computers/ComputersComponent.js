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
const TypographyComponent = ({ title = "", value = "" }) => {
  return (<Stack direction={'row'} spacing={1.5} justifyContent={'space-between'} sx={{ background: '' }}>
    <Typography fontWeight={'bold'}>{title}</Typography>
    <Typography noWrap sx={{ lineHeight: 1.15 }}>{value}</Typography>
  </Stack>)
}
const FieldComponent = ({ title = "", value = "", setValue }) => {
  return (<Stack direction={'row'} spacing={1.5} justifyContent={'space-between'} sx={{ background: '' }}>
    <Typography fontWeight={'bold'}>{title}</Typography>
    <TextFieldComponent />
    <Typography noWrap sx={{ lineHeight: 1.15 }}>{value}</Typography>
  </Stack>)
}




// Liste mock des 25 ordinateurs
const initialComputers = [
  { id: 1, name: "PC-01", status: "available" },
  { id: 2, name: "PC-02", status: "available" },
  { id: 3, name: "PC-03", status: "in_use" },
  { id: 4, name: "PC-04", status: "in_use" },
  { id: 5, name: "PC-05", status: "maintenance" },
  { id: 6, name: "PC-06", status: "available" },
  { id: 7, name: "PC-07", status: "offline" },
  { id: 8, name: "PC-08", status: "in_use" },
  { id: 9, name: "PC-09", status: "available" },
  { id: 10, name: "PC-10", status: "available" },
  { id: 11, name: "PC-11", status: "in_use" },
  { id: 12, name: "PC-12", status: "maintenance" },
  { id: 13, name: "PC-13", status: "available" },
  { id: 14, name: "PC-14", status: "offline" },
  { id: 15, name: "PC-15", status: "available" },
  { id: 16, name: "PC-16", status: "in_use" },
  { id: 17, name: "PC-17", status: "available" },
  { id: 18, name: "PC-18", status: "maintenance" },
  { id: 19, name: "PC-19", status: "in_use" },
  { id: 20, name: "PC-20", status: "available" },
  { id: 21, name: "PC-21", status: "available" },
  { id: 22, name: "PC-22", status: "offline" },
  { id: 23, name: "PC-23", status: "in_use" },
  { id: 24, name: "PC-24", status: "available" },
  { id: 25, name: "PC-25", status: "available" },
];
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function ComputersComponent() {
  const componentRef = useRef(null);
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const { text, greyLight } = theme.palette;
  const { t } = useTranslation([ClassDevice.NS_COLLECTION, NS_DASHBOARD_COMPUTERS, NS_BUTTONS]);
  const [computers] = useState(initialComputers);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [success, setSuccess] = useState(false);
  const [textSuccess, setTextSuccess] = useState(false);
  const [schools, setSchools] = useState([]);
  const [school, setSchool] = useState({});
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [allComputers, setAllComputers] = useState([]);
  const [computersBis, setComputersBis] = useState([]);
  const [mode, setMode] = useState('');
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-color-scheme: light)');

    const updateTheme = (e) => {
      //setTheme(e.matches ? 'dark' : 'light');
    };

    // valeur initiale
    //setTheme(mq.matches ? 'dark' : 'light');
    console.log("WAAAA", mq)
    // écoute les changements
    mq.addEventListener('change', updateTheme);

    return () => mq.removeEventListener('change', updateTheme);
  }, []);
  useEffect(() => {
    async function initComputers() {
      const ok = await ClassHardware.count([where('type', '==', 'ok')]);
      console.log("NB", ok)
      const _schools = await ClassSchool.fetchListFromFirestore([
        //where("school_uid", "==", schoolUid),
        orderBy("name"),
        //limit(25),
      ]);
      //console.log("SCHHOLlist", _schools)

      setSchools(_schools);
      if (_schools.length > 0) {
        const _school = _schools[0];
        setSchool(_school);
        const _rooms = await ClassRoom.fetchListFromFirestore([
          where("uid_school", "==", _school.uid),
          orderBy("uid_intern"),
          //limit(25),
        ]);
        // console.log("ROOMS list", _rooms)
        setRooms(_rooms);
        const _room = _rooms[0];
        setRoom(_room);
        const _computers = await ClassHardware.fetchListFromFirestore([
          //where("uid_room", "==", _room.uid),
          //where("status", "==", filter),
          orderBy("uid_intern"),
          //limit(25),
        ]);
        //console.log("computer list", _rooms)
        //console.log("computer index", _computers);

        setAllComputers(_computers);
        setComputersBis(_computers.filter(item => item.uid_room === _room.uid));
      }
    }
    initComputers();
  }, []);

  useEffect(() => {
    var _computers = [...allComputers];
    if (room) {
      _computers = _computers.filter(item => item.uid_room === room.uid);
    }
    if (filterStatus !== 'all') {
      _computers = _computers.filter(item => item.status === filterStatus);
    }
    if (filterType !== 'all') {
      _computers = _computers.filter(item => item.type === filterType);
    }
    //console.log('EVENT filter', _computers);
    setComputersBis(_computers);
  }, [filterStatus, filterType]);

  const onChangeSchool = (e) => {
    const { value } = e.target;
    const uidSchool = value;
    const _rooms = [];
  }

  const onChangeRoom = (e) => {
    const { value } = e.target;
    const uidRoom = value;
    var _computers = [...allComputers];
    if (uidRoom !== 'all') {
      const indexRoom = ClassRoom.indexOf(rooms, uidRoom);
      const _room = rooms[indexRoom];

      setRoom(_room);
      _computers = _computers.filter(item => item.uid_room === uidRoom);
    } else {
      setRoom(null);
    }
    if (filterStatus !== 'all') {
      _computers = _computers.filter(item => item.status === filterStatus);
    }
    //console.log('EVENT', _computers);
    setComputersBis(_computers);
  }

  const updateComputersStatus = async () => {
    let _computers = await ClassHardware.fetchListFromFirestore([
      //where("uid_room", "==", _room.uid),
      //where("status", "==", filter),
      orderBy("uid_intern"),
      //limit(25),
    ]);
    //console.log("computer list", _rooms)
    //console.log("computer index", _computers);
    setAllComputers(_computers);
    //var _computers = [...allComputers];
    if (room) {
      _computers = _computers.filter(item => item.uid_room === room.uid);
    }
    if (filterStatus !== 'all') {
      _computers = _computers.filter(item => item.status === filterStatus);
    }
    if (filterType !== 'all') {
      _computers = _computers.filter(item => item.type === filterType);
    }
    //console.log('EVENT filter', _computers);
    setComputersBis(_computers);
  }

  // Mapping des statuts → label + couleurs
  const STATUS_CONFIG = {
    available: {
      label: t('available'),
      badgeBg: "#022c22",
      badgeBorder: "#16a34a",
      badgeText: "#bbf7d0",
      glow: "#22c55e55",
    },
    busy: {
      label: t('busy'),
      badgeBg: "#111827",
      badgeBorder: "#3b82f6",
      badgeText: "#bfdbfe",
      glow: "#3b82f655",
    },
    in_use: {
      label: t('busy'),
      badgeBg: "#111827",
      badgeBorder: "#3b82f6",
      badgeText: "#bfdbfe",
      glow: "#3b82f655",
    },
    maintenance: {
      label: t('maintenance'),
      badgeBg: "#422006",
      badgeBorder: "#f97316",
      badgeText: "#fed7aa",
      glow: "#f9731655",
    },
    reparation: {
      label: t('reparation'),
      badgeBg: "#111827",
      badgeBorder: "rgb(255,0,0)",
      badgeText: "rgba(253, 214, 214, 1)",
      glow: "rgba(255,0,0,0.3)",
    },
    offline: {
      label: t('hs'),
      badgeBg: "#111827",
      badgeBorder: "#6b7280",
      badgeText: "#e5e7eb",
      glow: "#6b728055",
    },
    hs: {
      label: t('hs'),
      badgeBg: "#111827",
      badgeBorder: "#6b7280",
      badgeText: "#e5e7eb",
      glow: "#6b728055",
    },
    all: {
      label: "Tous",
      badgeBg: "transparent",
      badgeBorder: "var(--font-color)",
      badgeText: "#e5e7eb",
      glow: "#6b728055",
    },
  };
  /** Composants réutilisables **/

  function LegendItem({ value = 0, status }) {
    const cfg = STATUS_CONFIG[status];
    return (
      <div className="legend-item">
        <span className="legend-dot" />
        <span className="legend-label">{cfg.label} ({value})</span>

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
          border: 2px solid ${cfg.badgeBorder};
          background: var(--card-color);
          box-shadow: 0 0 10px ${cfg.glow};
        }
        .legend-label {
          color: #9ca3af;
          color: var(--font-color);
        }
      `}</style>
      </div>
    );
  }
  function CountBubble({ label, value }) {
    return (
      <div className="count-bubble">
        <span className="count-value">{value}</span>
        <span className="count-label">{label}</span>

        <style jsx>{`
        .count-bubble {
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid ${ClassColor.GREY_LIGHT};
          background: transparent;
          font-size: 0.78rem;
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
        }
        .count-value {
          font-weight: 600;
        }
        .count-label {
          color: #9ca3af;
        }
      `}</style>
      </div>
    );
  }
  function ComputerCard({ computer, isSelected, onClick }) {
    const cfg = STATUS_CONFIG[computer.status];
    const { theme, mode } = useThemeMode();
    const { cardColor, text, greyLight } = theme.palette;

    return (
      <button className="pc-card" onClick={onClick} type="button">
        <div className="pc-icon-wrapper">
          <Stack alignItems={'center'}>
            {
              ClassDevice.getIcon({ type: computer?.type, size: 'small', status: computer?.status })
            }
          </Stack>
        </div>
        <p className="pc-name">{computer.name}</p>
        <StatusBadge status={computer.status} />
        <p className="pc-id">#{computer?.id?.toString().padStart(2, "0") || computer.uid_intern || ''}</p>

        <style jsx>{`
        .pc-card {
          height: 100%;
          border-radius: 14px;
          border: 1px solid ${isSelected ? cfg.badgeBorder : "#111827"};
          background: radial-gradient(circle at top, ${cfg.glow},${mode === THEME_DARK ? `${cardColor.main},` : ''}${cardColor.main});
          padding: 8px 8px 9px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease,
            border-color 0.12s ease, background 0.12s ease;
          
        }

        .pc-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.3);
          border-color: ${cfg.badgeBorder};
        }

        .pc-icon-wrapper {
          margin-bottom: 2px;
        }

        .pc-name {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 500;
          color: ${text.main};
          white-space: nowrap;    
        }

        .pc-id {
          margin: 0;
          font-size: 0.75rem;
          color: ${mode === THEME_LIGHT ? text.main : greyLight.main};
        }
      `}</style>
      </button>
    );
  }
  function StatusBadge({ status, big = false }) {
    const cfg = STATUS_CONFIG[status];

    return (
      <>
        <span className={`badge ${big ? "badge-big" : ""}`}>
          <span className="dot" />
          {cfg.label}
        </span>

        <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid ${cfg.badgeBorder};
          background: ${cfg.badgeBg};
          color: ${cfg.badgeText};
          font-size: 0.72rem;
          white-space: nowrap;
        }

        .badge-big {
          margin-top: 6px;
          font-size: 0.8rem;
          padding: 3px 10px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: ${cfg.badgeBorder};
          box-shadow: 0 0 8px ${cfg.glow};
        }
      `}</style>
      </>
    );
  }
  const handleCloseSnackbar = (event, reason) => {
    setSuccess(false);
    if (reason === 'clickaway') {
      return;
    }
  };
  const handleCardClick = (pc) => {
    setSelected(pc);
    setSelectedDevice(pc);
    setOpenDialog(true);
    setMode('read');
    console.log("DEVICE", pc)
  };

  return (
    <Stack ref={componentRef} sx={{ width: '100%', height: '100%' }}>
      <DialogDevice
        updateList={updateComputersStatus}
        device={selectedDevice}
        setDevice={setSelectedDevice}
        mode={mode}
        setMode={setMode}
        setSuccess={setSuccess}
        setTextSuccess={setTextSuccess}
      />
      {
        //selectedDevice && <ScrollDialog updateList={updateComputersStatus} device={selectedDevice} setDevice={setSelectedDevice} isOpen={openDialog} setIsOpen={setOpenDialog} />
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
                  value={room?.uid || ''}
                  values={rooms.map(item => ({ id: item.uid, value: item.name }))}
                  onChange={onChangeRoom}
                  hasNull={false}
                />
              </Grid>
              }
              <Grid size={{ xs: 12, sm: 'auto' }} sx={{display:schools.length>0 && rooms.length>0 ? 'block' : 'none'}}>
                <SelectComponentDark
                  label={t('type')}
                  value={filterType}
                  values={[{ uid: 'all', name: `-- ${t('all')} --` }, ...ClassHardware.ALL_TYPES.map(item => ({ uid: item, name: t(item) }))].map(item => ({ id: item.uid, value: item.name }))}
                  onChange={(e) => setFilterType(e.target.value)}
                  hasNull={false}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 'auto' }} sx={{display:schools.length>0 && rooms.length>0 ? 'block' : 'none'}}>
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
          <Stack sx={{ width: { xs: '100%', sm: '40%' } }}>
            {
              schools.length === 0 && <Alert
                severity="warning"
                action={
                  <Button variant={'contained'} color="warning" size="small">
                    {'Créer'}
                  </Button>
                }
              >
                {"Il n'y a pas d'école disponible, veuillez en créer une."}
              </Alert>
            }
            {
              rooms.length === 0 && <Alert
                severity="warning"
                action={
                  <Button variant={'contained'} color="warning" size="small">
                    {'Créer'}
                  </Button>
                }
              >
                {"Il n'y a pas de salles disponibles, veuillez en créer une."}
              </Alert>
            }
          </Stack>
        </Stack>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography><b>{'Total : '}</b>{computersBis.length}</Typography>
          <Stack direction={'row'} alignItems={'center'}>
            <IconButton loading={refresh}
              onClick={async () => {
                setRefresh(true);
                await updateComputersStatus();
                setRefresh(false);
              }}
              color="primary" aria-label="add to shopping cart" size='small'>
              <RestartAltIcon />
            </IconButton>
            {
              user instanceof ClassUserIntern && <ButtonConfirm
                label={t('new', { ns: NS_BUTTONS })}
                loading={selectedDevice}
                onClick={async () => {
                  setMode('create');
                  //setIsOpen(true);
                  setSelectedDevice(new ClassHardware({ uid_room: room.uid, status: ClassDevice.STATUS.AVAILABLE }));
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
                <LegendItem status="all" value={computersBis.length} />
              </Box>
              <Stack direction={'row'} spacing={1} sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <LegendItem status="available" value={computersBis.filter((c) => c.status === "available").length} />
                <LegendItem status="busy" value={computersBis.filter((c) => c.status === "busy").length} />
                <LegendItem status="maintenance" value={computersBis.filter((c) => c.status === "maintenance").length} />
                <LegendItem status="reparation" value={computersBis.filter((c) => c.status === "reparation").length} />
                <LegendItem status="hs" value={computersBis.filter((c) => c.status === "hs").length} />
              </Stack>
            </> : <>
              {
                (filterStatus === 'available') && <LegendItem status="available" value={computersBis.filter((c) => c.status === "available").length} />
              }
              {
                (filterStatus === 'busy') && <LegendItem status="busy" value={computersBis.filter((c) => c.status === "busy").length} />
              }
              {
                (filterStatus === 'maintenance') && <LegendItem status="maintenance" value={computersBis.filter((c) => c.status === "maintenance").length} />
              }
              {
                (filterStatus === 'reparation') && <LegendItem status="reparation" value={computersBis.filter((c) => c.status === "reparation").length} />
              }
              {
                (filterStatus === 'hs') && <LegendItem status="hs" value={computersBis.filter((c) => c.status === "hs").length} />
              }
            </>}
          </Stack>
          <Grid container sx={{ width: '100%', background: '' }} justifyContent={computersBis.length === 0 ? 'center' : 'stretch'} spacing={0.5}>
            {computersBis.length === 0 && (
              <div className="empty-state">
                {t('not-found', { ns: ClassDevice.NS_COLLECTION })}
              </div>
            )}
            {computersBis.map((pc, i) => (
              <Grid key={`${pc.uid}-${i}`} size={{ xs: 6, sm: 'auto' }} justifyItems={'stretch'}>
                <ComputerCard
                  computer={pc}
                  isSelected={selectedDevice?.uid === pc.uid}
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
    </Stack>
  );
}