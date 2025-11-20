import React from "react";
import { useTranslation } from "react-i18next";
import { NS_HOME, NS_HOME_FOOTER, NS_HOME_MENU } from "@/contexts/i18n/settings";
import FooterAbout from "./FooterAbout";
import FooterNavItems from "./FooterNavItems";

const FooterNavList = () => {
  const {t}=useTranslation([NS_HOME_MENU, NS_HOME_FOOTER, NS_HOME, ]);
  const { content } = t(`${NS_HOME}:lessons`, { returnObjects: true });
  const allCourses = [...content];

  const lists = [
    {
      heading: t(`${NS_HOME_FOOTER}:navigation.title`),
      items: [
        {
          name: t('about'),
          path: "/#about",
        },
        {
          name: t('services'),
          path: "/#services",
        },
        {
          name: t('lessons'),
          path: "/#lessons",
        },
        {
          name: t('partners'),
          path: "/#partners",
        },
        /*
        {
          name: t('contact'),
          path: "/contact",
        },
        */
      ],
    },
    {
      heading: t(`${NS_HOME_FOOTER}:lessons.title`),
      items: allCourses.map(course=>({name:course.title,path:'/#lessons'})).slice(0,1),
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-12 md:grid-cols-2 lg:grid-cols-12 gap-30px md:gap-y-5 lg:gap-y-0 pt-40px pb-50px md:pt-20px md:pb-30px lg:pt-80px lg:pb-20">
        {/* left */}
        <FooterAbout />

        {/* nav area */}
        {lists.map((list, idx) => (
          <FooterNavItems key={idx} list={list} idx={idx} />
        ))}

      </div>
    </section>
  );
};

export default FooterNavList;
