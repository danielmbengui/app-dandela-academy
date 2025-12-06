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
export default function ButtonConfirm({ label = 'Confirmer', loading = false, disabled = false, onClick = null, size = 'small', ...props }) {
  const { theme } = useThemeMode();
  const { primary, background, greyLight } = theme.palette;
  return (<Button
  {...props}
    variant="contained"
    loading={loading}
    disabled={disabled}
    size={size}
    onClick={() => {
      if (onClick) {
        onClick();
      }
    }}
    sx={{
      border: `1px solid ${primary.main}`,
      textTransform: 'none',
      borderRadius: '999px',
      padding: '8px 14px',
      //border: '1px solid #374151',
      background: primary.main,
      color: background.main,
      fontSize: '0.9rem',
      height: size==='small' ? '35px' : size==='medium' ? '38px' : '40px',
      maxHeight: size==='small' ? '35px' : size==='medium' ? '45px' : '55px',
      //cursor: 'pointer',
      '&:hover': {
        //bgcolor: 'primary.dark',
        background: '#1d4ed8',
        //color: primary.main,
      },
      '&.Mui-disabled': {
        bgcolor: greyLight.main,
        color: background.main,
      },
    }}>
    {label}
  </Button>)
}