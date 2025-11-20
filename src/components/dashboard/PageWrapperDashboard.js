import HeaderDashboard from "./header/HeaderDashboard";
const PageWrapperDashboard = ({ children }) => {
  return (<>
    <HeaderDashboard />
    {children}
  </>);
};

/*

*/

export default PageWrapperDashboard;
