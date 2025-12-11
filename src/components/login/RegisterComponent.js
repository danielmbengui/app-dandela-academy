import React, { useState } from "react";
import LoginPageWrapper from "../wrappers/LoginPageWrapper";
import { Alert, Stack, Typography } from "@mui/material";
import TextFieldComponent from "../elements/TextFieldComponent";
import { IconEmail } from "@/assets/icons/IconsComponent";
import TextFieldPasswordComponent from "../elements/TextFieldPasswordComponent";
import ButtonNextComponent from "../elements/ButtonNextComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { set } from "zod";
import { useThemeMode } from "@/contexts/ThemeProvider";
import Link from "next/link";
import { PAGE_ACTIVE_ACCOUNT, PAGE_DASHBOARD_HOME, PAGE_FORGOT_PASSWORD, PAGE_REGISTER } from "@/contexts/constants/constants_pages";
import { ClassColor } from "@/classes/ClassColor";
import { useTranslation } from "react-i18next";
import { NS_LOGIN, NS_REGISTER } from "@/contexts/i18n/settings";
import FieldComponent from "../elements/FieldComponent";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/contexts/functions";
import AlertComponent from "../elements/AlertComponent";
import { ClassUser, ClassUserStudent } from "@/classes/users/ClassUser";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { validatePassword } from "firebase/auth";
import { auth } from "@/contexts/firebase/config";
import { where } from "firebase/firestore";

const ShowValidPassword = ({ isValid = false, text = "" }) => {
    const color = isValid ? 'green' : 'red';
    return (<Stack direction={'row'} spacing={1} alignItems={'center'}>
        <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '999px',
            background: color,
            //box-shadow: 0 0 8px ${cfg?.glow};
        }} />
        <Typography variant="caption" sx={{ fontSize: '0.85rem', fontWeight: 300, color: color }}>{text}</Typography>
    </Stack>)
}
export default function RegisterComponent() {
    const router = useRouter();
    const { theme } = useThemeMode();
    const { text, primary } = theme.palette;
    const { login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [errorMail, setErrorMail] = useState('');
    const [isErrorActivate, setIsErrorActivate] = useState(false);
    const [isError, setIsError] = useState(false);

    const [errors, setErrors] = useState({});

    const [validPassword, setValidPassword] = useState({
        containsLowercaseLetter: true,
        containsNonAlphanumericCharacter: true,
        containsNumericCharacter: true,
        containsUppercaseLetter: true,
        isValid: true,
        meetsMaxPasswordLength: true,
        meetsMinPasswordLength: true,
    });

    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation([NS_REGISTER]);
    const errorTranslate = t('errors', { returnObjects: true });
    const { main = "",
        notValid = errorTranslate['email-not-valid'],
        emailAlreadyExists = errorTranslate['email-already-exists'],
        
        notValidPassword = errorTranslate['password-not-valid'],
        notValidPasswordRepeat = errorTranslate['password-repeat'],
        notDandela = errorTranslate['email-not-dandela-academy'],
        notFound = errorTranslate['email-not-found'] || '',
        notActivatedText = errorTranslate['email-not-activated'] || '',
        errorMain = errorTranslate['before-continue'],
    } = errors;

    const onSubmit = async () => {
        setIsLoading(true);
        setIsErrorActivate('');
        setIsError(false);
        setErrors({});
        const _errors = {};
        const status = await validatePassword(auth, password);
        setValidPassword(prev => ({
            ...prev,
            isValid: status.isValid,
            containsLowercaseLetter: status.containsLowercaseLetter,
            containsUppercaseLetter:status.containsUppercaseLetter,
            containsNumericCharacter:status.containsNumericCharacter,
            containsNonAlphanumericCharacter:status.containsNonAlphanumericCharacter,
            meetsMinPasswordLength:status.meetsMinPasswordLength,
            meetsMaxPasswordLength:status.meetsMaxPasswordLength,
        }));
        if(!status.isValid) {
            _errors.password = notValidPassword;
        } else {
            if(password !== passwordRepeat) {
                _errors.password_repeat = notValidPasswordRepeat;
            }
        }
        //validPassword.containsLowercaseLetter = status.containsLowercaseLetter;
        console.log("valid password", status);
        if (!isValidEmail(email)) {
            //setErrorMail(notValid);
            //setIsError(true);
            //setError(<AlertComponent title={resetError} severity="error" />);
            //setIsLoading(false);
            _errors.email = notValid;
            //return;
        }
        
        if (Object.keys(_errors).length > 0) {
            _errors.main = errorMain;
            setErrors(prev=>({
                ...prev,
                ..._errors,
            }));
            return;
        }
        const countUsers = await ClassUser.count([where("email", "==", email.toLocaleLowerCase().trim())]);
        if(countUsers > 0) {
            _errors.main = emailAlreadyExists;
            setErrors({main:_errors.main});
        }
        /*
        try {
            const _user = await ClassUser.getByEmailAcademy(email);
            if (!_user) {
                setIsError(true);
                setError(<AlertComponent title={notFound} severity="error" />);
                return;
            }
            //notActivatedText
            if (!_user.activated) {
                setIsErrorActivate(true);
                setIsError(true);
                setError(<AlertComponent title={notActivatedText} subtitle={<Link style={{ fontWeight: 'bold', color: primary.main }} href={PAGE_ACTIVE_ACCOUNT}>{t('subtitle')}</Link>
                } severity="error" />);
                return;
            }
            const result = await login(_user.email, password);
            const { success, error } = result;
            console.log('login result', result);
            if (!success) {
                setIsError(true);
                setError(<AlertComponent title={error.message} severity="error" />);
                return;
            }
            router.replace(PAGE_DASHBOARD_HOME);
        } catch (_) {
            setError(<AlertComponent title={main} severity="error" />);
        } finally {
            setIsLoading(false);
        }
        */
    }
    return (<Stack spacing={3} sx={{ color: "var(--font-color)", width: '100%', py: 3, px: { xs: 3, sm: 5 }, background: 'var(--card-color)', borderRadius: '5px' }}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant="h4">
                {t('title')}
            </Typography>
            <Link href={PAGE_REGISTER}>
                <p className="link">{t('subtitle')}</p>
            </Link>
        </Stack>
        <Stack spacing={1} alignItems={'end'} sx={{ width: '100%' }}>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <FieldComponent
                    label={t('label-email')}
                    name='email'
                    type="email"
                    disabled={isLoading || isErrorActivate}
                    icon={<IconEmail width={20} />}
                    placeholder={t('placeholder-email')}
                    value={email}
                    onChange={(e) => {
                        e.preventDefault();
                        setEmail(e.target.value);
                        setErrorMail('');
                        setIsError(false);
                        // setError(<></>);
                    }}
                    onClear={() => {
                        setEmail('');
                        setErrorMail('');
                        setIsError(false);
                        //setError(<></>);
                    }}
                    error={errors.email}
                    fullWidth
                />
                <FieldComponent
                    label={t('label-password')}
                    name='password'
                    type="password"
                    placeholder={t('placeholder-password')}
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => {
                        e.preventDefault();
                        setPassword(e.target.value);
                        setErrorMail('');
                        setIsError(false);
                        //setError(<></>);
                    }}
                    onClear={() => {
                        setPassword('');
                        setErrorMail('');
                        setIsError(false);
                        //setError(<></>);
                    }}
                    error={errors.password}
                    fullWidth
                />
                <FieldComponent
                    label={t('label-password-repeat')}
                    name='password-repeat'
                    type="password"
                    placeholder={t('placeholder-password-repeat')}
                    value={passwordRepeat}
                    disabled={isLoading || isErrorActivate}
                    onChange={(e) => {
                        e.preventDefault();
                        setPasswordRepeat(e.target.value);
                        setErrorMail('');
                        setIsError(false);
                        //setError(<></>);
                    }}
                    onClear={() => {
                        setPassword('');
                        setErrorMail('');
                        setIsError(false);
                        //setError(<></>);
                    }}
                    error={errors.password_repeat}
                    fullWidth
                />
                {
                    !validPassword.isValid && <Stack sx={{ px: 1 }}>
                        <ShowValidPassword isValid={validPassword.containsLowercaseLetter} text={"Minimum 1 minuscule"} />
                        <ShowValidPassword isValid={validPassword.containsUppercaseLetter} text={"Minimum 1 majuscule"} />
                        <ShowValidPassword isValid={validPassword.containsNumericCharacter} text={"Minimum 1 chiffre"} />
                        <ShowValidPassword isValid={validPassword.containsNonAlphanumericCharacter} text={"Minimum 1 caratère spéciale"} />
                        <ShowValidPassword isValid={validPassword.meetsMinPasswordLength} text={"Minimum 6 caractères"} />
                        <ShowValidPassword isValid={validPassword.meetsMaxPasswordLength} text={"Maximum 4096 caractères"} />

                    </Stack>
                }
            </Stack>

            {
                !isErrorActivate && !isLoading && <Link href={PAGE_FORGOT_PASSWORD} style={{ color: ClassColor.GREY_LIGHT }}>
                    <p className="link">{t('btn-forgot-password')}</p>
                </Link>
            }
        </Stack>
        {
            // isError && (error)
        }
        {
            errors.main && (<Alert severity="error">
                <Stack sx={{ height: '100%', fontWeight: 'bold' }} justifyContent={'center'}>
                    {errors.main}
                </Stack>
            </Alert>)
        }
        {
            (<Alert severity="success">
                {'oook'}
            </Alert>)
        }

        {
            !isErrorActivate && !isLoading && <ButtonConfirm
                loading={isLoading}
                label={t('btn-create')}
                disabled={!email || !password || !passwordRepeat}
                onClick={onSubmit}
            />
        }

        {
            !isErrorActivate && !isLoading && <Typography variant="caption" sx={{ color: ClassColor.GREY_LIGHT }}>
                {t('want-create')} <Link href={PAGE_REGISTER} style={{ color: primary.main }}>
                    <p className="link"> {t('create-account')}</p>
                </Link>
            </Typography>
        }

    </Stack>);
}