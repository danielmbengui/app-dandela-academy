"use client";
import React, { useEffect } from "react";
import Aos from "aos";
import HeaderTop from "./HeaderTop";
import MobileMenu from "../menu/mobile/MobileMenu";
import stickyHeader from "@/contexts/libs/stickyHeader";
import smoothScroll from "@/contexts/libs/smoothScroll";
import Navbar from "../menu/Navbar";

const HeaderHome = () => {
  useEffect(() => {
    stickyHeader();
    smoothScroll();
    // AOS Scroll Animation
    Aos.init({
      offset: 1,
      duration: 1000,
      once: true,
      easing: "ease",
    });
  }, []);
  return (
    <header>
      <div>
        {/* header top */}
        <HeaderTop />
        {/* navbar */}
        <Navbar />
        {/* mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
};

export default HeaderHome;
