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
export default function ButtonCancel({label='Annuler', loading=false, disabled=false, onClick=null}) {
    const {theme} = useThemeMode();
    const {primary,background,greyLight} = theme.palette;
    return (<Button
        variant="contained"
        disableElevation
        loading={loading}
        disabled={disabled}
        onClick={()=>{
            if(onClick) {
                onClick();
            }
        }}
        sx={{
            border:`1px solid ${greyLight.main}`,
            textTransform: 'none',
            borderRadius: '999px',
            padding: '8px 14px',
            //border: '1px solid #374151',
            background: ClassColor.TRANSPARENT,
            color: greyLight.main,
            fontSize: '0.9rem',
            maxHeight:'35px',
            //cursor: 'pointer',
             '&:hover': {
            //bgcolor: 'primary.dark',
            borderColor: primary.main,
            color: primary.main,
          },
            '&.Mui-disabled': {
            bgcolor: greyLight.main,
            color: background.main,
          },
        }}>
        {label}
    </Button>)
}