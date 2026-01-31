import { generatePageMetadata } from "@/contexts/seo/metadata";
import { PAGE_EVENTS } from "@/contexts/constants/constants_pages";
import { NS_EVENTS } from "@/contexts/i18n/settings";
import { EventsProvider } from "@/contexts/EventsProvider";

export const dynamic = "force-dynamic";

export const generateMetadata = generatePageMetadata({
  ns: NS_EVENTS,
  path: PAGE_EVENTS,
});

export default async function EventsLayout({ children }) {
  return (
    <EventsProvider>
      {children}
    </EventsProvider>
  );
}
