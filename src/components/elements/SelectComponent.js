'use client';
import React from 'react';
import { ClassColor } from '@/classes/ClassColor';

export default function SelectComponent({
    label, name, value, values = [],
    disabled = false, onChange,
    error, hasNull=true
 }) {

    return (
        <div>
            {
                label && <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
                    {label}
                </label>
            }
            <div className="relative rounded-md">
                <select
                    id={name}
                    name={name}
                    type={'select'}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}

                    style={{color:disabled?ClassColor.GREY_LIGHT:'', cursor:disabled ? 'default' : 'pointer', border: `0.1px solid ${ClassColor.GREY_LIGHT}`, background:ClassColor.TRANSPARENT }} 
                    className="text-base w-full p-13px pr-30px py-7px focus:outline-none block appearance-none relative z-20 rounded-md">
                    
                    {
                        hasNull && <option value={''}>{'---'}</option>
                    }
                    {
                        values.map((item, i) => {
                            return (<option key={`${item.id}-${i}`} value={item.id} style={{color:"red"}}>
                                {item.value}
                            </option>)
                        })
                    }
                </select>
                <i style={{color:disabled?ClassColor.GREY_LIGHT:''}} className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 block text-lg z-10"></i>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}