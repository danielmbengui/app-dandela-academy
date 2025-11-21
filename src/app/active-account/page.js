"use client";
import React, { useState } from 'react';
import { WEBSITE_START_YEAR} from "@/contexts/constants/constants";

import { NS_HOME_FOOTER } from "@/contexts/i18n/settings";
import { useThemeMode } from "@/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/contexts/AuthProvider';
import LoginComponent from '@/components/login/LoginComponent';
import RegisterComponent from '@/components/login/RegisterComponent';

export default function Register() {
  return(<RegisterComponent />);
}
