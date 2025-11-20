import React from "react";
import { IconTiktok } from "@/assets/icons/IconsComponent";
import { WEBSITE_FACEBOOK, WEBSITE_LINKEDIN, WEBSITE_TIKTOK } from "@/contexts/constants/constants";
import { Stack } from "@mui/material";
import Link from "next/link";

const MobileSocial = () => {
  return (
    <div>
      <ul className="flex gap-3 items-center mb-5">
        <li>
          <Link className="facebook" href={WEBSITE_FACEBOOK} target={`_blank`}>
            <i className="icofont icofont-facebook text-fb-color dark:text-whiteColor dark:hover:text-secondaryColor"></i>
          </Link>
        </li>
        <li>
          <Link className="linkedin" href={WEBSITE_LINKEDIN} target={`_blank`}>
            <i className="icofont icofont-linkedin text-fb-color dark:text-whiteColor dark:hover:text-secondaryColor"></i>
          </Link>
        </li>
        <li>
          <Stack justifyContent={'center'} alignItems={'center'} sx={{height:'100%'}}>
          <Link className="dark:text-whiteColor dark:hover:text-secondaryColor" href={WEBSITE_TIKTOK} target={`_blank`}>
            <IconTiktok height={18} width={18} />
          </Link>
          </Stack>
        </li>
      </ul>
    </div>
  );
};

export default MobileSocial;
