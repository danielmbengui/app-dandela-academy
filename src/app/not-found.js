import NotFoundComponent from "@/components/not-found/NotFoundComponent";
import { PAGE_NOT_FOUND } from "@/contexts/constants/constants_pages";
import { NS_NOT_FOUND } from "@/contexts/i18n/settings";
import { generatePageMetadata } from "@/contexts/seo/metadata";

export const generateMetadata = generatePageMetadata({
  ns: NS_NOT_FOUND,
  path: PAGE_NOT_FOUND,
});

export default async function NotFoundLayout() {
  return (<NotFoundComponent />);
};
