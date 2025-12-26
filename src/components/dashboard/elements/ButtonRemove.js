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
export default function ButtonRemove({ label = 'Quitter', loading = false, disabled = false, onClick = null,fullWidth=false, size = 'small', ...props }) {
  const { theme } = useThemeMode();
  const { primary, background, greyLight, text } = theme.palette;
  return (<Button
    variant="contained"
    fullWidth={fullWidth}
    disableElevation
    loading={loading}
    disabled={disabled}
    size={size}
    onClick={() => {
      if (onClick) {
        onClick();
      }
    }}
    sx={{
      border: `0.1px solid red`,
      textTransform: 'none',
      borderRadius: '999px',
      padding: '8px 14px',
      //border: '1px solid #374151',
      background: ClassColor.TRANSPARENT,
      color: "red",
      fontSize: '0.9rem',
      height: size === 'small' ? '30px' : size === 'medium' ? '35px' : '40px',
      maxHeight: size === 'small' ? '30px' : size === 'medium' ? '40px' : '50px',
      //cursor: 'pointer',
      '&:hover': {
        //bgcolor: 'primary.dark',
        borderColor: "red",
        background: "red",
        color: "var(--card-color)",
      },
      '&.Mui-disabled': {
        border: `0.1px solid ${greyLight.main}`,
        bgcolor: greyLight.main,
        color: background.main,
      },
    }}
    {...props}>
    {label}
  </Button>)
}