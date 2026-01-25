import React, { useState } from "react";
import { Alert, Stack, Typography } from "@mui/material";
import { IconEmail } from "@/assets/icons/IconsComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { ClassColor } from "@/classes/ClassColor";
import Link from "next/link";
import { PAGE_LOGIN } from "@/contexts/constants/constants_pages";
import { isValidEmail } from "@/contexts/functions";
import { ClassUser } from "@/classes/users/ClassUser";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { NS_FORGOT_PASSWORD } from "@/contexts/i18n/settings";
import FieldComponent from "@/components/elements/FieldComponent";
import ButtonConfirm from "@/components/dashboard/elements/ButtonConfirm";
import LoginPageWrapper from "@/components/wrappers/LoginPageWrapper";
export default function ForgotPasswordComponent({ setIsLogin = null }) {
    const { t } = useTranslation([NS_FORGOT_PASSWORD]);

    const textLogin = t('login');
    const textSuccess = t('success-message');
    const errors = t('errors', { returnObjects: true });
    const { main = "",
        notValid = errors['email-not-valid'],
        notDandela = errors['email-not-dandela-academy'],
        notFound = errors['email-not-found'] || '',
        resetError = errors['reset-failed'] } = errors;
    //console.log("ERROORS", errors);
    const { theme } = useThemeMode();
    const { text, primary } = theme.palette;
    const { user, login, logout, sendResetPassword } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMail, setErrorMail] = useState('');
    const [error, setError] = useState('');
    const [isError, setIsError] = useState(false);
    const [success, setSuccess] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const AlertEmailContent = ({ title, email }) => {
        return (<Stack spacing={0.5}>
            <Typography sx={{ fontWeight: 500 }}>{title}</Typography>
            <Typography 
                sx={{ 
                    fontWeight: 600,
                    color: primary.main,
                    wordBreak: 'break-word'
                }}>
                {email}
            </Typography>
        </Stack>)
    }
    return (<LoginPageWrapper>
        <Stack 
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
            <Stack spacing={0.5} direction={'column'} justifyContent={'space-between'} alignItems={'start'}>
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
            <Stack spacing={2}>
                <FieldComponent
                    label={t('label-email')}
                    name='email'
                    type="email"
                    disabled={isLoading || isSuccess}
                    icon={<IconEmail width={20} />}
                    placeholder={t('placeholder-email')}
                    value={email}
                    onChange={(e) => {
                        e.preventDefault();
                        setEmail(e.target.value);
                        setErrorMail('');
                        setError(<></>);
                        setIsError(false);
                    }}
                    onClear={() => {
                        setEmail('');
                        setErrorMail('');
                        setError(<></>);
                        setIsError(false);
                    }}
                    error={errorMail}
                    fullWidth
                />
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
                        <Alert 
                            severity="error"
                            sx={{
                                borderRadius: '12px',
                                '& .MuiAlert-icon': {
                                    alignItems: 'center'
                                }
                            }}>
                            {error}
                        </Alert>
                    </Stack>
                )
            }
            {
                isSuccess && (
                    <Stack 
                        sx={{ 
                            animation: 'fadeIn 0.3s ease-in-out',
                            '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'translateY(-10px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}>
                        <Alert 
                            severity="success"
                            sx={{
                                borderRadius: '12px',
                                '& .MuiAlert-icon': {
                                    alignItems: 'center'
                                }
                            }}>
                            {success}
                        </Alert>
                    </Stack>
                )
            }

            {
                !isSuccess && <ButtonConfirm
                    loading={isLoading}
                    label={t('btn-reset-password')}
                    disabled={email === '' || isError || errorMail !== ''}
                    onClick={async (e) => {
                        setErrorMail('');
                        setIsError(false);
                        setError(<></>);
                        setIsLoading(true);
                        if (!isValidEmail(email)) {
                            setErrorMail(notValid);
                            setIsError(true);
                            setError(resetError);
                            setIsLoading(false);
                            return;
                        }
                        /*
                        if (!isValidDandelaAcademyEmail(email)) {
                            setErrorMail(notDandela);
                            setIsError(true);
                            setError(resetError);
                            setIsLoading(false);
                            return;
                        }
                        */
                        const _user = await ClassUser.getByEmailAcademy(email);
                        //const _exists = await _user.alreadyExist();
                        if (!_user) {
                            setIsError(true);
                            setError(<AlertEmailContent title={notFound} email={email} />);
                            setIsLoading(false);
                            return;
                        }
                        try {
                            console.log("USSSSR", _user)
                            await sendResetPassword(e, _user.email);
                            setIsSuccess(true);
                            setSuccess(<AlertEmailContent title={textSuccess} email={_user.email} />)
                            setIsError(false);
                            //setSuccess(<Typography>{`L'email de réinitialisation a été envoyé avec succès à : `}<b>{_user.email}</b></Typography>);
                        } catch (_) {
                            setIsError(true);
                            setError(main);
                            setIsSuccess(false);
                            setSuccess(<></>);
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                />
            }
            {
                !isSuccess && <Typography 
                    variant="caption" 
                    sx={{ 
                        color: ClassColor.GREY_LIGHT,
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        pt: 1
                    }}>
                    {t('want-connect')}{' '}
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
                            {textLogin}
                        </Typography>
                    </Link>
                </Typography>
            }
            {
                isSuccess && <ButtonConfirm
                    label={t('btn-home')}
                    onClick={() => {
                        router.push(PAGE_LOGIN);
                    }}
                    sx={{
                        mt: 2
                    }}
                />
            }
        </Stack>
    </LoginPageWrapper>);
}