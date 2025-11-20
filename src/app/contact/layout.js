import { NS_CONTACT } from "@/contexts/i18n/settings";
import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_CONTACT } from "@/contexts/constants/constants_pages";

export const generateMetadata = generatePageMetadata({
    ns: NS_CONTACT,
    path: PAGE_CONTACT,
    // images: ["https://.../og-inscription.jpg"],
    // overrides: { openGraph: { type: "article" } },
  });

export default async function ContactLayout({ children }) {
  return (<>{children}</>);
}
