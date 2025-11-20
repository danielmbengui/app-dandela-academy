"use client"
import React from "react";
import { PAGE_CONTACT } from "@/contexts/constants/constants_pages";
import { NS_CONTACT } from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";
import ContactPrimary from "./ContactPrimary";
import ContactForm from "./ContactForm";
import HeroPrimary from "./HeroPrimary";

const ContactMain = () => {
  const { t } = useTranslation([NS_CONTACT]);
  return (
    <>
      <HeroPrimary path={PAGE_CONTACT} title={t('title')} />
      <ContactPrimary />
      <ContactForm />
    </>
  );
};

export default ContactMain;
