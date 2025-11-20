import { Hind, Inter } from "next/font/google";
import "@/assets/css/icofont.min.css";
import "@/assets/css/popup.css";
import "@/assets/css/video-modal.css";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import "./globals.css";
import Providers from "@/contexts/providers";
import Head from "next/head";
import { getPreferredLocale } from "@/contexts/i18n/detect-locale";
import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_HOME } from "@/contexts/constants/constants_pages";
import { defaultLanguage, languages, NS_HOME } from "@/contexts/i18n/settings";
import Preloader from "@/components/shared/Preloader";

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});
export const hind = Hind({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind",
});

const RTL_LOCALES = ['ar', 'he'];
const getDir = (lng) => (RTL_LOCALES.includes(lng) ? 'rtl' : 'ltr');
export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_HOME,
  path: PAGE_HOME,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function RootLayout({ children }) {
  const locale = await getPreferredLocale();
  const lng = languages.includes(locale) ? locale : defaultLanguage;
  return (
    <html lang={lng} dir={getDir(lng)} className={`${hind.variable}`} >
      <Head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <body
        className={`relative leading-[1.8] bg-bodyBg dark:bg-bodyBg-dark z-0  ${inter.className}`}
      >
       <Providers>
       <Preloader />
        {children}
       </Providers>
      </body>
    </html>
  );
}
