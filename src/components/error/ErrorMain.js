"use client";
import React from "react";
import HeroPrimary from "../contact/HeroPrimary";
import Error1 from "./Error1";
import { useTranslation } from "react-i18next";
import { NS_ERRORS } from "@/contexts/i18n/settings";


const ErrorMain = () => {
    const { t } = useTranslation([NS_ERRORS]);
  return (
    <>
      <HeroPrimary path={"Error Page"} title={t('404')} />
      <Error1 />
    </>
  );
};

export default ErrorMain;