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
import { PAGE_ACTIVE_ACCOUNT, PAGE_DASHBOARD_HOME, PAGE_FORGOT_PASSWORD, PAGE_LOGIN, PAGE_REGISTER } from "@/contexts/constants/constants_pages";
import { ClassColor } from "@/classes/ClassColor";
import { Trans, useTranslation } from "react-i18next";
import { NS_HOME, NS_LOGIN } from "@/contexts/i18n/settings";
import FieldComponent from "../elements/FieldComponent";
import { useRouter } from "next/navigation";
import { isValidEmail, translateWithVars } from "@/contexts/functions";
import AlertComponent from "../elements/AlertComponent";
import { ClassUser } from "@/classes/users/ClassUser";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import AlreadyConnectedComponent from "../wrappers/AlreadyConnectedComponent";
const NotConnectedComponent = ({ title = "", subtitle = "" }) => {
    const { t } = useTranslation([NS_HOME]);
    const {message, ['btn-login']: btnLogin, ['btn-create']: btnCreate } = t('not-connected', { returnObjects: true });
    //"messsage":"Tu n’es pas connecté(e). Choisis une option pour continuer.",
    //"btn-login":"Me connecter",
    //"btn-create":"Créer un compte"
    return (<Stack spacing={3} sx={{ color: 'var(--font-color)', width: '100%', py: 3, px: { xs: 3, sm: 5 }, background: 'var(--card-color)', borderRadius: '5px' }}>
        <Stack spacing={0.5} alignItems={'center'} sx={{ textAlign: 'center' }}>
            <Typography variant="h4">
                {title}
            </Typography>
            <Typography variant="caption" sx={{ color: ClassColor.GREY_LIGHT }}>
                {subtitle}
            </Typography>
        </Stack>
        <Stack spacing={2} alignItems={'center'} sx={{ width: '100%' }}>
            <Typography>{message}</Typography>
            <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'center'}>
                <Link href={PAGE_LOGIN}>
                    <ButtonCancel
                        label={btnLogin}
                    />
                </Link>
                <Link href={PAGE_REGISTER}>
                    <ButtonConfirm
                        label={btnCreate}
                    />
                </Link>
            </Stack>
        </Stack>
    </Stack>)
}
/*
const AlreadyConnectedComponent = ({ title = "", subtitle = "" }) => {
    const { t } = useTranslation([NS_HOME]);
    const { ['btn-dashboard']: btnDashboard } = t('already-connected', { returnObjects: true });
    const { user } = useAuth();
    return (<Stack spacing={3} sx={{ color: "var(--font-color)", width: '100%', py: 3, px: { xs: 3, sm: 5 }, background: 'var(--card-color)', borderRadius: '5px' }}>
        <Stack spacing={0.5} alignItems={'center'} sx={{ textAlign: 'center' }}>
            <Typography variant="h4">
                {title}
            </Typography>
            <Typography variant="caption">
                {subtitle}
            </Typography>
        </Stack>
        <Stack spacing={1} alignItems={'center'} sx={{ width: '100%', textAlign: 'center' }}>
            <Trans
                ns={NS_HOME}
                i18nKey="already-connected.message"
                values={{ email: user.email }}
                components={{
                    div: <div style={{ display: 'block', lineHeight: '1.15rem' }}></div>,
                    b: <strong></strong>,
                }}
            />
            <Link href={PAGE_DASHBOARD_HOME}>
                <ButtonConfirm
                    //loading={isLoading}
                    label={btnDashboard}
                    onClick={async () => {
                        //router.push(PAGE_DASHBOARD_HOME);
                    }}
                />
            </Link>
        </Stack>
    </Stack>)
}
*/
export default function HomeComponent() {
    const router = useRouter();

    const { theme } = useThemeMode();
    const { text, primary } = theme.palette;
    const { user, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMail, setErrorMail] = useState('');
    const [isErrorActivate, setIsErrorActivate] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(<></>);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation([NS_HOME]);
    const errors = t('errors', { returnObjects: true });
    const { main = "",
        notValid = errors['email-not-valid'],
        notDandela = errors['email-not-dandela-academy'],
        notFound = errors['email-not-found'] || '',
        notActivatedText = errors['email-not-activated'] || '',
        resetError = errors['reset-failed'] } = errors;
    return (<NotConnectedComponent title={t('title')} subtitle={t('subtitle')} />);
}