"use client";
import React, { useEffect } from "react";
import Aos from "aos";
import stickyHeader from "@/libs/stickyHeader";
import smoothScroll from "@/libs/smoothScroll";
import NavbarHomeOB from "./NavbarHomeOB";
import MobileMenuHomeOB from "./MobileMenuHomeOB";
import HeaderTopOB from "../../HeaderTopOB";

const HeaderHomeOB = () => {
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
        <HeaderTopOB />
        {/* navbar */}
        <NavbarHomeOB />
        {/* mobile menu */}
        <MobileMenuHomeOB />
      </div>
    </header>
  );
};

export default HeaderHomeOB;
