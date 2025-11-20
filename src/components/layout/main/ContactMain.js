"use client"
import ContactFrom from "@/components/sections/contact-form/ContactFrom";
import ContactPrimary from "@/components/sections/contact/ContactPrimary";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import { PAGE_CONTACT } from "@/libs/constants/constants_pages";
import { NS_CONTACT } from "@/libs/i18n/settings";
import React from "react";
import { useTranslation } from "react-i18next";

const ContactMain = () => {
  const { t } = useTranslation([NS_CONTACT]);
  return (
    <>
      <HeroPrimary path={PAGE_CONTACT} title={t('title')} />
      <ContactPrimary />
      <ContactFrom />
    </>
  );
};

export default ContactMain;
