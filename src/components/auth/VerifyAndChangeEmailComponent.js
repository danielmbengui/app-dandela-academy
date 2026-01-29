import React, { useEffect, useState } from "react";
import LoginPageWrapper from "../wrappers/LoginPageWrapper";
import { Alert, Button, CircularProgress, Stack, Typography } from "@mui/material";
import TextFieldComponent from "../elements/TextFieldComponent";
import { IconEmail } from "@/assets/icons/IconsComponent";
import TextFieldPasswordComponent from "../elements/TextFieldPasswordComponent";
import ButtonNextComponent from "../elements/ButtonNextComponent";
import { useAuth } from "@/contexts/AuthProvider";
import { set } from "zod";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { ClassColor } from "@/classes/ClassColor";
import Link from "next/link";
import { PAGE_DASHBOARD_HOME, PAGE_LOGIN } from "@/contexts/constants/constants_pages";
import FieldComponent from "../elements/FieldComponent";
import { isValidDandelaAcademyEmail, isValidEmail } from "@/contexts/functions";
import { ClassUser } from "@/classes/users/ClassUser";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { NS_FORGOT_PASSWORD, NS_BUTTONS } from "@/contexts/i18n/settings";
import { getValueAsType } from "framer-motion";
import { getTranslations } from "@/contexts/i18n/init";
import AlertComponent from "../elements/AlertComponent";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import Preloader from "../shared/Preloader";
import { auth } from "@/contexts/firebase/config";
import OtherPageWrapper from "../wrappers/OtherPageWrapper";
import { applyActionCode } from "firebase/auth";

const StatusComponent = ({ status, actionConfirm = null }) => {
    const { t } = useTranslation([NS_FORGOT_PASSWORD, NS_BUTTONS]);
    const router = useRouter();
    const { user, sendVerification } = useAuth();
    var component = <>
        {
            <ButtonConfirm
                label={"Vérifier mon adresse email"}
                onClick={() => {
                    if (actionConfirm) {
                        actionConfirm();
                    }
                }}
            >{t('btn-home')}</ButtonConfirm>
        }
    </>;
    var title = "Changer l'adresse email du compte";
    var subtitle = `Active ton compte en vérifiant ton adresse email : ${user?.email}.`;
    if (status === "error") {
        title = "Lien invalide";
        subtitle = "Ce lien n'existe pas";
        component = (<ButtonConfirm label={t('see-app', { ns: NS_BUTTONS })} style={{ minWidth: '200px' }} onClick={() => router.replace(PAGE_DASHBOARD_HOME)} />);
    }
    if (status === "expired") {
        title = `Lien expiré`;
        subtitle = `L'email est expiré ou a déjà été utilisé`;
        component = (<ButtonConfirm
            label={`Renvoyer un lien`}
            style={{ minWidth: '200px' }}
            onClick={async () => {
                await sendVerification();
                router.replace(PAGE_DASHBOARD_HOME);
            }}
        />);
    }
    if (status === "checking") {
        component = (<>
            <CircularProgress />
            <Typography>{`Vérification du lien...`}</Typography>
        </>)
    }
    if (status === "applying") {
        component = (<>
            <CircularProgress />
            <Typography>{`Validation en cours...`}</Typography>
        </>)
    }
    if (status === 'verified') {
        component = (<>
            <AlertComponent severity="success" subtitle={'Ton adresse email a été validée avec succès !'} />
            <ButtonConfirm label={t('continuer-dashboard', { ns: NS_BUTTONS })} style={{ minWidth: '200px' }} onClick={() => router.replace(PAGE_DASHBOARD_HOME)} />
        </>);
    }
    return (<CardComponent title={title} subtitle={subtitle}>
        <Stack spacing={1} alignItems={'center'} justifyContent={'center'}>
            {component}
        </Stack>
    </CardComponent>)
}
const CardComponent = ({ children, title = "", subtitle = "" }) => {
    return (<Stack spacing={3} alignItems={'center'} sx={{ color: "var(--font-color)", width: '100%', py: 3, px: { xs: 3, sm: 5 }, background: 'var(--card-color)', borderRadius: '5px' }}>
        <Stack sx={{ textAlign: 'center' }} spacing={1} direction={'column'} justifyContent={'center'} alignItems={'center'}>
            <Typography variant="h4">
                {title}
            </Typography>
            <Typography variant="caption" sx={{ color: ClassColor.GREY_LIGHT }}>
                {subtitle}
            </Typography>
        </Stack>
        {
            children
        }
    </Stack>)
}
export default function VerifyAndChangeEmailComponent() {
    const { t } = useTranslation([NS_FORGOT_PASSWORD]);
    const { user, isLoading, updateOneUser } = useAuth();
    const router = useRouter();
    const sp = useSearchParams();

    const [status, setStatus] = useState("ready");
    // checking | ready | applying | success | error
    const [error, setError] = useState("");
    //const [isLoading, setIsLoading] = useState(false);

    const mode = sp.get("mode");
    const oobCode = sp.get("oobCode");
    //const returnTo = sp.get("returnTo") || "/dashboard";
    const raw = sp.get("returnTo") || PAGE_DASHBOARD_HOME;
    const returnTo = raw.startsWith("/") ? raw : PAGE_DASHBOARD_HOME;
    const expirationDate = sp.get("expiration") || new Date();
    // var now = new Date();
    //now = now.setDate(now.getMinutes),
    //   now.setMinutes(now.getMinutes() + (20*60));  
    useEffect(() => {
        /*
        const now = new Date();
        if (now >= expirationDate) {
            setStatus('expired');
        }
        
        if (!isLoading && !user.email_verified) {
            setStatus('verified')
        }
        */
        // 1) validation du lien
        /*
        if (!mode || !oobCode) {
            setStatus("error");
            setError("Lien invalide : paramètres manquants.");
            return;
        }
        if (mode !== "verifyEmail") {
            setStatus("error");
            setError(`Mode non supporté: ${mode}`);
            return;
        }
        */

        // 2) on affiche un bouton "Confirmer"
        // setStatus("ready");
    }, [mode, oobCode, isLoading, user]);
    const onSubmit = async () => {
        try {
            setStatus("applying");
            setError("");
            //const auth = getAuth();
            
            // ✅ C’EST ÇA qui “valide” le clic sur le lien et met emailVerified à jour côté Firebase
            await applyActionCode(auth, oobCode);
            const _user = user?.clone();
            _user.update({ email: "daniel.mbengui@gmail.com", email_verified:true });
            await updateOneUser();
            // Optionnel : si l'utilisateur est connecté dans ce navigateur, on reload pour avoir emailVerified à jour
            if (auth.currentUser) {
                await auth.currentUser.reload();
            }
            setStatus("verified");
            //router.replace(returnTo);
            //router.replace(PAGE_DASHBOARD_HOME);
        } catch (e) {
            setStatus("error");
            setError(e?.message || "Impossible de valider ce lien.");
            console.log("ERRRROR", e);
        }
    };
    if (isLoading) {
        return (<Preloader />)
    }

    // if (status === "checking") return <div style={{ padding: 20 }}>Vérification du lien…</div>;

    /*
        if (status === "error") {
            return (
                <div style={{ padding: 20 }}>
                    <h2>Erreur</h2>
                    <p>{error}</p>
                </div>
            );
        }
        

    if (status === "ready") {
        return (
            <div style={{ padding: 20 }}>
                <h2>Confirmer la vérification de ton e-mail</h2>
                <h2>Seu e-mail foi verificado</h2>
                <p>Clique pour valider ton adresse e-mail.</p>
                <p>Faça login com a sua nova conta {expirationDate.toString()}</p>
                <button onClick={confirm} style={{ padding: "10px 16px" }}>
                    Confirmer
                </button>
                <button onClick={confirm} style={{ padding: "10px 16px" }}>
                    Continuar
                </button>
                <h2>Sua solicitação para verificar o e-mail expirou ou o link já foi usado</h2>
                <p>Verifique seu e-mail novamente</p>
                <button onClick={confirm} style={{ padding: "10px 16px" }}>
                    Continuar
                </button>
            </div>
        );
    }
*/
    return (<OtherPageWrapper>
        <StatusComponent status={status} actionConfirm={onSubmit} />
    </OtherPageWrapper>);
}