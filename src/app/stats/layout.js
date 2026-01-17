import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LESSONS, PAGE_STATS, } from "@/contexts/constants/constants_pages";
import {NS_LESSONS, NS_STATS, } from "@/contexts/i18n/settings";
import { LessonProvider } from "@/contexts/LessonProvider";
import { ChapterProvider } from "@/contexts/ChapterProvider";
import { StatProvider } from "@/contexts/StatProvider";
import { SessionProvider } from "@/contexts/SessionProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_STATS,
  path: PAGE_STATS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function StatsLayout({ children }) {
  return (<LessonProvider>
    <SessionProvider>
    <ChapterProvider>
    <StatProvider>
      {children}
      </StatProvider>
    </ChapterProvider>
    </SessionProvider>
  </LessonProvider>);
}