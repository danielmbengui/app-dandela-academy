"use client";
import { usePathname } from "next/navigation";
import NavItems from "@/components/layout/header/NavItems";
import NavbarLogo from "@/components/layout/header/NavbarLogo";
import NavbarRight from "@/components/layout/header/NavbarRight";
import NavItems2 from "@/components/layout/header/NavItems2";
import useIsTrue from "@/hooks/useIsTrue";
import NavbarTop from "@/components/layout/header/NavbarTop";
import NavItemsHome from "./NavItemsHome";
import NavbarRightLogin from "./NavbarRightLogin";

const NavbarDashboard = () => {
  const isHome1 = useIsTrue("/");
  const isHome1Dark = useIsTrue("/home-1-dark");
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  const isHome7 = useIsTrue("/home-7");
  const isHome7Dark = useIsTrue("/home-7-dark");

  return (
    <div
      className={`bg-menuBg transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark ${isHome2 || isHome2Dark
        ? "lg:border-b border-borderColor dark:border-borderColor-dark"
        : ""
        }`}
    >
      <nav>
        <div
          className={`py-15px lg:py-0 px-15px ${isHome1 ||
            isHome1Dark ||
            isHome4 ||
            isHome4Dark ||
            isHome5 ||
            isHome5Dark
            ? "lg:container 3xl:container2-lg"
            : isHome2 || isHome2Dark
              ? "container sm:container-fluid lg:container 3xl:container-secondary "
              : "lg:container 3xl:container-secondary-lg "
            } 4xl:container mx-auto relative`}
        >

          <div className="grid grid-cols-2 lg:grid-cols-12 items-center gap-15px">
            {/* navbar left */}
            <NavbarLogo />
            {/* Main menu */}
            <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
              <div className="px-5 lg:px-10px 2xl:px-15px 3xl:px-5 py-15 lg:py-5 2xl:py-10px 3xl:py-10 leading-sm 2xl:leading-lg text-base lg:text-sm 2xl:text-base font-semibold block group-hover:text-primaryColor dark:text-whiteColor">
                
              </div>
            </div>


            {/* navbar right */}
            <div className="py-15 lg:py-10 2xl:py-15px 3xl:py-10">
            <NavbarRightLogin isHome2Dark={isHome2Dark} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarDashboard;
