"use client";
import NavbarRightDashboard from "./NavbarRightDashboard";
import { Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import NavbarLogoOB from "@/components/on-boarding/NavbarLogoOB";

const NavbarDashboard = () => {
  const path = usePathname();
  return (
    <div
      className={`bg-menuBg transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark`}
    >
      <nav>
        <Stack sx={{ px: { xs: 2, sm: 15 },py:1.5,bgcolor:''}} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <NavbarLogoOB />
          {/* Main menu */}
          {/* navbar right */}
          <NavbarRightDashboard />
        </Stack>
      </nav>
    </div>
  );
};

export default NavbarDashboard;
