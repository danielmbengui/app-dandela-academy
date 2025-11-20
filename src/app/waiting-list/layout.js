import { NS_WAITING_LIST } from "@/contexts/i18n/settings";
import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_WAITING_LIST } from "@/contexts/constants/constants_pages";

export const generateMetadata = generatePageMetadata({
    ns: NS_WAITING_LIST,
    path: PAGE_WAITING_LIST,
    // images: ["https://.../og-inscription.jpg"],
    // overrides: { openGraph: { type: "article" } },
  });

export default async function WaitingListLayout({ children }) {
  return (<>{children}</>);
}
