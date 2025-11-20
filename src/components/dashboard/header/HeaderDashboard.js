"use client";
import React, { useEffect } from "react";
import Aos from "aos";
import stickyHeader from "@/libs/stickyHeader";
import smoothScroll from "@/libs/smoothScroll";
import NavbarDashboard from "./NavbarDashboard";
import MobileMenuDashboard from "./MobileMenuDashboard";

const HeaderDashboard = () => {
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
        {/* navbar */}
        <NavbarDashboard />
        {/* mobile menu */}
        <MobileMenuDashboard />
      </div>
    </header>
  );
};

export default HeaderDashboard;
