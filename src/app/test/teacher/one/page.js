"use client"

import OneTeacherComponent from "@/components/teacher/OneTeacherComponent copy"
import DashboardPageWrapper from "@/components/wrappers/DashboardPageWrapper"
import { TeachersProvider } from "@/contexts/TeachersProvider"

export default function OneTeacherPage() {
  return(<TeachersProvider>
  {'TEST'}
  <DashboardPageWrapper>
    <OneTeacherComponent />
  </DashboardPageWrapper>
  </TeachersProvider>)
}