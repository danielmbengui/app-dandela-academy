"use client";
import { usePathname } from "next/navigation";
import FooterNavListHome from "./FooterNavListHome";
import CopyRightHome from "./CopyRightHome";

const FooterHome = () => {
  const pathname = usePathname();
  const isHome8 = pathname === "/home-8" || pathname === "/home-8-dark";
  const isHome9 = pathname === "/home-9" || pathname === "/home-9-dark";
  const isHome10 = pathname === "/home-10" || pathname === "/home-10-dark";
  return (
    <footer
      className={`bg-footerBg 2xl:bg-cover`}
    >
      <div
        className={`${"container"} pb-5 pt-10 lg:pb-10 lg:pt-0  `}
      >
        {/* footer main */}
        <FooterNavListHome />

        {/* footer copyright  */}
        <CopyRightHome />
      </div>
    </footer>
  );
};

export default FooterHome;
