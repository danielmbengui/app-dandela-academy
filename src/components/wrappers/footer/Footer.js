"use client";
import FooterNavList from "./FooterNavList";
import CopyRight from "./CopyRight";

const Footer = () => {
  return (
    <footer
      className={`bg-footerBg 2xl:bg-cover`}
    >
      <div
        className={`${"container"} pb-5 pt-10 lg:pb-10 lg:pt-0  `}
      >
        {/* footer main */}
        <FooterNavList />

        {/* footer copyright  */}
        <CopyRight />
      </div>
    </footer>
  );
};

export default Footer;
