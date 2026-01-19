'use client';
import React, { useState } from 'react';
import TextFieldComponent from './TextFieldComponent';
import TextFieldPasswordComponent from './TextFieldPasswordComponent';
import TextAreaComponent from './TextAreaComponent';
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import "dayjs/locale/fr";
import "dayjs/locale/en";
import "dayjs/locale/pt";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLanguage } from '@/contexts/LangProvider';
import TextFieldPhoneComponent from './TextFieldPhoneComponent';
import { ClassColor } from '@/classes/ClassColor';
import { IconButton, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useThemeMode } from '@/contexts/ThemeProvider';
import { IconRemove, IconReset } from '@/assets/icons/IconsComponent';
import { max } from 'date-fns';
const inputBase = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500';
export default function FieldPhoneComponent({
    label, name, value="",
    disabled = false,
    onChange = () => { },
    onClear = () => { },
    type = 'text',
    error,
    placeholder,
    minRows = 1,
    maxRows = 5,
    icon = "", fullWidth = false,
    disablePast = false,
    disableFuture = false,
    prefixe, setPrefixe, phone, setPhone, codeCountry, setCodeCountry, required = false,
    editable = false, resetable = false, removable = false, onRemove = () => { }, onSubmit = () => { }, onCancel = () => { }, autoComplete = [],
    sx = {},
    ...props }) {
    //console.log("FILED", name, type)
    const { lang } = useLanguage();
    //const [valueDate, setValueDate] = useState(value ? dayjs(value) : null); // valeur interne (dayjs|null)
    const { theme } = useThemeMode();
    const { primary, primaryShadow, background } = theme.palette;
    const [processing, setProcessing] = useState(false);
    return (
        <Stack alignItems={'start'}>
            {
                label && <label className="text-contentColor dark:text-contentColor-dark block" style={{ fontSize: '0.9rem', marginBottom: '7px' }}>
                    {label}{required && <b style={{ color: 'red' }}>*</b>}
                </label>
            }
            <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ width: '100%' }}>
                <TextFieldPhoneComponent
                value={value}
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
            </Stack>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </Stack>
    );
}