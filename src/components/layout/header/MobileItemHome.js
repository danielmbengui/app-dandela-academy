import AccordionController from "@/components/shared/accordion/AccordionController";

import MobileLink from "./MobileLink";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
const MobileMenuItemHome = ({ item }) => {
  const { name, path, children, accordion } = item;

  return !accordion ? (
    <MobileLink item={{ name, path }} />
  ) : (
    <Accordion>
      <MobileLink item={{ name, path }} />
    </Accordion>
  );
};

export default MobileMenuItemHome;
