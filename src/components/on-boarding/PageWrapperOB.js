import HeaderHomeOB from "./landing-page/header/HeaderHomeOB";
import FooterOB from "./footer/FooterOB";
import ScrollupOB from "./ScrollupOB";
const PageWrapperOB = ({ children }) => {
  return (<>
    <HeaderHomeOB />
    {children}
    <FooterOB />
    <ScrollupOB />
  </>);
};

/*

*/

export default PageWrapperOB;
