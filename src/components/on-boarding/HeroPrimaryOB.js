import React from "react";
import Link from "next/link";
import BookImage from "@/components/shared/animaited-images/BookImage";
import GlobImage from "@/components/shared/animaited-images/GlobImage";
import TriangleImage from "@/components/shared/animaited-images/TriangleImage";
import { Stack } from "@mui/material";
import { PUBLIC_IMAGE_HOME_SCHOOL_1 } from "@/libs/constants/constants_images";
const HeroPrimaryOB = ({ title, backTitle="",backLink="/" }) => {
  return (
    <section data-aos="fade-up">
      {/* banner section  */}
      <div style={{ backgroundImage: `url(${PUBLIC_IMAGE_HOME_SCHOOL_1})`, }} 
      className="bg-center bg-no-repeat bg-cover bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-y-visible">
              <div className="h-[100%] bg-black bg-opacity-70 py-60px overflow-hidden">
        {/* animated icons  */}
        <Stack sx={{display:{xs:'none',sm:'none'}}}>
          <BookImage type={"secondary"} />
          <GlobImage type={"secondary"} />
          <TriangleImage type={"secondary"} />
        </Stack>
        <div className="container  bg-opacity-70">
          <div className="text-center">
            <h1 className="text-3xl md:text-size-40 2xl:text-size-55 font-bold text-white dark:text-blackColor2-dark  leading-18 md:leading-15 lg:leading-18">
              {title}
            </h1>
           {
            backTitle && backLink &&  <ul className="flex gap-1 justify-center text-white ">
            <li>
              <Link
                href={backLink}
                className="text-lg text-white dark:text-blackColor2-dark hover:text-secondaryColor dark:hover:text-secondaryColor"
              >
                {backTitle} <i className="icofont-simple-right"></i>
              </Link>
            </li>
            <li>
              <span className="text-lg text-blackColor2 dark:text-blackColor2-dark mr-1.5">
                {title}
              </span>
            </li>
          </ul>
           }
          </div>
        </div>
              </div>

      </div>
    </section>
  );
};

export default HeroPrimaryOB;
