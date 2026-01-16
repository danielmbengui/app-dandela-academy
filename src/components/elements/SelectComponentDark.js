'use client';
import React from 'react';
import { ClassColor } from '@/classes/ClassColor';
import { useThemeMode } from '@/contexts/ThemeProvider';
const inputBase = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500';

export default function SelectComponentDark({
    label, name, value, values = [],
    disabled = false, onChange,
    error, hasNull=true,
    display=true,
    required=false,
    ...props
 }) {
const {theme} = useThemeMode();
const {blueDark, text, cardColor} = theme.palette;
    return (
        <div style={{display:display ? 'block' : 'none',}}>
            {
                label && <label className="text-contentColor dark:text-contentColor-dark mb-5px block" style={{ fontSize: '0.9rem', color:"var(--grey-light)" }}>
                    {label}{required && <b style={{ color: 'red' }}>*</b>}
                </label>
            }
            <div className="relative rounded-sm" style={{
                background:cardColor.main, 
                borderRadius:'20px',
                border:`0.1px solid var(--card-border)`,
                //boxShadow: '0.5px 0.5px rgba(0, 0, 0, 0.3)',
                }}>
                <select
                    id={name}
                    name={name}
                    type={'select'}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}

                    style={{fontSize:'0.9rem',fontWeight:'300', color:disabled?ClassColor.GREY_LIGHT:text.main, cursor:disabled ? 'not-allowed' : 'pointer', background:'transparent', borderRadius:'20px' }} 
                    className="text-base w-full p-13px pr-30px py-3px focus:outline-none block appearance-none relative z-20 rounded-xl"
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
                <i style={{color:disabled?ClassColor.GREY_LIGHT:text.main}} className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 block text-md z-15"></i>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}