"use client"
import About4 from "@/components/sections/abouts/About4";
import Blogs from "@/components/sections/blogs/Blogs";
import Brands from "@/components/sections/brands/Brands";
import EventsTab from "@/components/sections/events/EventsTab";
import FeatureCourses from "@/components/sections/featured-courses/FeatureCourses";
import Fees from "@/components/sections/fees/Fees";
import Hero7 from "@/components/sections/hero-banners/Hero7";
import Overview from "@/components/sections/overviews/Overview";
import PopularSubjects3 from "@/components/sections/popular-subjects/PopularSubjects3";
import Registration from "@/components/sections/registrations/Registration";
import FeaturesMarque from "@/components/sections/sub-section/FeaturesMarque";
import ImageGallery from "@/components/sections/sub-section/ImageGallery";
import Testimonials from "@/components/sections/testimonials/Testimonials";
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

const HomePageComponent = () => {
  const { t } = useTranslation([NS_HOME]);
  const slides = getJsonValues(t("about", { returnObjects: true }));
  const { title, subtitle, bubble, goals, tag, about, mission, vision, inefop } = t(`lessons`, { returnObjects: true });
  useEffect(() => {
      //console.log("SLIDES", tag)
  })
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

export default HomePageComponent;
