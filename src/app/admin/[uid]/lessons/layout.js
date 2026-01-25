import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LESSONS, } from "@/contexts/constants/constants_pages";
import { NS_LESSONS, } from "@/contexts/i18n/settings";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_LESSONS,
  path: PAGE_LESSONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function LessonsLayout({ children }) {


  return (children);
}