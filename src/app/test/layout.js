import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_TEACHERS } from "@/contexts/constants/constants_pages";
import { NS_TEACHERS } from "@/contexts/i18n/settings";
import { ClassLessonChapter } from "@/classes/lessons/ClassLessonChapter";
import PwaProvider from "@/contexts/PwaProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_TEACHERS,
  path: PAGE_TEACHERS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function TestLayout({ children }) {

  return (children);
}