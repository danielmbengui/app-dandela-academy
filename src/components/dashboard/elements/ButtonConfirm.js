import { IconHome } from "@/assets/icons/IconsComponent";
import { Button } from "@mui/material";
import React from "react";

/*
        .btn {
          border-radius: 999px;
          padding: 8px 14px;
          border: 1px solid #374151;
          background: #020617;
          color: #e5e7eb;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .btn.primary {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
          border-color: transparent;
        }
*/
export default function ButtonConfirm({ label = 'Confirmer',isAdmin=false, color = 'primary', loading = false, disabled = false, onClick = null, fullWidth = false, size = 'small',
  variant = 'contained',icon=null,sx={}, ...props }) {
  return (<Button
    //disableElevation
    variant={variant}
    fullWidth={fullWidth}
    loading={loading}
    elevation={0}
    startIcon={icon}
    color={isAdmin ? 'warning' : color}
    disabled={disabled}
    size={size}
    onClick={() => {
      if (onClick) {
        onClick();
      }
    }}
    sx={{
      textTransform: 'none',
      boxShadow: 'none',
      borderRadius: '999px',
      padding: '8px 14px',
      color: variant === 'outlined' ? 'var(--primary)' : 'var(--font-reverse-color)',
      fontSize: '0.9rem',
      height: size === 'small' ? '30px' : size === 'medium' ? '35px' : '40px',
      maxHeight: size === 'small' ? '30px' : size === 'medium' ? '40px' : '50px',
      borderColor: variant === 'outlined' ? 'var(--primary)' : 'transparent',
      '&:hover': {
        borderColor: variant === 'outlined' ? 'var(--primary)' : 'transparent',
      },
      '&.Mui-disabled': {
        bgcolor: 'var(--grey-light)',
        color: 'var(--font-color)',
        borderColor: 'var(--card-border)',
      },
      ...sx
    }}
    {...props}>
    {label}
  </Button>)
}