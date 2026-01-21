import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_PROFILE, PAGE_SETTINGS,} from "@/contexts/constants/constants_pages";
import { NS_PROFILE, NS_SETTINGS,} from "@/contexts/i18n/settings";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_SETTINGS,
  path: PAGE_SETTINGS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function DashboardSettingsLayout({ children }) {
  return (children);
}