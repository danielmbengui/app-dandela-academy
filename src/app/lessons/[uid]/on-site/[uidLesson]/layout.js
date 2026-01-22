import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LESSONS, } from "@/contexts/constants/constants_pages";
import { NS_LESSONS_ONE, } from "@/contexts/i18n/settings";
import { SessionProvider } from "@/contexts/SessionProvider";
import { ChapterProvider } from "@/contexts/ChapterProvider";
import { LessonTeacherProvider } from "@/contexts/LessonTeacherProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_LESSONS_ONE,
  path: PAGE_LESSONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function OneLessonLayout({ children, params }) {
  const {uid:uidLesson} = await params;
  return (<LessonTeacherProvider uidSourceLesson={uidLesson}>
    {children}
  </LessonTeacherProvider>);
}