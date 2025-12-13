import React, { useState } from "react";
import LoginPageWrapper from "../wrappers/LoginPageWrapper";
import { Alert, Button, Stack, Typography } from "@mui/material";
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
        return (<Stack>
            <Typography>{title}</Typography>
            <Typography><b>{email}</b></Typography>
        </Stack>)
    }
    return (<LoginPageWrapper>
        <Stack spacing={3} sx={{ color: "var(--font-color)", width: '100%', py: 3, px: { xs: 3, sm: 5 }, background: 'var(--card-color)', borderRadius: '5px' }}>
            <Stack spacing={0.5} direction={'column'} justifyContent={'space-between'} alignItems={'start'}>
                <Typography variant="h4">
                    {t('title')}
                </Typography>
                <Typography variant="caption" sx={{ color: ClassColor.GREY_LIGHT }}>
                    {t('subtitle')}
                </Typography>
            </Stack>
            <Stack spacing={1}>
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
                />
            </Stack>
            {
                isError && (<Alert severity="error">{error}</Alert>)
            }
            {
                isSuccess && (<Alert severity="success">
                    {success}
                </Alert>)
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
                !isSuccess && <Typography variant="caption" sx={{ color: ClassColor.GREY_LIGHT }}>
                    {t('want-connect')} <Link href={PAGE_LOGIN} style={{ color: primary.main }}>
                    <p className="link">{textLogin}</p>
                    </Link>
                </Typography>
            }
            {
                isSuccess && <Button
                    label={""}
                    onClick={() => {
                        router.push(PAGE_LOGIN);
                    }}
                >{t('btn-home')}</Button>
            }
        </Stack>
    </LoginPageWrapper>);
}