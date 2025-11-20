"use client"
import HeroLogin from "@/components/sections/hero-banners/HeroLogin";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import LoginTab from "@/components/sections/login/LoginTab";
import WaitingListTab from "@/components/sections/waiting-list/WaitingListTab";
import ConnectedForm from "@/components/shared/login/ConnectedForm";
import WaitingListForm from "@/components/shared/login/WaitingListForm";
import { useAuth } from "@/contexts/AuthProvider";
import { useLanguage } from "@/contexts/LangProvider";
import { NS_PAGES } from "@/libs/i18n/settings";
import { Button } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const WaitingListMain = () => {
  const { t } = useTranslation([NS_PAGES]);
  const { user } = useAuth();
  const {lang} = useLanguage();
  return (
    <>
      {
        <WaitingListTab />
      }
    </>
  );
};

export default WaitingListMain;
