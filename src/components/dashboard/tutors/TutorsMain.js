import SubHeaderDashboard from "@/components/sections/sub-section/dashboards/SubHeaderDashboard";
import React from "react";
import PopularInstructors from "@/components/sections/sub-section/dashboards/PopularInstructors";
import TutorsList from "./TutorsList";

const TutorsMain = ({user=null}) => {
  return (
    <> 

    <TutorsList />

    </>
  );
};

export default TutorsMain;
