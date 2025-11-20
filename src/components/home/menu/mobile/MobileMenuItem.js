import Accordion from "../../others/Accordion";
import MobileLink from "./MobileLink";

const MobileMenuItem = ({ item }) => {
  const { name, path, children, accordion } = item;

  return !accordion ? (
    <MobileLink item={{ name, path }} />
  ) : (
    <Accordion>
      <MobileLink item={{ name, path }} />
    </Accordion>
  );
};

export default MobileMenuItem;
