import React from "react";
import { NS_HOME_FOOTER } from "@/contexts/i18n/settings";
import { useTranslation } from "react-i18next";

const FooterAbout = () => {
  const {t}=useTranslation([NS_HOME_FOOTER]);
  const { title, subtitle,schedule,} = t(`about`, { returnObjects: true });

  return (
    <div
      className="sm:col-start-1 sm:col-span-12 md:col-span-6  lg:col-span-4 mr-30px"
      data-aos="fade-up"
    >
      <h4 className="text-size-22 font-bold text-whiteColor mb-3">{title}</h4>
      <p className="text-base lg:text-sm 2xl:text-base text-darkgray mb-30px leading-1.8 2xl:leading-1.8">
        {subtitle}
      </p>
      <div className="flex items-center">
          <div>
            <i className="icofont-clock-time text-3xl text-whiteColor h-78px w-78px bg-primaryColor leading-78px mr-22px block text-center"></i>
          </div>
          <div>
            <h6 className="text-lg text-whiteColor font-medium leading-29px">
              {schedule.title}
            </h6>
            {
              schedule.hours?.map((hour,i)=>{
                return(<p key={`${hour}-${i}`} className="text-sm text-whiteColor text-opacity-60 mb-1">
                  {hour}
                </p>)
              })
            }
          </div>
        </div>
    </div>
  );
};

export default FooterAbout;
