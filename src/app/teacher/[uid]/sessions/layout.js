import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_SESSIONS } from "@/contexts/constants/constants_pages";
import { NS_DASHBOARD_HOME } from "@/contexts/i18n/settings";
import { SessionProvider } from "@/contexts/SessionProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_DASHBOARD_HOME,
  path: PAGE_SESSIONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function TeacherSessionsLayout({ children, params }) {
  const { uid } = await params;
  return (
    <SessionProvider uidTeacher={uid}>
      {children}
    </SessionProvider>
  );
}
