import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_COMPUTERS, PAGE_LESSONS, PAGE_STATS, } from "@/contexts/constants/constants_pages";
import { NS_DASHBOARD_COMPUTERS, NS_LESSONS, NS_STATS_ONE, } from "@/contexts/i18n/settings";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_STATS_ONE,
  path: PAGE_STATS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function OneStatLayout({ children }) {
  return (children);
}