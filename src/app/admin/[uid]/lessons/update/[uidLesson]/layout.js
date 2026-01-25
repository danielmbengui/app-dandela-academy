import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_ADMIN_UPDATE_ONE_LESSON, PAGE_LESSONS, } from "@/contexts/constants/constants_pages";
import { NS_LESSONS_ONE, } from "@/contexts/i18n/settings";
import { SessionProvider } from "@/contexts/SessionProvider";
import { ChapterProvider } from "@/contexts/ChapterProvider";
import { LessonProvider } from "@/contexts/LessonProvider";
import { UsersProvider } from "@/contexts/UsersProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_LESSONS_ONE,
  path: PAGE_ADMIN_UPDATE_ONE_LESSON,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function AdminLessonUpdateLayout({ children, params }) {
  const {uid:uidLesson} = await params;
  return (<UsersProvider>
    <LessonProvider>
    <SessionProvider uidLesson={uidLesson}>
    <ChapterProvider uidLesson={uidLesson}>
    {children}
    </ChapterProvider>
  </SessionProvider>
  </LessonProvider>
  </UsersProvider>);
}