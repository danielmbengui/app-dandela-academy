import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_COMPUTERS, PAGE_DASHBOARD_HOME, PAGE_HOME, PAGE_LOGIN } from "@/contexts/constants/constants_pages";
import { defaultLanguage, languages, NS_DASHBOARD_HOME, NS_HOME, NS_LOGIN } from "@/contexts/i18n/settings";
import Preloader from "@/components/shared/Preloader";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_DASHBOARD_HOME,
  path: PAGE_DASHBOARD_COMPUTERS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function DashboardComputersLayout({ children }) {
  return (children);
}