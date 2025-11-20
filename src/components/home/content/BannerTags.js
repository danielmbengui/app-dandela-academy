import React from "react";
import { getJsonValues } from "@/contexts/functions";
import { NS_HOME } from "@/contexts/i18n/settings";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

const Feature2 = ({ feature, idx }) => {
  return (
    <div>
      <a
        href="#"
        className={`text-3xl ${
          idx % 2 === 0
            ? "text-primaryColor hover:text-secondaryColor dark:hover:text-secondaryColor"
            : "text-darkdeep2 hover:text-primaryColor dark:text-darkdeep2-dark dark:hover:text-primaryColor"
        }  font-medium whitespace-nowrap px-4`}
      >
        {feature}
      </a>
    </div>
  );
};

const BannerTags = () => {
    const {t} = useTranslation([NS_HOME])
    //const {t}=useTranslation([]);
    const features = getJsonValues(t("tags", { returnObjects: true }));
    return (
        <div data-aos="fade-up">
            <div className="container-fluid py-10 px-0 bg-borderColor dark:bg-borderColor-dark overflow-x-hidden">
            <div className="flex animate-marquee play-state">
                    {/* marques */}
                    {features.map((feature, idx) => (
                        <Stack key={idx} direction={'row'} alignItems={'center'}>
                            <Feature2 key={idx} idx={idx} feature={feature} />
                        </Stack>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BannerTags;
