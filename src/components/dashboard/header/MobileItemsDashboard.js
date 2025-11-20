import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NS_DASHBOARD_MENU } from "@/libs/i18n/settings";
import MobileMenuItemDashboard from "./MobileItemDashboard";
import AccordionContainerOB from "../AccordionContainerOB";
import { useAuth } from "@/contexts/AuthProvider";

const MobileMenuItemsDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation([NS_DASHBOARD_MENU]);
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (user) {
      const _items = user?.menuDashboard().map((item, i) => ({ i: i + 1, path: item.path, name: t(item.name), accordion: "accordion", }));
      setItems(_items);
    }
  }, [user])
  /*
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
  */

  // const items_1 = user?.menuDashboard().map((item,i)=>({i:i+1,path:item.path,name:t(item.name),accordion: "accordion",}));
  // const items = [];

  return (
    <div className="pt-8 pb-6 border-b border-borderColor dark:border-borderColor-dark">
      <AccordionContainerOB>
        {items.map((item, idx) => (
          <MobileMenuItemDashboard key={idx} item={{ i: idx + 1, path: item.path, name: t(item.name), accordion: "accordion", }} />
        ))}
      </AccordionContainerOB>
    </div>
  );
};

export default MobileMenuItemsDashboard;
