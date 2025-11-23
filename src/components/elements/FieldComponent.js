'use client';
import React, { useState } from 'react';
import TextFieldComponent from './TextFieldComponent';
import TextFieldPasswordComponent from './TextFieldPasswordComponent';
import TextAreaComponent from './TextAreaComponent';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import "dayjs/locale/fr";
import "dayjs/locale/en";
import "dayjs/locale/pt";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLanguage } from '@/contexts/LangProvider';
import TextFieldPhoneComponent from './TextFieldPhoneComponent';

const inputBase = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500';
export default function FieldComponent({ label, name, value, disabled = false, onChange = () => { }, onClear = () => { }, type = 'text', error, placeholder, minRows = 1, maxRows = 1,
    icon = "", fullWidth = false,
    prefixe, setPrefixe, phone, setPhone, codeCountry, setCodeCountry, required=false }) {
    //console.log("FILED", name, type)
    const { lang } = useLanguage();
    const [valueDate, setValueDate] = useState(value ? dayjs(value) : null); // valeur interne (dayjs|null)
    return (
        <div>
            {
                label && <label className="text-contentColor dark:text-contentColor-dark mb-5px block" style={{fontSize:'0.9rem'}}>
                    {label}{required && <b style={{color:'red'}}>*</b>}
                </label>
            }
            {
                type !== 'text' && <>
                    {
                        type === "phone" && <TextFieldPhoneComponent
                            prefixe={prefixe}
                            name={name}
                            setPrefixe={setPrefixe}
                            phone={phone}
                            setPhone={setPhone}
                            codeCountry={codeCountry}
                            setCodeCountry={setCodeCountry}
                            onChange={onChange}
                            onClear={onClear}
                            placeholder={placeholder}
                            fullWidth={fullWidth}
                            error={error}
                            disabled={disabled}
                        />
                    }
                    {
                        type === 'password' && <TextFieldPasswordComponent
                            //id={name}
                            name={name}
                            disabled={disabled}
                            icon={icon}
                            value={value}
                            onChange={onChange}
                            onClear={onClear}
                            placeholder={placeholder}
                            error={error}
                            type={type}
                            //helperText={error}
                            fullWidth={fullWidth}
                            className={`${inputBase} ${error ? 'border-red-500' : ''}`}
                        />
                    }
                    {
                        type === 'multiline' && <TextAreaComponent
                            //label={label}
                            name={name}
                            icon={icon}
                            type={'text'}
                            value={value}
                            minRows={minRows}
                            maxRows={maxRows}
                            fullWidth={fullWidth}
                            onChange={onChange}
                            onClear={onClear}
                            error={error}
                            disabled={disabled}
                        />
                    }

                    {
                        type === 'date' && <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
                            <DatePicker
                                //label={label} 
                                format="DD-MM-YYYY"
                                maxDate={dayjs(new Date())}
                                type="date"
                                name={name}
                                value={value ? dayjs(value) : null} // convertir string -> dayjs
                                onChange={(newValue) => {
                                    onChange({
                                        target: {
                                            type: "date",
                                            name: "birthday",
                                            value: newValue ? newValue.format("YYYY-MM-DD") : "" // ici on repasse en string
                                        }
                                    });
                                }}
                                sx={{ borderRadius: '7px', width: '100%' }}
                                inputClass={inputBase}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                    }
                                }}
                                disabled={disabled}
                            />
                        </LocalizationProvider>
                        /*
                        type === "date" && <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
                            <DatePicker
                                maxDate={dayjs(new Date())}
                                className="shadow-sm"
                                //label="Date de naissance"
                                //value={value}
                                name={name}
                                value={''} // convertir string -> dayjs
                                onChange={(newValue) => {
                                    onChange({
                                        target: {
                                            type: "date",
                                            name: "birthday",
                                            value: newValue ? newValue.format("YYYY-MM-DD") : "" // ici on repasse en string
                                        }
                                    });
                                }}
                                type="date"
                                sx={{ my: 1, borderRadius: '7px', width: '100%' }}
                                inputClass={inputClass}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                    }
                                }}
                            />
                        </LocalizationProvider>
                        */
                    }
                </>
            }
            {
                (type === 'text' || type === 'email') && <TextFieldComponent
                    //id={name}
                    name={name}
                    disabled={disabled}
                    icon={icon}
                    value={value}
                    onChange={onChange}
                    onClear={onClear}
                    placeholder={placeholder}
                    error={error}
                    type={type}
                    //helperText={error}
                    className={`${inputBase} ${error ? 'border-red-500' : ''}`}
                    fullWidth={fullWidth}
                />
            }
            {

            }
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}