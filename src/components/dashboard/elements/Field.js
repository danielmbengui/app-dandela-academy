import { useThemeMode } from "@/contexts/ThemeProvider";
import React from "react";

export default function Field({value='', disabled=true,onChange=null}) {
    const {theme} = useThemeMode();
    const {greyLight} = theme.palette;
    return( <div className="field" style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '12px',
        fontSize: '0.9rem',
    }}>
        <label style={{
            marginBottom: '4px',
            color: '#9ca3af',
        }}>Prénom</label>
        <input
            type="text"
            name="firstName"
            value={value}
            onChange={()=>{
                if(onChange) {
                    onChange();
                }
            }}
            disabled={disabled}
            style={{
                background: '#020617',
                borderRadius: '10px',
                border: '1px solid #1f2937',
                padding: '8px 10px',
                color: disabled ? greyLight.main : '#e5e7eb',
                fontStyle: disabled ? 'italic' : 'normal',
                outline: 'none',
                fontSize: '0.9rem',
                cursor: disabled ? 'not-allowed' : 'text'
            }}
        />
    </div>)
}