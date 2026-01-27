import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_ADMIN_LESSONS, PAGE_LESSONS } from "@/contexts/constants/constants_pages";
import { NS_LESSONS } from "@/contexts/i18n/settings";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_LESSONS,
  path: PAGE_LESSONS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function AdminOneLessonLayout({ children, params }) {
  // Les providers LessonProvider et UsersProvider sont déjà fournis par le layout parent
  // (admin/[uid]/lessons/layout.js)
  return children;
}
