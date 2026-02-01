import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_CERTIFICATIONS } from "@/contexts/constants/constants_pages";
import { NS_CERTIFICATIONS } from "@/contexts/i18n/settings";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_CERTIFICATIONS,
  path: PAGE_CERTIFICATIONS,
});

export default async function CertificationsLayout({ children }) {
  return <>{children}</>;
}
