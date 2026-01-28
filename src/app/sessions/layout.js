import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_LESSONS, PAGE_SESSIONS, } from "@/contexts/constants/constants_pages";
import { NS_LESSONS, NS_SESSIONS, } from "@/contexts/i18n/settings";
import { LessonProvider } from "@/contexts/LessonProvider";
import { UsersProvider } from "@/contexts/UsersProvider";
import { LessonTeacherProvider } from "@/contexts/LessonTeacherProvider";
import { SessionProvider } from "@/contexts/SessionProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_SESSIONS,
  path: PAGE_SESSIONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function SessionsLayout({ children }) {
  return (<LessonProvider>
    <LessonTeacherProvider>
      <UsersProvider>
        <SessionProvider>
        {children}
        </SessionProvider>
      </UsersProvider>
    </LessonTeacherProvider>
  </LessonProvider>);
}