import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_FORGOT_PASSWORD, PAGE_HOME, PAGE_LOGIN } from "@/contexts/constants/constants_pages";
import { defaultLanguage, languages, NS_FORGOT_PASSWORD, NS_HOME, NS_LOGIN } from "@/contexts/i18n/settings";
import Preloader from "@/components/shared/Preloader";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_FORGOT_PASSWORD,
  path: PAGE_FORGOT_PASSWORD,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function LoginLayout({ children }) {
  return (children);
}