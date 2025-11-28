'use client';
import React from 'react';
import { ClassColor } from '@/classes/ClassColor';
import { useThemeMode } from '@/contexts/ThemeProvider';

export default function SelectComponentDark({
    label, name, value, values = [],
    disabled = false, onChange,
    error, hasNull=true,
    display=true,
    ...props
 }) {
const {theme} = useThemeMode();
const {blueDark, text} = theme.palette;
    return (
        <div style={{display:display ? 'block' : 'none',}}>
            {
                label && <label className="text-contentColor dark:text-contentColor-dark mb-3px block" style={{color:blueDark.main}}>
                    {label}
                </label>
            }
            <div className="relative rounded-sm" style={{background:blueDark.main, borderRadius:'20px',}}>
                <select
                    id={name}
                    name={name}
                    type={'select'}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}

                    style={{fontSize:'0.9rem',fontWeight:'normal', color:disabled?ClassColor.GREY_LIGHT:text.reverse, cursor:disabled ? 'default' : 'pointer', background:'transparent', borderRadius:'20px' }} 
                    className="text-base w-full p-13px pr-30px py-3px focus:outline-none block appearance-none relative z-20 rounded-xl"
                    >
                    {
                        hasNull && <option value={''}>{'---'}</option>
                    }
                    {
                        values.map((item, i) => {
                            return (<option key={`${item.id}-${i}`} value={item.id}>
                                {item.value}
                            </option>)
                        })
                    }
                </select>
                <i style={{color:disabled?ClassColor.GREY_LIGHT:ClassColor.WHITE}} className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 block text-md z-15"></i>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}