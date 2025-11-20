"use client";
import TabButtonPrimary from "@/components/shared/buttons/TabButtonPrimary";
import LoginForm from "@/components/shared/login/LoginForm";
import SignUpForm from "@/components/shared/login/SignUpForm";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import Image from "next/image";
import shapImage2 from "@/assets/images/education/hero_shape2.png";
import shapImage3 from "@/assets/images/education/hero_shape3.png";
import shapImage4 from "@/assets/images/education/hero_shape4.png";
import shapImage5 from "@/assets/images/education/hero_shape5.png";
import useTab from "@/hooks/useTab";
import { useTranslation } from "react-i18next";
import { NS_FORM, NS_LOGIN } from "@/libs/i18n/settings";
import ConnectedForm from "@/components/shared/login/ConnectedForm";
import AdminLoginForm from "./AdminLoginForm";

const AdminLoginTab = () => {
  const { t } = useTranslation([NS_LOGIN, NS_FORM]);
  const { title: titleLogin } = t(`login`, { returnObjects: true });
  const { title: titleSignup } = t(`signup`, { returnObjects: true });
  const { currentIdx, handleTabClick } = useTab();
  const tabButtons = [
    { name: titleLogin, content: <AdminLoginForm handleTabClick={handleTabClick} /> },
    {
      name: titleSignup,
      content: <SignUpForm handleTabClick={handleTabClick} />,
    },
  ];
  return (
    <section className="relative">
      <div className="container py-100px">
        <div className="tab md:w-2/3 mx-auto">
          {/* tab contents */}
          <div className="shadow-container bg-whiteColor dark:bg-whiteColor-dark pt-10px px-5 pb-10 md:p-50px md:pt-30px rounded-5px">
            <div className="tab-contents">
              <TabContentWrapper
                //key={idx}
                isShow={true}
              >
                <AdminLoginForm handleTabClick={handleTabClick} />
              </TabContentWrapper>
            </div>
          </div>
        </div>
      </div>
      {/* animated icons */}
      <div>
        <Image
          loading="lazy"
          className="absolute right-[14%] top-[30%] animate-move-var"
          src={shapImage2}
          alt="Shape"
        />
        <Image
          loading="lazy"
          className="absolute left-[5%] top-1/2 animate-move-hor"
          src={shapImage3}
          alt="Shape"
        />
        <Image
          loading="lazy"
          className="absolute left-1/2 bottom-[60px] animate-spin-slow"
          src={shapImage4}
          alt="Shape"
        />
        <Image
          loading="lazy"
          className="absolute left-1/2 top-10 animate-spin-slow"
          src={shapImage5}
          alt="Shape"
        />
      </div>
    </section>
  );
};

export default AdminLoginTab;
