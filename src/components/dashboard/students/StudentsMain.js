import SubHeaderDashboard from "@/components/sections/sub-section/dashboards/SubHeaderDashboard";
import React from "react";
import PopularInstructors from "@/components/sections/sub-section/dashboards/PopularInstructors";
import StudentsList from "./StudentsList";

const StudentsMain = ({user=null}) => {
  return (
    <> 

    <StudentsList />

    </>
  );
};

export default StudentsMain;
