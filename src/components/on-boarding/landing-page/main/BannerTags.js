import Feature2 from "@/components/shared/features/Feature2";
import { LINK_INEFOP } from "@/libs/constants/constants";
import { IMAGE_PARTNER_INEFOP, IMAGE_PARNER_NG_ANALYTICS, IMAGE_PARNER_NG_LEARNING, IMAGE_PARTNER_MMS_MEMORIAL } from "@/libs/constants/constants_images";
import { getJsonValues } from "@/libs/functions";
import { NS_HOME, NS_SIGN_UP } from "@/libs/i18n/settings";
import { Stack } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
//import { LINK_INEFOP } from "@/libs/constants/constants";
//import { IMAGE_PARNER_INEFOP, IMAGE_PARNER_NG_ANALYTICS, IMAGE_PARNER_NG_LEARNING, IMAGE_PARTNER_MMS_MEMORIAL } from "@/libs/constants/constants_images";

const BannerTags = () => {
    const {t} = useTranslation([NS_HOME])
    //const {t}=useTranslation([]);
    const features = getJsonValues(t("tags", { returnObjects: true }));
      
    const PARTNERS = [
        { name: "Inefop", link: LINK_INEFOP, image: IMAGE_PARTNER_INEFOP },
        { name: "MMS Memorial", link: '', image: IMAGE_PARTNER_MMS_MEMORIAL },
        { name: "NG Learning", link: LINK_INEFOP, image: IMAGE_PARNER_NG_LEARNING },
        { name: "NG Analytics", link: LINK_INEFOP, image: IMAGE_PARNER_NG_ANALYTICS },
    ]
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
