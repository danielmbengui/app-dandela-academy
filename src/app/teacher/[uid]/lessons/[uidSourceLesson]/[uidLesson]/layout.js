import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LESSONS, } from "@/contexts/constants/constants_pages";
import { NS_LESSONS, } from "@/contexts/i18n/settings";
import { LessonProvider } from "@/contexts/LessonProvider";
import { LessonTeacherProvider } from "@/contexts/LessonTeacherProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_LESSONS,
  path: PAGE_LESSONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function LessonsLayout({ children, params }) {
    const {uid:uidTeacher, uidSourceLesson} = await params;
  console.log("uid teacher", uidTeacher)
  return (<LessonTeacherProvider uidSourceLesson={uidSourceLesson} uidTeacher={uidTeacher}>
      {children}
    </LessonTeacherProvider>);
}