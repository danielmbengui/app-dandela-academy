import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { NS_LESSONS } from "@/contexts/i18n/settings";
import { LessonTeacherProvider } from "@/contexts/LessonTeacherProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_LESSONS,
  path: PAGE_LESSONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function AdminOneLessonTeacherLayout({ children, params }) {
  const { uidLesson } = await params;
  // uidLesson est le ClassLesson parent (uidSourceLesson)
  // Pas besoin de uidTeacher car c'est pour admin
  return (
    <LessonTeacherProvider uidSourceLesson={uidLesson}>
      {children}
    </LessonTeacherProvider>
  );
}
