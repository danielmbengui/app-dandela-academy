import Footer from "../footer/Footer";
import HeaderHome from "../header/HeaderHome";
import Scrollup from "../others/Scrollup";
const PageWrapper = ({ children }) => {
  return (<>
    <HeaderHome />
    {children}
    <Footer />
    <Scrollup />
  </>);
};
export default PageWrapper;
