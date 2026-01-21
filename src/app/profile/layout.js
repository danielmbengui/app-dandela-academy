import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_PROFILE,} from "@/contexts/constants/constants_pages";
import { NS_PROFILE,} from "@/contexts/i18n/settings";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_PROFILE,
  path: PAGE_DASHBOARD_PROFILE,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function DashboardProfileLayout({ children }) {
  return (children);
}