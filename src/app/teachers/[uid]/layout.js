import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LESSONS, PAGE_TEACHERS, } from "@/contexts/constants/constants_pages";
import { NS_LESSONS_ONE, NS_TEACHERS, } from "@/contexts/i18n/settings";
import { SessionProvider } from "@/contexts/SessionProvider";
import { LessonProvider } from "@/contexts/LessonProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_TEACHERS,
  path: PAGE_TEACHERS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function OneTeacherLayout({ children, params }) {
  const {uid:uidTeacher} = await params;
  return (<LessonProvider uidTeacher={uidTeacher}>
    <SessionProvider uidTeacher={uidTeacher}>
      {children}
    </SessionProvider>
  </LessonProvider>);
}