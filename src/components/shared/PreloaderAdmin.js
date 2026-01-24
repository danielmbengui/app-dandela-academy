import Image from "next/image";
import imageLogo from "@/assets/images/logos/logo-image.png";
import { IconLogoImage } from "@/assets/icons/IconsComponent";
import { useEffect } from "react";

const PreloaderAdmin = () => {
  useEffect(() => {
  document.documentElement.classList.add("preloader-ready");
}, []);
  return (
    <div className="animate-preloader opacity-0 invisible fixed top-0 left-0 -z-1 w-full transition-all">
          <div className="preloader flex  h-screen w-full items-center justify-center bg-bodyBg transition-all">
      {/* spinner  */}
      <div 
      className="w-90px h-90px border-5px border-t-orange border-r-orange border-b-orange-light border-l-orange-light rounded-full animate-spin-infinit"
     // style={{ borderColor: "var(--warning)" }} // orange fixe
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <IconLogoImage width={50} height={50} color="var(--warning)" />
      </div>
    </div>
    </div>
  );
};

export default PreloaderAdmin;
