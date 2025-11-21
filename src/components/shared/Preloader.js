import Image from "next/image";
import imageLogo from "@/assets/images/logos/logo-image.png";

const Preloader = () => {
  return (
    <div className="animate-preloader opacity-0 invisible fixed top-0 left-0 -z-1 w-full transition-all">
          <div className="preloader flex  h-screen w-full items-center justify-center  bg-whiteColor transition-all">
      {/* spinner  */}
      <div className="w-90px h-90px border-5px border-t-blue border-r-blue border-b-blue-light border-l-blue-light rounded-full animate-spin-infinit"></div>
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <Image
          src={imageLogo}
          alt="Preloader"
          className="h-10 w-10 block"
          placeholder="blur"
        />
      </div>
    </div>
    </div>
  );
};

export default Preloader;
