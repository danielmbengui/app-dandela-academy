import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_DASHBOARD_HOME, PAGE_DASHBOARD_USERS, PAGE_HOME, PAGE_LOGIN } from "@/contexts/constants/constants_pages";
import { defaultLanguage, languages, NS_DASHBOARD_HOME, NS_DASHBOARD_USERS, NS_HOME, NS_LOGIN } from "@/contexts/i18n/settings";
import { UsersProvider } from "@/contexts/UsersProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_DASHBOARD_USERS,
  path: PAGE_DASHBOARD_USERS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function UsersLayout({ children }) {
  return (<UsersProvider>
    {children}
  </UsersProvider>);
}