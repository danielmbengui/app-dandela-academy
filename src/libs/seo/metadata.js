// lib/seo/metadata.js
import { getPreferredLocale } from "@/libs/i18n/detect-locale";
import { languages, defaultLanguage } from "@/libs/i18n/settings";
import { getTranslations } from "@/libs/i18n/init";

// lit l’URL base depuis l’env (gère tes 2 variantes de nommage)
function getBaseUrl() {
  const env =
    process.env.NEXT_PUBLIC_WEBSITE_LINK ||
    process.env.NEXT_PUBLIC_WESITE_LINK || // (ton nom actuel)
    "";
  return env.replace(/\/+$/, ""); // retire trailing slash
}

function buildUrl(path = "/") {
  const base = getBaseUrl();
  if (!base) return path; // fallback si pas d'env
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

/**
 * Crée des metadata locales basées sur un namespace de traductions
 * @param {Object} opts
 * @param {string} opts.ns - namespace de traduction (ex: "signup")
 * @param {string} [opts.path="/"] - chemin (pour canonique / OG URL)
 * @param {string} [opts.lng] - forcer une langue (sinon auto via getPreferredLocale)
 * @param {string} [opts.titleKey="title-page"] - clé i18n pour le titre
 * @param {string} [opts.descKey="description-page"] - clé i18n pour la description
 * @param {Array<string>|Array<Object>} [opts.images=[]] - images OG/Twitter (URL absolues ou objets {url,width,height,alt})
 * @param {Object} [opts.overrides={}] - merge final pour surcharger n'importe quel champ
 */
export async function createMetadata({
  ns,
  path = "/",
  lng,
  titleKey = "title-page",
  descKey = "description-page",
  images = [],
  overrides = {},
} = {}) {
  const locale = lng || (await getPreferredLocale());
  const lang = languages.includes(locale) ? locale : defaultLanguage;

  const t = await getTranslations(lang, ns);
  const title = t?.[titleKey] || "Dandela Academy";
  const description = t?.[descKey] || "Dandela Academy";

  const url = buildUrl(path);

  const ogImages = (images.length ? images : [`${getBaseUrl()}/og-default.jpg`]).map(
    (img) => (typeof img === "string" ? { url: img } : img)
  );

  const baseMeta = {
    title,
    description,
    alternates: {
      canonical: url,
      // (Optionnel) hreflang — si pas de /[locale], laisse vide ou gère custom
      // languages: Object.fromEntries(languages.map((l) => [l, url])),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Dandela Academy",
      type: "website",
      images: ogImages,
      locale: lang,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url ?? i),
    },
    robots: {
      index: true,
      follow: true,
    },
    // icons, themeColor, etc. ajoutables ici au besoin
  };

  // merge final pour permettre des surcharges par page
  return deepMerge(baseMeta, overrides);
}

// petit merge récursif simple
function deepMerge(a, b) {
  if (!b) return a;
  const out = { ...a };
  for (const k of Object.keys(b)) {
    if (isPlainObj(a[k]) && isPlainObj(b[k])) out[k] = deepMerge(a[k], b[k]);
    else out[k] = b[k];
  }
  return out;
}
function isPlainObj(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

/**
 * Fabrique une fonction `generateMetadata` réutilisable pour une page donnée.
 * Usage: export const generateMetadata = generatePageMetadata({ ns: NS_SIGN_UP, path: "/inscription" })
 */
export function generatePageMetadata(opts) {
  return async () => createMetadata(opts);
}
