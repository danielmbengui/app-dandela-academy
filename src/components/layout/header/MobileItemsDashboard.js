import React from "react";
import AccordionHome from "./AccordionHome";
import AccordionContainer from "@/components/shared/containers/AccordionContainer";
import MobileMenuItem from "./MobileItem";
import AccordionPages from "./AccordionPages";
import AccordionCourses from "./AccordionCourses";
import AccordionDashboard from "./AccordionDashboard";
import AccordionEcommerce from "./AccordionEcommerce";
import { useTranslation } from "react-i18next";
import { NS_DASHBOARD_MENU, NS_HOME_MENU } from "@/libs/i18n/settings";
import MobileMenuItemHome from "./MobileItemHome";
import { useAuth } from "@/contexts/AuthProvider";

const MobileMenuItemsDashboard = () => {
  const {t} = useTranslation([NS_DASHBOARD_MENU]);
  const {user} = useAuth();
  /*
  const items = [
    {
      id: 2,
      name: t('services'),
      path: "/#services",
      accordion: "accordion",
      children: <AccordionPages />,
    },
    {
      id: 3,
      name: t('lessons'),
      path: "/#lessons",
      accordion: "accordion",
      children: <AccordionCourses />,
    },
    {
      id: 4,
      name: t('partners'),
      path: "/#partners",
      accordion: "accordion",
      children: <AccordionDashboard />,
    },
    {
      id: 5,
      name: t('contact'),
      path: "/contact",
      accordion: "accordion",
      children: <AccordionEcommerce />,
    },
  ];
  */
  const items = user?.menuDashboard()?.map(item=>({
    ...item,
    name:t(item.name),
    id:item.name,
    accordion:'accordion',
  })) || [];

  return (
    <div className="pt-8 pb-6 border-b border-borderColor dark:border-borderColor-dark">
      <AccordionContainer>
        {items.map((item, idx) => (
          <MobileMenuItemHome key={idx} item={item} />
        ))}
      </AccordionContainer>
    </div>
  );
};

export default MobileMenuItemsDashboard;
