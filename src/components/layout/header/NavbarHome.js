"use client";
import { usePathname } from "next/navigation";
import NavItems from "@/components/layout/header/NavItems";
import NavbarLogo from "@/components/layout/header/NavbarLogo";
import NavbarRight from "@/components/layout/header/NavbarRight";
import NavItems2 from "@/components/layout/header/NavItems2";
import useIsTrue from "@/hooks/useIsTrue";
import NavbarTop from "@/components/layout/header/NavbarTop";
import NavItemsHome from "./NavItemsHome";
import NavbarRightHome from "./NavbarRightHome";
import { Stack } from "@mui/material";

const NavbarHome = () => {
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
      className={`bg-menuBg transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark`}
    >
      <nav>
        <Stack sx={{ px: { xs: 2, sm: 15 },py:1.5,bgcolor:''}} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <NavbarLogo />
          {/* Main menu */}
          <NavItemsHome />

          {/* navbar right */}
          <NavbarRightHome isHome2Dark={isHome2Dark} />
        </Stack>
      </nav>
    </div>
  );
};

export default NavbarHome;
