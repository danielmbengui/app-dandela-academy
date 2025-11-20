import { PAGE_CONTACT } from "@/libs/constants/constants_pages";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MobileLinkOB = ({ item }) => {
  const currentPath = usePathname();
  const { name, path } = item;
  const isActive = currentPath === path ? true : false;
  return (
    <Link
      className={`leading-1 py-11px text-${isActive ? 'secondaryColor' : 'primaryColor'} font-medium hover:text-secondaryColor dark:text-whiteColor dark:hover:text-secondaryColor`}
      href={path}
      target={path === PAGE_CONTACT ? '_blank' : '_self'}
    >
      {name}
    </Link>
  );
};

export default MobileLinkOB;
