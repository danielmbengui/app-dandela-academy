"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuth, applyActionCode } from "firebase/auth";
import VerifyEmailComponent from "@/components/auth/VerifyEmailComponent";
import NotFoundComponent from "@/components/not-found/NotFoundComponent";

const MODES_AUTH = [
    "verifyEmail",
    "resetPassword",
    "recoverEmail",
    "verifyAndChangeEmail",
    "signIn",
    "login",
    "register",
];
export default function AuthPage() {
    const router = useRouter();
    const sp = useSearchParams();

    const [status, setStatus] = useState("checking");
    // checking | ready | applying | success | error
    const [error, setError] = useState("");

    const mode = sp.get("mode");
    const oobCode = sp.get("oobCode");
    //const returnTo = sp.get("returnTo") || "/dashboard";
    const raw = sp.get("returnTo") || "/dashboard";
    const returnTo = raw.startsWith("/") ? raw : "/dashboard";

    useEffect(() => {
        // 1) validation du lien
        if (!mode || !MODES_AUTH.includes(mode)) {
            setStatus("error");
            setError("Lien invalide : paramètres manquants.");
            return;
        }
        if (!oobCode) {
            setStatus("error");
            setError("Lien invalide : paramètres manquants.");
            return;
        }
        if (mode !== "verifyEmail") {
            setStatus("error");
            setError(`Mode non supporté: ${mode}`);
            return;
        }

        // 2) on affiche un bouton "Confirmer"
        setStatus("ready");
    }, [mode, oobCode]);

    const confirm = async () => {
        try {
            setStatus("applying");
            setError("");

            const auth = getAuth();

            // ✅ C’EST ÇA qui “valide” le clic sur le lien et met emailVerified à jour côté Firebase
            await applyActionCode(auth, oobCode);

            // Optionnel : si l'utilisateur est connecté dans ce navigateur, on reload pour avoir emailVerified à jour
            if (auth.currentUser) {
                await auth.currentUser.reload();
            }

            setStatus("success");
            router.replace(returnTo);
        } catch (e) {
            setStatus("error");
            setError(e?.message || "Impossible de valider ce lien.");
        }
    };
    if (!mode || !MODES_AUTH.includes(mode)) {
        return (<NotFoundComponent />)
    }
    if(mode === "verifyEmail") {
        return (<VerifyEmailComponent actionConfirm={confirm} />);
    }
    if (status === "checking") return <div style={{ padding: 20 }}>Vérification du lien…</div>;

    if (status === "error") {
        return (<VerifyEmailComponent actionConfirm={confirm} />);
    }
    if (status === "ready") {
        return (
            <div style={{ padding: 20 }}>
                <h2>Confirmer la vérification de ton e-mail</h2>
                <p>Clique pour valider ton adresse e-mail.</p>

                <button onClick={confirm} style={{ padding: "10px 16px" }}>
                    Confirmer
                </button>
            </div>
        );
    }
    if (status === "applying") return <div style={{ padding: 20 }}>Validation en cours…</div>;
    // success
    return (
        <div style={{ padding: 20 }}>
            <h2>E-mail vérifié ✅</h2>
            <p>Tu peux continuer.</p>

            <button
                onClick={() => router.replace("/dashboard")}
                style={{ padding: "10px 16px" }}
            >
                Continuer
            </button>
        </div>
    );
}
