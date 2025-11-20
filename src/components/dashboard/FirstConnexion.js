"use client"

import { NS_BUTTONS, NS_COMMON, NS_DASHBOARD_FIRST_CONNEXION, NS_ERRORS, NS_FORM, NS_HOW_KNOW, NS_LEVELS, NS_ROLES, NS_SIGN_UP, NS_USER_LEVELS } from "@/libs/i18n/settings";
import { useTranslation } from "react-i18next";
//import ButtonNextWL from "./ButtonNextWL";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LangProvider";
//import TextFieldPhoneWL from "./TextFieldPhoneWL";
//import TextAreaWL from "./TextAreaWL";
//import TextFieldWL from "./TextFieldWL";
//import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
//import dayjs from "dayjs";
//import "dayjs/locale/fr";
//import "dayjs/locale/en";
//import "dayjs/locale/pt";
//import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
//import { ClassUser } from "@/classes/ClassUser";
import { translateWithVars } from "@/libs/functions";
/*
import SelectTypeWL from "./SelectTypeWL";
import SelectLevelWL from "./SelectLevelWL";
import { Box, Button, CircularProgress, Stack, Tab, Tabs, Typography } from "@mui/material";
import ButtonBackWL from "./ButtonBackWL";
import { ClassCountry } from "@/classes/ClassCountry";
import MenuSignUp from "../MenuSignUp";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import LoadingComponent from "../LoadingComponent";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useAuth } from "@/contexts/AuthProvider";
import Link from "next/link";
import { ClassUserWaitingList } from "@/classes/users/ClassUserWaitingList";
*/
//import TextFieldPasswordWL from "./TextFieldPasswordWL";
import { useRouter } from 'next/navigation';
import { PAGE_DASHBOARD_HOME } from "@/libs/constants/constants_pages";
import { Button, Stack, Tab, Tabs } from "@mui/material";
import Image from "next/image";
import { LOGO_DANDELA_ICON } from "@/libs/constants/constants_images";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";
import FieldDA from "@/components/shared/inputs/FieldDA";
import { ClassUser } from "@/classes/users/ClassUser";
import { ClassUserExtern } from "@/classes/users/extern/ClassUserExtern";
import ButtonNextDA from "@/components/shared/inputs/ButtonNextDA";
import SelectDA from "@/components/shared/inputs/SelectDA";
import TextAreaDA from "@/components/shared/inputs/TextAreaDA";
//import { IMAGE_LOGO_DANDELA, LOGO_DANDELA_ICON } from "@/lib/constants_images";
//import Image from "next/image";

const inputBase =
    'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500';

function Stepper({ currentStep }) {
    const { t } = useTranslation([NS_DASHBOARD_FIRST_CONNEXION]);
    const ARRAY_TITLES = [
        t(`step-identity-title`),
        t(`step-profile-title`),
        t(`step-details-title`),
        t(`step-validation-title`),
    ];
    const stepStatus = (step) =>
        step === currentStep ? 'active' : step < currentStep ? 'completed' : 'inactive';
    const stepIconClass = (state) =>
        state === 'active' || state === 'completed'
            ? 'bg-primaryColor text-white'
            : 'bg-gray-200 text-gray-500';
    return (<div className="mb-8">
        <div className="flex justify-start items-start">
            {ARRAY_TITLES.map((title, i) => {
                const st = stepStatus(i + 1);
                return (
                    <div key={`${title}-${i}`} className="relative flex-1 flex flex-col items-center">
                        {i !== 0 && (
                            <span
                                className={`absolute w-full h-0.5 right-1/2 top-[15px] -translate-y-1/2 ${st === 'active' || st === 'completed' ? 'bg-primaryColor' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                        <div
                            className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-semibold z-10 ${stepIconClass(
                                st
                            )}`}
                        >
                            {i + 1}
                        </div>
                        <div className="text-xs mt-2 font-medium">
                            {title}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>)
}
function Step1({ setCurrentStep, user = {}, errors, setErrors, setUser, onChange }) {
    const { t } = useTranslation([NS_DASHBOARD_FIRST_CONNEXION, NS_ERRORS, NS_BUTTONS, NS_FORM]);
    const [isDisabled, setIsDisabled] = useState(false);
    /*
    useEffect(() => {
        if (!user.last_name || !user.first_name || !user.email) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [user.last_name, user.first_name, user.email]);
    */

    const validateStep = async () => {
        const error = {};
        //if (!user.validLastName()) error.last_name = translateWithVars(t(`${NS_ERRORS}:last-name`), { min: ClassUser.MIN_LENGTH_LAST_NAME, max: ClassUser.MAX_LENGTH_LAST_NAME });
        //if (!user.validFirstName()) error.first_name = translateWithVars(t(`${NS_ERRORS}:first-name`), { min: ClassUser.MIN_LENGTH_FIRST_NAME, max: ClassUser.MAX_LENGTH_FIRST_NAME });
        //if (!user.validEmail()) error.email = t(`${NS_ERRORS}:email`);
        if (!user.birthday || !(new Date(user.birthday))) {
            error.birthday = t(`${NS_ERRORS}:select-birthday`);
        } else if (!user.validBirthday()) {
            error.birthday = translateWithVars(t(`${NS_ERRORS}:birthday`), { year: ClassUser.MIN_YEARS_OLD });
        }
        setErrors(error);
        return Object.keys(error).length === 0;
    };
    const goToNextStep = async () => {
        //if (await validateStep()) setCurrentStep(prev => prev + 1);
        setCurrentStep(prev => prev + 1);
    };

    return (<div>
        <h2 className="text-xl font-semibold text-blue-900 mb-6">{t(`${NS_DASHBOARD_FIRST_CONNEXION}:step-identity-subtitle`)}</h2>
        <Stack maxWidth={'sm'} spacing={3} className="mt-8 flex justify-end bg-red-600">
            <Stack>
                <FieldDA
                    label={`${t(`${NS_FORM}:birthday`)} *`}
                    type="date"
                    name="birthday"
                    value={user?.birthday || ''}
                    onChange={onChange}
                    inputClass={inputBase}
                    onClear={() => {
                        //user.update({ email: "" });§ ,ser(user.clone());
                    }}
                    error={errors.birthday}
                />
            </Stack>
            <Stack className="mt-8 flex justify-end" alignItems={'end'}>
                <ButtonNextDA
                    label={t(`${NS_BUTTONS}:next`)}
                    fullWidth={false}
                    onClick={goToNextStep}
                    disabled={isDisabled}
                //disabled={!user.first_name || !user.last_name || !user.email}
                />
            </Stack>
        </Stack>

    </div>)
}
function Step2({ setCurrentStep, user, setUser, backStep, onChange, errors, setErrors }) {
    const { t } = useTranslation([NS_SIGN_UP, NS_BUTTONS, NS_ERRORS, NS_HOW_KNOW]);
    const listAllKnows = ClassUserExtern.ALL_HOW_KNOWS;
    const [isDisabled, setIsDisabled] = useState(true);
    /*
    useEffect(() => {
        if (!user.type || !user.level || !user.goals || !user.how_know) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [user.type, user.level, user.goals, user.how_know]);
    */
    /*
     const validateStep = () => {
         const error = {};
         //if (!user.validType()) error.type = t(`${NS_ERRORS}:type`);
         //if (!user.validGoals()) error.goals = translateWithVars(t(`${NS_ERRORS}:goals`), { min: ClassUserExtern.MIN_LENGTH_GOALS, max: ClassUserExtern.MAX_LENGTH_GOALS });
         if (user.isErrorHowKnow()) {
             error.how_know = t(`${NS_ERRORS}:select-option`)
         } else if (!user.validHowKnow()) error.how_know_text = translateWithVars(t(`${NS_ERRORS}:how-know`), { min: ClassUserExtern.MIN_LENGTH_HOW_KNOW_TEXT, max: ClassUserExtern.MAX_LENGTH_HOW_KNOW_TEXT });
         console.log("ERRRORS", error)
         setErrors(error);
         return Object.keys(error).length === 0;
     };
     const goToNextStep = () => {
         if (validateStep()) setCurrentStep(prev => prev + 1);
     };
     */
    return (<div>
        <h2 className="text-xl font-semibold text-blue-900 mb-6">{t(`${NS_DASHBOARD_FIRST_CONNEXION}:step-profile-subtitle`)}</h2>
        <div className="space-y-4">
            <div>
                <FieldDA
                    label={`${t(`${NS_DASHBOARD_FIRST_CONNEXION}:goals`)}*`}
                    name={'goals'}
                    type={'multiline'}
                    value={user.goals}
                    onChange={onChange}
                    minRows={3}
                    maxRows={10}
                    onClear={() => {
                        user.goals = '';
                        setUser(user.clone());
                    }}
                    error={errors.goals}
                />
            </div>
        </div>
        {/*
        <div className="space-y-4">
            
            <div>
                <label className="block text-sm font-medium text-gray-700">{t(`${NS_SIGN_UP}:how-know`)}{` *`}</label>
                <Stack spacing={0.5} sx={{ my: 1 }}>
                    {
                        listAllKnows.map((item, i) => {
                            return (<div key={`${item}-${i}`}>
                                <Checkbox
                                    //type={'checkbox'}
                                    name={item}
                                    checked={user.how_know.startsWith(item)}
                                    onChange={() => {
                                        if (item !== ClassUserExtern.HOW_KNOW.OTHER) {
                                            user.update({ how_know_text: '' });
                                            setUser(user.clone());
                                            setErrors(prev => ({ ...prev, how_know_text: '' }))
                                        }
                                        onChange({
                                            target: {
                                                type: "text",
                                                name: "how_know",
                                                value: item // ici on repasse en string
                                            }
                                        });
                                    }}
                                    label={t(`${NS_HOW_KNOW}:${item}`)}
                                />
                            </div>)
                        })
                    }
                    {
                        user.how_know.startsWith(ClassUserExtern.HOW_KNOW.OTHER) && <FieldDA
                            //label={`${t(`${NS_SIGN_UP}:birthday`)} *`}
                            //type="text"
                            name="how_know_text"
                            value={user.how_know_text}
                            onChange={(e) => {
                                onChange(e);
                            }}
                            inputClass={inputBase}
                            onClear={() => {
                                user.update({ how_know_text: "" });
                                setUser(user.clone());
                            }}
                            error={errors.how_know_text}
                        />
                    }
                    {errors.how_know && <p className="text-red-500 text-sm mt-1">{errors.how_know}</p>}

                </Stack>
            </div>
        </div>
       */}

        <div className="mt-8 flex justify-between">
            {
                /*
                 <ButtonBackWL
                    onClick={() => backStep()}
                />
                <ButtonNextWL
                    label={t(`${NS_BUTTONS}:next`)}
                    onClick={goToNextStep}
                    disabled={isDisabled}
                />
                */
            }
        </div>
    </div>)
}
/*
function Step3({ setCurrentStep, user, setUser, backStep, onChange, errors, setErrors }) {
    const { t } = useTranslation([NS_SIGN_UP, NS_BUTTONS, NS_ERRORS, NS_HOW_KNOW]);
    const [prefixe, setPrefixe] = useState(ClassCountry.DEFAULT_PREFIXE);
    const [phone, setPhone] = useState("");
    const [codeCountry, setCodeCountry] = useState(ClassCountry.DEFAULT_CODE);
    const [showWhatsApp, setShowWhatsApp] = useState(false);
    const validateStep = () => {
        const next = {};
        if (user.isErrorPhoneNumber(codeCountry)) next.phone_number = t(`${NS_ERRORS}:phone`);
        console.log("ERRRORS", next)
        setErrors(next);
        return Object.keys(next).length === 0;
    };
    const goToNextStep = () => {
        if (validateStep()) setCurrentStep(prev => prev + 1);
    };
    return (<div>
        <h2 className="text-xl font-semibold text-blue-900 mb-6">{t(`${NS_SIGN_UP}:step-details-subtitle`)}</h2>

        <div className="space-y-4">
            <Field
                label={`${t(`${NS_SIGN_UP}:phone`)} *`}
                name="phone_number"
                type="phone"
                value={user.phone_number}
                onChange={(e) => {
                    const { value } = e.target;
                    if (value) {
                        setShowWhatsApp(true);
                    } else {
                        setShowWhatsApp(false);
                        user.update({ okay_whatsapp: false });
                        setUser(user.clone());
                    }
                    onChange(e);
                }}
                onClear={() => {
                    user.update({ phone_number: "", okay_whatsapp: false });
                    setUser(user.clone());
                    setShowWhatsApp(false);
                    setErrors(prev => ({ ...prev, phone: '' }))
                }}
                error={errors.phone_number}
                inputClass={inputBase}
                prefixe={prefixe}
                setPrefixe={setPrefixe}
                phone={phone}
                setPhone={setPhone}
                codeCountry={codeCountry}
                setCodeCountry={setCodeCountry}
            />
            {
                showWhatsApp && <Checkbox
                    name="okay_whatsapp"
                    checked={user.okay_whatsapp}
                    onChange={onChange}
                    label={t(`${NS_SIGN_UP}:ok-whastapp`)}
                />
            }
            <Checkbox
                name="okay_newsletter"
                checked={user.okay_newsletter}
                onChange={onChange}
                label={t(`${NS_SIGN_UP}:newsletter`)}
            />
        </div>

        <div className="mt-8 flex justify-between">
            <ButtonBackWL
                onClick={() => backStep()}
            />
            <ButtonNextWL
                label={t(`${NS_BUTTONS}:next`)}
                onClick={goToNextStep}
            />
        </div>
    </div>)
}
*/
/*
function Step4({ submitting, user, backStep, onChange, errors }) {
    const { lang } = useLanguage();
    const { t } = useTranslation([NS_SIGN_UP, NS_BUTTONS, NS_COMMON, NS_ERRORS, NS_USER_LEVELS]);
    const summary = useMemo(() => buildSummary({ user }), [user]);

    function buildSummary({ user = null }) {
        //const {t} = useTranslation();
        const rows = [];
        const push = (label, value) => value && rows.push({ label, value });

        push(t(`${NS_SIGN_UP}:lastname`), user.last_name);
        push(t(`${NS_SIGN_UP}:firstname`), user.first_name);
        push(t(`${NS_SIGN_UP}:email`), user.email);
        push(t(`${NS_SIGN_UP}:type`), t(`${NS_ROLES}:${user.type}`));
        push(t(`${NS_SIGN_UP}:phone`), user.phone_number);
        push(t(`${NS_SIGN_UP}:birthday`), getFormattedDate(user.birthday, lang));
        //push('Adresse', f.addressLine1);
        //push('Adresse (suite)', f.addressLine2);
        //push('Ville', f.city);
        //push('Région/État', f.stateRegion);
        //push('Code postal', f.postalCode);
        //push('Pays', f.country);
        //push('Langue préférée',f.preferredLanguage === 'fr' ? 'Français (FR)' : f.preferredLanguage === 'en' ? 'Anglais (EN)' : 'Portugais (PT-AO)');
        push(
            t(`${NS_SIGN_UP}:level`),
            t(`${NS_USER_LEVELS}:${user.level}`),
        );
        push(t(`${NS_SIGN_UP}:goals`), user.goals);
        push(t(`${NS_SIGN_UP}:how-know`), user.isOtherHowKnow() ? user.how_know_text : t(`${NS_HOW_KNOW}:${user.how_know}`));
        push(t(`${NS_SIGN_UP}:ok-whastapp`), !user.phone_number ? '' : user.okay_whatsapp ? t(`${NS_COMMON}:yes`) : t(`${NS_COMMON}:no`));
        push(t(`${NS_SIGN_UP}:newsletter`), user.okay_newsletter ? t(`${NS_COMMON}:yes`) : t(`${NS_COMMON}:no`));

        return rows;
    }
    return (<div>
        {
            !submitting && <div>
                <h2 className="text-xl font-semibold text-blue-900 mb-6">{t(`${NS_SIGN_UP}:step-validation-subtitle`)}</h2>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="font-medium text-gray-800 mb-2">{t(`${NS_SIGN_UP}:resume`)}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        {summary.map((row) => (
                            <p key={row.label}>
                                <strong>{row.label}:</strong> {row.value}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="mb-6">

                    <div className="flex items-start gap-3">
                        <Checkbox
                            name="okay_other_news"
                            checked={user.okay_other_news}
                            onChange={onChange}
                            label={`${t(`${NS_SIGN_UP}:accept-conditions`)} *`}
                        />
                    </div>
                    {errors.okay_other_news && <p className="text-red-500 text-sm mt-1">{errors.okay_other_news}</p>}
                </div>
            </div>
        }
        {
            submitting && <Stack alignItems={'center'} justifyContent={'center'} sx={{ background: '', height: '100%', minHeight: '250px' }}>
                <CircularProgress size={'30px'} />
                <span>{`${t(`${NS_COMMON}:loading`)}`}</span>
            </Stack>
        }

        <div className="mb-6 bg-gray-100 p-4 rounded-md" style={{ display: 'none' }}>
            <div className="text-sm text-gray-600">CAPTCHA placeholder (non configuré)</div>
        </div>

        <div className="mt-8 flex justify-between">
            <ButtonBackWL
                onClick={() => backStep()}
                disabled={submitting}
            />
            <ButtonNextWL
                type="submit"
                disabled={submitting}
                label={submitting ? t(`${NS_BUTTONS}:sending`) : t(`${NS_BUTTONS}:confirm`)}
            //onClick={validateStep3}
            />
        </div>
    </div>);
}
*/
/*
function StepSuccess({ user }) {
    const { t } = useTranslation([NS_SIGN_UP, NS_BUTTONS])
    function WhatsAppButton() {
        const encodedText = encodeURIComponent(`${t(`${NS_SIGN_UP}:share-text`)}\n${process.env.NEXT_PUBLIC_WESITE_LINK}`);
        const href = `https://api.whatsapp.com/send?text=${encodedText}`;

        return (<>
            <a
                href={href}
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
                <FaWhatsapp className="mr-1" /> {translateWithVars(t(`${NS_BUTTONS}:share-to`), { text: "WhatsApp" })}
            </a>
        </>);
    }
    function TwitterButton() {
        const encodedText = encodeURIComponent(`${t(`${NS_SIGN_UP}:share-text`)}\n${process.env.NEXT_PUBLIC_WESITE_LINK}`);
        //const href = `https://api.whatsapp.com/send?text=${encodedText}`;
        const href = `https://twitter.com/intent/tweet?text=${t(`${NS_SIGN_UP}:share-text`)}&url=${process.env.NEXT_PUBLIC_WESITE_LINK}`;

        return (<>
            <a
                href={href}
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
                <FaTwitter className="mr-1" /> {translateWithVars(t(`${NS_BUTTONS}:share-to`), { text: "Twitter" })}
            </a>
        </>);
    }
    function FacebookButton() {
        const encodedText = encodeURIComponent(`${t(`${NS_SIGN_UP}:share-text`)}\n${process.env.NEXT_PUBLIC_WESITE_LINK}`);
        //const href = `https://api.whatsapp.com/send?text=${encodedText}`;
        const href = `https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_WESITE_LINK}`;

        return (<>
            <a
                href={href}
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
                <FaFacebook className="mr-1" /> {translateWithVars(t(`${NS_BUTTONS}:share-to`), { text: "Facebook" })}
            </a>
        </>);
    }
    return (<div className="font-sans text-gray-800">
        <main className="py-12 px-4">
            <section className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">{t(`${NS_SIGN_UP}:subscribe-success-title`)}</h2>
                    <p className="text-gray-600">{translateWithVars(t(`${NS_SIGN_UP}:subscribe-success-connected`), { email: user?.email })}</p>
                    <p className="text-gray-600 mb-8">{translateWithVars(t(`${NS_SIGN_UP}:subscribe-success-subtitle`), { email: user?.email })}</p>


                    <div className="flex justify-center gap-4 flex-wrap">
                        <WhatsAppButton />
                        <FacebookButton />
                        <TwitterButton />
                    </div>
                </div>
            </section>
        </main>
    </div>);
}
*/

// ---------- Small components ----------
/*
function Field({ label, name, value, onChange, onClear, type = 'text', error, inputClass, placeholder, minRows = 1, maxRows = 1,
    prefixe, setPrefixe, phone, setPhone, codeCountry, setCodeCountry }) {
    const { lang } = useLanguage();
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor={name}>
                {label}
            </label>
            {
                type === "phone" && <TextFieldPhoneWL
                    prefixe={prefixe}
                    setPrefixe={setPrefixe}
                    phone={phone}
                    setPhone={setPhone}
                    codeCountry={codeCountry}
                    setCodeCountry={setCodeCountry}
                    onChange={onChange}
                />
            }
            {
                type === "password" && <TextFieldPasswordWL
                    name={name}
                    value={value}
                    onChange={onChange}
                    onClear={onClear}
                    placeholder={placeholder}
                    error={error}
                    type={type}
                    //minRows={minRows}
                    //maxRows={maxRows}
                    //helperText={error}
                    className={`${inputClass} ${error ? 'border-red-500' : ''}`}
                />
            }
            {
                type === "date" && <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
                    <DatePicker
                        maxDate={dayjs(new Date())}
                        className="shadow-sm"
                        //label="Date de naissance"
                        //value={value}
                        name={'birthday'}
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
            }
            {
                type === 'multiline' && <TextAreaWL
                    fullWidth={true}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onClear={onClear}
                    placeholder={placeholder}
                    error={error}
                    type={type}
                    minRows={minRows}
                    maxRows={maxRows}
                    //helperText={error}
                    className={`${inputClass} ${error ? 'border-red-500' : ''}`}
                />
            }
            {
                type !== "date" && type !== "phone" && type !== 'password' && type !== 'multiline' && <>
                    <TextFieldWL
                        //id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onClear={onClear}
                        placeholder={placeholder}
                        error={error}
                        type={type}
                        minRows={minRows}
                        maxRows={maxRows}
                        //helperText={error}
                        className={`${inputClass} ${error ? 'border-red-500' : ''}`}
                    />
                </>
            }
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
*/
function Checkbox({ name, checked, onChange, label }) {
    return (
        <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                style={{ cursor: 'pointer' }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span style={{ cursor: 'pointer' }}>{label}</span>
        </label>
    );
}
/*
function StepLogin() {
    const { t } = useTranslation([NS_SIGN_UP, NS_BUTTONS, NS_ERRORS]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const { login, isErrorSignIn, textErrorSignIn } = useAuth();
    //login = async (e, email, password)
    useEffect(() => {
        if (!email || !password) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [email, password]);
    const validateStep = async () => {
        const error = {};
        //if (!user.validLastName()) error.last_name = translateWithVars(t(`${NS_ERRORS}:last-name`), { min: ClassUser.MIN_LENGTH_LAST_NAME, max: ClassUser.MAX_LENGTH_LAST_NAME });
        //if (!user.validFirstName()) error.first_name = translateWithVars(t(`${NS_ERRORS}:first-name`), { min: ClassUser.MIN_LENGTH_FIRST_NAME, max: ClassUser.MAX_LENGTH_FIRST_NAME });
        if (!isValidEmail(email)) error.email = t(`${NS_ERRORS}:email`);
        setErrors(error);
        return Object.keys(error).length === 0;
    };
    const goToNextStep = async (e) => {
        if (validateStep()) {
            setSubmitting(true);
            await login(e, email, password);
            setSubmitting(false);
        }
    };
    return (<div>
        {isErrorSignIn && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm text-red-700">{textErrorSignIn}</p>
            </div>
        )}
        <h2 className="text-xl font-semibold text-blue-900 mb-6">{t(`${NS_SIGN_UP}:login-step-login`)}</h2>
        <div className="space-y-4">
            <Field
                label={`${t(`${NS_SIGN_UP}:email`)} *`}
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                    const _value = e.target.value;
                    setEmail(_value);
                }}
                onClear={() => {
                    setEmail('');
                    setErrors(prev => ({ ...prev, email: '' }));
                }}
                error={errors.email}
                inputClass={inputBase}
            />
            <Field
                label={`${t(`${NS_SIGN_UP}:password`)} *`}
                type="password"
                name="default_password"
                value={password}
                onChange={(e) => {
                    const _value = e.target.value;
                    setPassword(_value);
                }}
                onClear={() => {
                    setPassword('');
                    setErrors(prev => ({ ...prev, password: '' }));
                }}
                error={errors.password}
                inputClass={inputBase}
            />
        </div>
        <div className="mt-8 flex justify-end">
            <ButtonNextWL
                label={t(`${NS_BUTTONS}:connect`)}
                onClick={goToNextStep}
                disabled={isDisabled}
                loading={submitting}
            //disabled={!user.first_name || !user.last_name || !user.email}
            />
        </div>
    </div>)
}
*/

export default function FirstConnexion() {
    const { t } = useTranslation([NS_SIGN_UP, NS_BUTTONS, NS_ERRORS]);
    const [currentStep, setCurrentStep] = useState(1);
    const [newUser, setNewUser] = useState(new ClassUserExtern());
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [statePage, setStatePage] = useState('signup'); // signup / login
    //const summary = useMemo(() => buildSummary({ f: form, user }), [form]);
    //const summary = useMemo(() => buildSummary({ f: form, user }), [form]);
    const formRef = useRef(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleChange = (event, newValue) => {
        setStatePage(newValue);
    };
    const backStep = () => setCurrentStep(prev => prev - 1);
    const onChange = (e) => {
        //console.log("OBBBBJ", e)
        const { name, value, type, checked } = e.target;
        /*
                newUser.update({
                    [name]:
                        type === 'checkbox' ? checked :
                            type === 'date' && value ? new Date(value) :
                                value,
                });
                */
        newUser[name] =
            type === 'checkbox' ? checked :
                type === 'date' && value ? new Date(value) :
                    value
        console.log("VALUE", name, type, value, checked);
        console.log("USER", newUser);
        setNewUser(newUser.clone());
        //setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors((p) => ({
            ...p,
            _form: '',
        }));
        //if (!user.okay_other_news) next.okay_other_news = t(`${NS_ERRORS}:accept-conditions`);
        if (!newUser.okay_other_news) {
            setErrors((prev) => ({ ...prev, okay_other_news: t(`${NS_ERRORS}:accept-conditions`) }));
            return;
        }
        setErrors((p) => ({ ...p, okay_other_news: undefined }));
        setSubmitting(true);

        try {
            // 🔁 Remplace par ton endpoint réel
            // const res = await fetch('/api/waitlist', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(form),
            // });
            // if (!res.ok) throw new Error('Network error');
            await new Promise((r) => setTimeout(r, 800)); // simulate
            //throw new Error("ERRRRRRRRROR : 404")
            if (await newUser.alreadyExist()) throw new Error(translateWithVars(t(`${NS_ERRORS}:form`), { email: newUser.email }));
            await newUser.signup();
            router.replace(PAGE_DASHBOARD_HOME);
            //await newUser.addToFirestore();
            setSubmitted(true);
        } catch (err) {
            setErrors((p) => ({
                ...p,
                _form: err.message,
                //_form: translateWithVars(t(`${NS_ERRORS}:form`), {email:newUser.email}),
            }));
        } finally {
            setSubmitting(false);
        }
    };
    if (submitted) {
        //return (<StepSuccess user={newUser} />)
    }
    //return(<>WEEESH</>)

    return (<>
        <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
            <HeadingDashboard>{t('Compléter les informations')}</HeadingDashboard>

            {/* counter area */}
            <Stepper currentStep={currentStep} />
            <form onSubmit={onSubmit} className="space-y-6">
                {
                    currentStep === 1 && <Step1 setCurrentStep={setCurrentStep} errors={errors} setErrors={setErrors} user={newUser} setUser={setNewUser} onChange={onChange} />
                }
                {
                    currentStep === 2 && <Step2 setCurrentStep={setCurrentStep} user={newUser} setUser={setNewUser} backStep={backStep} onChange={onChange} errors={errors} setErrors={setErrors} />
                }
                {
                    //currentStep === 3 && <Step3 setCurrentStep={setCurrentStep} user={newUser} setUser={setNewUser} backStep={backStep} onChange={onChange} errors={errors} setErrors={setErrors} />
                }
                {
                    //currentStep === 4 && <Step4 submitting={submitting} setCurrentStep={setCurrentStep} user={newUser} setUser={setNewUser} backStep={backStep} onChange={onChange} errors={errors} setErrors={setErrors} />
                }
            </form>
        </div>
        <div className="font-sans text-gray-800 min-h-screen">
            <section className="py-6 md:py-8 px-12 md:px-16 bg-white rounded-xl">
                <div className="container mx-auto max-w-4xl text-center">
                    <Stack alignItems={'center'} sx={{ mb: 1 }}>
                        <Image
                            className="dark:invert"
                            src={LOGO_DANDELA_ICON}
                            alt="Dandela Academy logo"
                            width={40}
                            height={40}
                            style={{ color: 'inherit', height: '100%', width: 'auto' }}
                            priority
                        />
                    </Stack>
                    {
                        <>
                            <h1 className="text-3xl md:text-5xl font-bold text-blue-900 mb-4">
                                {t(`${NS_SIGN_UP}:title`)}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8">
                                {t(`${NS_SIGN_UP}:subtitle`)}
                            </p>
                            <button
                                //onClick={scrollToForm}
                                onClick={() => setStatePage('login')}
                                style={{ cursor: 'pointer', display: 'none' }}
                                className="bg-blue-900 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium text-lg transition-colors duration-200"
                            >
                                {t(`${NS_BUTTONS}:connect`)}
                            </button>
                        </>
                    }
                    {
                        statePage === 'loginU' && <>
                            <h1 className="text-3xl md:text-5xl font-bold text-blue-900 mb-4">
                                {t(`${NS_SIGN_UP}:login-title`)}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8">
                                {t(`${NS_SIGN_UP}:login-subtitle`)}
                            </p>
                            <button
                                //onClick={scrollToForm}
                                onClick={() => setStatePage('signup')}
                                style={{ cursor: 'pointer', display: 'none' }}
                                className="bg-blue-900 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium text-lg transition-colors duration-200"
                            >
                                {t(`${NS_BUTTONS}:signup`)}
                            </button>
                        </>
                    }
                </div>
            </section>
            <section ref={formRef} className="py-8 px-1">

                <div className="container text-center bg-green-600">

                    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                        <HeadingDashboard>{t('title')}</HeadingDashboard>
                        <Tabs value={statePage} onChange={handleChange} centered sx={{ mb: 7 }}>
                            <Tab label={t(`${NS_BUTTONS}:signup`)} value={'signup'} />
                            <Tab label={t(`${NS_BUTTONS}:connect`)} value={'login'} />
                        </Tabs>
                        {
                            statePage === 'signup' && <>
                                {
                                    //!submitting && <Stepper currentStep={currentStep} />
                                }

                                {errors._form && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                        <p className="text-sm text-red-700">{errors._form}</p>
                                    </div>
                                )}

                                <form onSubmit={onSubmit} className="space-y-6">
                                    {
                                        //currentStep === 1 && <Step1 setCurrentStep={setCurrentStep} errors={errors} setErrors={setErrors} user={newUser} setUser={setNewUser} onChange={onChange} />
                                    }
                                    {
                                        //currentStep === 2 && <Step2 setCurrentStep={setCurrentStep} user={newUser} setUser={setNewUser} backStep={backStep} onChange={onChange} errors={errors} setErrors={setErrors} />
                                    }
                                    {
                                        //currentStep === 3 && <Step3 setCurrentStep={setCurrentStep} user={newUser} setUser={setNewUser} backStep={backStep} onChange={onChange} errors={errors} setErrors={setErrors} />
                                    }
                                    {
                                        //currentStep === 4 && <Step4 submitting={submitting} setCurrentStep={setCurrentStep} user={newUser} setUser={setNewUser} backStep={backStep} onChange={onChange} errors={errors} setErrors={setErrors} />
                                    }
                                </form>
                            </>
                        }
                        {
                            //  statePage === 'login' && <StepLogin setCurrentStep={setCurrentStep} errors={errors} setErrors={setErrors} user={newUser} setUser={setNewUser} onChange={onChange} />
                        }
                    </div>
                </div>
            </section>
        </div>
    </>)
}