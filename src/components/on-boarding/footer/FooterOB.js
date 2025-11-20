"use client";
import { usePathname } from "next/navigation";
import FooterNavListOB from "./FooterNavListOB";
import CopyRightOB from "./CopyRightOB";

const FooterOB = () => {
  const pathname = usePathname();

  return (
    <footer
      className={`bg-footerBg 2xl:bg-cover`}
    >
      <div
        className={`${"container"} pb-5 pt-10 lg:pb-10 lg:pt-0  `}
      >
        {/* footer main */}
        <FooterNavListOB />

        {/* footer copyright  */}
        <CopyRightOB />
      </div>
    </footer>
  );
};

export default FooterOB;
