import React, { useEffect, useMemo, useState } from "react";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthProvider";
import Image from "next/image";
import { getExampleFor, parseAndValidatePhone } from "@/contexts/functions";
import { useTranslation } from "react-i18next";
import TextFieldComponent from "./TextFieldComponent";
import { ClassCountry } from "@/classes/ClassCountry";
import { ClassColor } from "@/classes/ClassColor";
import SelectComponentDark from "./SelectComponentDark";
import { code } from "@heroui/react";
import { isValid } from "date-fns";
import { ClassUser } from "@/classes/users/ClassUser";

function SelectPrefixe({ codeCountry = "", setCodeCountry = null, setPrefixe = null, disabled = false }) {
    const { user } = useAuth();
    const [types, setTypes] = useState([]);
    const COUNTRIES = ClassCountry.COUNTRIES;
    const prefixes = useMemo(() => {
        const _prefixes = [];
        COUNTRIES.forEach(country => {
            country.prefixes.forEach(prefixe => {
                if (!_prefixes.includes(prefixe)) {
                    _prefixes.push({
                        code: country.code,
                        prefixe: prefixe
                    });
                }
            })
        });
        return _prefixes;
    }, [COUNTRIES]);

    const handleChange = (event) => {
        const _code = event.target.value;
        setCodeCountry(_code);
        setPrefixe(`+${COUNTRIES.filter(country => country.code === _code)[0].prefixes[0]}`);
        console.log("PREFIXE", COUNTRIES.filter(country => country.code === _code)[0].prefixes[0])
    };
    return (<SelectComponentDark
        value={codeCountry}
        values={prefixes.map((item) => ({ id: item.code, value: `+${item.prefixe}` }))}
        disabled={disabled}
        onChange={handleChange}
        hasNull={false}
    />);
}

export default function TextFieldPhoneComponent({
    name = '',
    error = false,
    disabled = false,
    label = '',
    fullWidth = false,
    //codeCountry = ClassCountry.DEFAULT_CODE, setCodeCountry = null,
    //phone = "", setPhone = null, 
    //prefixe = ClassCountry.DEFAULT_PREFIXE,
    //setPrefixe = null,
    value = "",
    onChange,
    onClear,
    placeholder = '920 234 234',
}) {
    //const [codeCountry, setCodeCountry] = useState('AO');
    const { t } = useTranslation([ClassUser.NS_COLLECTION]);
    //const [prefixe, setPrefixe] = useState('+244');
    const [codeCountry, setCodeCountry] = useState(ClassCountry.DEFAULT_CODE);
    const [prefixe, setPrefixe] = useState(ClassCountry.DEFAULT_PREFIXE);
    const [phone, setPhone] = useState("");
    const { formatPhone, isValidPhone, errorPhone } = useMemo(() => {
        const isValidPhone = phone === '' ? true : parseAndValidatePhone(`${prefixe}${phone}`, codeCountry).is_valid;
        const errorPhone = isValidPhone ? '' : t('errors.phone_number');
        console.log("is vl", isValidPhone)
        return {
            formatPhone: getExampleFor(codeCountry),
            isValidPhone: isValidPhone,
            errorPhone
        };
    }, [codeCountry, phone, prefixe]);
    return (<Stack alignItems={'start'} sx={{ width: '100%' }}>
        <Stack alignItems={'center'} direction={'row'} sx={{ width: '100%' }} spacing={1}>
            <Box sx={{ minWidth: '15%' }}>
                <SelectPrefixe disabled={disabled} codeCountry={codeCountry} setCodeCountry={setCodeCountry} setPrefixe={setPrefixe} />
            </Box>
            <TextFieldComponent
                name={name}
                label={label}
                value={phone}
                onChange={(e) => {
                    const { value } = e.target;
                    setPhone(`${value}`);
                    //onChange(e);
                    onChange({
                        target: {
                            type: "phone",
                            name: name,
                            value: value ? `${prefixe}${value}` : '' // ici on repasse en string
                        }
                    });
                }}
                onClear={() => {
                    setPhone(``);
                    //onChange(e);
                    onClear({
                        target: {
                            type: "phone",
                            name: name,
                            value: `` // ici on repasse en string
                        }
                    });
                }}
                placeholder={formatPhone.formatNational()}
                type={'number'}
                disabled={disabled}
                fullWidth={fullWidth}
            //helperText={errorPhone}
            //style={{width:'100%'}}
            //helperText={"Téléphone invalide"}
            />
        </Stack>
        
    </Stack>
    )
}