import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import ModuleDetailsPrimary from "@/components/sections/modules-details/ModuleDetailsPrimary";
import React from "react";

const ModuleDetailsMain = ({ id, module,tutors,duration }) => {
  return (
    <>
      <HeroPrimary path={"Course-Details"} title={"Course Details"} />
      <ModuleDetailsPrimary id={id} module={module} tutors={tutors} duration={duration} />
    </>
  );
};

export default ModuleDetailsMain;
