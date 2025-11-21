import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_HOME, PAGE_LOGIN } from "@/contexts/constants/constants_pages";
import { defaultLanguage, languages, NS_HOME, NS_LOGIN } from "@/contexts/i18n/settings";
import Preloader from "@/components/shared/Preloader";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_LOGIN,
  path: PAGE_LOGIN,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function LoginLayout({ children }) {
  return (children);
}