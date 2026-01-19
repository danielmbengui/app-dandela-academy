import React, { useState } from "react";
import { Alert, Stack, Typography } from "@mui/material";
import { IconEmail } from "@/assets/icons/IconsComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import Link from "next/link";
import { PAGE_ACTIVE_ACCOUNT, PAGE_DASHBOARD_HOME, PAGE_FORGOT_PASSWORD, PAGE_LOGIN } from "@/contexts/constants/constants_pages";
import { useTranslation } from "react-i18next";
import { NS_ACTIVE_ACCOUNT, NS_LOGIN } from "@/contexts/i18n/settings";
import { useRouter } from "next/navigation";
import { isValidDandelaAcademyEmail, isValidEmail } from "@/contexts/functions";
import { ClassUser } from "@/classes/users/ClassUser";
import FieldComponent from "@/components/elements/FieldComponent";
import AlertComponent from "@/components/elements/AlertComponent";
import ButtonNextComponent from "@/components/elements/ButtonNextComponent";
import LoginPageWrapper from "@/components/wrappers/LoginPageWrapper";
import { ClassColor } from "@/classes/ClassColor";
export default function ActiveAccountComponent({ setIsLogin = null }) {
    const router = useRouter();
    const { theme } = useThemeMode();
    const { text, primary } = theme.palette;
    const { user, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [emailAcademy, setEmailAcademy] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [errorMail, setErrorMail] = useState('');
    const [errorMailAcademy, setErrorMailAcademy] = useState('');
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(<></>);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation([NS_ACTIVE_ACCOUNT]);
    const errors = t('errors', { returnObjects: true });
    const { main = "",
        notValid = errors['email-not-valid'],
        notDandela = errors['email-not-dandela-academy'],
        notFound = errors['email-not-found'] || '',
        resetError = errors['reset-failed'] } = errors;
    return (<LoginPageWrapper>
        <Stack spacing={3} sx={{ color: text.main, width: '100%', py: 3, px: { xs: 3, sm: 5 }, background: 'white', borderRadius: '5px' }}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h4">
                    {t('title')}
                </Typography>
                <Link href={PAGE_LOGIN} style={{ color: primary.main }}>
                    {t('subtitle')}
                </Link>
            </Stack>
            <Stack spacing={1} alignItems={'end'} sx={{ width: '100%' }}>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <FieldComponent
                        required={true}
                        label={t('label-email')}
                        name='email'
                        type="email"
                        icon={<IconEmail width={20} />}
                        placeholder={t('placeholder-email')}
                        value={email}
                        onChange={(e) => {
                            e.preventDefault();
                            setEmail(e.target.value);
                            setErrorMail('');
                            setIsError(false);
                            setError(<></>);
                        }}
                        onClear={() => {
                            setEmail('');
                            setErrorMail('');
                            setIsError(false);
                            setError(<></>);
                        }}
                        error={errorMail}
                        fullWidth
                    />
                    <FieldComponent
                        required={true}
                        label={t('label-email-academy')}
                        name='email_cademy'
                        type="email"
                        icon={<IconEmail width={20} />}
                        placeholder={t('placeholder-email-academy')}
                        value={emailAcademy}
                        onChange={(e) => {
                            e.preventDefault();
                            setEmailAcademy(e.target.value);
                            setErrorMailAcademy('');
                            setIsError(false);
                            setError(<></>);
                        }}
                        onClear={() => {
                            setEmailAcademy('');
                            setErrorMailAcademy('');
                            setIsError(false);
                            setError(<></>);
                        }}
                        error={errorMailAcademy}
                        fullWidth
                    />
                    <FieldComponent
                        required={true}
                        label={t('label-password')}
                        name='password'
                        type="password"
                        placeholder={t('placeholder-password')}
                        value={password}
                        onChange={(e) => {
                            e.preventDefault();
                            setPassword(e.target.value);
                            setErrorMail('');
                            setIsError(false);
                            setError(<></>);
                        }}
                        onClear={() => {
                            setPassword('');
                            setErrorMail('');
                            setIsError(false);
                            setError(<></>);
                        }}
                        fullWidth
                    />
                </Stack>
                <Link href={PAGE_FORGOT_PASSWORD} style={{ color: ClassColor.GREY_LIGHT }}>
                    {t('btn-forgot-password')}
                </Link>
            </Stack>
            {
                isError && (error)
            }

            <ButtonNextComponent
                loading={isLoading}
                label={t('btn-active')}
                disabled={email === '' || emailAcademy === '' || password === ''}
                onClick={async () => {
                    setIsLoading(true);
                    setErrorMail('');
                    setErrorMailAcademy('');
                    setIsError(false);
                    setError(<></>);

                    if (!isValidEmail(email)) {
                        setErrorMail(notValid);
                        setIsError(true);
                        setError(<AlertComponent title={resetError} severity="error" />);
                        setIsLoading(false);
                        return;
                    }
                    if (!isValidEmail(emailAcademy)) {
                        setErrorMailAcademy(notValid);
                        setIsError(true);
                        setError(<AlertComponent title={resetError} severity="error" />);
                        setIsLoading(false);
                        return;
                    }
                    if (!isValidDandelaAcademyEmail(emailAcademy)) {
                        setErrorMailAcademy(notDandela);
                        setIsError(true);
                        setError(<AlertComponent title={resetError} severity="error" />);
                        setIsLoading(false);
                        return;
                    }
                    try {
                        var _user = await ClassUser.getByEmail(email);
                        if (!_user) {
                            setErrorMail(notFound);
                            setIsError(true);
                            setError(<AlertComponent title={resetError} severity="error" />);
                            return;
                        }
                        _user = await ClassUser.getByEmailAcademy(emailAcademy);
                        if (!_user) {
                            setErrorMailAcademy(notFound);
                            setIsError(true);
                            setError(<AlertComponent title={resetError} severity="error" />);
                            return;
                        }
                        //console.log('USEEEER', _user);
                        if(!_user.activated) {
                            const data = {activated:!_user.activated};
                            console.log("STATUS", _user.status);
                            if(_user.status === ClassUser.STATUS.MUST_ACTIVATE) {
                                data.status = ClassUser.STATUS.FIRST_CONNEXION;
                            }
                            console.log("STATUS DATA", data);
                            await ClassUser.update(_user.uid, data);
                        }
                        //console.log('ACTIVATED');
                        const result = await login(email, password);
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
                }}
            />
            <Typography sx={{ color: ClassColor.GREY_LIGHT }}>
                {t('want-connect')} <Link href={PAGE_LOGIN} style={{ color: primary.main }}>{t('btn-connect')}</Link>
            </Typography>
        </Stack>
    </LoginPageWrapper>);
}