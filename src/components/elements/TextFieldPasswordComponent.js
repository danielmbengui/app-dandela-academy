import React, { useEffect, useState } from "react";
import { IconButton, InputAdornment, TextField, } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import PropTypes from 'prop-types';
import { useThemeMode } from "@/contexts/ThemeProvider";
import { ClassColor } from "@/classes/ClassColor";
import { useLanguage } from "@/contexts/LangProvider";
import { IconPasswordInvisible, IconPasswordVisible } from "@/assets/icons/IconsComponent";
//import { IconPasswordInvisible, IconPasswordVisible } from "../IconsComponent";

export default function TextFieldPasswordComponent({
    type = "text",
    label = "",
    name = "",
    icon = null,
    placeholder = "",
    value = "",
    disabled = false,
    showOnClear = true,
    error = false,
    helperText = "",
    fullWidth = false,
    onChange = null,
    onClear = null,
    //multiline = false,
    minRows = 1,
    maxRows = 1,
    maxHeight='2.5rem',
    onSubmit = () => { },
    ...props
}) {
    const {lang} = useLanguage();
    const { theme } = useThemeMode();
    const { blue, greyLight, text, primary,blueDark } = theme.palette;
    const [visible,setVisible] = useState(false);

    return (<TextField
        className="shadow-sm"
        lang={lang}
        disabled={disabled}
        type={visible ? 'text' : 'password'}
        label={label}
        id={name}
        name={name}
        variant="outlined"
        //size={'medium'}
        multiline={maxRows>minRows}
        minRows={minRows}
        maxRows={maxRows}
        fullWidth={fullWidth}
        value={value}
        error={error}
        helperText={error ? helperText : ''}
        //helperText={isErrorCompany ? `Le nom doit contenir entre ${MIN_LENGTH_COMPANY} et ${MAX_LENGTH_COMPANY}` : ''}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onSubmit}
        sx={{
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
                    color: 'red', // couleur par défaut
                    border: `1px solid ${ClassColor.GREY_HYPER_LIGHT}`,
                },
                '&.Mui-focused fieldset': {
                    borderColor: primary.main, // quand focus
                    border: `1px solid ${primary.main}`,
                },
                '&.Mui-error fieldset': {
                    // borderColor: 'error.main', // en cas d'erreur
                    border: `1px solid ${'red'}`,
                },
                '&.Mui-disabled fieldset': {
                    // borderColor: greyLight.main, // désactivé
                    border: `1px solid ${ClassColor.GREY_HYPER_LIGHT}`,
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
                sx: { background: ClassColor.TRANSPARENT, maxHeight: maxHeight },
                startAdornment:(
                    <InputAdornment position="start" sx={{ color: ClassColor.GREY_LIGHT }}>
                        <div onClick={()=>setVisible(prev=>!prev)} style={{cursor:'pointer'}}>
                        {
                            !visible ? <IconPasswordInvisible width={20} height={20} /> : <IconPasswordVisible width={20} height={20} color={blueDark.main} />
                        }
                        </div>
                        
                    </InputAdornment>
                ),
                endAdornment: value.length > 0 && !disabled && (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={()=>{
                                setVisible(false);
                                onClear();
                            }}
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
TextFieldPasswordComponent.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    label: PropTypes.string,
    //icon: PropTypes.node,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    // minLength: PropTypes.number,
    // maxLength: PropTypes.number,
};