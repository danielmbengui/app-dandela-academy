import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_COMPUTERS, } from "@/contexts/constants/constants_pages";
import { NS_DASHBOARD_COMPUTERS, } from "@/contexts/i18n/settings";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_DASHBOARD_COMPUTERS,
  path: PAGE_DASHBOARD_COMPUTERS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function DashboardComputersLayout({ children }) {
  return (<>
    {children}
  </>);
}