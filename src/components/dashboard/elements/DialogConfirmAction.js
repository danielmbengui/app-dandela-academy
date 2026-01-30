"use client";
import React, { useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeMode } from "@/contexts/ThemeProvider";
import ButtonCancel from './ButtonCancel';
import ButtonConfirm from './ButtonConfirm';
import { IconCheckFilled } from "@/assets/icons/IconsComponent";

export default function DialogConfirmAction({
  title = "Souhaites-tu ajouter cet élément ?",
  actionConfirm = null,
  actionCancel = null,
  labelConfirm = "Oui",
  labelCancel = "Non",
  open = false,
  setOpen = null,
  icon = null,
  severity = "info",
  isAdmin = false,
}) {
  const { theme } = useThemeMode();
  const { primary, cardColor, text, greyLight } = theme.palette;
  const [processing, setProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!actionConfirm) return;
    setProcessing(true);
    try {
      await actionConfirm();
    } catch (error) {
      console.error("Error in confirm action:", error);
    } finally {
      setProcessing(false);
      if (setOpen) setOpen(false);
    }
  };

  const handleCancel = () => {
    if (actionCancel) {
      actionCancel();
    }
    if (setOpen) setOpen(false);
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'warning':
        return 'var(--warning)';
      case 'error':
        return 'var(--error)';
      case 'success':
        return 'var(--success)';
      default:
        return primary.main;
    }
  };

  const getSeverityBg = () => {
    switch (severity) {
      case 'warning':
        return 'var(--warning-shadow)';
      case 'error':
        return 'var(--error-shadow)';
      case 'success':
        return 'var(--success-shadow)';
      default:
        return 'var(--primary-shadow)';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
        },
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          background: cardColor.main,
          color: text.main,
          margin: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          p: 0,
          position: 'relative',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2.5, pb: 1 }}
        >
          <Box sx={{ flex: 1 }} />
          <IconButton
            onClick={handleCancel}
            disabled={processing}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: greyLight.main,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                background: 'var(--background-menu-item)',
                color: text.main,
                transform: 'rotate(90deg)',
              },
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 3, sm: 4 }, pt: 2, pb: 3 }}>
        <Stack spacing={3} alignItems="center">
          {/* Icône de confirmation avec animation */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: getSeverityBg(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${getSeverityColor()}`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: getSeverityBg(),
                opacity: 0.3,
                animation: 'ripple 2s ease-out infinite',
                '@keyframes ripple': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 0.3,
                  },
                  '100%': {
                    transform: 'scale(1.4)',
                    opacity: 0,
                  },
                },
              },
            }}
          >
            {icon || (
              <IconCheckFilled
                width={36}
                height={36}
                color={getSeverityColor()}
              />
            )}
          </Box>

          {/* Titre */}
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              textAlign: 'center',
              color: text.main,
              lineHeight: 1.5,
              px: 1,
            }}
          >
            {title}
          </Typography>

          {/* Boutons d'action */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ width: '100%', pt: 1 }}
          >
            <ButtonCancel
              disabled={processing}
              label={labelCancel}
              variant="outlined"
              onClick={handleCancel}
              fullWidth
              isAdmin={isAdmin}
              sx={{ order: { xs: 2, sm: 1 } }}
            />
            <ButtonConfirm
              loading={processing}
              disabled={processing}
              label={labelConfirm}
              variant="contained"
              onClick={handleConfirm}
              fullWidth
              isAdmin={isAdmin}
              sx={{ order: { xs: 1, sm: 2 } }}
            />
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
