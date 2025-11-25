import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_CALENDAR, PAGE_DASHBOARD_PROFILE,} from "@/contexts/constants/constants_pages";
import { NS_DASHBOARD_CALENDAR, NS_DASHBOARD_PROFILE,} from "@/contexts/i18n/settings";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_DASHBOARD_CALENDAR,
  path: PAGE_DASHBOARD_CALENDAR,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function DashboardCalendarLayout({ children }) {
  return (children);
}