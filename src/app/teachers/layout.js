import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_TEACHERS } from "@/contexts/constants/constants_pages";
import { NS_TEACHERS } from "@/contexts/i18n/settings";

import { TeachersProvider } from "@/contexts/TeachersProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_TEACHERS,
  path: PAGE_TEACHERS,
  // images: ["https://.../og-inscription.jpg"],
  // overrides: { openGraph: { type: "article" } },
});

export default async function TeachersLayout({ children }) {
  return (<TeachersProvider>
    {children}
  </TeachersProvider>);
}