"use client";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import HeaderTop from "./HeaderTop";

import useIsTrue from "@/hooks/useIsTrue";
import Aos from "aos";
import stickyHeader from "@/libs/stickyHeader";
import smoothScroll from "@/libs/smoothScroll";
import NavbarHome from "./NavbarHome";
import NavbarLogin from "./NavbarLogin";
import MobileMenuLogin from "./MobileMenuLogin";

const HeaderLogin = ({bannerContact=true}) => {
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");
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
        {
          bannerContact && <HeaderTop />
        }
        
        {/* navbar */}
        <NavbarLogin />
        {/* mobile menu */}
        <MobileMenuLogin />
      </div>
    </header>
  );
};

export default HeaderLogin;
