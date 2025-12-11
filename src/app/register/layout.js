import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LOGIN, PAGE_REGISTER } from "@/contexts/constants/constants_pages";
import { NS_LOGIN, NS_REGISTER } from "@/contexts/i18n/settings";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_REGISTER,
  path: PAGE_REGISTER,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function LoginLayout({ children }) {
  return (children);
}