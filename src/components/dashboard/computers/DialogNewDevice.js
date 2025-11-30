"use client";
import React, { useEffect, useRef, useState } from 'react';
import { IconDashboard, IconEdit, IconMobile, } from "@/assets/icons/IconsComponent";
import { THEME_DARK, THEME_LIGHT, WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_DASHBOARD_COMPUTERS, NS_DASHBOARD_HOME, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import { ClassColor } from '@/classes/ClassColor';
import { Backdrop, Box, Chip, CircularProgress, Container, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import { ClassHardware, ClassDevice } from '@/classes/ClassDevice';
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
import { cutString, getFormattedDate, getFormattedDateCompleteNumeric, getJsonValues, translateWithVars } from '@/contexts/functions';
import { useLanguage } from '@/contexts/LangProvider';
import { ClassUserAdmin, ClassUserIntern, ClassUserSuperAdmin } from '@/classes/users/ClassUser';
import AccordionComponent from '@/components/dashboard/elements/AccordionComponent';
import TextFieldComponent from '@/components/elements/TextFieldComponent';
import TextFieldComponentDark from '@/components/elements/TextFieldComponentDark';
import { ComputerIconLarge, ComputerIconSmall, LaptopIconLarge, LaptopIconSmall, MobileIconLarge, TabletIconLarge, TvIconLarge, WatchIconLarge } from './ComputerIcons';
import BadgeStatusDevice from './BadgeStatusDevice';
import ButtonCancel from '../elements/ButtonCancel';
import ButtonConfirm from '../elements/ButtonConfirm';
import DialogTypographyComponent from '../elements/DialogTypographyComponent';
import FieldComponent from '@/components/elements/FieldComponent';
import DialogConfirmAction from '../elements/DialogConfirmAction';

import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

function SimpleAlert({text=""}) {
  return (<Alert severity="error">{text}</Alert>);
}

function ReadComponent({ device = null }) {
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const { lang } = useLanguage();
  return (<Stack spacing={1} sx={{ width: '100%' }}>
    <DialogTypographyComponent title={t('uid')} value={device?.uid} />
    <DialogTypographyComponent title={t('uid_intern')} value={`#${device?.uid_intern}`} />
    <DialogTypographyComponent title={t('name')} value={device?.name} />
    <DialogTypographyComponent title={t('status')} value={t(device?.status)} />
    <DialogTypographyComponent title={t('category')} value={t(device?.category)} />
    <DialogTypographyComponent title={t('type')} value={t(device?.type)} />
    <DialogTypographyComponent title={t('brand')} value={device?.brand} />
    <DialogTypographyComponent title={t('os')} value={t(device?.os)} />
    <DialogTypographyComponent title={t('os_version')} value={device?.os_version} />
    <DialogTypographyComponent title={t('buy_time')} value={getFormattedDate(device?.buy_time, lang) || '---'} />
    <Stack sx={{ width: '100%', pt: 3, pb: 1 }} spacing={1} alignItems={'end'}>
      <Stack sx={{ width: '100%' }} spacing={1} alignItems={'start'}>
        <Typography variant="caption">{`${t('created_time')} : ${getFormattedDateCompleteNumeric(device?.created_time) || '---'}`}</Typography>
        <Typography variant="caption">{`${t('last_edit_time')} : ${getFormattedDateCompleteNumeric(device?.last_edit_time) || '---'}`}</Typography>
      </Stack>
    </Stack>
  </Stack>);
}
function EditComponent({ device = null, deviceEdit = null, setDeviceEdit }) {
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const { lang } = useLanguage();
  const onChangeValue = (e) => {
    const { name, value, type } = e.target;
    console.log(name, value);
    setDeviceEdit(prev => {
      if (!prev || prev === null) {
        return prev;
      }
      prev.update({ [name]: type === 'date' ? new Date(value) : value });
      console.log("WAAAA10", prev)
      return prev.clone();
    })
  }

  return (<Stack spacing={1} sx={{ width: '100%' }}>
    <SelectComponentDark
      label={t('category')}
      name={'category'}
      value={deviceEdit?.category}
      values={ClassDevice.ALL_CATEGORIES.map(category => ({ id: category, value: t(category) }))}
      onChange={onChangeValue}
      hasNull={false}
    />
    <SelectComponentDark
      label={t('type')}
      name={'type'}
      value={deviceEdit?.type}
      values={ClassDevice.getTypesByCategory(deviceEdit?.category).map(type => ({ id: type, value: t(type) }))}
      onChange={onChangeValue}
      hasNull={false}
    />
    <FieldComponent
      label={t('name')}
      name={'name'}
      type='text'
      value={deviceEdit?.name || ''}
      onChange={onChangeValue}
    />
    <FieldComponent
      label={t('brand')}
      name={'brand'}
      type='text'
      value={deviceEdit?.brand || ''}
      onChange={onChangeValue}
    />
    <FieldComponent
      label={t('os')}
      name={'os'}
      type='text'
      value={deviceEdit?.os || ''}
      onChange={onChangeValue}
    />
    <FieldComponent
      label={t('os_version')}
      name={'os_version'}
      type='text'
      value={deviceEdit?.os_version || ''}
      onChange={onChangeValue}
    />
    <FieldComponent
      label={t('buy_time')}
      name={'buy_time'}
      type='date'
      value={deviceEdit?.buy_time || ''}
      onChange={onChangeValue}
    />
    <SelectComponentDark
      label={t('status')}
      name={'status'}
      value={deviceEdit.status}
      values={ClassDevice.ALL_STATUS.map(status => ({ id: status, value: t(status) }))}
      onChange={onChangeValue}
      hasNull={false}
    />
  </Stack>);
}
function NewComponent({ device = null, deviceEdit = null, setDeviceEdit }) {
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const { lang } = useLanguage();
  const onChangeValue = (e) => {
    const { name, value, type } = e.target;
    console.log(name, value);
    setDeviceEdit(prev => {
      if (!prev || prev === null) {
        return prev;
      }
      prev.update({ [name]: type === 'date' ? new Date(value) : value });
      console.log("WAAAA10", prev)
      return prev.clone();
    })
  }

  return (<Stack spacing={1} sx={{ width: '100%' }}>
    <SelectComponentDark
      label={t('category')}
      name={'category'}
      value={deviceEdit?.category}
      values={ClassDevice.ALL_CATEGORIES.map(category => ({ id: category, value: t(category) }))}
      onChange={onChangeValue}
      hasNull={false}
    />
    <SelectComponentDark
      label={t('type')}
      name={'type'}
      value={deviceEdit?.type}
      values={ClassDevice.getTypesByCategory(deviceEdit?.category).map(type => ({ id: type, value: t(type) }))}
      onChange={onChangeValue}
      hasNull={false}
    />
    <FieldComponent
      label={t('name')}
      name={'name'}
      type='text'
      value={deviceEdit?.name || ''}
      onChange={onChangeValue}
    />
    <FieldComponent
      label={t('brand')}
      name={'brand'}
      type='text'
      value={deviceEdit?.brand || ''}
      onChange={onChangeValue}
    />
    <FieldComponent
      label={t('os')}
      name={'os'}
      type='text'
      value={deviceEdit?.os || ''}
      onChange={onChangeValue}
    />
    <FieldComponent
      label={t('os_version')}
      name={'os_version'}
      type='text'
      value={deviceEdit?.os_version || ''}
      onChange={onChangeValue}
    />
    <FieldComponent
      label={t('buy_time')}
      name={'buy_time'}
      type='date'
      value={deviceEdit?.buy_time || ''}
      onChange={onChangeValue}
    />
    <SelectComponentDark
      label={t('status')}
      name={'status'}
      value={deviceEdit.status}
      values={ClassDevice.ALL_STATUS.map(status => ({ id: status, value: t(status) }))}
      onChange={onChangeValue}
      hasNull={false}
    />
  </Stack>);
}
export default function DialogNewDevice({ updateList = null, isOpen = false, setIsOpen = null }) {
  const { theme } = useThemeMode();
  const { primary, cardColor, text, greyLight } = theme.palette;
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const errorsTranslate = t('errors', { returnObjects: true });
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [mode, setMode] = useState('create');
  const [processing, setProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [device, setDevice] = useState(new ClassDevice());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [errors, setErrors] = useState({});

  const onChangeValue = (e) => {
    const { name, value, type } = e.target;
    console.log(name, value);
    setErrors(prev => ({ ...prev, [name]: '' }))
    setDevice(prev => {
      if (!prev || prev === null) {
        return prev;
      }
      prev.update({ [name]: type === 'date' ? new Date(value) : value });
      console.log("WAAAA10", ClassDevice.getTypesByCategory(prev.category));
      if (name === 'category') {
        if (value === ClassDevice.CATEGORY.HARDWARE) {
          return new ClassHardware(prev.toJSON());
        }
      }
      return prev.clone();
    })
  }
  const handleClose = () => {
    setDevice(null);
    //setDeviceEdit(null);
    //setMode('read');
    setIsOpen(false);
    setErrors({});
  };
  useEffect(() => {
    async function initComputers() {
      setDevice(new ClassDevice());
      console.log("DEVICE", device)
      const _schools = await ClassSchool.fetchListFromFirestore([
        //where("school_uid", "==", schoolUid),
        orderBy("name"),
        //limit(25),
      ]);
      const _school = _schools[0];
      const _rooms = await ClassRoom.fetchListFromFirestore([
        where("uid_school", "==", _school.uid),
        orderBy("uid_intern"),
        //limit(25),
      ]);
      setRooms(_rooms);
      const _room = _rooms[0];
    }
    if (isOpen) {
      initComputers();
    }
  }, [isOpen]);

  const onSubmit = (e) => {
    const _errors = {};
    if (!device.validCategory()) {
      _errors.category = errorsTranslate.category || '';
    }
    if (!device.validType()) {
      _errors.type = errorsTranslate.type || '';
    }
    if (!device.validName()) {
      _errors.name = translateWithVars(errorsTranslate.name, { min: ClassDevice.MIN_LENGTH_NAME, max: ClassDevice.MAX_LENGTH_NAME }) || '';
    }
    if (!device.validBrand()) {
      _errors.brand = translateWithVars(errorsTranslate.brand, { min: ClassDevice.MIN_LENGTH_BRAND, max: ClassDevice.MAX_LENGTH_BRAND }) || '';
    }
    if (!device.validOs()) {
      _errors.os = errorsTranslate.os || '';
    }
    if (!device.validOsVersion()) {
      _errors.os_version = translateWithVars(errorsTranslate.os_version, { min: ClassHardware.MIN_LENGTH_OS_VERSION, max: ClassHardware.MAX_LENGTH_OS_VERSION }) || '';
    }

    if (!device.validBuyTime()) {
      _errors.buy_time = errorsTranslate.buy_time || '';
    }
    if (!device.validStatus()) {
      _errors.status = errorsTranslate.status || '';
    }
    if (!device.uid_room) {
      _errors.room = errorsTranslate.room || '';
    }
    if(Object.keys(_errors).length > 0) {
      _errors.main = errorsTranslate.main || '';
    }
    console.log("ERRRRORS", _errors)
    setErrors(_errors);
  }

  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <Dialog
        //fullWidth
        maxWidth={'md'}
        open={isOpen}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{

          '& .MuiDialog-container': {
            p: 1,
            //alignItems: 'stretch', // ⬅️ étire le container sur toute la hauteur
          },
          '& .MuiDialog-paper': {
            borderRadius: '10px',
            background: cardColor.main,
            color: text.main,
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
            //borderTopColor: greyLight.main,    // ou une couleur de ton thème
            //borderBottomColor: greyLight.main,
            borderTop: `0.1px solid ${cardColor.main}`,
            borderBottom: `0.1px solid ${greyLight.main}`,
          },

          // 🔹 Si tu utilises aussi des <Divider /> à l’intérieur

        }}
      >
        <DialogTitle id="scroll-dialog-title">
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
              {
                ClassDevice.getIcon({ type: device?.type, size: 'small', status: device?.status, extra: true })
              }
              <Stack>
                <Typography variant='h4'>{device?.name || t('name')}</Typography>
                <Typography variant='h5' color='greyLight'>{device?.type !== ClassDevice.TYPE.UNKNOWN ? t(device?.type) : t('type')}</Typography>
              </Stack>
            </Stack>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
          </Stack>
        </DialogTitle>
        <DialogContent dividers={true} sx={{ p: { xs: 1, md: 2 }, pt: { xs: 0, md: 0 } }}>
          <Stack spacing={1} sx={{ width: '100%' }}>
            <SelectComponentDark
              label={t('room')}
              name={'uid_room'}
              value={device?.uid_room}
              values={rooms.map(room => ({ id: room.uid, value: room.name }))}
              onChange={onChangeValue}
              hasNull={device?.uid_room === ''}
              required
              error={errors.room}
            />
            <SelectComponentDark
              label={t('category')}
              name={'category'}
              disabled={!device?.uid_room}
              value={device?.category}
              values={ClassDevice.ALL_CATEGORIES.map(category => ({ id: category, value: t(category) }))}
              onChange={onChangeValue}
              hasNull={device?.category === ClassDevice.CATEGORY.UNKNOWN}
              required
              error={errors.category}
            />
            <SelectComponentDark
              label={t('type')}
              name={'type'}
              disabled={!device?.validCategory()}
              value={device?.type}
              values={ClassDevice.getTypesByCategory(device?.category).map(type => ({ id: type, value: t(type) }))}
              onChange={onChangeValue}
              hasNull={device?.type === ClassDevice.TYPE.UNKNOWN}
              required
              error={errors.type}
            />
            <FieldComponent
              label={t('name')}
              name={'name'}
              disabled={!device?.validType()}
              type='text'
              value={device?.name || ''}
              onChange={onChangeValue}
              required
              error={errors.name}
            />
            <FieldComponent
              label={t('brand')}
              name={'brand'}
              disabled={!device?.validType()}
              type='text'
              value={device?.brand || ''}
              onChange={onChangeValue}
              required
              error={errors.brand}
            />
            {
              device?.validCategory() && <Stack spacing={1}>
                <SelectComponentDark
                  label={t('os')}
                  name={'os'}
                  disabled={!device?.validType()}
                  value={device?.os}
                  values={ClassHardware.ALL_OS.map(category => ({ id: category, value: t(category) }))}
                  onChange={onChangeValue}
                  hasNull={device?.os === ClassHardware.OS.UNKNOWN}
                  required
                  error={errors.os}
                />
                <FieldComponent
                  label={t('os_version')}
                  name={'os_version'}
                  disabled={!device?.validType()}
                  type='text'
                  value={device?.os_version || ''}
                  onChange={onChangeValue}
                  required
                  error={errors.os_version}
                />
              </Stack>
            }
            <FieldComponent
              label={t('buy_time')}
              name={'buy_time'}
              disabled={!device?.validType()}
              type='date'
              value={device?.buy_time || ''}
              onChange={onChangeValue}
              required
              error={errors.buy_time}
            />
            <SelectComponentDark
              label={t('status')}
              name={'status'}
              disabled={!device?.validType()}
              value={device?.status || ''}
              values={ClassDevice.ALL_STATUS.map(status => ({ id: status, value: t(status) }))}
              onChange={onChangeValue}
              hasNull={device?.status === ClassDevice.STATUS.UNKNOWN || device?.status === ''}
              required
              error={errors.status}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ minHeight: '20px' }}>
          {
            user instanceof ClassUserIntern && <Stack sx={{ width: '100%' }} direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
              {
                mode === 'create' && <Stack spacing={3} sx={{width:'100%', background:''}} direction={'row'} alignItems={'center'} justifyContent={errors.main ? 'space-between' : 'end'}>
                  {
                    errors.main && <Stack sx={{background:'', width:'100%'}}>
                    <SimpleAlert text={errors.main} />
                    </Stack>
                  }
                  <ButtonConfirm loading={processing} label={t('btn-create')} variant='contained' onClick={onSubmit} />
                </Stack>
              }
            </Stack>
          }
        </DialogActions>
      </Dialog>
    </Stack>
  );
}