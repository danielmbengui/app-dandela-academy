import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_COMPUTERS, PAGE_LESSONS, } from "@/contexts/constants/constants_pages";
import { NS_ADMIN_CHAPTERS, NS_CHAPTERS, NS_DASHBOARD_COMPUTERS, NS_LESSONS, } from "@/contexts/i18n/settings";
import { LessonProvider } from "@/contexts/LessonProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_ADMIN_CHAPTERS,
  path: PAGE_LESSONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function ChapterLayout({ children }) {
  return (children);
}