"use client"
import HeroLogin from "@/components/sections/hero-banners/HeroLogin";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import LoginTab from "@/components/sections/login/LoginTab";
import ConnectedForm from "@/components/shared/login/ConnectedForm";
import { useAuth } from "@/contexts/AuthProvider";
import { NS_PAGES } from "@/libs/i18n/settings";
import { useTranslation } from "react-i18next";
import AdminLoginTab from "./AdminLoginTab";

const AdminLoginMain = () => {
  const { t } = useTranslation([NS_PAGES]);
  const { user } = useAuth();
  return (
    <>
      <div className="hidden">
      <HeroLogin path={"Log In"} title={t(`login`)} backTitle={t(`home`)} backLink={"/"} />
      </div>
      {
        !user && <AdminLoginTab />
      }
      {
        user && <ConnectedForm />
      }
    </>
  );
};

export default AdminLoginMain;
