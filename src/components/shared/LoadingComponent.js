import React from "react";
import { Stack } from "@mui/material";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { NS_CERTIFICATIONS } from "@/contexts/i18n/settings";
export default function LoadingComponent() {
    const { t: tCertPage } = useTranslation(NS_CERTIFICATIONS);
    return (<Stack alignItems={'center'} sx={{ width: 'fit-content'}}>
        <Icon icon="ph:spinner-gap" color="var(--primary)" className="w-12 h-12 animate-spin primary" />
        <p className="text-sm text-gray-500 dark:text-gray-400">{tCertPage("list_loading")}</p>
    </Stack>);
}