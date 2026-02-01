"use client"
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NS_LANGS } from '@/contexts/i18n/settings';
import { useLanguage } from '@/contexts/LangProvider';
import { ClassLang } from '@/classes/ClassLang';
import SelectComponentDark from './SelectComponentDark';

export default function SelectLanguageComponent() {
    const { t } = useTranslation([NS_LANGS]);
    const { lang, changeLang } = useLanguage();
    const LANGS = ClassLang.ALL_LANGUAGES;
    return (
      <SelectComponentDark 
      value={lang}
      values={LANGS.map(lang => ({ id: lang.id, value: `${lang.flag_str} ${t(lang.id, { ns: NS_LANGS })}` }))}
      hasNull={false}
      onChange={(e) => {
        const { value } = e.target;
        changeLang(value);
      }}
      />
    );
  }