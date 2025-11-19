
import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

let initializing = null;

/**
 * Initialise (ou réutilise) i18next pour une locale donnée
 * et ne charge que les namespaces demandés.
 * Appelable côté serveur ET côté client.
 */
export async function getTranslations(locale,ns) {
  try {
    //const filePath = path.join(process.cwd(), "public", "locales", locale, `${ns}.json`);
    //const raw = fs.readFileSync(filePath, "utf8");
    return(import(`@/locales/${locale}/${ns}.json`))
  } catch (e) {
    console.error("❌ Erreur chargement traductions:", e);
    return {};
  }
}

export async function initI18next(locale, ns) {
  if (!i18next.isInitialized) {
    i18next
      .use(initReactI18next)
      .use(
        resourcesToBackend((lng, namespace) =>
          import(`@/locales/${lng}/${namespace}.json`)
        )
      );
  }

  // Évite les races si plusieurs composants init en parallèle
  if (!initializing) {
    initializing = i18next.init({
      lng: locale,
      fallbackLng: 'pt',
      ns,
      defaultNS: 'common',
      interpolation: { escapeValue: false },
      returnNull: false,
    }).finally(() => {
      initializing = null;
    });
  }

  if (!i18next.isInitialized) {
    await initializing;
  } else {
    // Si déjà init mais locale/ns différents, on les (ré)applique
    if (i18next.language !== locale) {
      const html = document.documentElement;
      if (html.lang !== locale) html.lang = locale;
      await i18next.changeLanguage(locale);
    }
  }

  return i18next;
}
