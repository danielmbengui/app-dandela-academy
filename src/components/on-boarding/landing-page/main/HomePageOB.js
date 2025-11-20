"use client"
import React, { useEffect } from "react";
import BannerTags from "./BannerTags";
import AboutComponent from "./AboutComponent";
import CategoriesComponent from "./CategoriesComponent";
import ServicesComponent from "./ServicesComponent";
import RegistrationComponent from "./RegistrationComponent";
import LessonsComponent from "./LessonsComponent";
import PartnersComponent from "./PartnersComponent";
import HeroComponent from "./HeroComponent";
import { NS_HOME } from "@/libs/i18n/settings";
import { useTranslation } from "react-i18next";
import { getJsonValues } from "@/libs/functions";
import GalleryComponent from "./GalleryComponent";

const HomePageOB = () => {
  const { t } = useTranslation([NS_HOME]);
  const slides = getJsonValues(t("about", { returnObjects: true }));
  const { title, subtitle, bubble, goals, tag, about, mission, vision, inefop } = t(`lessons`, { returnObjects: true });

  return (
    <>
      <HeroComponent />
      <BannerTags />
      <AboutComponent />
      <CategoriesComponent subject="lg" />
      <ServicesComponent />
      <LessonsComponent />
      <RegistrationComponent />
      <PartnersComponent />
      <GalleryComponent />
    </>
  );
};

export default HomePageOB;
