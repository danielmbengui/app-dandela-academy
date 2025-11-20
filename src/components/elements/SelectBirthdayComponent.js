import React, { useEffect, useState } from "react";
import { ClassUser } from "@/classes/ClassUser";
import { useLanguage } from "@/contexts/LangProvider";
import { getFormattedDate, getFormattedMonth, getLastDayInMonth } from "@/contexts/functions";
import { useTranslation } from "react-i18next";
import { Alert, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery } from '@mui/material';
import { IconCalendar } from "@/assets/icons/IconsComponent";

function SelectComponent({ label = "", list = [], value = "", setValue = null, userToCreate = null, setUserToCreate = null }) {
    const array = ['10px', '20px', '30px'];
    const { t } = useTranslation(['roles']); // déclare les namespaces utilisés

    useEffect(() => {
        // setTypes([]);
        // setType('');
    }, [])
    const handleChange = (event) => {
        const _value = event.target.value;
        setValue(_value);
        console.log("VALUEEEE", _value)
    };

    return (
        <FormControl sx={{ minWidth: 10 }} size="small">
            <InputLabel id="demo-select-small-label">{`${label}`}</InputLabel>
            {
                list.length > 0 && <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={value}
                    label={label}
                    onChange={handleChange}
                    disabled={array.length === 1}
                >
                    {
                        list.map((_item, index) => {
                            return (<MenuItem key={`${_item.value}-${index}`} value={_item.value}>{`${_item.render}`}</MenuItem>)
                        })
                    }
                </Select>
            }
        </FormControl>
    );
}

export default function SelectBirthdayComponent({ user = {}, setUser = null, day = -1, setDay = null, month = -1, setMonth = null, year = -1, setYear = null }) {
    const { lang } = useLanguage();
    const { t, i18n } = useTranslation(['common', 'users/form']); // déclare les namespaces utilisés
    const now = new Date();
    const actualYear = now.getFullYear();
    const actualMonth = now.getMonth();
    const actualDay = now.getDate();
    const minDate = new Date(actualYear - ClassUser.MIN_YEARS_OLD, actualMonth, actualDay);
    const [years, setYears] = useState([{
        value: -1,
        render: '-',
        disabled: true,
    }, ...Array.from({ length: 101 }, (_, i) => ({
        value: actualYear - 100 - ClassUser.MIN_YEARS_OLD + i,
        render: `${actualYear - 100 - ClassUser.MIN_YEARS_OLD + i}`,
        disabled: actualYear - 100 - ClassUser.MIN_YEARS_OLD + i > actualYear - ClassUser.MIN_YEARS_OLD,
    })).sort((a, b) => b.value - a.value)]);
    const [months, setMonths] = useState([{
        value: -1,
        render: '-',
        disabled: true,
    }, ...Array.from({ length: 12 }, (_, i) => ({
        value: i,
        render: getFormattedMonth(new Date(actualYear, i), lang),
        disabled: false,
    }))]);
    const [days, setDays] = useState([{
        value: -1,
        render: '-',
        disabled: true,
    }, ...Array.from({ length: getLastDayInMonth(actualMonth + 1, actualYear - ClassUser.MIN_YEARS_OLD) }, (_, i) => ({
        value: i + 1,
        render: `${i + 1}`,
        disabled: false,
    }))]);
    //const [year, setYear] = useState(-1);
    //const [month, setMonth] = useState(-1);
    //const [day, setDay] = useState(-1);
    useEffect(() => {
        if (day > -1) {
            setDays(Array.from({ length: getLastDayInMonth(month + 1, year) }, (_, i) => {
                //const is_disabled = new Date(year, month, i + 1) > minDate;
                return ({
                    value: i + 1,
                    render: `${i + 1}`,
                    disabled: false,
                })
            }));
            if (month > -1 && year > -1) {
                user.update({
                    birthday: new Date(year, month, day),
                    //email:`${user.getDisplayName()}@dandela-academy.ao`,
                });
                setUser(user?.clone());
            }
        }
    }, [day]);
    useEffect(() => {
        if (month > -1) {
            setMonths(Array.from({ length: 12 }, (_, i) => ({
                value: i,
                render: getFormattedMonth(new Date(actualYear, i), lang),
                disabled: false,
            })));
            if (year > -1) {
                setDays(Array.from({ length: getLastDayInMonth(month + 1, year) }, (_, i) => {
                    const is_disabled = new Date(year, month, i + 1) > minDate;
                    return ({
                        value: i + 1,
                        render: `${i + 1}`,
                        disabled: is_disabled,
                    })
                }));
            }
            if (day > -1 && year > -1) {
                user.update({
                    birthday: new Date(year, month, day),
                    //email:`${user.getDisplayName()}@dandela-academy.ao`,
                });
                setUser(user?.clone());
            }
        }
        /*
      user.update({
          birthday: new Date(year, month, day),
          //email:`${user.getDisplayName()}@dandela-academy.ao`,
        });
        */

    }, [month]);
    useEffect(() => {
        if (year > -1) {
            setYears(Array.from({ length: 101 }, (_, i) => ({
                value: actualYear - 100 - ClassUser.MIN_YEARS_OLD + i,
                render: `${actualYear - 100 - ClassUser.MIN_YEARS_OLD + i}`,
                disabled: actualYear - 100 - ClassUser.MIN_YEARS_OLD + i > actualYear - ClassUser.MIN_YEARS_OLD,
            })).sort((a, b) => b.value - a.value));
            if (day > -1 && month > -1) {
                user.update({
                    birthday: new Date(year, month, day),
                    //email:`${user.getDisplayName()}@dandela-academy.ao`,
                });
                setUser(user?.clone());
            }
        }
    }, [year]);
    return (<Stack sx={{width:'100%'}}>
        <Stack alignItems={'center'} direction={'row'} spacing={1} sx={{width:'100%'}}>
        <IconCalendar />
        <SelectComponent label={`${t('common:day')}`} value={day} setValue={setDay} list={days} setList={setDays}
            error={day > -1 && year > -1 && month > -1 && new Date(year, month, day) > minDate}
        />
        <SelectComponent label={`${t('common:month')}`} value={month} setValue={setMonth} list={months} setList={setMonths}
            error={year > -1 && month > -1 && new Date(year, month, 1) > minDate}
        />
        <SelectComponent label={`${t('common:year')}`} value={year} setValue={setYear} list={years} setList={setYears}
            error={year > -1 && new Date(year, 0, 1) > minDate}
        />
    </Stack>
    {
            day > -1 && month > -1 && year > -1 && new Date(year, month, day) > minDate && <Typography color='error' sx={{ fontSize: '0.8rem' }}>{`L'utilisateur doit etre né avant le ${getFormattedDate(minDate, lang)}`}</Typography>
        }
    </Stack>)
}