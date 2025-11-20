"use client"
import React from "react";
import HeroComponent from "./content/HeroComponent";
import BannerTags from "./content/BannerTags";
import AboutComponent from "./content/AboutComponent";
import CategoriesComponent from "./content/CategoriesComponent";
import ServicesComponent from "./content/ServicesComponent";
import LessonsComponent from "./content/LessonsComponent";
import RegistrationComponent from "./content/RegistrationComponent";
import PartnersComponent from "./content/PartnersComponent";
import GalleryComponent from "./content/GalleryComponent";

const HomePage = () => {
  return (<>
    <HeroComponent />
    <BannerTags />
    <AboutComponent />
    <CategoriesComponent subject="lg" />
    <ServicesComponent />
    <LessonsComponent />
    <RegistrationComponent />
    <PartnersComponent />
    <GalleryComponent />
  </>);
};

export default HomePage;
