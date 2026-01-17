import { IconHome } from "@/assets/icons/IconsComponent";
import { ClassColor } from "@/classes/ClassColor";
import { useThemeMode } from "@/contexts/ThemeProvider";
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
export default function ButtonConfirm({ label = 'Confirmer', color = 'primary', loading = false, disabled = false, onClick = null, fullWidth = false, size = 'small',
  variant = 'contained',sx={}, ...props }) {
  const { theme } = useThemeMode();
  const { primary, background, greyLight } = theme.palette;
  return (<Button
    //disableElevation
    variant={variant}
    fullWidth={fullWidth}
    loading={loading}
    //elevation={0}
    color={color}
    disabled={disabled}
    size={size}
    onClick={() => {
      if (onClick) {
        onClick();
      }
    }}
    sx={{
      //border: `1px solid ${primary.main}`,
      textTransform: 'none',
      borderRadius: '999px',
      padding: '8px 14px',
      //border: '1px solid #374151',
      //background: primary.main,
      //color: background.main,
      color: "var(--card-color)",
      fontSize: '0.9rem',
      height: size === 'small' ? '30px' : size === 'medium' ? '35px' : '40px',
      maxHeight: size === 'small' ? '30px' : size === 'medium' ? '40px' : '50px',
      //cursor: 'pointer',
      '&:hover': {
        //bgcolor: 'primary.dark',
        //background: '#1d4ed8',
        //color: primary.main,
      },
      '&.Mui-disabled': {
        bgcolor: greyLight.main,
        color: background.main,
      },
      ...sx
    }}
    {...props}>
    {label}
  </Button>)
}