import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_TEACHERS } from "@/contexts/constants/constants_pages";
import { NS_TEACHERS } from "@/contexts/i18n/settings";
import { UsersProvider } from "@/contexts/UsersProvider";
import { LessonTeacherProvider } from "@/contexts/LessonTeacherProvider";
import { LessonProvider } from "@/contexts/LessonProvider";
import { SessionProvider } from "@/contexts/SessionProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_TEACHERS,
  path: PAGE_TEACHERS,
});

export default async function TeacherProfileLayout({ children, params }) {
  const { uid } = await params;
  
  return (
    <LessonProvider>
      <LessonTeacherProvider uidTeacher={uid}>
        <SessionProvider uidTeacher={uid}>
          <UsersProvider>
            {children}
          </UsersProvider>
        </SessionProvider>
      </LessonTeacherProvider>
    </LessonProvider>
  );
}
