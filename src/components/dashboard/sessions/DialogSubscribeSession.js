"use client";
import React, { useState } from 'react';
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useAuth } from '@/contexts/AuthProvider';
import { Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useLanguage } from '@/contexts/LangProvider';
import SessionSubscribeComponent from './SessionSubscribeComponent';
import { useSession } from '@/contexts/SessionProvider';

export default function DialogSubscribeSession({
  //title="Confirmer action",
  title = "T'inscrire à ce cours ?",
  updateList = null,
  actionConfirm = null,
  actionCancel = null,
  labelConfirm="Oui",
  labelCancel="Non",
  open = false,
  setOpen = null,
  //session=null,
  //selectedSlot: slot=null,
}) {
  const { theme } = useThemeMode();
  const { primary, cardColor, text, greyLight } = theme.palette;
    const { session, sessions,slot, setUidSession, setUidSlot} = useSession();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [mode, setMode] = useState('create');
  const [processing, setProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deviceEdit, setDeviceEdit] = useState(null);

  const onChangeValue = (e) => {

  }

  const handleClose = () => {
    //setDevice(null);
    //setDeviceEdit(null);
    //setMode('read');
    //setUidSession(null);
    //setUidSlot(null);
    setOpen(false);
  };

  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <Dialog
        //fullWidth
        inert={processing}
        //maxWidth={'lg'}
        open={open}
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
            minWidth: { xs: '100%', md: '500px' },
            width: { xs: '100%', md: '' },
            maxWidth: { xs: '100%', md: '100%' },
            //maxWidth: '100%',
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

            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
          </Stack>
        </DialogTitle>
        <DialogContent dividers={true} sx={{ p: { xs: 1, md: 3 }, pt: { xs: 0, md: 0 } }}>
          <SessionSubscribeComponent session={session} selectedSlot={slot} />
        </DialogContent>

      </Dialog>
    </Stack>
  );
}