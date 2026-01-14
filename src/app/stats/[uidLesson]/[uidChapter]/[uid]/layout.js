import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_COMPUTERS, PAGE_LESSONS, PAGE_STATS, } from "@/contexts/constants/constants_pages";
import { NS_DASHBOARD_COMPUTERS, NS_LESSONS, NS_STATS_ONE, } from "@/contexts/i18n/settings";
import { LessonProvider } from "@/contexts/LessonProvider";
import { ChapterProvider } from "@/contexts/ChapterProvider";
import { StatProvider } from "@/contexts/StatProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_STATS_ONE,
  path: PAGE_STATS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function OneStatLayout({ children, params }) {
  const {uidLesson, uidChapter} = await params;
  return (<LessonProvider>
    <ChapterProvider uidLesson={uidLesson}>
    <StatProvider uidLesson={uidLesson} uidChapter={uidChapter}>
      {children}
      </StatProvider>
    </ChapterProvider>
  </LessonProvider>);
}