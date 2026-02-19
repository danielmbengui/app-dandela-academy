// src/components/OfflineBanner.jsx
import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";
import Button from "@mui/material/Button";
import { useInternet } from "@/contexts/InternetProvider";

export default function NoInternetComponent({
  fixed = true,
  showWhenOnline = false,
  onRetry,
}) {
  const { isOnline, isOffline } = useInternet();

  if (!showWhenOnline && isOnline) return null;

  const handleRetry = async () => {
    // Optionnel: callback custom
    if (onRetry) return onRetry();

    // Sinon: refresh soft
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <div
      className={[
        fixed ? "fixed top-0 left-0 right-0 z-[2000]" : "",
        "px-3 pt-3",
      ].join(" ")}
    >
      <Stack className="mx-auto w-full max-w-3xl">
        <Alert
          severity={isOffline ? "warning" : "success"}
          icon={isOffline ? <WifiOffRoundedIcon /> : undefined}
          action={
            isOffline ? (
              <Button color="inherit" size="small" onClick={handleRetry}>
                Réessayer
              </Button>
            ) : null
          }
          className="rounded-2xl shadow-md"
        >
          {isOffline
            ? "Aucune connexion Internet. Certaines fonctionnalités peuvent être indisponibles."
            : "Connexion rétablie ✅"}
        </Alert>
      </Stack>
    </div>
  );
}
