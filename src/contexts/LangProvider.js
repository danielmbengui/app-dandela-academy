'use client';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
//import { initI18next } from '@/lib/i18n/init';
import { useParams } from 'next/navigation';
import { defaultLanguage, namespaces } from '@/contexts/i18n/settings';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { IMAGE_BRITISH_FLAG, IMAGE_FRENCH_FLAG, IMAGE_PORTUGUESE_FLAG } from '@/contexts/constants/constants_images';
import { ClassLang } from '@/classes/ClassLang';
import { initI18next } from '@/contexts/i18n/init';
import { auth } from './firebase/config';
const LangContext = createContext(null);

export function useLanguage() {
    return useContext(LangContext);
}

export function LangProvider({ children }) {
    const params = useParams(); // { id: "x1VnUK8WdaD9Vr7sJmLj" }
    //const pathname = usePathname();
    const [ready, setReady] = useState(i18next.isInitialized && i18next.language === params.locale);
    const [lang, setLang] = useState(defaultLanguage);
    const [i18n, setI18n] = useState(null);
    const [classLang, setClassLang] = useState(null);
    const ALL_LANGUAGES = [
        new ClassLang({ id: ClassLang.LANGUAGE_FRENCH, name: 'Français', flag: IMAGE_FRENCH_FLAG }),
        new ClassLang({ id: ClassLang.LANGUAGE_ENGLISH, name: 'Anglais', flag: IMAGE_BRITISH_FLAG }),
        new ClassLang({ id: ClassLang.LANGUAGE_PORTUGUESE, name: 'Portugais', flag: IMAGE_PORTUGUESE_FLAG }),
        //new ClassLang({ id: 'de', name: 'Allemand', flag: IMAGE_GERMAN_FLAG }),
    ]
    useEffect(() => {
        if (auth) {
            auth.languageCode = lang;
        }
    }, [lang, auth]);
    const changeLang = (newLang) => {
        //document.documentElement.lang = newLang; // Applique la classe du thème

        //i18n.changeLanguage(newLang);
        if (i18n.isInitialized) {
            const html = document.documentElement;
            if (html.lang !== newLang) html.lang = newLang;
            //localStorage.setItem('lang', newLang);
            i18n.changeLanguage(newLang);
            document.cookie = `locale=${newLang}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
            setLang(newLang);
            setClassLang(ClassLang.getOneLang(newLang));
            localStorage.setItem('lang', newLang);
        }

        //setLang(newLang);
        //  console.log("router change lang", router.locale, "lang change param", newLang, "i18n hange", i18n.language);
    };
    useEffect(() => {
        //const _locale = params.locale || defaultLanguage;
        var _locale = localStorage.getItem('lang'); // Récupère la donnée du localStorage
        if(!_locale) {
            _locale=defaultLanguage;
            localStorage.setItem('lang', _locale);
        }
        let mounted = true;
        (async () => {
            const _i18n = await initI18next(_locale, namespaces);
            const html = document.documentElement;
            if (html.lang !== _locale) html.lang = _locale;
            _i18n.changeLanguage(_locale);
            setI18n(_i18n);
            setLang(_locale);
            document.cookie = `locale=${_locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
            setClassLang(ClassLang.getOneLang(_locale));
            if (mounted) setReady(true);
        })();
        return () => { mounted = false; };
    }, [params?.locale, namespaces?.join('|')]);
    if (!ready) return null; // ou un mini skeleton si tu veux

    return <LangContext.Provider
        value={{ lang, changeLang, classLang, list: ALL_LANGUAGES }}
    //value={value}

    >
        <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    </LangContext.Provider>;
}
