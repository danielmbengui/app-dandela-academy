import ErrorMain from "@/components/error/ErrorMain";
import PageWrapper from "@/components/home/layout/PageWrapper";
import ThemeController from "@/components/home/others/ThemeController";
import { PAGE_HOME, PAGE_NOT_FOUND } from "@/contexts/constants/constants_pages";
import { NS_ERRORS } from "@/contexts/i18n/settings";
import { generatePageMetadata } from "@/contexts/seo/metadata";

export const generateMetadata = generatePageMetadata({
  ns: NS_ERRORS,
  path: PAGE_NOT_FOUND,
});

const NotFound = () => {
  return (
    <PageWrapper>
      <main>
        <ErrorMain />
      </main>
      <ThemeController />
    </PageWrapper>
  );
};

export default NotFound;
