import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_NOT_AUTHORIZED } from "@/contexts/constants/constants_pages";
import { NS_NOT_AUTHORIZED } from "@/contexts/i18n/settings";


export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_NOT_AUTHORIZED,
  path: PAGE_NOT_AUTHORIZED,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function NotAuthorizedLayout({ children }) {
  return (children);
}