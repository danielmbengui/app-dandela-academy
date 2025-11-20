"use client"
import React from "react";
import { PAGE_CONTACT } from "@/libs/constants/constants_pages";
import { NS_CONTACT } from "@/libs/i18n/settings";
import { useTranslation } from "react-i18next";
import HeroPrimaryOB from "../HeroPrimaryOB";
import ContactPrimaryOB from "./ContactPrimaryOB";
import ContactFormOB from "./ContactFormOB";

const ContactMainOB = () => {
  const { t } = useTranslation([NS_CONTACT]);
  return (
    <>
      <HeroPrimaryOB path={PAGE_CONTACT} title={t('title')} />
      <ContactPrimaryOB />
      <ContactFormOB />
    </>
  );
};

export default ContactMainOB;
