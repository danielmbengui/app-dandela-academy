import React from "react";
import { useTranslation } from "react-i18next";
import { NS_HOME_MENU } from "@/contexts/i18n/settings";
import { PAGE_CONTACT } from "@/contexts/constants/constants_pages";
import MobileMenuItem from "./MobileMenuItem";
import AccordionContainer from "../../others/AccordionContainer";

const MobileMenuItems = () => {
  const {t} = useTranslation([NS_HOME_MENU]);
  const items = [
    {
      id: 1,
      name: t('about'),
      path: "/#about",
      accordion: "accordion",
      //children: <AccordionHome />,
    },
    {
      id: 2,
      name: t('services'),
      path: "/#services",
      accordion: "accordion",
      //children: <AccordionPages />,
    },
    {
      id: 3,
      name: t('lessons'),
      path: "/#lessons",
      accordion: "accordion",
      //children: <AccordionCourses />,
    },
    {
      id: 4,
      name: t('partners'),
      path: "/#partners",
      accordion: "accordion",
      //children: <AccordionDashboard />,
    },
    {
      id: 5,
      name: t('contact'),
      path: PAGE_CONTACT,
      accordion: "accordion",
      //children: <AccordionEcommerce />,
    },
  ];

  return (
    <div className="pt-8 pb-6 border-b border-borderColor dark:border-borderColor-dark">
      <AccordionContainer>
        {items.map((item, idx) => (
          <MobileMenuItem key={idx} item={item} />
        ))}
      </AccordionContainer>
    </div>
  );
};

export default MobileMenuItems;
