"use client";
import React, { useEffect, useRef, useState } from 'react';
import { IconDashboard, } from "@/assets/icons/IconsComponent";
import { WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_DASHBOARD_COMPUTERS, NS_DASHBOARD_HOME, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import { ClassColor } from '@/classes/ClassColor';
import { Backdrop, Box, CircularProgress, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { ClassComputer, ClassDevice } from '@/classes/ClassDevice';
import { orderBy, where } from 'firebase/firestore';
import SelectComponent from '@/components/elements/SelectComponent';
import SelectComponentDark from '@/components/elements/SelectComponentDark';
import { ClassSchool } from '@/classes/ClassSchool';
import { ClassRoom } from '@/classes/ClassRoom';
import constants from 'constants';
import DeviceCard from './DeviceCard';

import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { cutString, getFormattedDate } from '@/contexts/functions';
import { useLanguage } from '@/contexts/LangProvider';
import { ClassUserAdmin, ClassUserSuperAdmin } from '@/classes/users/ClassUser';
import AccordionComponent from '@/components/dashboard/hub/AccordionComponent';

const TypographyComponent = ({ title = "", value = "" }) => {
  return (<Stack direction={'row'} spacing={1.5} justifyContent={'space-between'} sx={{ background: '' }}>
    <Typography fontWeight={'bold'}>{title}</Typography>
    <Typography noWrap>{value}</Typography>
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


export default function ComputersComponent() {
  const { theme } = useThemeMode();
  const { text, greyLight } = theme.palette;
  const { t } = useTranslation([ClassDevice.NS_COLLECTION, NS_DASHBOARD_COMPUTERS]);
  const [computers] = useState(initialComputers);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [schools, setSchools] = useState([]);
  const [school, setSchool] = useState({});
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [allComputers, setAllComputers] = useState([]);
  const [computersBis, setComputersBis] = useState([]);
  useEffect(() => {
    async function initComputers() {
      const _schools = await ClassSchool.fetchListFromFirestore([
        //where("school_uid", "==", schoolUid),
        orderBy("name"),
        //limit(25),
      ]);
      //console.log("SCHHOLlist", _schools)

      setSchools(_schools);
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
      const _computers = await ClassComputer.fetchListFromFirestore([
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
    initComputers();
  }, []);

  useEffect(() => {
    var _computers = [...allComputers];
    if (room) {
      _computers = _computers.filter(item => item.uid_room === room.uid);
    }
    if (filter !== 'all') {
      _computers = _computers.filter(item => item.status === filter);
    }
    //console.log('EVENT filter', _computers);
    setComputersBis(_computers);
  }, [filter]);

  const onChangeRoom = async (e) => {
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
    if (filter !== 'all') {
      _computers = _computers.filter(item => item.status === filter);
    }
    //console.log('EVENT', _computers);
    setComputersBis(_computers);
  }

  const updateComputersStatus = async () => {
    let _computers = await ClassComputer.fetchListFromFirestore([
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
    if (filter !== 'all') {
      _computers = _computers.filter(item => item.status === filter);
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
    badgeBorder: ClassColor.WHITE,
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
          gap: 6px;
          font-size: 0.78rem;
          color: #e5e7eb;
        }
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: 2px solid ${cfg.badgeBorder};
          background: ${cfg.badgeBg};
          box-shadow: 0 0 10px ${cfg.glow};
        }
        .legend-label {
          color: #9ca3af;
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

  return (
    <button className="pc-card" onClick={onClick} type="button">
      <div className="pc-icon-wrapper">
        <ComputerIconSmall status={computer.status} />
      </div>
      <p className="pc-name">{computer.name}</p>
      <StatusBadge status={computer.status} />
      <p className="pc-id">#{computer?.id?.toString().padStart(2, "0") || computer.uid_intern || ''}</p>

      <style jsx>{`
        .pc-card {
          border-radius: 14px;
          border: 1px solid ${isSelected ? cfg.badgeBorder : "#111827"};
          background: radial-gradient(circle at top, ${cfg.glow}, #020617);
          padding: 8px 8px 9px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease,
            border-color 0.12s ease, background 0.12s ease;
          box-shadow: ${"0 10px 25px rgba(0,0,0,0.5)"};
        }

        .pc-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.6);
          border-color: ${cfg.badgeBorder};
        }

        .pc-icon-wrapper {
          margin-bottom: 2px;
        }

        .pc-name {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 500;
          color: ${ClassColor.WHITE};
        }

        .pc-id {
          margin: 0;
          font-size: 0.75rem;
          color: #9ca3af;
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
/** Icône "ordinateur de maison" en mode petit **/
function ComputerIconSmall({ status }) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon">
      <div className="screen" />
      <div className="stand" />
      <div className="base" />

      <style jsx>{`
        .icon {
          width: 42px;
          height: 38px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .screen {
          width: 100%;
          height: 22px;
          border-radius: 8px;
          border: 2px solid #111827;
          background: linear-gradient(
            135deg,
            ${cfg.badgeBorder}33,
            #020617 65%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 10px ${cfg.glow};
        }

        .stand {
          width: 8px;
          height: 6px;
          margin-top: 2px;
          border-radius: 4px;
          background: #0b1120;
          border: 1px solid #111827;
        }

        .base {
          width: 24px;
          height: 4px;
          margin-top: 2px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
        }
      `}</style>
    </div>
  );
}
/** Version "large" pour le panneau de droite **/
function ComputerIconLarge({ status }) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="icon-large">
      <div className="screen" />
      <div className="stand" />
      <div className="base" />

      <style jsx>{`
        .icon-large {
          width: 90px;
          height: 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .screen {
          width: 100%;
          height: 42px;
          border-radius: 12px;
          border: 2px solid #111827;
          background: radial-gradient(
            circle at top left,
            ${cfg.badgeBorder}44,
            #020617 70%
          );
          box-shadow: inset 0 0 0 1px #020617, 0 0 16px ${cfg.glow};
        }

        .stand {
          width: 12px;
          height: 10px;
          margin-top: 4px;
          border-radius: 6px;
          background: #020617;
          border: 1px solid #111827;
        }

        .base {
          width: 40px;
          height: 6px;
          margin-top: 3px;
          border-radius: 999px;
          background: #020617;
          border: 1px solid #111827;
        }
      `}</style>
    </div>
  );
}
function ScrollDialog({ device = null, setDevice = null, updateList = null, isOpen = false, setIsOpen = null }) {
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { theme } = useThemeMode();
  const { blueDark } = theme.palette;
  const [open, setOpen] = useState(isOpen);
  const [processing, setProcessing] = useState(false);
  const [changeDevice, setChangeDevice] = useState(null);
  const [scroll, setScroll] = useState('paper');
  useEffect(() => {
    if (device) {
      setChangeDevice(device.clone());
    } else {
      setChangeDevice(null);
    }
  }, [device]);



  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setIsOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
    setDevice(null);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <Dialog
        //fullWidth
        maxWidth={'md'}
        open={isOpen}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{

          '& .MuiDialog-container': {
            p: 1,
            //alignItems: 'stretch', // ⬅️ étire le container sur toute la hauteur
          },
          '& .MuiDialog-paper': {
            borderRadius: '10px',
            background: blueDark.main,
            color: 'white',
            minWidth: { xs: '100%', md: '400px' },
            width: { xs: '100%', md: '' },
            maxWidth: { xs: '100%', md: '50%' },
            maxWidth: '100%',
            margin: 1,
            //borderRadius: 0,
            //height: '100vh',      // ⬅️ plein écran en hauteur
            //maxHeight: '100vh',   // ⬅️ enlève la limite par défaut
            display: 'flex',
            flexDirection: 'column',
          },
          // 🔹 Bordures générées par `DialogContent dividers`
          '& .MuiDialogContent-dividers': {
            borderTopColor: 'rgba(255,255,255,0.2)',    // ou une couleur de ton thème
            borderBottomColor: 'rgba(255,255,255,0.2)',
          },

          // 🔹 Si tu utilises aussi des <Divider /> à l’intérieur
          '& .MuiDivider-root': {
            borderColor: 'rgba(255,255,255,0.2)',
          },
        }}
      >
        <DialogTitle id="scroll-dialog-title">
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
              {
                ClassComputer.getIconType({ type: device.type })
              }
              <Stack>
                <Typography variant='h4'>{device.name || '---'}</Typography>
                <Typography variant='h5' color='greyLight'>{t(device.type)}</Typography>
              </Stack>
            </Stack>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
          </Stack>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'} sx={{ p: { xs: 1, md: 2 } }}>
          <Stack spacing={2.5}>
            <Stack spacing={1} alignItems={'center'} sx={{ width: '100%' }}>
              <ComputerIconLarge status={device.status} />
              <StatusBadge status={device.status} big />
              <Typography>{device.name}</Typography>
            </Stack>
            <Stack spacing={1} sx={{ width: '100%' }}>
              <TypographyComponent title={t('uid')} value={device.uid} />
              <TypographyComponent title={t('uid_intern')} value={`#${device.uid_intern}`} />
              <TypographyComponent title={t('name')} value={device.name} />
              <TypographyComponent title={t('status')} value={t(device.status)} />
              <TypographyComponent title={t('category')} value={t(device.category)} />
              <TypographyComponent title={t('type')} value={t(device.type)} />

              <TypographyComponent title={t('brand')} value={device.brand} />
              <TypographyComponent title={t('os')} value={t(device.os)} />
              <TypographyComponent title={t('os_version')} value={device.os_version} />
              <TypographyComponent title={t('buy_time')} value={getFormattedDate(device.buy_time, lang)} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ minHeight: '20px' }}>
          {
            (user instanceof ClassUserSuperAdmin || user instanceof ClassUserAdmin) && <Stack direction={'row'} sx={{ width: '100%', background: '' }} justifyContent={'end'} alignItems={'center'} spacing={1}>
              {
                !processing && <SelectComponentDark
                  //label={'status'}
                  value={changeDevice?.status}
                  values={ClassDevice.ALL_STATUS.map(item => ({ id: item, value: t(item) }))}
                  onChange={(e) => setChangeDevice(prev => {
                    if (!prev || prev === null) return prev;
                    console.log("CHANGE", e.target.value)
                    prev.update({ status: e.target.value });
                    //prev.status = e.target.value;
                    return prev.clone();
                  })}
                  hasNull={false}
                />
              }
              {
                changeDevice?.status !== device?.status && <Button loading={processing} variant='contained' onClick={async () => {
                  setProcessing(true);
                  const newDevice = await ClassComputer.update(device.uid, { status: changeDevice.status });
                  if (newDevice) {
                    setDevice(newDevice);
                    await updateList();
                  }
                  setProcessing(false);
                }}>{t('btn-edit')}</Button>
              }
            </Stack>
          }

        </DialogActions>
      </Dialog>
    </Stack>
  );
}
  const handleCardClick = (pc) => {
    setSelected(pc);
    setSelectedDevice(pc);
    setOpenDialog(true);
  };

  return (
    <>
      {
        selectedDevice && <ScrollDialog updateList={updateComputersStatus} device={selectedDevice} setDevice={setSelectedDevice} isOpen={openDialog} setIsOpen={setOpenDialog} />
      }
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Stack spacing={1}>
          <Stack alignItems={'start'} sx={{ background: '' }}>
            <Grid spacing={1} container>
              <Grid size={{ xs: 'grow', sm: 'auto' }}>
                <SelectComponentDark
                  label={t('room', {ns:NS_DASHBOARD_COMPUTERS})}
                  value={room?.uid || ''}
                  values={rooms.map(item => ({ id: item.uid, value: item.name }))}
                  onChange={onChangeRoom}
                  hasNull={false}
                />
              </Grid>
              <Grid size={{ xs: 'grow', sm: 'auto' }}>

                <SelectComponentDark
                  label={t('status', {ns:NS_DASHBOARD_COMPUTERS})}
                  value={filter}
                  values={[{ uid: 'all', name: `-- ${t('all')} --` }, ...ClassDevice.ALL_STATUS.map(item => ({ uid: item, name: t(item) }))].map(item => ({ id: item.uid, value: item.name }))}
                  onChange={(e) => setFilter(e.target.value)}
                  hasNull={false}
                />
              </Grid>
            </Grid>

          </Stack>
          <Stack maxWidth={{ xs: '100%', sm: '350px' }}>
            <AccordionComponent school={school} room={room} />
          </Stack>
        </Stack>
        <Stack
          spacing={1}
          sx={{
            width: '100%',
            background: '#020617',
            borderRadius: '16px',
            border: '1px solid #1f2937',
            padding: '12px',
            //boxShadow: '0 18px 45px rgba(0, 0, 0, 0.4)',
          }}>
          <Stack spacing={1} direction={'row'} sx={{ background: '', width: '100%' }} className='legend'>
            {filter === 'all' ? <>
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
                (filter === 'available') && <LegendItem status="available" value={computersBis.filter((c) => c.status === "available").length} />
              }
              {
                (filter === 'busy') && <LegendItem status="busy" value={computersBis.filter((c) => c.status === "busy").length} />
              }
              {
                (filter === 'maintenance') && <LegendItem status="maintenance" value={computersBis.filter((c) => c.status === "maintenance").length} />
              }
              {
                (filter === 'reparation') && <LegendItem status="reparation" value={computersBis.filter((c) => c.status === "reparation").length} />
              }
              {
                (filter === 'hs') && <LegendItem status="hs" value={computersBis.filter((c) => c.status === "hs").length} />
              }
            </>}
          </Stack>
          <Grid container sx={{ width: '100%', background: '' }} justifyContent={'stretch'} spacing={0.5}>
            {computersBis.map((pc, i) => (
              <Grid key={`${pc.uid}-${i}`} size={{ xs: 6, sm: 'auto' }} justifyItems={'stretch'}>
                <ComputerCard
                  computer={pc}
                  isSelected={selectedDevice?.uid === pc.uid}
                  onClick={() => handleCardClick(pc)}
                />
                <div style={{ display: 'none' }}>
                  <DeviceCard
                    //key={d.uid}
                    device={pc}
                    onClick={() => console.log("open details", d.uid)}
                    onEdit={(dev) => console.log("edit", dev.uid)}
                    onToggleEnabled={(dev) =>
                      console.log("toggle enabled", dev.uid, dev.enabled)
                    }
                  />
                </div>
              </Grid>

            ))}
          </Grid>
        </Stack>
      </Stack>



      <div className="page" style={{ background: 'red', maxWidth: '100%', display: 'none' }}>

        <main className="container" style={{ background: 'green' }}>
          {/* HEADER */}
          <Stack spacing={1} alignItems={'start'} sx={{ mb: 2 }}>
            <SelectComponentDark
              label={'school'}
              value={school.uid}
              values={schools.map(item => ({ id: item.uid, value: item.name }))}
              hasNull={false}
            />
            <Grid container>
              <Grid size={'auto'}>
                <SelectComponentDark
                  label={'room'}
                  value={room?.uid || 'all'}
                  values={rooms.length > 1 ? [{ uid: 'all', name: `-- ${t('all')} --` }, ...rooms].map(item => ({ id: item.uid, value: item.name })) : rooms.map(item => ({ id: item.uid, value: item.name }))}
                  onChange={onChangeRoom}
                  hasNull={false}
                />
              </Grid>
              <Grid size={'auto'}>

                <SelectComponentDark
                  label={'status'}
                  value={filter}
                  values={[{ uid: 'all', name: `-- ${t('all')} --` }, ...ClassDevice.ALL_STATUS.map(item => ({ uid: item, name: t(item) }))].map(item => ({ id: item.uid, value: item.name }))}
                  onChange={(e) => setFilter(e.target.value)}
                  hasNull={false}
                />
              </Grid>
            </Grid>
          </Stack>

          {/* FILTRES + STATS QUICK */}
          <section className="toolbar">
            <div className="chips">
              <button
                className={`chip ${filter === "all" ? "chip-active" : ""}`}
                onClick={() => setFilter("all")}
              >
                Tous
              </button>
              <button
                className={`chip ${filter === "available" ? "chip-active" : ""}`}
                onClick={() => setFilter("available")}
              >
                Disponibles
              </button>
              <button
                className={`chip ${filter === "busy" ? "chip-active" : ""}`}
                onClick={() => setFilter("busy")}
              >
                Occupés
              </button>
              <button
                className={`chip ${filter === "maintenance" ? "chip-active" : ""
                  }`}
                onClick={() => setFilter("maintenance")}
              >
                Maintenance
              </button>
              <button
                className={`chip ${filter === "reparation" ? "chip-active" : ""
                  }`}
                onClick={() => setFilter("reparation")}
              >
                {`Réparation`}
              </button>
              <button
                className={`chip ${filter === "hs" ? "chip-active" : ""}`}
                onClick={() => setFilter("hs")}
              >
                HS / Hors ligne
              </button>
            </div>
          </section>

          {/* GRID + PANEL */}
          <section className="layout">
            {/* GRID DES ORDIS */}

            <Stack
              spacing={1}
              sx={{
                background: '#020617',
                borderRadius: '16px',
                border: '1px solid #1f2937',
                padding: '12px',
                boxShadow: '0 18px 45px rgba(0, 0, 0, 0.4)',
              }}>
              <Stack spacing={1} direction={'row'} sx={{ background: '' }} className='legend'>
                {filter === 'all' ? <>
                  <LegendItem status="available" value={computersBis.filter((c) => c.status === "available").length} />
                  <LegendItem status="busy" value={computersBis.filter((c) => c.status === "busy").length} />
                  <LegendItem status="maintenance" value={computersBis.filter((c) => c.status === "maintenance").length} />
                  <LegendItem status="reparation" value={computersBis.filter((c) => c.status === "reparation").length} />
                  <LegendItem status="hs" value={computersBis.filter((c) => c.status === "hs").length} />
                </> : <>
                  {
                    (filter === 'available') && <LegendItem status="available" value={computersBis.filter((c) => c.status === "available").length} />
                  }
                  {
                    (filter === 'busy') && <LegendItem status="busy" value={computersBis.filter((c) => c.status === "busy").length} />
                  }
                  {
                    (filter === 'maintenance') && <LegendItem status="maintenance" value={computersBis.filter((c) => c.status === "maintenance").length} />
                  }
                  {
                    (filter === 'reparation') && <LegendItem status="reparation" value={computersBis.filter((c) => c.status === "reparation").length} />
                  }
                  {
                    (filter === 'hs') && <LegendItem status="hs" value={computersBis.filter((c) => c.status === "hs").length} />
                  }
                </>}
              </Stack>
              <div className="grid">
                {computersBis.map((pc, i) => (
                  <ComputerCard
                    key={`${pc.uid}-${i}`}
                    computer={pc}
                    isSelected={selected?.uid === pc.uid}
                    onClick={() => handleCardClick(pc)}
                  />
                ))}
              </div>
            </Stack>

            {/* PANNEAU DÉTAILS */}
            <aside className="side-panel">
              {selected ? (
                <>
                  <h2>Détails du poste</h2>
                  <div className="side-icon-wrapper">
                    <ComputerIconLarge status={selected.status} />
                  </div>
                  <p className="side-name">{selected.name}</p>
                  <StatusBadge status={selected.status} big />

                  <div className="side-info">
                    <p>
                      <span>Identifiant interne :</span> #{selected.id}
                    </p>
                    <p>
                      <span>Emplacement :</span> Salle informatique principale
                    </p>
                    <p>
                      <span>Type :</span> Poste fixe
                    </p>
                    <p>
                      <span>OS :</span> Windows 11 (exemple)
                    </p>
                    <p>
                      <span>Dernière mise à jour :</span> 14.11.2025
                    </p>
                  </div>

                  <p className="side-note">
                    Cette partie pourra être reliée à ta vraie base de données
                    (Firestore, API interne) pour afficher les specs, l&apos;état
                    des mises à jour, l&apos;historique des pannes, etc.
                  </p>
                </>
              ) : (
                <div className="side-empty">
                  <p>Sélectionne un ordinateur dans la grille pour voir les détails.</p>
                </div>
              )}
            </aside>
          </section>
        </main>

        <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 0px;
          color: #e5e7eb;
          display: flex;
          justify-content: center;
        }

        .container {
          width: 100%;
          min-height: 100vh;
          height: 100%;
          padding: 0px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          align-items: flex-start;
        }

        .breadcrumb {
          margin: 0 0 4px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        h1 {
          margin: 0 0 6px;
          font-size: 1.8rem;
          color:var(--font-color);
        }

        .muted {
          margin: 0;
          font-size: 0.9rem;
          color: ${ClassColor.GREY_LIGHT};
          max-width: 460px;
        }

        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: flex-end;
        }

        .toolbar {
        width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: start;
          gap: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .chip {
          border-radius: 999px;
          padding: 4px 10px;
          border: 1px solid var(--primary);
          background: var(--card-color);
          color: var(--primary);
          font-size: 0.78rem;
          cursor: pointer;
        }

        .chip-active {
          background: var(--primary);
          border-color: var(--primary);
          border: 1px solid var(--primary);
          color: var(--background);
        }

        .counts {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .layout {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1.1fr);
          gap: 16px;
        }

        @media (max-width: 980px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .header {
            flex-direction: column;
          }
        }

        .grid {
            width: 100%;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        @media (max-width: 1000px) {
          .grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 800px) {
          .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .side-panel {
          background: #020617;
          border-radius: 16px;
          border: 1px solid #1f2937;
          padding: 16px 16px 18px;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
          min-height: 220px;
        }

        .side-panel h2 {
          margin: 0 0 12px;
          font-size: 1.1rem;
        }

        .side-icon-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
        }

        .side-name {
          text-align: center;
          margin: 0;
          font-weight: 600;
          font-size: 1rem;
        }

        .side-info {
          margin-top: 12px;
          font-size: 0.85rem;
        }

        .side-info p {
          margin: 2px 0;
        }

        .side-info span {
          color: #9ca3af;
        }

        .side-note {
          margin-top: 12px;
          font-size: 0.78rem;
          color: #6b7280;
        }

        .side-empty {
          font-size: 0.9rem;
          color: #9ca3af;
          margin-top: 10px;
        }
      `}</style>
      </div>
    </>
  );
}