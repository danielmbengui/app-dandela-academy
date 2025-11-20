"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LangProvider";
import { useTranslation } from "react-i18next";
import { NS_BUTTONS, NS_LANGS } from "@/contexts/i18n/settings";
import { Box } from "@mui/material";
import DropdownWrapper from "./DropdownWrapper";

const SelectLang = () => {
  const { t } = useTranslation([NS_LANGS, NS_BUTTONS]);
  const { changeLang, classLang, list } = useLanguage();

  return (<ul className="flex items-center nav-list">
    <li className="relative group">
      <button className="text-contentColor dark:text-contentColor-dark pr-10px flex items-center">
        <Image
          src={classLang?.flag}
          width={50}
          height={50}
          alt=""
          className="w-auto h-3 mr-1 rounded-sm"
        />
        {t(`${NS_LANGS}:${classLang.id}`)}
        <i className="icofont-rounded-down"></i>
      </button>
      {/* dropdown menu  */}
      <DropdownWrapper>
        <div className="shadow-dropdown3 max-w-dropdown2 w-2000 rounded-standard bg-white dark:bg-whiteColor-dark">
          <ul>
            {
              list.filter(item => item.id !== classLang?.id).map((item, i) => {
                return (<li key={`${item.id}-${i}`}>
                  <Box
                    onClick={(e) => {
                      e.preventDefault();
                      changeLang(item.id);
                    }}
                    sx={{ cursor: 'pointer' }}
                    className="flex items-center text-size-13 text-blackColor p-10px transition duration-300 hover:bg-primaryColor hover:text-whiteColor dark:text-blackColor-dark dark:hover:text-whiteColor-dark dark:hover:bg-primaryColor"
                  >
                    <Image
                      src={item.flag}
                      alt=""
                      width={50}
                      height={50}
                      className="w-auto h-10px rounded-sm mr-10px"
                    />
                    {t(`${NS_LANGS}:${item.id}`)}
                  </Box>
                </li>)
              })
            }
          </ul>
        </div>
      </DropdownWrapper>
    </li>
  </ul>);
};

export default SelectLang;
