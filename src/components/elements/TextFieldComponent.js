"use client"
import React from "react";
import { Autocomplete, IconButton, InputAdornment, TextField, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import PropTypes from 'prop-types';
import { useThemeMode } from "@/contexts/ThemeProvider";
import { ClassColor } from "@/classes/ClassColor";
import { useLanguage } from "@/contexts/LangProvider";

export default function TextFieldComponent({
    type = "text",
    label = "",
    name = "",
    icon = null,
    placeholder = "",
    value = "",
    disabled = false,
    error = false,
    helperText = "",
    fullWidth = false,
    onChange = null,
    onClear = null,
    maxHeight = '2.5rem',
    autoComplete = [],
    onSubmit = () => { },
    ...props
}) {
    const { lang } = useLanguage();
    const { theme } = useThemeMode();
    const { blue, greyLight, text, primary, cardColor } = theme.palette;
    if (autoComplete.length > 0) {
        
        return (<Autocomplete
            disablePortal
            options={autoComplete}
            fullWidth={fullWidth}
            className="shadow-sm"
            lang={lang}
            disabled={disabled}
            type={type}
            label={label}
            id={name}
            name={name}
            
            renderInput={(params) => (<TextField

                variant="outlined"
                size={'small'}
                fullWidth={fullWidth}

                //
                {...props}
            />)}
        />
        )
        
    }
    return (<TextField
        className="shadow-sm"
        lang={lang}
        disabled={disabled}
        type={type}
        label={label}
        id={name}
        name={name}
        variant="outlined"
        size={'small'}
        fullWidth={fullWidth}
        value={value}
        error={error}
        //helperText={error ? error : ''}
        //helperText={isErrorCompany ? `Le nom doit contenir entre ${MIN_LENGTH_COMPANY} et ${MAX_LENGTH_COMPANY}` : ''}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onSubmit}
        sx={{
            pointerEvents: 'auto',
            //color:'black',
            //borderWidth:'1px',
            borderRadius: '7px',
            //my: 1,
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
                // 👉 style quand le TextField est disabled
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
        }}
        slotProps={{
            inputLabel: {
                sx: {
                    //color: 'inherit',

                    '&.Mui-focused': {
                        color: primary.main,
                    },
                    '&.Mui-error': {
                        color: 'error.main',
                    },
                    '&.Mui-disabled': {
                        color: ClassColor.GREY_HYPER_LIGHT,
                    },
                }
            },
            input: {
                sx: {
                    color: cardColor.contrastText, // couleur par défaut
                    background: cardColor.main,
                    //borderRadius:'20px',
                    fontSize: '14px',
                    //maxHeight: maxHeight 
                },
                startAdornment: icon && (
                    <InputAdornment position="start" sx={{ color: ClassColor.GREY_LIGHT }}>
                        {icon}
                    </InputAdornment>
                ),
                endAdornment: value.length > 0 && !disabled && (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={onClear}
                            edge="end"
                            size="small"
                        >
                            <CloseIcon sx={{ color: text.main }} fontSize="small" />
                        </IconButton>
                    </InputAdornment>
                ),

            }
        }}
        //
        {...props}
    />)
}
TextFieldComponent.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    label: PropTypes.string,
    icon: PropTypes.node,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    // minLength: PropTypes.number,
    // maxLength: PropTypes.number,
};