import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { NS_ADMIN_CHAPTERS } from "@/contexts/i18n/settings";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_ADMIN_CHAPTERS,
  path: PAGE_LESSONS,
});

export default async function AdminOneChapterLayout({ children }) {
  return children;
}
