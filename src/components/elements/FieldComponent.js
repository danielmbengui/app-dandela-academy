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
export default function FieldComponent({ label, name, value, disabled = false, onChange = () => { }, onClear = () => { }, type = 'text', error, placeholder, minRows = 1, maxRows = 5,
    icon = "", fullWidth = false,
    disablePast = false,
    disableFuture = false,
    prefixe, setPrefixe, phone, setPhone, codeCountry, setCodeCountry, required = false,
    editable = false, resetable = false, removable = false, onRemove = () => { }, onSubmit = () => { }, onCancel = () => { }, autoComplete = [], 
    isAdmin=false,
    sx={},
    ...props }) {
    //console.log("FILED", name, type)
    const { lang } = useLanguage();
    const [valueDate, setValueDate] = useState(value ? dayjs(value) : null); // valeur interne (dayjs|null)
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
            <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{width:'100%'}}>
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
                                        isAdmin={isAdmin}
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
                                {...props}
                            />
                        }

                        {
                            type === 'date' && <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
                                <DatePicker
                                    disablePast={disablePast}
                                    disableFuture={disableFuture}
                                    //label={label} 
                                    format="DD-MM-YYYY"
                                    minDate={disablePast ? dayjs(new Date()) : null}
                                    maxDate={disableFuture ? dayjs(new Date()) : null}
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
                                            size: 'small',
                                            slotProps: {
                                                input: {
                                                    sx: {
                                                        maxHeight: '2rem',
                                                        borderRadius: '5px',
                                                        borderColor: 'var(--card-border)'
                                                    }
                                                }
                                            },
                                            sx: {
                                                width: '100%',

                                            }
                                        },
                                    }}
                                    disabled={disabled}
                                />
                            </LocalizationProvider>
                        }
                        {
                            type === 'hour' && <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
                                <TimePicker
                                    disablePast={disablePast}
                                    disableFuture={disableFuture}
                                    //label={label} 
                                    //minTime={disablePast ? dayjs(new Date()) : null}
                                    //maxDate={disableFuture ? dayjs(new Date()) : null}
                                    format="HH:mm"
                                    
                                    //maxDate={disableFuture ? dayjs(new Date()) : null}
                                    //type="date"
                                    //sx={{maxHeight: '40px',}}
                                    name={name}
                                    value={value ? dayjs(value) : null} // convertir string -> dayjs
                                    onChange={(newValue) => {
                                        onChange({
                                            target: {
                                                type: "hour",
                                                name: name,
                                                value: newValue ? newValue : "" // ici on repasse en string
                                            }
                                        });
                                    }}
                                    //inputClass={inputBase}
                                    //className={inputBase}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            slotProps: {
                                                input: {
                                                    sx: {
                                                        maxHeight: '2rem',
                                                        borderRadius: '5px',
                                                        borderColor: 'var(--card-border)'
                                                    }
                                                }
                                            },
                                            sx: {
                                                width: '100%',

                                            }
                                        },
                                    }}
                                    disabled={disabled}
                                />
                            </LocalizationProvider>
                        }
                    </>
                }
                {
                    (type === 'text' || type === 'email' || type === "number") && <TextFieldComponent
                        //id={name}
                        isAdmin={isAdmin}
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
                        //className={`${inputBase} ${error ? 'border-red-500' : ''}`}
                        fullWidth={fullWidth}
                        {...props}
                    />
                }
                {
                    (editable || resetable || removable) && <Stack direction={'row'} spacing={0.5}>
                        {
                            resetable && <IconButton
                                loading={processing}
                                
                                onClick={() => {
                                    if (onCancel) {
                                        setProcessing(true);
                                        onCancel();
                                        setProcessing(false);
                                    }
                                }}
                                sx={{
                                    display: processing ? 'none' : 'flex',
                                    background:isAdmin ? 'var(--admin)': primary.main,
                                    color: background.main,
                                    width: '24px',
                                    height: '24px',
                                    '&:hover': {
                                        color: background.main,
                                        backgroundColor: isAdmin ? 'var(--admin)' : 'primary.main',
                                        boxShadow: `0 0 0 0.2rem ${isAdmin ? 'var(--admin-shadow-sm)': primaryShadow.main}`,
                                    },
                                }} aria-label="delete" size="small">
                                <IconReset width={14} height={14} />
                            </IconButton>
                        }
                        {
                            removable && <IconButton
                                loading={processing}
                                onClick={() => {
                                    if (onRemove) {
                                        setProcessing(true);
                                        onRemove();
                                        setProcessing(false);
                                    }
                                }}
                                sx={{
                                    display: processing ? 'none' : 'flex',
                                    background: 'red',
                                    color: background.main,
                                    width: '24px',
                                    height: '24px',
                                    '&:hover': {
                                        color: background.main,
                                        backgroundColor: 'error.main',
                                        boxShadow: `0 0 0 0.2rem rgba(255,0,0,0.5)`,
                                    },
                                }} aria-label="delete" size="small">
                                <IconRemove width={14} height={14} />
                            </IconButton>
                        }
                        {
                            editable && <IconButton
                                loading={processing}
                                disabled={!value || processing}
                                onClick={() => {
                                    setProcessing(true);
                                    if (onSubmit) {
                                        onSubmit();
                                    }
                                    setProcessing(false);
                                }}
                                sx={{
                                    background: isAdmin ? 'var(--admin)' : primary.main,
                                    color: background.main,
                                    width: { xs: '25px', sm: '25px' },
                                    height: { xs: '25px', sm: '25px' },
                                    '&:hover': {
                                        color: background.main,
                                        backgroundColor: isAdmin ? 'var(--admin)' : primary.main,
                                        boxShadow: `0 0 0 0.2rem ${isAdmin ? 'var(--admin-shadow-sm)' : 'var(--primary-shadow-sm)'}`,
                                    },
                                }} aria-label="delete" size="small">
                                <CheckIcon sx={{ fontSize: { xs: '15px', sm: '20px' } }} />
                            </IconButton>
                        }
                    </Stack>
                }
            </Stack>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </Stack>
    );
}