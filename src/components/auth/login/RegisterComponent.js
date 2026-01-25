import React, { useState } from "react";
import { Alert, Button, Chip, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { IconEmail, IconGoogleColor } from "@/assets/icons/IconsComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import Link from "next/link";
import { PAGE_DASHBOARD_HOME, PAGE_FORGOT_PASSWORD, PAGE_LOGIN, PAGE_REGISTER, PAGE_TERMS_PRIVACY, PAGE_TERMS_USAGE } from "@/contexts/constants/constants_pages";
import { ClassColor } from "@/classes/ClassColor";
import { Trans, useTranslation } from "react-i18next";
import { NS_LOGIN, NS_REGISTER } from "@/contexts/i18n/settings";
import { useRouter } from "next/navigation";
import { isValidEmail, isValidPassword } from "@/contexts/functions";
import { ClassUser } from "@/classes/users/ClassUser";
import { where } from "firebase/firestore";
import FieldComponent from "@/components/elements/FieldComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";

const ShowValidPassword = ({ isValid = false, text = "" }) => {
    const color = isValid ? '#10b981' : '#ef4444';
    return (<Stack 
        direction={'row'} 
        spacing={1.5} 
        alignItems={'center'}
        sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
                transform: 'translateX(4px)'
            }
        }}>
        <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 8px ${color}40`,
            transition: 'all 0.2s ease'
        }} />
        <Typography 
            variant="caption" 
            sx={{ 
                fontSize: '0.85rem', 
                fontWeight: isValid ? 500 : 400, 
                color: color,
                transition: 'all 0.2s ease'
            }}>
            {text}
        </Typography>
    </Stack>)
}
export default function RegisterComponent() {
    /*
        "password": "Mot de passe",
    "password_repeat": "Répéter le mot de passe",
    "password_placeholder": "Saisis un mot de passe",
    "password_repeat_placeholder": "Répète le mot de passe",
    */
    const { t } = useTranslation([NS_REGISTER, ClassUser.NS_COLLECTION]);
    const labels = {
        email: t('email', { ns: ClassUser.NS_COLLECTION }),
        email_placeholder: t('email_placeholder', { ns: ClassUser.NS_COLLECTION }),
        password: t('password', { ns: ClassUser.NS_COLLECTION }),
        password_placeholder: t('password_placeholder', { ns: ClassUser.NS_COLLECTION }),
        password_repeat: t('password_repeat', { ns: ClassUser.NS_COLLECTION }),
        password_repeat_placeholder: t('password_repeat_placeholder', { ns: ClassUser.NS_COLLECTION }),
    }
    const passwordLabel = t('password');
    const router = useRouter();
    const { theme } = useThemeMode();
    const { text, primary } = theme.palette;
    const { createAccount,login, logout, signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [form, setForm] = useState({
        email: '',
        password: '',
        password_repeat: '',
    })

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
    } = errorTranslate;

    const onChangeValue = (e) => {
        const { value, name } = e.target;
        setErrors(prev => ({
            ...prev,
            main: '',
            [name]: ''
        }));
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
        console.log("ERRORS", errors)
    }
    const onClearValue = (name) => {
        setErrors(prev => ({
            ...prev,
            main: '',
            [name]: ''
        }));
        setForm(prev => ({
            ...prev,
            [name]: ''
        }))
    }

    const onSubmit = async (e) => {
        //e.preventDefault();
        setIsLoading(true);
        try {
            const _errors = {};
            setErrors(_errors);
            const status = await isValidPassword(form.password);
            setValidPassword(status);
            if (!status.isValid) {
                _errors.password = notValidPassword || '';
            } else {
                if (form.password !== form.password_repeat) {
                    _errors.password_repeat = notValidPasswordRepeat || '';
                }
            }
            console.log("valid password", status);
            if (!isValidEmail(form.email)) {
                _errors.email = notValid || '';
                //return;
            }

            if (Object.keys(_errors).length > 0) {
                _errors.main = errorMain;
                setErrors(prev => ({
                    ...prev,
                    ..._errors,
                }));
                return;
            }
            const countUsers = await ClassUser.count([where("email", "==", form.email.toLocaleLowerCase().trim())]);
            if (countUsers > 0) {
                _errors.email = emailAlreadyExists;
                _errors.main = errorMain;
                setErrors(_errors);
                return;
            }
            await createAccount(e,form.email, form.password);
            router.replace(PAGE_DASHBOARD_HOME);
        } catch (error) {
            console.log("ERRROR", error);
            setErrors({ main: main })
        } finally {
            setIsLoading(false);
        }
    }
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
        <Stack spacing={3} direction={'row'} justifyContent={'space-between'} alignItems={'start'}>
            <Stack sx={{ width: '70%' }} spacing={0.5}>
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
            <Link href={PAGE_LOGIN} style={{ textDecoration: 'none' }}>
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
        {
            isLoading && <Stack 
                alignItems={'center'} 
                spacing={2}
                sx={{
                    py: 4,
                    animation: 'fadeIn 0.3s ease-in-out',
                    '@keyframes fadeIn': {
                        from: { opacity: 0 },
                        to: { opacity: 1 }
                    }
                }}>
                <CircularProgress size={40} />
                <Typography 
                    sx={{ 
                        color: 'var(--grey-light)',
                        fontWeight: 500
                    }}>
                    {t('processing')}
                </Typography>
            </Stack>
        }
        {
            !isLoading && <Stack spacing={3} sx={{ width: '100%' }}>
                <Stack sx={{ width: '100%' }} spacing={2.5}>
                    <FieldComponent
                        label={labels.email}
                        name='email'
                        type="email"
                        disabled={isLoading || isErrorActivate}
                        icon={<IconEmail width={20} />}
                        placeholder={labels.email_placeholder}
                        value={form.email}
                        onChange={onChangeValue}
                        onClear={() => onClearValue('email')}
                        error={errors.email}
                        fullWidth
                    />
                    <FieldComponent
                        label={labels.password}
                        name='password'
                        type="password"
                        placeholder={labels.password_placeholder}
                        value={form.password}
                        disabled={isLoading}
                        onChange={onChangeValue}
                        onClear={() => onClearValue('password')}
                        error={errors.password}
                        fullWidth
                    />
                    <FieldComponent
                        label={labels.password_repeat}
                        name='password_repeat'
                        type="password"
                        placeholder={labels.password_repeat_placeholder}
                        value={form.password_repeat}
                        disabled={isLoading || isErrorActivate}
                        onChange={onChangeValue}
                        onClear={() => onClearValue('password_repeat')}
                        error={errors.password_repeat}
                        fullWidth
                    />
                    {
                        errors.password && <Stack 
                            sx={{ 
                                px: 2, 
                                py: 1.5,
                                background: 'rgba(0,0,0,0.02)',
                                borderRadius: '12px',
                                border: '1px solid var(--card-border)',
                                animation: 'slideDown 0.3s ease-in-out',
                                '@keyframes slideDown': {
                                    from: { opacity: 0, transform: 'translateY(-10px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' }
                                }
                            }}
                            spacing={1}>
                            <ShowValidPassword isValid={validPassword.containsLowercaseLetter} text={"Minimum 1 minuscule"} />
                            <ShowValidPassword isValid={validPassword.containsUppercaseLetter} text={"Minimum 1 majuscule"} />
                            <ShowValidPassword isValid={validPassword.containsNumericCharacter} text={"Minimum 1 chiffre"} />
                            <ShowValidPassword isValid={validPassword.containsNonAlphanumericCharacter} text={"Minimum 1 caractère spécial"} />
                            <ShowValidPassword isValid={validPassword.meetsMinPasswordLength} text={"Minimum 6 caractères"} />
                            <ShowValidPassword isValid={validPassword.meetsMaxPasswordLength} text={"Maximum 4096 caractères"} />
                        </Stack>
                    }
                </Stack>
                {
                    errors.main && (
                        <Stack 
                            sx={{ 
                                animation: 'fadeIn 0.3s ease-in-out',
                                '@keyframes fadeIn': {
                                    from: { opacity: 0, transform: 'translateY(-10px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' }
                                }
                            }}>
                            <Alert 
                                severity="error"
                                sx={{
                                    borderRadius: '12px',
                                    '& .MuiAlert-icon': {
                                        alignItems: 'center'
                                    }
                                }}>
                                <Stack sx={{ height: '100%', fontWeight: '500' }} justifyContent={'center'}>
                                    {errors.main}
                                </Stack>
                            </Alert>
                        </Stack>
                    )
                }
                <Stack spacing={2.5}>
                <ButtonConfirm
                    loading={isLoading}
                    label={t('btn-create')}
                    disabled={!form.email || !form.password || !form.password_repeat || isLoading || errors.main}
                    onClick={onSubmit}
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
                <Typography 
                    variant="caption" 
                    sx={{
                        textAlign:'justify',
                        color: 'var(--grey-light)',
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                        px: 1,
                        '& a': {
                            color: primary.main, 
                            cursor:'pointer',
                            fontWeight: 500,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: primary.dark,
                                textDecoration: 'underline'
                            }
                        }
                    }}>
                    <Trans
                    t={t}
                    i18nKey={'terms'}
                    values={{
                        usage: PAGE_TERMS_USAGE,
                        privacy: PAGE_TERMS_PRIVACY
                    }}
                    components={{
                        a:<a />
                    }}
                    />
                </Typography>
                </Stack>
                
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: ClassColor.GREY_LIGHT,
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        pt: 1
                    }}>
                    {t('want-create')}{' '}
                    <Link href={PAGE_LOGIN} style={{ textDecoration: 'none' }}>
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
            </Stack>
        }
    </Stack>);
}