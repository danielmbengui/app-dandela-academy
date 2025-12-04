"use client";
import React, { useEffect, useRef, useState } from 'react';
import { IconDashboard, IconEdit, IconMobile, IconRemove, } from "@/assets/icons/IconsComponent";
import { THEME_DARK, THEME_LIGHT, WEBSITE_START_YEAR } from "@/contexts/constants/constants";
import { NS_DASHBOARD_COMPUTERS, NS_DASHBOARD_HOME, } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import DashboardPageWrapper from '@/components/wrappers/DashboardPageWrapper';
import { ClassColor } from '@/classes/ClassColor';
import { Alert, Autocomplete, Backdrop, Box, Chip, CircularProgress, Container, Divider, Grid, IconButton, Snackbar, Stack, TextField, Typography } from '@mui/material';
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
import { useRoom } from '@/contexts/RoomProvider';
import { useDevice } from '@/contexts/DeviceProvider';

function SimpleAlert({ text = "", severity = 'error' }) {
  return (<Alert severity={severity}>{text}</Alert>);
}
function CreateComponent({mode = '', setMode = null, }) {
  const { theme } = useThemeMode();
  const { primary, cardColor, text, greyLight } = theme.palette;
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const errorsTranslate = t('errors', { returnObjects: true });
  const successTranslate = t('success', { returnObjects: true });
  const { user } = useAuth();
  //const [deviceNew, setDeviceNew] = useState(device);
  const { room, rooms } = useRoom();
  const [device, setDevice] = useState(null);
  const [errors, setErrors] = useState({});

  const { create, changeDevice,isLoading, } = useDevice();
  useEffect(() => {
    if (mode === 'create') {
      setDevice(new ClassHardware({ uid_room: room?.uid || '', status: ClassDevice.STATUS.AVAILABLE }));
    } else {
      setDevice(null);
    }
  }, [mode])
  const onChangeValue = (e) => {
    const { name, value, type } = e.target;
    // console.log(name, value);
    setErrors(prev => ({ ...prev, [name]: '' }))
    setDevice(prev => {
      if (!prev || prev === null) {
        return prev;
      }
      prev.update({ [name]: type === 'date' ? new Date(value) : value });
      return prev;
    })
  }
  const onClear = (name) => {
    //const { name, value, type } = e.target;
    console.log(name);

    setErrors(prev => ({ ...prev, [name]: '' }))
    setDevice(prev => {
      if (!prev || prev === null) {
        return prev;
      }
      prev.update({ [name]: '' });
      return prev;
    });
  }
  const handleClose = () => {
    // setDeviceNew(null);
    //setDevice(null);
    changeDevice();
    setMode('');
    setErrors({});
  };

  const onSubmit = async (e) => {
    setProcessing(true);
    try {
      const _errors = {};
      if (!device.validCategory()) {
        _errors.category = errorsTranslate.category || '';
      }
      if (!device.validType()) {
        _errors.type = errorsTranslate.type || '';
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
      if (Object.keys(_errors).length > 0) {
        _errors.main = errorsTranslate.main || '';
        setErrors(_errors);
      } else {
        //await create();
        var newDevice = await create(device);
        console.log("NEW DEVICE", newDevice);
        if (newDevice) {
          //setTextSuccess(successTranslate.create || '');
          setErrors({});
          //setDevice(newDevice);
          //setDeviceNew(newDevice);
          setMode('read');
          //changeDevice(newDevice.uid);
          //await updateList();
        }

      }

    } catch (error) {
      console.log("ERROR", error)
      return null;
    } finally {
      setProcessing(false);
    }
  }
  return (<>
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
          disabled={device?.uid_room === ''}
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
          //disabled={!device?.validCategory()}
          disabled={device?.uid_room === '' || !device?.validCategory()}
          value={device?.type}
          values={ClassDevice.getTypesByCategory(device?.category).map(type => ({ id: type, value: t(type) }))}
          onChange={onChangeValue}
          hasNull={device?.type === ClassDevice.TYPE.UNKNOWN}
          required
          error={errors.type}
        />
        <FieldComponent
          label={t('brand')}
          name={'brand'}
          disabled={!device?.validType()}
          type='text'
          value={device?.brand || ''}
          onChange={onChangeValue}
          onClear={() => onClear('brand')}
          required
          error={errors.brand}
        />
        {
          device?.validCategory() && <Stack spacing={1}>
            <FieldComponent
              label={t('os')}
              name={'os'}
              disabled={!device?.validType()}
              type='text'
              value={device?.os || ''}
              //onChange={onChangeValue}
              onChange={onChangeValue}
              onClear={() => onClear('os')}
              required
              error={errors.os}
              autoComplete={ClassHardware.ALL_OS.map(item => t(item)).sort((a, b) => a.localeCompare(b))}
            //options={['yes', 'no'].map(item=>({label:item}))}
            />

            <FieldComponent
              label={t('os_version')}
              name={'os_version'}
              disabled={!device?.validType()}
              type='text'
              value={device?.os_version || ''}
              onChange={onChangeValue}
              onClear={() => onClear('os_version')}
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
      </Stack>
    </DialogContent>
    <DialogActions sx={{ minHeight: '20px' }}>
      {
        user instanceof ClassUserIntern && <Stack sx={{ width: '100%' }} direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
          {
            <Stack spacing={1.5} sx={{ width: '100%', background: '' }} direction={'row'} alignItems={'center'} justifyContent={errors.main ? 'space-between' : 'end'}>
              {
                errors.main && <Stack sx={{ background: '', width: '100%' }}>
                  <SimpleAlert text={errors.main} />
                </Stack>
              }
              <ButtonConfirm loading={isLoading} label={t('btn-create')} variant='contained' onClick={onSubmit} />
            </Stack>
          }
        </Stack>
      }
    </DialogActions>
  </>)
}
function ReadComponent({setMode = null,}) {
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { theme } = useThemeMode();
  const { getOneRoomName } = useRoom();
  const { primary, greyLight } = theme.palette;
  const [wantRemove, setWantRemove] = useState(false);
  const { device, changeDevice, remove } = useDevice();

  const handleClose = () => {
    //setDevice(null);
    changeDevice();
    setMode('');
  };
  const handleRemove = () => {
    setWantRemove(true);
    //setMode('remove');
  };
  const handleEdit = () => {
    setMode('edit');
  };
  return (<>
    <DialogTitle id="scroll-dialog-title">
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
          {
            ClassDevice.getIcon({ type: device?.type, size: 'small', status: device?.status, extra: true })
          }
          <Stack>
            <Typography variant='h4'>{device?.name || '---'}</Typography>
            <Typography variant='h5' color='greyLight'>{getOneRoomName(device?.uid_room) || '---'}</Typography>
          </Stack>
        </Stack>
        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
      </Stack>
    </DialogTitle>
    <DialogContent dividers={true} sx={{ p: { xs: 1, md: 2 }, pt: { xs: 0, md: 0 } }}>
      <Stack spacing={2}>
        <Stack spacing={1} alignItems={'center'} sx={{ width: '100%' }}>
          {
            ClassDevice.getIcon({ type: device?.type, size: 'large', status: device?.status })
          }
          <BadgeStatusDevice status={device?.status} big />
          <Typography>{device?.name}</Typography>
        </Stack>
        <Divider sx={{ color: greyLight.main }} variant={'middle'}>
          <Chip label={t('infos')} size="small" />
        </Divider>
        <Stack>
          <DialogTypographyComponent title={t('uid')} value={device?.uid} />
          <DialogTypographyComponent title={t('uid_intern')} value={`#${device?.uid_intern}`} />
          <DialogTypographyComponent title={t('category')} value={t(device?.category)} />
          <DialogTypographyComponent title={t('type')} value={t(device?.type)} />
          <DialogTypographyComponent title={t('name')} value={device?.name} />
          <DialogTypographyComponent title={t('brand')} value={device?.brand} />
          <DialogTypographyComponent title={t('os')} value={t(device?.os)} />
          <DialogTypographyComponent title={t('os_version')} value={device?.os_version} />
          <Stack sx={{ pt: 3 }}>
            <Typography variant='caption'>{`${t('buy_time')} : ${getFormattedDateCompleteNumeric(device?.buy_time, lang)}`}</Typography>
            <Typography variant='caption'>{`${t('created_time')} : ${getFormattedDateCompleteNumeric(device?.created_time, lang)}`}</Typography>
            <Typography variant='caption'>{`${t('last_edit_time')} : ${getFormattedDateCompleteNumeric(device?.last_edit_time, lang)}`}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </DialogContent>
    <DialogActions sx={{ minHeight: '20px' }}>
      {
        user instanceof ClassUserIntern && <Stack sx={{ width: '100%' }} direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
          <IconButton size={'small'} onClick={handleRemove}>
            <IconRemove width={20} height={20} color={'red'} />
          </IconButton>
          <IconButton size={'small'} onClick={handleEdit}>
            <IconEdit width={20} height={20} color={primary.main} />
          </IconButton>
        </Stack>
      }
    </DialogActions>
    <DialogConfirmAction
      title='Veux-tu supprimer ce périphérique ?'
      setOpen={setWantRemove}
      open={wantRemove}
      actionCancel={() => setWantRemove(false)}
      actionConfirm={async () => {
        const _removed = await remove();
        //const _removed = await device.removeFirestore();
        //setRemoved(_removed);
        //await updateList();
        //setSuccess(_removed);
        //setTextSuccess(_removed ? successTranslate.remove : '')
        handleClose();

      }}
    //actionCancel={}
    />
  </>);
}
function UpdateComponent({setMode = null, }) {
  const { theme } = useThemeMode();
  const { greyLight } = theme.palette;
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const errorsTranslate = t('errors', { returnObjects: true });
  const { user } = useAuth();
  const { rooms, getOneRoomName } = useRoom();
  const { device, changeDevice, update,isLoading } = useDevice();
  const [deviceEdit, setDeviceEdit] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (device) {
      console.log("updates", ClassDevice.getTypesByCategory('hardware'))
      setDeviceEdit(device.clone());
    } else {
      setDeviceEdit(null);
    }
  }, [device]);
  const onChangeValue = (e) => {
    const { name, value, type } = e.target;
    console.log(name, value);
    setDeviceEdit(prev => {
      if (!prev || prev === null) {
        return prev;
      }
      prev.update({ [name]: type === 'date' ? new Date(value) : value });
      console.log("WAAAA10", prev.clone())
      return prev.clone();
    })
  }
  const handleClose = () => {
    //setDevice(null);
    changeDevice();
    setDeviceEdit(null);
    setMode('');
  };
  const handleSubmit = async () => {
    //setProcessing(true);
    try {
      const _errors = {};
      if (!deviceEdit.validCategory()) {
        _errors.category = errorsTranslate.category || '';
      }
      if (!deviceEdit.validType()) {
        _errors.type = errorsTranslate.type || '';
      }
      if (!deviceEdit.validBrand()) {
        _errors.brand = translateWithVars(errorsTranslate.brand, { min: ClassDevice.MIN_LENGTH_BRAND, max: ClassDevice.MAX_LENGTH_BRAND }) || '';
      }
      if (!device.validOs()) {
        _errors.os = errorsTranslate.os || '';
      }
      if (!deviceEdit.validOsVersion()) {
        _errors.os_version = translateWithVars(errorsTranslate.os_version, { min: ClassHardware.MIN_LENGTH_OS_VERSION, max: ClassHardware.MAX_LENGTH_OS_VERSION }) || '';
      } 
      if (!deviceEdit.validBuyTime()) {
        _errors.buy_time = errorsTranslate.buy_time || '';
      }
      if (!deviceEdit.validStatus()) {
        _errors.status = errorsTranslate.status || '';
      }
      if (!deviceEdit.uid_room) {
        _errors.room = errorsTranslate.room || '';
      }
      console.log("errrrorw", _errors)
      if (Object.keys(_errors).length > 0) {
        _errors.main = errorsTranslate.main || '';
        setErrors(_errors);
      } else {
        console.log("OOOOK", deviceEdit.toJSON())
        const newDevice = await update(deviceEdit);
        if (newDevice) {
          //changeDevice(newDevice.uid);
          //setDevice(newDevice);
          //setDeviceEdit(newDevice);
          setMode('read');
         // setSuccess(true);
          //setTextSuccess(successTranslate.edit)
          //await updateList();
          //await updateComputersList();
        }
      }
    } catch (error) {
      console.log("ERROR", error)
      return;
    } finally {
      //setProcessing(false);
    }
  }
  return (<>
    <DialogTitle id="scroll-dialog-title">
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
          {
            ClassDevice.getIcon({ type: deviceEdit?.type, size: 'small', status: deviceEdit?.status, extra: true })
          }
          <Stack>
            <Typography variant='h4'>{deviceEdit?.name || '---'}</Typography>
            <Typography variant='h5' color='greyLight'>{getOneRoomName(device?.uid_room) || '---'}</Typography>
          </Stack>
        </Stack>
        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
      </Stack>
    </DialogTitle>
    <DialogContent dividers={true} sx={{ p: { xs: 1, md: 2 }, pt: { xs: 0, md: 0 } }}>
      <Stack spacing={2}>
        <Stack spacing={1} alignItems={'center'} sx={{ width: '100%' }}>
          {
            ClassDevice.getIcon({ type: deviceEdit?.type, size: 'large', status: deviceEdit?.status })
          }
          <BadgeStatusDevice status={deviceEdit?.status} big />
          <Typography>{deviceEdit?.name}</Typography>
        </Stack>
        <Divider sx={{ color: greyLight.main }} variant={'middle'}>
          <Chip label={t('infos')} size="small" />
        </Divider>
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
            value={deviceEdit?.category}
            values={ClassDevice.ALL_CATEGORIES.map(category => ({ id: category, value: t(category) }))}
            onChange={onChangeValue}
            hasNull={false}
            error={errors.category}
          />
          <SelectComponentDark
            label={t('type')}
            name={'type'}
            value={deviceEdit?.type}
            values={ClassDevice.getTypesByCategory(deviceEdit?.category).map(type => ({ id: type, value: t(type) }))}
            onChange={onChangeValue}
            hasNull={false}
            error={errors.type}
          />
          <FieldComponent
            label={t('name')}
            name={'name'}
            type='text'
            value={deviceEdit?.name || ''}
            onChange={onChangeValue}
            error={errors.name}
          />
          <FieldComponent
            label={t('brand')}
            name={'brand'}
            type='text'
            value={deviceEdit?.brand || ''}
            onChange={onChangeValue}
            error={errors.brand}
          />
          <FieldComponent
            label={t('os')}
            name={'os'}
            type='text'
            value={deviceEdit?.os || ''}
            onChange={onChangeValue}
            error={errors.os}
          />
          <FieldComponent
            label={t('os_version')}
            name={'os_version'}
            type='text'
            value={deviceEdit?.os_version || ''}
            onChange={onChangeValue}
            error={errors.os_version}
          />
          <FieldComponent
            label={t('buy_time')}
            name={'buy_time'}
            type='date'
            value={deviceEdit?.buy_time || ''}
            onChange={onChangeValue}
            error={errors.buy_time}
          />
          <SelectComponentDark
            label={t('status')}
            name={'status'}
            value={deviceEdit?.status}
            values={ClassDevice.ALL_STATUS.map(status => ({ id: status, value: t(status) }))}
            onChange={onChangeValue}
            hasNull={false}
            error={errors.status}
          />
        </Stack>
      </Stack>
    </DialogContent>
    <DialogActions sx={{ minHeight: '20px' }}>
      {
        user instanceof ClassUserIntern && <Stack sx={{ width: '100%' }} direction={'row'} spacing={1} justifyContent={'end'} alignItems={'center'}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <ButtonCancel disabled={isLoading} label={t('btn-cancel')} variant='contained' onClick={() => setMode('read')} />
            {
              device && deviceEdit && !device.same(deviceEdit) && <ButtonConfirm loading={isLoading} label={t('btn-edit')} variant='contained'
                onClick={handleSubmit} />
            }
          </Stack>
        </Stack>
      }
    </DialogActions>
  </>)
}

export default function DialogDevice({ mode = 'read', setMode = null }) {
  const { theme } = useThemeMode();
  const { cardColor, text, greyLight } = theme.palette;
  const { device, changeDevice, } = useDevice();

  const handleClose = () => {
    //setDevice(null);
    //setDeviceEdit(null);
    changeDevice();
    setMode('');
  };

  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <Dialog
        //inert
        //fullWidth
        maxWidth={'md'}
        open={device}
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
        {
          mode === 'create' && <CreateComponent mode={mode} setMode={setMode} />
        }
        {
          mode === 'read' && <ReadComponent setMode={setMode} />
        }
        {
          mode === 'edit' && <UpdateComponent setMode={setMode} />
        }
      </Dialog>
    </Stack>
  );
}