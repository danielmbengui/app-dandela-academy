import React, { useEffect, useState } from "react";
import { FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthProvider";
import Image from "next/image";
import { getExampleFor, parseAndValidatePhone } from "@/contexts/functions";
import { useTranslation } from "react-i18next";
import TextFieldComponent from "./TextFieldComponent";
import { ClassCountry } from "@/classes/ClassCountry";
import { ClassColor } from "@/classes/ClassColor";

function SelectPrefixe({codeCountry="", setCodeCountry=null,setPrefixe=null,disabled=false}) {
    const { user } = useAuth();
    const [types, setTypes] = useState([]);
    const COUNTRIES = ClassCountry.COUNTRIES;
    
    const handleChange = (event) => {
        const _code = event.target.value;
        setCodeCountry(_code);
        setPrefixe(`+${COUNTRIES.filter(country=>country.code===_code)[0].prefixes[0]}`);
        console.log("PREFIXE", COUNTRIES.filter(country=>country.code===_code)[0].prefixes[0])
    };

    return (<Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={codeCountry}
        //label={`Type`}
        disabled={disabled}
        onChange={handleChange}
        size="small"
        sx={{ minWidth: 110,maxHeight:'2.5rem',borderColor:ClassColor.GREY_HYPER_LIGHT }}
    >
        {
            COUNTRIES.map((country, index) => {
                return(country.prefixes.map((prefixe)=>{
                    return (<MenuItem key={`${country.code}-${prefixe}-${index}`} value={country.code}>
                        <Stack spacing={1} direction={'row'} alignItems={'center'}>
                            <Image
                                className="dark:invert"
                                src={country.flags.png}
                                alt="Next.js logo"
                                width={20}
                                height={20}
                                priority
                                style={{
                                    width: 'auto',
                                    //display:country.code===codeCountry ? 'none' : 'block',
                                }}
                            />
                            <Typography>{`+${prefixe}`}</Typography>
                        </Stack>
                    </MenuItem>)
                }))
                
            })
        }
    </Select>);
}

export default function TextFieldPhoneComponent({
    name='',
    error = false,
    disabled=false,
    label='',
    fullWidth=false,
    codeCountry=ClassCountry.DEFAULT_CODE, setCodeCountry=null,
    phone="", setPhone=null,prefixe=ClassCountry.DEFAULT_PREFIXE,
    onChange,
    onClear,
    placeholder='920 234 234',
    setPrefixe=null }) {
    //const [codeCountry, setCodeCountry] = useState('AO');
    //const [prefixe, setPrefixe] = useState('+244');
    const [formatPhone, setFormatPhone] = useState(getExampleFor(codeCountry));
    const {t} = useTranslation(['users/form']);
    useEffect(()=>{
setFormatPhone(getExampleFor(codeCountry));
    }, [codeCountry])
    return (<Stack alignItems={'center'} direction={'row'} sx={{ width: '100%' }} spacing={1}>
        <SelectPrefixe disabled={disabled} codeCountry={codeCountry} setCodeCountry={setCodeCountry} setPrefixe={setPrefixe} />
        <TextFieldComponent
            label={label}
            value={phone}
            onChange={(e) => {
                setPhone(`${e.target.value}`);
                //onChange(e);
                onChange({
                    target: {
                        type: "phone",
                        name: name,
                        value: `${prefixe}${e.target.value}` // ici on repasse en string
                    }
                });
            }}
            onClear={onClear}
            placeholder={formatPhone.formatNational()}
            type={'number'}
            disabled={disabled}
            fullWidth={fullWidth}
            error={error}
            //helperText={"Téléphone invalide"}
        />
    </Stack>
    )
}