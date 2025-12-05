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
import { ClassColor } from '@/classes/ClassColor';
import { IconButton, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useThemeMode } from '@/contexts/ThemeProvider';
const inputBase = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500';
export default function FieldTextComponent({ label, name, value, disabled = false, onChange = () => { }, onClear = () => { }, type = 'text', error, placeholder, minRows = 1, maxRows = 1,
    icon = "", fullWidth = false,
    prefixe, setPrefixe, phone, setPhone, codeCountry, setCodeCountry, required = false,
    editable = false, onSubmit = () => { }, onCancel = () => { } }) {
    //console.log("FILED", name, type)
    const { lang } = useLanguage();
    const [valueDate, setValueDate] = useState(value ? dayjs(value) : null); // valeur interne (dayjs|null)
    const { theme } = useThemeMode();
    const { primary, background } = theme.palette;
    const [processing,setProcessing] = useState(false);
    return (
        <div>
                        {
                label && <label className="text-contentColor dark:text-contentColor-dark mb-5px block" style={{ fontSize: '0.9rem' }}>
                    {label}{required && <b style={{ color: 'red' }}>*</b>}
                </label>
            }
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <Typography>{value}</Typography>
                {
                    editable && <Stack direction={'row'} spacing={0.5}>
                    <IconButton 
                    onClick={()=>{
                        if(onCancel) {
                            onCancel();
                        }
                    }}
                    sx={{
                        display:processing ? 'none' : 'flex',
                        background: 'red',
                        color: background.main,
                        width: { xs: '25px', sm: '25px' },
                        height: { xs: '25px', sm: '25px' },
                        '&:hover': {
                            color: background.main,
                            backgroundColor: 'red',
                            boxShadow: '0 0 0 0.2rem rgba(255,0,0,.5)',
                        },
                    }} aria-label="delete" size="small">
                        <RestartAltIcon sx={{ fontSize: { xs: '15px', sm: '20px' } }} />
                    </IconButton>
                    <IconButton 
                    loading={processing}
                    onClick={()=>{
                        setProcessing(true);
                        if(onSubmit) {
                            onSubmit();  
                        }
                        setProcessing(false);
                    }}
                    sx={{
                        background: primary.main,
                        color: background.main,
                        width: { xs: '25px', sm: '25px' },
                        height: { xs: '25px', sm: '25px' },
                        '&:hover': {
                            color: background.main,
                            backgroundColor: primary.main,
                            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
                        },
                    }} aria-label="delete" size="small">
                        <CheckIcon sx={{ fontSize: { xs: '15px', sm: '20px' } }} />
                    </IconButton>
                </Stack>
                }
            </Stack>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}