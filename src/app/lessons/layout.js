import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_COMPUTERS, PAGE_LESSONS, } from "@/contexts/constants/constants_pages";
import { NS_DASHBOARD_COMPUTERS, NS_LESSONS, } from "@/contexts/i18n/settings";
import { LessonProvider } from "@/contexts/LessonProvider";
import { UsersProvider } from "@/contexts/UsersProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_LESSONS,
  path: PAGE_LESSONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function LessonsLayout({ children }) {
  return (<LessonProvider>
    <UsersProvider>
    {children}
    </UsersProvider>
  </LessonProvider>);
}