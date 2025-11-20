import Image from "next/image";
import React from "react";
import registrationImage1 from "@/assets/images/register/register__1.png";
import registrationImage2 from "@/assets/images/register/register__2.png";
import registrationImage3 from "@/assets/images/register/register__3.png";
import { useTranslation } from "react-i18next";
import { NS_BUTTONS, NS_HOME } from "@/contexts/i18n/settings";
import Link from "next/link";
import { PAGE_WAITING_LIST } from "@/contexts/constants/constants_pages";
import PopupVideo from "../others/PopupVideo";
import ButtonPrimary from "../others/ButtonPrimary";

const RegistrationComponent = () => {
  const { t } = useTranslation([NS_HOME, NS_BUTTONS]);
  const { title, subtitle, form, tag, } = t(`register`, { returnObjects: true });

  return (
    <section className="bg-register bg-cover bg-center bg-no-repeat lg:mb-150px">
      {/* registration overlay  */}
      <div className="overlay bg-blueDark bg-opacity-90 py-20 lg:pt-[90px] lg:pb-0 relative z-0">
        {/* animate icons  */}
        <div>
          <Image
            className="absolute top-0 left-0 lg:left-[8%] 2xl:top-10 animate-move-hor block z--1"
            src={registrationImage1}
            alt=""
          />
          <Image
            className="absolute top-1/2 left-3/4 md:left-2/3 lg:left-1/2 2xl:left-[8%] md:top animate-spin-slow block z--1"
            src={registrationImage2}
            alt=""
          />
          <Image
            className="absolute top-20 lg:top-3/4 md:top-14 right-20 md:right-20 lg:right-[90%] animate-move-var block z--1"
            src={registrationImage3}
            alt=""
          />
        </div>
        <div className="container">
          {/* about section   */}
          <div className="grid grid-cols-1 lg:grid-cols-12 pt-30px gap-x-30px">
            {/* about left  */}
            <div
              className="mb-30px lg:mb-0 pb-0 md:pb-30px xl:pb-0 lg:col-start-1 lg:col-span-7"
              data-aos="fade-up"
            >
              <div className="relative">
                <span className="text-sm font-semibold text-primaryColor bg-whitegrey3 px-6 py-5px mb-5 rounded-full inline-block">
                  {tag}
                </span>
                <h3 className="text-3xl md:text-[35px] 2xl:text-size-42 leading-[45px] 2xl:leading-2xl font-bold text-whiteColor pb-25px">
                  {title.create}{" "}
                  <span className="relative after:w-full after:h-[7px] after:bg-secondaryColor after:absolute after:left-0 after:bottom-2 md:after:bottom-4 z-0 after:z-[-1]">
                    {title.account}
                  </span>{" "}
                  {title.action}{" "}
                  <span className="text-yellow1">{`50`} </span> {title.lessons}
                </h3>
                <div className="flex gap-x-5 items-center">
                  <div>
                    <PopupVideo />
                  </div>

                  <div>
                    <p className="text-size-15 md:text-[22px] lg:text-lg 2xl:text-[22px] leading-6 md:leading-9 lg:leading-8 2xl:leading-9 font-semibold text-white">
                      {subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* sbject right  */}
            <div className="overflow-visible lg:col-start-8 lg:col-span-5 relative z-1 lg:-mb-150px">
              <form
                className="p-35px pt-10 bg-lightGrey10 dark:bg-lightGrey10-dark rounded shadow-experience"
                data-aos="fade-up"
              >
                <h3 className="text-xl text-blackColor dark:text-blackColor-dark font-semibold mb-5 font-inter">
                  {form.title}
                </h3>
                <p className="text-contentColor dark:text-contentColor-dark mb-25px">
                  {form.subtitle}
                </p>
                <div className="text-contentColor dark:text-contentColor-dark mb-30px">
                  <p className="text-contentColor dark:text-contentColor-dark mb-10px">
                    {form.ul?.title}
                  </p>
                  <ul className="space-y-3">
                    {
                      form.ul?.content?.map((step, i) => {
                        return (<li key={`${step}-${i}`} className="flex items-center group">
                          <i className="icofont-check px-2 py-2 text-primaryColor bg-whitegrey3 bg-opacity-40 group-hover:bg-primaryColor group-hover:text-white group-hover:opacity-100 mr-15px dark:bg-whitegrey1-dark"></i>
                          <p className="text-sm md:text-base font-medium text-blackColor dark:text-blackColor-dark">
                            {step}
                          </p>
                        </li>)
                      })
                    }
                  </ul>
                </div>
                <Link href={PAGE_WAITING_LIST}>
                  <ButtonPrimary type="button" arrow={true}>
                    {t(`${NS_BUTTONS}:subscribe`)}
                  </ButtonPrimary>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationComponent;
