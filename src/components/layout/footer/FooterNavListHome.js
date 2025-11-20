import React, { useEffect } from "react";
import FooterNavItems from "./FooterNavItems";
import FooterAbout from "./FooterAbout";
import FooterRecentPosts from "./FooterRecentPosts";
import FooterNavItemsHome from "./FooterNavItemsHome";
import { useTranslation } from "react-i18next";
import { NS_HOME, NS_HOME_FOOTER, NS_HOME_MENU } from "@/libs/i18n/settings";
import getAllCourses from "@/libs/getAllCourses";
import FooterAboutHome from "./FooterAboutHome";

const FooterNavListHome = () => {
  const {t}=useTranslation([NS_HOME_MENU, NS_HOME_FOOTER, NS_HOME, ]);
  const { title, subtitle, bubble, content,goals, tag, about, mission, vision, inefop } = t(`${NS_HOME}:lessons`, { returnObjects: true });
  const allCourses = [...content];
  //const { t } = useTranslation([NS_HOME]);
  
  useEffect(() => {
      console.log("SLIDES", content)
  })

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
      items: allCourses.map(course=>({name:course.title,path:'/#lessons'})),
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-12 md:grid-cols-2 lg:grid-cols-12 gap-30px md:gap-y-5 lg:gap-y-0 pt-40px pb-50px md:pt-20px md:pb-30px lg:pt-80px lg:pb-20">
        {/* left */}
        <FooterAboutHome />

        {/* nav area */}
        {lists.map((list, idx) => (
          <FooterNavItemsHome key={idx} list={list} idx={idx} />
        ))}

      </div>
    </section>
  );
};

export default FooterNavListHome;
