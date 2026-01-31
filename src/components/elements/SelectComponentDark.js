'use client';
import React from 'react';
import { ClassColor } from '@/classes/ClassColor';
import { useThemeMode } from '@/contexts/ThemeProvider';

export default function SelectComponentDark({
    label, name, value, values = [],
    disabled = false, onChange,
    error, hasNull=true,
    display=true,
    required=false,
    /** Couleur du sélecteur (flèche et texte). Ex: "var(--admin)", "var(--warning)" */
    selectorColor,
    /** Si false, le select prend une largeur auto au lieu de 100% */
    fullWidth = true,
    ...props
 }) {
const {theme} = useThemeMode();
const {blueDark, text, cardColor} = theme.palette;
const effectiveColor = disabled ? ClassColor.GREY_LIGHT : (selectorColor ?? text.main);
    return (
        <div style={{ display: display ? (fullWidth ? 'block' : 'inline-block') : 'none' }}>
            {
                label && <label className="text-contentColor dark:text-contentColor-dark block" style={{ fontSize: '0.9rem', marginBottom:'7px' }}>
                    {label}{required && <b style={{ color: 'red' }}>*</b>}
                </label>
            }
            <div className="relative rounded-sm" style={{
                background:cardColor.main, 
                borderRadius:'20px',
                border:`0.1px solid var(--card-border)`,
                width: fullWidth ? undefined : 'fit-content',
                //boxShadow: '0.5px 0.5px rgba(0, 0, 0, 0.3)',
                }}>
                <select
                    id={name}
                    name={name}
                    type={'select'}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}

                    style={{fontSize:'0.9rem',fontWeight:'300', color: effectiveColor, cursor:disabled ? 'not-allowed' : 'pointer', background:'transparent', borderRadius:'20px', width: fullWidth ? undefined : 'auto', minWidth: fullWidth ? undefined : '8rem' }} 
                    className={`text-base p-13px pr-30px py-3px focus:outline-none focus:orange block appearance-none relative z-20 rounded-xl ${fullWidth ? 'w-full' : ''}`}
                    {...props}
                    >
                    {
                        hasNull && <option value={''}>{'---'}</option>
                    }
                    {
                        values.map((item, i) => {
                            return (<option disabled={item.disabled} key={`${item.id}-${i}`} value={item.id}>
                                {item.value}
                            </option>)
                        })
                    }
                </select>
                <i style={{color: effectiveColor}} className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 block text-md z-15"></i>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}