import React, { useState } from "react";
import { Alert, Button, Divider, Stack, Typography } from "@mui/material";
import { IconEmail, IconGoogleColor } from "@/assets/icons/IconsComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { set } from "zod";
import { useThemeMode } from "@/contexts/ThemeProvider";
import Link from "next/link";
import { PAGE_ACTIVE_ACCOUNT, PAGE_DASHBOARD_HOME, PAGE_FORGOT_PASSWORD, PAGE_REGISTER } from "@/contexts/constants/constants_pages";
import { ClassColor } from "@/classes/ClassColor";
import { useTranslation } from "react-i18next";
import { NS_LOGIN } from "@/contexts/i18n/settings";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/contexts/functions";
import { ClassUser } from "@/classes/users/ClassUser";
import FieldComponent from "@/components/elements/FieldComponent";
import AlertComponent from "@/components/elements/AlertComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
export default function LoginComponent() {
    const router = useRouter();
    const { t } = useTranslation([NS_LOGIN, ClassUser.NS_COLLECTION]);
    const labels = {
        email: t('email', { ns: ClassUser.NS_COLLECTION }),
        email_placeholder: t('email_placeholder', { ns: ClassUser.NS_COLLECTION }),
        password: t('password', { ns: ClassUser.NS_COLLECTION }),
        password_placeholder: t('password_placeholder', { ns: ClassUser.NS_COLLECTION }),
    }
    const { theme } = useThemeMode();
    const { text, primary } = theme.palette;
    const { user, login, logout, signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMail, setErrorMail] = useState('');
    const [isErrorActivate, setIsErrorActivate] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(<></>);
    const [isLoading, setIsLoading] = useState(false);

    const errors = t('errors', { returnObjects: true });
    const { main = "",
        notValid = errors['email-not-valid'],
        notDandela = errors['email-not-dandela-academy'],
        notFound = errors['email-not-found'] || '',
        notActivatedText = errors['email-not-activated'] || '',
        resetError = errors['reset-failed'] } = errors;
    return (<Stack 
        spacing={3} 
        sx={{ 
            color: "var(--font-color)", 
            width: '100%', 
            py: { xs: 3, sm: 4 }, 
            px: { xs: 3, sm: 5 }, 
            background: 'var(--card-color)', 
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
            }
        }}>
        <Stack direction={'row'} spacing={3} justifyContent={'space-between'} alignItems={'center'}>
            <Stack spacing={0.5}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, var(--font-color) 0%, var(--font-color) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                    {t('title')}
                </Typography>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: 'var(--grey-light)',
                        fontSize: '0.9rem'
                    }}>
                    {t('subtitle')}
                </Typography>
            </Stack>
            <Link href={PAGE_REGISTER} style={{ textDecoration: 'none' }}>
                <Typography 
                    className="link" 
                    sx={{ 
                        color: primary.main,
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            color: primary.dark,
                            transform: 'translateY(-1px)'
                        }
                    }}>
                    {t('create-account')}
                </Typography>
            </Link>
        </Stack>
        <Stack spacing={0} alignItems={'end'} sx={{ width: '100%' }}>
            <Stack sx={{ width: '100%' }} spacing={2.5}>
                <FieldComponent
                    label={labels.email}
                    name='email'
                    type="email"
                    disabled={isLoading || isErrorActivate}
                    icon={<IconEmail width={20} />}
                    placeholder={labels.email_placeholder}
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
                    label={labels.password}
                    name='password'
                    type="password"
                    placeholder={labels.password_placeholder}
                    value={password}
                    disabled={isLoading || isErrorActivate}
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
            {
                !isLoading && <Link 
                    href={PAGE_FORGOT_PASSWORD} 
                    style={{ textDecoration: 'none', marginTop: '4px' }}>
                    <Typography 
                        className="link" 
                        sx={{ 
                            color: ClassColor.GREY_LIGHT,
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: primary.main,
                                transform: 'translateX(2px)'
                            }
                        }}>
                        {t('btn-forgot-password')}
                    </Typography>
                </Link>
            }
        </Stack>
        {
            isError && (
                <Stack 
                    sx={{ 
                        animation: 'fadeIn 0.3s ease-in-out',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'translateY(-10px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}>
                    {error}
                </Stack>
            )
        }

        {
            !isErrorActivate && !isLoading && <Stack spacing={2.5}>
                <ButtonConfirm
                loading={isLoading}
                label={t('btn-connect')}
                disabled={email === '' || password === '' || isErrorActivate}
                onClick={async () => {
                    setIsLoading(true);
                    setIsErrorActivate('');
                    setIsError(false);
                    setError(<></>);

                    if (!isValidEmail(email)) {
                        setErrorMail(notValid);
                        setIsError(true);
                        setError(<AlertComponent title={resetError} severity="error" />);
                        setIsLoading(false);
                        return;
                    }
                    try {
                        const _user = await ClassUser.getByEmail(email);
                        const _user_academy = await ClassUser.getByEmailAcademy(email);
                        if (!_user && !_user_academy) {
                            setIsError(true);
                            setError(<AlertComponent title={notFound} severity="error" />);
                            return;
                        }
                        const final_user = _user || _user_academy;
                        //notActivatedText
                        /*
                        if (!_user.activated) {
                            setIsErrorActivate(true);
                            setIsError(true);
                            setError(<AlertComponent title={notActivatedText} subtitle={<Link style={{ fontWeight: 'bold', color: primary.main }} href={PAGE_ACTIVE_ACCOUNT}>{t('subtitle')}</Link>
                            } severity="error" />);
                            return;
                        }
                        */
                        const result = await login(final_user.email, password);
                        const { success, error } = result;
                        console.log('login result', result);
                        if (!success) {
                            setIsError(true);
                            setError(<AlertComponent title={error.message} severity="error" />);
                            return;
                        }
                        router.push(PAGE_DASHBOARD_HOME);
                    } catch (_) {
                        setError(<AlertComponent title={main} severity="error" />);
                    } finally {
                        setIsLoading(false);
                    }
                }}
            />
                    <Divider 
                        sx={{ 
                            '&::before, &::after': {
                                borderColor: 'var(--card-border)',
                                opacity: 0.3
                            },
                            my: 1
                        }}>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: 'var(--grey-light)',
                                px: 2,
                                fontSize: '0.8rem'
                            }}>
                            {t('other-method')}
                        </Typography>
                    </Divider>
                <Button 
                variant={'outlined'} 
                size="medium"
                onClick={()=>signIn('google')}
                sx={{
                    minHeight:'44px', 
                    border:'1px solid var(--card-border)', 
                    borderRadius:'12px', 
                    textTransform:'none',
                    color:'var(--font-color)',
                    fontWeight: 500,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: primary.main,
                        backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    },
                    '&:active': {
                        transform: 'translateY(0)'
                    }
                }}
                startIcon={<IconGoogleColor height={22} />}>
                    {"Continuer avec Google"}
                </Button>
            </Stack>
        }


        {
            !isErrorActivate && !isLoading && <Typography 
                variant="caption" 
                sx={{ 
                    color: ClassColor.GREY_LIGHT,
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    pt: 1
                }}>
                {t('want-create')}{' '}
                <Link href={PAGE_REGISTER} style={{ textDecoration: 'none' }}>
                    <Typography 
                        component="span"
                        className="link" 
                        sx={{ 
                            color: primary.main,
                            fontWeight: 600,
                            display: 'inline',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: primary.dark,
                                textDecoration: 'underline'
                            }
                        }}>
                        {t('create-account')}
                    </Typography>
                </Link>
            </Typography>
        }

    </Stack>);
}