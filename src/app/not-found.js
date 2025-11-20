import ThemeController from "@/components/shared/ThemeController";
import { PAGE_HOME, PAGE_NOT_FOUND } from "@/contexts/constants/constants_pages";
import { NS_ERRORS } from "@/contexts/i18n/settings";
import { generatePageMetadata } from "@/contexts/seo/metadata";

export const generateMetadata = generatePageMetadata({
  ns: NS_ERRORS,
  path: PAGE_NOT_FOUND,
});

const NotFound = () => {
  return (
    <>
      <main>
        MERDE
      </main>
      <ThemeController />
    </>
  );
};

export default NotFound;
