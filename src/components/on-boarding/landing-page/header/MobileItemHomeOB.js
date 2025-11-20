import AccordionController from "@/components/shared/accordion/AccordionController";

import MobileLinkOB from "../../MobileLinkOB";
import Accordion from "@/components/shared/accordion/Accordion";
import AccordionContent from "@/components/shared/accordion/AccordionContent";
const MobileMenuItemHomeOB = ({ item }) => {
  const { name, path, children, accordion } = item;

  return !accordion ? (
    <MobileLinkOB item={{ name, path }} />
  ) : (
    <Accordion>
      <MobileLinkOB item={{ name, path }} />
    </Accordion>
  );
};

export default MobileMenuItemHomeOB;
