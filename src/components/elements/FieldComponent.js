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
import { IconButton, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useThemeMode } from '@/contexts/ThemeProvider';
const inputBase = 'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500';
export default function FieldComponent({ label, name, value, disabled = false, onChange = () => { }, onClear = () => { }, type = 'text', error, placeholder, minRows = 1, maxRows = 5,
    icon = "", fullWidth = false,
    prefixe, setPrefixe, phone, setPhone, codeCountry, setCodeCountry, required = false,
    editable = false,resetable=false, onSubmit = () => { }, onCancel = () => { },autoComplete=[], ...props}) {
    //console.log("FILED", name, type)
    const { lang } = useLanguage();
    const [valueDate, setValueDate] = useState(value ? dayjs(value) : null); // valeur interne (dayjs|null)
    const { theme } = useThemeMode();
    const { primary, background } = theme.palette;
    const [processing, setProcessing] = useState(false);
    return (
        <div>
            {
                label && <label className="text-contentColor dark:text-contentColor-dark block" style={{ fontSize: '0.9rem', marginBottom:'7px' }}>
                    {label}{required && <b style={{ color: 'red' }}>*</b>}
                </label>
            }
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
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
                                    //type="date"
                                    name={name}
                                    value={value ? dayjs(value) : null} // convertir string -> dayjs
                                    onChange={(newValue) => {
                                        onChange({
                                            target: {
                                                type: "date",
                                                name: name,
                                                value: newValue ? newValue.format("YYYY-MM-DD") : "" // ici on repasse en string
                                            }
                                        });
                                    }}
                                    //inputClass={inputBase}
                                    //className={inputBase}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            sx: {
                                                width: '100%',
                                                borderRadius: "7px",
                                                cursor: 'pointer',
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        //borderColor: ClassColor.GREY_HYPER_LIGHT, // couleur par défaut
                                                        color: ClassColor.GREY_HYPER_LIGHT, // couleur par défaut
                                                        border: `0.1px solid ${ClassColor.GREY_HYPER_LIGHT}`,
                                                    },
                                                    '&:hover fieldset': {
                                                        // borderColor: ClassColor.GREY_LIGHT, // au survol
                                                        //color: 'red', // couleur par défaut
                                                        border: `1px solid ${primary.main}`,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        //borderColor: ClassColor.TRANSPARENT, // quand focus
                                                        border: `2px solid ${primary.main}`,
                                                    },
                                                    '&.Mui-error fieldset': {
                                                        // borderColor: 'error.main', // en cas d'erreur
                                                        border: `0.1px solid ${'red'}`,
                                                    },
                                                    '&.Mui-disabled': {
                                                        cursor: 'not-allowed',      // curseur
                                                        pointerEvents: 'auto',      // réactive les events pour voir le curseur
                                                    },
                                                    '&.Mui-disabled fieldset': {
                                                        // borderColor: greyLight.main, // désactivé
                                                        border: `0.1px solid ${ClassColor.GREY_HYPER_LIGHT}`,
                                                        color: ClassColor.GREY_LIGHT,
                                                    },
                                                    '&.Mui-disabled .MuiOutlinedInput-input': {
                                                        cursor: 'not-allowed',      // curseur sur le texte aussi
                                                    },
                                                    '& .MuiOutlinedInput-root:hover + .MuiInputLabel-root': {
                                                        color: 'red',
                                                    },
                                                },
                                            },
                                        },
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
                    (type === 'text' || type === 'email' || type === "number") && <TextFieldComponent
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
                        autoComplete={autoComplete}
                        //helperText={error}
                        className={`${inputBase} ${error ? 'border-red-500' : ''}`}
                        fullWidth={fullWidth}
                        {...props}
                    />
                }
                {
                    (editable || resetable) && <Stack direction={'row'} spacing={0.5}>
                        <IconButton
                            onClick={() => {
                                if (onCancel) {
                                    onCancel();
                                }
                            }}
                            sx={{
                                display: processing ? 'none' : 'flex',
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
                        {
                            editable && <IconButton
                            loading={processing}
                            onClick={() => {
                                setProcessing(true);
                                if (onSubmit) {
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
                        }
                    </Stack>
                }
            </Stack>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}