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
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { cutString, getFormattedDate, getFormattedDateCompleteNumeric, getJsonValues } from '@/contexts/functions';
import { useLanguage } from '@/contexts/LangProvider';
import { ClassUserAdmin, ClassUserIntern, ClassUserSuperAdmin } from '@/classes/users/ClassUser';
import ButtonCancel from './ButtonCancel';
import ButtonConfirm from './ButtonConfirm';
import DialogTypographyComponent from './DialogTypographyComponent';
import FieldComponent from '@/components/elements/FieldComponent';

export default function DialogConfirmAction({
  //title="Confirmer action",
  title = "Souhaites-tu ajouter cet élément ?",
  updateList = null,
  actionConfirm = null,
  actionCancel = null,
  labelConfirm="Oui",
  labelCancel="Non",
  open = false,
  setOpen = null
}) {
  const { theme } = useThemeMode();
  const { primary, cardColor, text, greyLight } = theme.palette;
  const { t } = useTranslation([ClassDevice.NS_COLLECTION]);
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [mode, setMode] = useState('create');
  const [processing, setProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [device, setDevice] = useState(new ClassDevice());
  const [deviceEdit, setDeviceEdit] = useState(null);

  const onChangeValue = (e) => {
    const { name, value, type } = e.target;
    console.log(name, value);
    setDevice(prev => {
      if (!prev || prev === null) {
        return prev;
      }
      prev.updateFirestore({ [name]: type === 'date' ? new Date(value) : value });
      console.log("WAAAA10", ClassDevice.getTypesByCategory(prev.category))
      return prev.clone();
    })
  }

  const handleClose = () => {
    //setDevice(null);
    //setDeviceEdit(null);
    //setMode('read');
    setOpen(false);
  };

  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <Dialog
        //fullWidth
        maxWidth={'md'}
        open={open}
        //onClose={handleClose}
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
          <Stack direction={'row'} justifyContent={'end'}>

            <CloseIcon sx={{ cursor: 'pointer' }} onClick={actionCancel} />
          </Stack>
        </DialogTitle>
        <DialogContent dividers={true} sx={{ p: { xs: 1, md: 3 }, pt: { xs: 0, md: 0 } }}>
          <Stack spacing={2} alignItems={'center'}>
            <Typography variant='h5'>{title}</Typography>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <ButtonCancel disabled={processing} label={labelCancel} variant='contained'
                onClick={actionCancel} />
              <ButtonConfirm loading={processing} disabled={processing} label={labelConfirm} variant='contained' 
              onClick={()=>{
                setProcessing(true);
                actionConfirm();
                setProcessing(false);
                actionCancel();
              }} 
              />
            </Stack>
          </Stack>

        </DialogContent>

      </Dialog>
    </Stack>
  );
}