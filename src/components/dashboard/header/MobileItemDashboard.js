import Accordion from "@/components/shared/accordion/Accordion";
import MobileLinkOB from "../MobileLinkOB";
const MobileMenuItemDashboard = ({ item }) => {
  const { name, path, children, accordion } = item;

  return !accordion ? (
    <MobileLinkOB item={{ name, path }} />
  ) : (
    <Accordion>
      <MobileLinkOB item={{ name, path }} />
    </Accordion>
  );
};

export default MobileMenuItemDashboard;
