import React, { useState } from "react";
import { IconUserCertified, IconVisible } from "@/assets/icons/IconsComponent";
import { ClassLesson, ClassLessonTeacher } from "@/classes/ClassLesson";
import { formatDuration, getFormattedDateNumeric, getFormattedHour } from "@/contexts/functions";
import { NS_BUTTONS, NS_DASHBOARD_MENU, NS_DAYS, NS_LANGS, NS_LESSONS_ONE } from "@/contexts/i18n/settings";
import { Box, CircularProgress, Skeleton, Stack, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useLesson } from "@/contexts/LessonProvider";
import { useLanguage } from "@/contexts/LangProvider";
import Image from "next/image";
import BadgeStatusLesson from "@/components/dashboard/lessons/BadgeStatusLesson";
import { useAuth } from "@/contexts/AuthProvider";
import { ClassUserIntern } from "@/classes/users/ClassUser";
import { SCHOOL_NAME } from "@/contexts/constants/constants";
import { useSession } from "@/contexts/SessionProvider";
import DialogSession from "../dashboard/sessions/DialogSession";
import { ClassSessionSlot } from "@/classes/ClassSession";
import Link from "next/link";
import ButtonCancel from "../dashboard/elements/ButtonCancel";
import ButtonConfirm from "../dashboard/elements/ButtonConfirm";
import { PAGE_LESSONS, PAGE_LESSONS_TEACHER, PAGE_TEACHERS } from "@/contexts/constants/constants_pages";
import { useLessonTeacher } from "@/contexts/LessonTeacherProvider";


export default function OneTeacherLessonComponent() {
  const { user } = useAuth();
  const { t } = useTranslation([ClassLessonTeacher.NS_COLLECTION, NS_LESSONS_ONE, NS_LANGS, NS_DAYS, NS_DASHBOARD_MENU]);
  const { lang } = useLanguage();
  //const [lesson, setLesson] = useState(null);
  const { lesson } = useLessonTeacher();

  return (<Stack>
      <div className="teacher-card">
        <div className="teacher-main">
          {lesson?.teacher?.showAvatar?.({})}
          <div className="teacher-text">
            <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
              <p className="teacher-name">
              {lesson?.teacher?.first_name} {lesson?.teacher?.last_name}
            </p>
            <IconUserCertified height={14} width={14} color="var(--primary)" />
            </Stack>
            <p className="teacher-role">{lesson?.teacher?.role_title}</p>
          </div>
        </div>
        <p className="teacher-bio">{lesson?.teacher?.bio}</p>
      </div>
      <style jsx>{`
        .teacher-card {
          border-radius: 10px;
          border: 1px solid #111827;
          border: 0.1px solid var(--primary-shadow-xl);
          padding: 10px 10px 12px;
          padding: 15px;
          background: radial-gradient(circle at top left, #111827, #020617);
          background: var(--primary-shadow);
          font-size: 0.85rem;
        }
        .teacher-name {
          margin: 0;
          font-weight: 500;
          line-height: 1rem;
          color: var(--primary-dark);
        }
        .teacher-role {
          margin: 0;
          color: var(--primary);
          font-size: 0.78rem;
        }
        .teacher-bio {
          margin: 4px 0 4px;
          font-size: 0.8rem;
          color: var(--primary-dark);
        }
        
                .teacher-label {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                }
                .teacher-label-text {
                  font-size: 0.75rem;
                  font-size: 1.05rem;
                  color: #9ca3af;
                  margin-bottom: 6px;
                }
        
                .teacher-main {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 6px;
                }
        
                .teacher-text {
                  font-size: 0.83rem;
                }
        
                
        
                
        
               
        
                .teacher-email {
                  margin: 0 0 6px;
                  font-size: 0.78rem;
                  color: var(--grey-light);
                }
        
                .teacher-email span {
                  color: var(--grey-light);
                }
                .hero-seats {
                  margin-top: 6px;
                  font-size: 0.85rem;
                }
                .seats-sub {
                  margin: 2px 0 4px;
                  font-size: 0.78rem;
                  color: #9ca3af;
                }
                .seats-bar {
                  width: 100%;
                  height: 7px;
                  border-radius: 999px;
                  background: #020617;
                  border: 1px solid #111827;
                  border: 1px solid var(--card-bord);
                  background: linear-gradient(90deg, #22c55e, #16a34a);
                  overflow: hidden;
                }
        
                .seats-fill {
                  height: 100%;
                  background: linear-gradient(90deg, #22c55e, #16a34a);
                  background: red;
                }
        
                .breadcrumb {
                  margin: 0 0 4px;
                  font-size: 0.75rem;
                  color: #6b7280;
                }
        
                h1 {
                  margin: 0;
                  font-size: 1.5rem;
                  line-height: 1.5rem;
                }
        
                .muted {
                  margin-top: 5px;
                  font-size: 0.9rem;
                  color: #9ca3af;
                }
        
                .badges {
                  margin-top: 10px;
                  display: flex;
                  gap: 5px;
                  flex-wrap: wrap;
                }
        
                .badge-format {
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  border-radius: 999px;
                  border-width: 1px;
                  border-style: solid;
                  padding: 2px 9px;
                  font-size: 0.8rem;
                  background: #020617;
                }
        
                .badge-dot {
                  width: 7px;
                  height: 7px;
                  border-radius: 999px;
                }
        
                .badge-cert {
                  border-radius: 999px;
                  padding: 2px 10px;
                  font-size: 0.8rem;
                  background: #022c22;
                  background: transparent;
                  color: #bbf7d0;
                  color: var(--font-color);
                  border: 0.1px solid #16a34a;
                }
        
                .enroll-card {
                  background: var(--card-color);
                  border-radius: 10px;
                  padding: 16px 16px 18px;
                  border: 1px solid var(--card-color);
                  
                  min-width: 260px;
                  max-width: 320px;
                }
        
                .price {
                  margin: 0;
                  font-size: 1.7rem;
                  font-weight: 600;
                }
        
                .currency {
                  font-size: 1rem;
                  color: #9ca3af;
                  margin-left: 4px;
                }
        
                .price-helper {
                  margin: 4px 0 0;
                  font-size: 0.8rem;
                  color: #9ca3af;
                }
        
                .installments {
                  margin: 8px 0 0;
                  font-size: 0.8rem;
                  color: #e5e7eb;
                }
        
                .dates {
                  display: flex;
                  gap: 12px;
                  margin-top: 10px;
                  font-size: 0.85rem;
                }
        
                .date-label {
                  margin: 0;
                  font-size: 0.75rem;
                  color: #9ca3af;
                }
        
                .date-value {
                  margin: 2px 0 0;
                }
        
                .seats {
                  margin-top: 10px;
                  font-size: 0.85rem;
                }
        
                .seats-line {
                  margin: 0;
                }
        
                .seats-left {
                  margin: 2px 0 0;
                  font-size: 0.78rem;
                  color: #9ca3af;
                }
        
                .btn {
                  border-radius: 999px;
                  padding: 8px 14px;
                  border: 1px solid #374151;
                  background: #020617;
                  color: #e5e7eb;
                  font-size: 0.9rem;
                  cursor: pointer;
                }
        
                .primary {
                  background: linear-gradient(135deg, #2563eb, #4f46e5);
                  border-color: transparent;
                }
        
                .btn-enroll {
                  width: 100%;
                  margin-top: 12px;
                }
        
                .btn-disabled {
                  background: #111827;
                  cursor: not-allowed;
                }
        
                .secure-note {
                  margin: 8px 0 0;
                  font-size: 0.75rem;
                  color: #9ca3af;
                }
        
                .grid {
                  display: grid;
                  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.1fr);
                  gap: 16px;
                  margin-bottom: 30px;
                }
        
                @media (max-width: 900px) {
                  .header {
                    flex-direction: column;
                  }
                  .enroll-card {
                    max-width: 100%;
                    width: 100%;
                  }
                  .grid {
                    grid-template-columns: 1fr;
                  }
                }
        
                .main-col,
                .side-col {
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                }
        
                .card {
                  background: var(--card-color);
                  color: var(--font-color);
                    color: var(--grey-light);
                  border-radius: 16px;
                  padding: 14px 14px 16px;
                }
        
                .card h2 {
                  margin: 0 0 10px;
                  font-size: 1.05rem;
                }
        
                .description {
                  margin: 0;
                  padding-left: 10px;
                  font-size: 0.9rem;
                  color: var(--grey-light);
                  color: var(--font-color);
                }
        
                .list {
                  margin: 0;
                  padding-left: 18px;
                  font-size: 0.88rem;
                            color: var(--grey-light);
                              color: var(--font-color);
                }
        
                .list li {
                  margin-bottom: 4px;
                }
        
                .list.ordered {
                  padding-left: 20px;
                }
        
                .list.small {
                  font-size: 0.8rem;
                }
        
                .cert-main {
                  margin: 0 0 8px;
                  font-size: 0.9rem;
                  color: var(--font-color);
                }
        
                .cert-badge {
                  margin-top: 8px;
                  font-size: 0.8rem;
                  padding: 4px 8px;
                  border-radius: 8px;
                  background: #022c22;
                  color: #bbf7d0;
                  border: 1px solid #16a34a;
                }
              `}</style>
  </Stack>);
}