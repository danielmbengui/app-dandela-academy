import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LESSONS, } from "@/contexts/constants/constants_pages";
import { NS_DASHBOARD_HOME, NS_LESSONS, } from "@/contexts/i18n/settings";
import { LessonProvider } from "@/contexts/LessonProvider";
import { LessonTeacherProvider } from "@/contexts/LessonTeacherProvider";
import { SessionProvider } from "@/contexts/SessionProvider";
import { UsersProvider } from "@/contexts/UsersProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_DASHBOARD_HOME,
  path: PAGE_LESSONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function OneTeacherLayout({ children, params }) {
  const {uid} = await params;
  return (
    <UsersProvider>
      <LessonProvider>
        <LessonTeacherProvider uidTeacher={uid}>
          <SessionProvider uidTeacher={uid}>
            {children}
          </SessionProvider>
        </LessonTeacherProvider>
      </LessonProvider>
    </UsersProvider>
  );
}